import Oviz from "crux"
import Vue from "vue";
import * as Path from "path";

import { editorConfig } from "./Editor";
import template from "./template.bvt"
import {DiscreteHeatMap} from "oviz-components/discrete_heatmap" 

import {testVizDataList, findFilesByDataName} from "utils/viz-class"

const defaultValues = [0, 0.5, 1];
const defaultColors = ["white", "#C7C7C7", "red"];
const defaultInfo = ["did not use drug", "unknown", "used drug"];

const DiscreteHeatmap = {
    initViz,
    initVizWithDeepomics
}

function initViz(): any {

    const vizDataList = testVizDataList;
    const vizOpts = {
        template,
        components: {DiscreteHeatMap},
        data: {
            config: {
                colLabelRotation: 90,
            },
            values : defaultValues,
            valueMap: genDefaultValueMap(),
            colorMap: genDefaultColorMap([]),
        },
        loadData: {
            heatmapData: {
                url:`/api/public?path={{filePath}}`,
                // dataPath: `/data/drug used/T1_sample.xls`,                   
                type: "tsv",
                loader(load) {
                    const fileList = findFilesByDataName( vizDataList, "heatmapData");
                    fileList.forEach(f=> {
                        let filePath = Path.join(f.path, f.name)
                        filePath = btoa(filePath)
                        load({filePath});
                    });
                },
                loaded(d) {
                    const values = [];
                    d = d.map(sample => {
                        const rows = [];
                        const data = [];
                        sample.forEach(row => {
                            const r = [];
                            rows.push(row[""]);
                            sample.columns.forEach(k => {
                                if (k !== "") {
                                    r.push(parseFloat(row[k]));
                                    if (!values.includes(parseFloat(row[k])))
                                        values.push(parseFloat(row[k]));
                                }
                            });
                            data.push(r);
                        });
                        return {rows, columns: sample.columns.splice(1, sample.columns.length), data};
                    });
                    this.data.values = values.sort();
                    this.data.colorMap = genDefaultColorMap(this.data.values);
                    return d;
                },
            },
            // testData: {
            //     content: `{"prop1":{"hello"}}`,
            //     dataPath: "/prop1",
            //     // type:"text",
            //     loaded(d) {
            //         console.log("======>"+d)
            //     }
            // }
        },
    };
    return {vizOpts, editorConfig};
}

function initVizWithDeepomics(fileDefs) {
    
}

function genDefaultColorMap(values) {
    const colorMap = new Map();
    colorMap.set(0, "white");
    colorMap.set(0.5, "#C7C7C7");
    colorMap.set(1, "red");
    return colorMap;
}

function genDefaultValueMap() {
    const valueMap = new Map();
    valueMap.set(0, "did not use drug");
    valueMap.set(1, "used drug");
    valueMap.set(0.5, "uknown");
    return valueMap;
}

export default DiscreteHeatmap;