import Oviz from "crux";
import template from "./template.bvt";
import { ComplexStackedBar } from "oviz-components/complex-stacked-bar";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

const xLabel = "project type";
const yLabel = "expression";

export function init(vid, path, eid, plot_name) {

    const {visualizer} = Oviz.visualize({
        el: vid,
        template,
        components: { ComplexStackedBar },
        data: {
            xLabel, yLabel,
            tickprop : {
                opt: {
                    line: {
                        stroke: "none"
                    },
                    tick: {
                        stroke: "none"
                    }
                }
            },
            plotSize: [1100, 500],
            startX: 150, 
            startY: 20, 
            width: 1500, 
            height: 500, 
            titleSize: 11, 
            labelSize: 11, 
            title: "", 
            ylabel: "", 
            xlabel: "", 
            plotRotation: 0, 
            xRotation: 0, 
            yRotation: 0,
        },
        loadData: {
            data: {
                url: path,
                type: "csv" ,
                dsvHasHeader: false,
                loaded(data) {
                    this.data.data = staticDataProcessor(data)
                    this.data.width = Math.max(1400, 100 * Object.keys(this.data.data.widMap).length)
                },
            },
        },
        setup() {
            console.log(this)
            this.data.groups = this.data.data.colorMap
            this.size = {height: 700, width: Math.max(1600, 200 + 100*Object.keys(this.data.data.widMap).length)};
            // this.size = {height: 700, width: 1600};
            registerEditorConfig(editorConfig(this, eid), "getVue", plot_name);
        }
    });
    return visualizer;
}

function staticDataProcessor(data) {
    const projects = {};
    let categories = new Set<string>();
    let counter = 0;
    let curr;
    const widMap = {}
    let pro = []
    data.slice(1).forEach((d, index)=>{
        if(d[0].slice(-4) == ".csv" || d[1]=="" || d[1] == null) {
            curr = d[0];
            projects[curr] = [];
            pro.push(curr);
        }
        if(d[1] != null) categories.add("C"+d[1]);
        if(index == data.slice(1).length-1) {
            if(d[1] != null) categories.add("C"+d[1]);
        }
    })
    let cat = Array.from(categories).sort();;
    let temp = {};
    let result = {}
    cat.forEach(c=>{
        temp[c] = 0;
        result[c] = {}
        pro.forEach(p => result[c][p] = 0)
    })
    data.slice(1).forEach((d, index)=>{
        if(d[0].slice(-4) == ".csv" || d[1]=="" || d[1] == null) {
            widMap[curr] = counter;
            projects[curr] = Object.entries(temp).map((d: any)=>[d[0], d[1]/counter]);
            cat.forEach(c=>{
                temp[c] = 0;
            })
            counter = 0;
            curr = d[0];
        } else {
            if(d[1]!= null) {
                result["C"+d[1]][curr]++;
                temp["C"+d[1]]++;
                counter++;
            }
        }
        if(index == data.slice(1).length-1) {
            console.log(index)
            console.log(curr)
            console.log(result)
            widMap[curr] = counter;
            projects[curr] = Object.entries(temp).map((d: any)=>[d[0], d[1]/counter]);
            cat.forEach(c=>{
                temp[c] = 0;
            })
        }
    })
    let ret = {};
    cat.forEach(c => {
        // let sum = Object.entries(result[c]).reduce((pre, cur) =>  pre + parseFloat(cur[1]), 0);
        ret[c] = Object.entries(result[c]).map((d: [string, number]) => [d[0], d[1]/widMap[d[0]]]);
    })
    let classifications = cat.sort();
    const colorMap = Oviz.color.schemeCategory("dark", cat);
    return {data: ret, classifications, widMap, colorMap, baseWidth: Math.min(1100/Object.keys(widMap).length, 40)}
}