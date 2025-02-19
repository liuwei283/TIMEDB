import Oviz from "crux";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";
import template from "./template.bvt";

const xlabel = "";
const ylabel = "sample sizes";
const valueRange = [0,70];
const colors = {
    fill: "#66c", 
    // border: "#fcf"
};

const MODULE_NAME = "immuneBar";

export function init(vid, path, eid, plot_name) {
    // if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: vid,
        template,
        data: {
            xlabel, 
            ylabel,
            startX: 0, 
            startY: 0,
            height: 550, 
            titleSize: 14, 
            labelSize: 12, 
            title: "",
            plotRotation: 0, 
            xRotation: -45, 
            yRotation: 0,
            groups: {
                colors
            },
        },
        loadData: {
            data: {
                url: path,
                type: "tsv",
                dsvHasHeader: false,
                loaded(data) {
                    valueRange[1] = Math.ceil(Math.max(...data.slice(1).map(d=>d[1]))/50)*50
                    this.data.result = data.slice(1);
                    this.data.sampleSize = data.slice(1).reduce((pre, cur) => pre+parseInt(cur[1]), 0);
                    this.data.valueRange = valueRange
                    this.data.width = Math.max(1000, 30*this.data.result.length)
                },
            },
        },
        setup() { 
            this.size = {height: 600, width: 300+this.data.width}
            console.log(this);
            registerEditorConfig(editorConfig(this, eid), "getVue", plot_name);
        },
    });
}