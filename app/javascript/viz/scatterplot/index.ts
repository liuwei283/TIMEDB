import Oviz from "crux";
import template from "./template.bvt"
import {ComplexScatterplot} from "./complex-scatterplot"
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
        components: {ComplexScatterplot},
        data: {
            plotHeight: 400,
            plotWidth: 400,
            colors: ["green", "red"],
            config: {
                xAxisIndex:1,
                yAxisIndex:2,
                computeOval: false,
                categoryRange: [null, null],
                valueRange: [null, null],
                scatterSize: 8,
                hollow: false,
            },
            groups: null,
            clusters: null,
            vectorLabel: null,
            scatterVectorData: null,
            scatterClusterData: null,
        },
        loadData: genDefaultDataSources(),
        setup() {
            registerEditorConfig(editorConfig(this));
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
                return null;
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


register(MODULE_NAME, init);