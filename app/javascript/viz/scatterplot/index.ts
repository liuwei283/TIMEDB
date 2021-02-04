import Oviz from "crux";
import template from "./template.bvt"
import {ComplexScatterplot} from "./complex-scatterplot"
import { editorConfig } from "./editor";
import { registerEditorConfig } from "utils/editor";

import {getGroups, groupBy}from "utils/array"
import {register} from "page/visualizers";

import * as _ from "lodash";

const MODULE_NAME = 'scatterplot'

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        renderer: "svg",
        root: new ComplexScatterplot(),
        data: {
            colors: ["green", "red"],
            config: {
                plotHeight: 500,
                plotWidth: 500,
                xAxisIndex:1,
                yAxisIndex:2,
                computeOval: false,
                categoryRange: [null, null],
                valueRange: [null, null],
                scatterSize: 8,
                hollow: false,
                showErrorEllipse: true,
            },
            vectorLabel: null,
        },
        loadData: {
            scatterData: {
                fileKey: "scatterData",
                type: "tsv",
                dsvRowParser (row, index,columns) {
                    row.sampleId = row[columns[0]];
                    delete row[columns[0]];
                    for (let i = 1; i< columns.length; i++)
                        row[columns[i]] = parseFloat(row[columns[i]]);
                    return row;
                },
                loaded(data) {
                    this.data.scatterColumns = data.columns;
                    this.data.scatterColumns[0] = "sampleId";
                    this.data.availableAxises = [];
                    data.columns.forEach((d,i) => {
                        if(i>0) this.data.availableAxises.push({value: i, text: d});
                    })
                }
            },
            scatterGroupData: {
                fileKey: "scatterGroupData",
                type: "tsv",
                optional: true,
                dependsOn: ["scatterData"],
                loaded(data) {
                    if (!data) return;
                    this.data.groups = getGroups(data, data.columns[1]);
                    this.data.scatterData = this.data.scatterData.map(d => {
                        data.forEach(group => {
                            if(group[data.columns[0]] === d[this.data.scatterData.columns[0]]) 
                            d.group = group[data.columns[1]] ;
                        })
                        
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
                dsvRowParser (row, _,columns) {
                    for (let i = 1; i< columns.length; i++)
                        row[columns[i]] = parseFloat(row[columns[i]]);
                    return row;
                },
                loaded(data) {
                    if (!data) return;
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
                    if (!data) return;
                    this.data.clusters = Object.keys(_.groupBy(data, "cluster"));
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
                        return hasCluster;
                    })
                    return null;
                }
            }
        },
        setup() {
            console.log(this["_data"]);
            registerEditorConfig(editorConfig(this));
        }
    }); 
    
    return visualizer;
}

register(MODULE_NAME, init);

export function registerScatterplot(){
    register(MODULE_NAME, init);
}