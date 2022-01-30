import Oviz from "crux";
import template from "./template.bvt";

const xlabel = "Categories";
const ylabel = "Sample numbers";
const valueRange = [0,70];
const plotSize = [500,1200];
const colors = ["#66c", "#fcf"];

const MODULE_NAME = "immuneBar";

export function init(id, path, config) {
    // if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        data: {
            xlabel, ylabel,
            labelFontSize: 12, 
            tickFontSize: 14, 
            xAxisRotated: 45,
        },
        loadData: {
            data: {
                url: path,
                type: "tsv",
                dsvHasHeader: false,
                loaded(data) {
                    console.log(data)
                    console.log(data.slice(1))
                    valueRange[1] = Math.ceil(Math.max(...data.slice(1).map(d=>d[1]))/50)*50
                    this.data.result = data.slice(1);
                    this.data.colors = colors;
                    this.data.sampleSize = data.slice(1).reduce((pre, cur) => pre+parseInt(cur[1]), 0);
                    this.data.valueRange = valueRange
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