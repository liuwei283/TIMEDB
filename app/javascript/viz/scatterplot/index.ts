import Oviz from "crux";
import template from "./template.bvt"
import { editorConfig } from "./editor";
import { registerEditorConfig } from "utils/editor";
import {savedTheme} from "oviz-common/mem-theme"

import {getGroups, groupBy}from "utils/array"
import {findBoundsForValues} from "utils/maths";
import { event } from "crux/dist/utils";
import {register} from "page/visualizers";


const sampleIndex = 0;
// const xAxisIndex = 1;
// const yAxisIndex = 2;

const MODULE_NAME = 'scatterplot'

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {
            plotHeight: 400,
            plotWidth: 400,
            colors: ["green", "red"],
            config: {
                xAxisIndex:1,
                yAxisIndex:2,
                computeOval: false,
            },
            scatterVectorData: null,
            scatterClusterData: null,
        },
        loadData: genDefaultDataSources(),
        setup() {
            registerEditorConfig(editorConfig(this));
            //select x, y axis
            const xAxisIndex = this.data.config.xAxisIndex;
            const yAxisIndex = this.data.config.yAxisIndex;
            const scatterData = this.data.scatterData;
            this.data.categoryRange = findBoundsForValues(scatterData.map(d=>(d[this.data.scatterColumns[xAxisIndex]])),1);
            this.data.valueRange = findBoundsForValues(scatterData.map(d=>(d[this.data.scatterColumns[yAxisIndex]])),1);
            // this.data.categoryRange = [-0.6,0.4];
            // this.data.valueRange = [-0.6,0.4];

            console.log(this.data.scatterColumns)
            this.data.xLabel = this.data.scatterColumns[xAxisIndex];
            this.data.yLabel = this.data.scatterColumns[yAxisIndex];
            this.data.usedAttrs = [this.data.scatterColumns[0], this.data.scatterColumns[xAxisIndex], 
                this.data.scatterColumns[yAxisIndex]];
            if (this.data.groups) this.data.usedAttrs.push("group");
            if (this.data.clusters) this.data.usedAttrs.push("cluster");
            this.data.scatterData = this.data.scatterData.map(d => {
                const datum = {};
                this.data.usedAttrs.forEach(key => {
                    datum[key] = d[key];
                })
                return datum;
            })
            
             //config plot size
             const xyRatio = (this.data.categoryRange[1] - this.data.categoryRange[0]) / (this.data.valueRange[1] - this.data.valueRange[0])
             this.data.plotWidth = xyRatio > 1 || this.data.plotWidth; 
             this.data.plotHeight = this.data.plotWidth/ xyRatio; 

            const svgRatioX = this.data.plotWidth / (this.data.categoryRange[1] - this.data.categoryRange[0]);
            const svgRatioY = this.data.plotHeight / (this.data.valueRange[1] - this.data.valueRange[0]);

            // compute oval
            if (this.data.clusters) {
                const ovalData = groupBy(this.data.scatterData, "cluster");
                this.data.ovalData = [];
                this.data.clusters.forEach(key=> {
                    const ellipseData = computeErrorEllipse(ovalData[key], this.data.usedAttrs[1], this.data.usedAttrs[2],
                        svgRatioX, svgRatioY);
                    ellipseData.cluster = key;
                    this.data.ovalData.push(ellipseData);
                });
            }
        }
    }); 
    
    return visualizer;
}

function genDefaultDataSources() {
    const defaultDataSources = {
        scatterData: {
            fileKey: "scatterData",
            type: "tsv",
            dsvRowParser (row, index,columns) {
                for (let i = 1; i< columns.length; i++)
                    row[columns[i]] = parseFloat(row[columns[i]]);
                return row;
            },
            loaded(data) {
                this.data.scatterColumns = data.columns;
                this.data.availableAxises = data.columns.filter((d,i) => {
                    if(i>0) return {value: i, string: d};
                })
            }
        },
        scatterGroupData: {
            fileKey: "scatterGroupData",
            type: "tsv",
            optional: true,
            dependsOn: ["scatterData"],
            loaded(data) {
                this.data.groups = getGroups(data, data.columns[1]);
                this.data.scatterData = this.data.scatterData.map((d,i) => {
                    if(data[i][data.columns[0]] === d[this.data.scatterData.columns[0]]) 
                        d.group = data[i][data.columns[1]];
                    return d;
                })
                this.data.groupLabel = "group";
                return null;
            }
        },
        scatterVectorData: {
            fileKey: "scatterVectorData",
            type: "tsv",
            optional: true,
            dependsOn: ["scatterData"],
            dsvRowParser (row, index,columns) {
                for (let i = 1; i< columns.length; i++)
                    row[columns[i]] = parseFloat(row[columns[i]]);
                return row;
            },
            loaded(data) {
                this.data.vectorLabel = data.columns[0];
            }
        },
        scatterClusterData: {
            fileKey: "scatterClusterData",
            type: "tsv",
            optional: true,
            dependsOn: ["scatterData"],
            dsvHasHeader: false,
            dsvRowParser(row) {
                return {
                    "sample": row[0], 
                    cluster: row[1]
                };
            },
            loaded(data) {
                this.data.scatterData = this.data.scatterData.filter(d => {
                    let hasCluster = false;
                    const sample = d[this.data.scatterColumns[0]]
                    data.forEach((c, j, arr) => {
                        if(c.sample === sample) {
                            hasCluster = true;
                            d.cluster = c.cluster;
                            arr.splice(j,1);
                        }
                    })
                    if (hasCluster) return d;
                })
                this.data.clusters = getGroups(data, "cluster");
            }
        }
    }
    if (window.gon && window.gon.required_data ) {
        const dataSources = {}
        window.gon.required_data.forEach(dt => {
            dataSources[dt] = defaultDataSources[dt];
        })
        return dataSources;
    } else 
        return defaultDataSources;
}

function computeErrorEllipse(samples, xIndex, yIndex, svgRatioX, svgRatioY) {
    debugger;
    const ellipseData = {cx:0, cy:0, rx:0, ry:0, rotationAngle:0};
    const s = 5.991;
    const statX = new Oviz.algo.Statistics(samples.map(x => x[xIndex]));
    const statY = new Oviz.algo.Statistics(samples.map(y => y[yIndex]));
    
    ellipseData.cx =  statX.mean();
    ellipseData.cy = statY.mean();

    
    let varX = 0, varY = 0, cov = 0;
    samples.forEach(d => {
        varX += Math.pow( (d[xIndex] - statX.mean()) * svgRatioX, 2) / (samples.length-1);
        varY += Math.pow( (d[yIndex] - statY.mean()) * svgRatioY, 2) / (samples.length-1);
        cov += (d[xIndex] - statX.mean()) * svgRatioX * (d[yIndex] - statY.mean()) * svgRatioY / (samples.length-1);
    })

    const eParams = {a: 1, b: -(varX+varY), c: varX*varY - Math.pow(cov, 2)};
    const eigenValue1 = (-eParams.b + Math.sqrt(Math.pow(eParams.b,2) - 4*eParams.a*eParams.c))/(2*eParams.a);
    const eigenValue2 = (-eParams.b - Math.sqrt(Math.pow(eParams.b,2) - 4*eParams.a*eParams.c))/(2*eParams.a);
    ellipseData.rx = Math.sqrt(s * Math.abs(eigenValue1));
    ellipseData.ry = Math.sqrt(s * Math.abs(eigenValue2));
    
    const rotationRad = Math.atan((varX -eigenValue1)/cov);
    console.log(`${eigenValue1} === ${eigenValue2}`)
    ellipseData.rotationAngle  = rotationRad*180/Math.PI;
    const triFunctions = {
        sin(r) {return r * Math.sin(rotationRad)}, 
        cos(r) {return r * Math.cos(rotationRad)}
    };
    const dx = triFunctions.cos(ellipseData.rx);
    const dy = triFunctions.sin(ellipseData.rx);
    const path = `M 0 0 
                  A ${ellipseData.rx} ${ellipseData.ry} ${ellipseData.rotationAngle} 0 1 ${2*dx} ${2*dy}
                  A ${ellipseData.rx} ${ellipseData.ry} ${ellipseData.rotationAngle} 0 1 0 0 Z`;
    const center = {x:statX.mean(), y:statY.mean()};
    const ovalPathData = {
        cluster:null,
        path,
        xAxisPath: `M 0 0 L ${2*dx} ${2*dy}`,
        // yAxisPath: `M ${dx - triFunctions.sin(ellipseData.ry)} ${dy - triFunctions.cos(ellipseData.ry)} L ${dx + triFunctions.sin(ellipseData.ry)} ${dy + triFunctions.cos(ellipseData.ry)}`,
        yAxisPath: `M ${dx - Math.abs(triFunctions.sin(ellipseData.ry))} ${dy - Math.abs(triFunctions.cos(ellipseData.ry))} L ${dx + Math.abs(triFunctions.sin(ellipseData.ry))} ${dy + Math.abs(triFunctions.cos(ellipseData.ry))}`,
        
        center, dx, dy
    }
    return ovalPathData;
}


register(MODULE_NAME, init);