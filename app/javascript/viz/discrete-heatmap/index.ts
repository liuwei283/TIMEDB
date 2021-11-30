import Oviz from "crux"

import { editorConfig } from "./editor";
import template from "./template.bvt"
import {DiscreteHeatMap} from './discrete-heatmap'
import {register} from "page/visualizers";
import { registerEditorConfig } from "utils/editor";

const MODULE_NAME = "discrete-heatmap"
const defaultValues = [0, 0.5, 1];
const defaultInfo = ["did not use drug", "not reported", "used drug"];
let gridW,gridH
let width:[]
const DiscreteHeatmap = {
    initViz,
    initVizWithDeepomics
}

function init() {
    if (window.gon.module_name !== MODULE_NAME) return;
    const {vizOpts} = initViz();
    Oviz.visualize(vizOpts);
}

function initViz(): any {
    const vizOpts = {
        el:"#canvas",
        template,
        components: {DiscreteHeatMap},
        data: {
            config: {
                colLabelRotation: 90,
            },
            values : defaultValues,
            valueMap: genDefaultValueMap(),
            colors: ["white", "#C7C7C7", "red"],
            gridW,
            gridH,
            width,
        },
        loadData: {
            heatmapDataD: {
                fileKey: 'heatmapDataD',                  
                type: "tsv",
                multiple: true,
                loaded(d) {
                    //samples sorting
                    let samples = [];;
                    let sortedsamples = [];
                    d.forEach((i,j) => {
                        i.forEach((item,index) => {
                            if(!samples.includes(item)){
                                let eachsample = item[""];
                                console.log("eachsample",item)
                                eachsample = eachsample.slice(1,);
                                samples[index] =parseFloat(eachsample);
                            }
                            else{
                                return null;
                            }
                        });
                    });
                    samples.sort(function(a, b) {
                        return a - b;
                    });
                    samples.forEach((item,index) => {
                        if(item < 10){
                            const eachsortedsample= "G0"+ String(item)
                            sortedsamples.push(eachsortedsample)
                        }else {
                            const eachsortedsample= "G" + String(item)
                            sortedsamples.push(eachsortedsample)
                            
                        }
                    });

                    //get plot data
                    const values = [];
                    const collength = [];
                    d = d.map(sample => {
                        const rows = [];
                        const data = [];
                        sortedsamples.forEach((item,index)=>{
                            sample.forEach(row => {
                                if(row[""] == item){
                                    const r = [];
                                    rows.push(item);
                                    sample.columns.forEach(k => {
                                        if (k !== "") {
                                            r.push(parseFloat(row[k]));
                                            if (!values.includes(parseFloat(row[k])))
                                                values.push(parseFloat(row[k]));
                                        };
                                    });
                                    data.push(r);
                                };
                            });
                        });
                        return {rows, columns: sample.columns.splice(1, sample.columns.length), data};
                    });
                    d.forEach(i => {
                        const length = i.columns.length;
                        collength.push(length)
                    });
                    console.log(collength)
                    this.data.values = values.sort();
                    this.data.gridH = 15;
                    this.data.gridW = 25;
                    this.data.width = collength;
                    console.log(this.data.width)
                    return d;
                },
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this));
        }
    };
    return {vizOpts};
}

function initVizWithDeepomics(fileDefs) {
    
}


function genDefaultValueMap() {
    const valueMap = new Map();
    valueMap.set(0, "no");
    valueMap.set(1, "yes");
    valueMap.set(0.5, "not reported");
    return valueMap;
}



export default DiscreteHeatmap;

register(MODULE_NAME, init);

