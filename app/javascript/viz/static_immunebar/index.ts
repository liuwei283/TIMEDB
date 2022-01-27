import Oviz from "crux";
import template from "./template.bvt";

let xlabel = "Cancer type";
const ylabel = "Sample number";
let title = "which method";
const sample = 0;
const valueRange = [0, 1];
const plotSize = [500,1200];
const colors = ["#3d8eff", "#000000"];

const MODULE_NAME = "immuneBar";

export function init(id, path) {
    // if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        data: {
            xlabel, ylabel, title,
            labelFontSize: 12, 
            tickFontSize: 14, 
            xAxisRotated: 45,
        },
        loadData: {
            data: {
                url: path,
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    const xAxisKey = data.columns[0];
                    const yAxisKey = data.columns[1];
                    const result = [];
                    let sampleSize: number = 0;
                    let maxSample: number = 0;
                    data.forEach(d => {
                        result.push([d[xAxisKey], d[yAxisKey]]);
                        sampleSize += d[yAxisKey];
                        maxSample = maxSample >= d[yAxisKey]? maxSample: d[yAxisKey];
                    });
                    if(data.columns[0] != "cancer_type")
                    this.data.xlabel = data.columns[0];
                    this.data.r = result;
                    this.data.colors = colors;
                    this.data.sampleSize = sampleSize;
                    this.data.valueRange = [0, maxSample*1.2]
                    this.data.plotSize = plotSize;
                    this.data.labelFontSize = 12;
                    this.data.tickFontSize = 14;
                },
            },
        },
        setup() { 
            console.log(this["_data"]);
        },
    });
}