import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { PieChart } from "crux/dist/element";
//import { chooseMethod } from "viz/comparedBar2";
import { isThisTypeNode } from "typescript";

const MODULE_NAME = "static_method_immunePie";

let chosenSample = [];
let chosenMethod = [];
let pieR = 120;
let plotSize = [1200,800];
let tempSample = [];
let rowdata = [];
let colorMap = ["#D9222A","#BEDECC","#BAD05D","#F5F4C6","#ECB7A2",
                "#FCE2B4","#EA8C2E","#E1AEBA","#00AEBE","#FAF08D",
                "#EA8C2E","#E5B574","#FCF18D","#E8D0D3","#F4F1C6",
                "#FFF005","#AA84A4","#7ABEA2","#FCF18D","#E1AEBA",
                "#FCEF8D","#E3B5AD","#FAF4C5","#E38F7A","#A4CDA0",
                "#B25675","#E7DAD9","#00AEBE","#AC94B6","#00899D",
                "#8CB9BA","#F4C5C4",
                "#D9222A","#BEDECC","#BAD05D","#F5F4C6","#ECB7A2",
                "#FCE2B4","#EA8C2E","#E1AEBA","#00AEBE","#FAF08D",
                "#EA8C2E","#E5B574","#FCF18D","#E8D0D3","#F4F1C6",
                "#FFF005","#AA84A4","#7ABEA2","#FCF18D","#E1AEBA",
                "#FCEF8D","#E3B5AD","#FAF4C5","#E38F7A","#A4CDA0",
                "#B25675","#E7DAD9","#A8CFDC","#AC94B6","#00899D",
                "#8CB9BA","#F4C5C4",]
const title = "Proportion of Immune Cells for Each Sample";
const tickFontSize = 20;


export function init(id, path) {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: {},
        data: {
            legendPos: {x: 800, y: 0},
            updateLegendPos(ev, el, deltaPos) {
                this.legendPos.x += deltaPos[0];
                this.legendPos.y += deltaPos[1];
                this.redraw();
            },
        },
        loadData: {
            comparedBox: {
                fileKey: "methodPie",
                type: "csv",
                multiple: false,
                loaded(data) {
                    rowdata = data;
                    let result = process(data)
                    chosenMethod.length == 0? chosenMethod[0] = result.methoddata[0]:null
                    chosenSample.length == 0? chosenSample[0] = result.sampleList[0]:null
                    let test = result.temp[chosenMethod[0]][chosenSample[0]]
                    let legend = result.legendData[chosenMethod[0]][chosenSample[0]];

                    this.data.test = test;
                    this.data.chosenMethod = chosenMethod;
                    this.data.chosenSample = chosenSample;
                    this.data.pieR = pieR;
                    this.data.methodList = result.methoddata;
                    this.data.sampleList = result.sampleList;
                    this.data.legend = legend;
                    this.data.title = title;
                    this.data.tickFontSize = tickFontSize;
                    this.data.plotSize = plotSize;

                },
            },
        },
        setup() {
            console.log(this["_data"]);
            registerEditorConfig(editorConfig(this), editorRef);
        },
    });

    return visualizer;
}

//register(MODULE_NAME, init);

export function filteredSample(v:any){
    chosenSample = [];
    const choose:Set<string> = v.data.chosenSample;
    v.data.chosenSample = v.data.sampleList.filter(s => choose.has(s));
    const samples = v.data.chosenSample;
    tempSample  = chosenSample = samples;
    let newresult = process(rowdata)
    chosenMethod.length == 0? chosenMethod = newresult.methoddata[0]:null
    
    let test = newresult.temp[chosenMethod[0]][chosenSample[0]]
    let legend = newresult.legendData[chosenMethod[0]][chosenSample[0]];

    v.data.test = test;
    v.data.chosenMethod = chosenMethod;
    v.data.chosenSample = chosenSample;
    v.data.pieR = pieR;
    v.data.methodList = newresult.methoddata;
    v.data.sampleList = newresult.sampleList;
    v.data.legend = legend;
    v.data.title = title;
    v.data.tickFontSize = tickFontSize;
    v.data.plotSize = plotSize;
    v.forceRedraw = true;
    v.run();

}

export function filterMethod(v:any){
    chosenMethod = [];
    const choose: Set<string> = v.data.chosenMethod;
    v.data.chosenMethod = v.data.methodList.filter(s => choose.has(s))
    const method = v.data.chosenMethod;
    chosenMethod = method;
    let newresult = process(rowdata)
    console.log("filter:",newresult)
    tempSample.length == 0? tempSample = newresult.sampleList[0] :null
    console.log("tempSample:",tempSample)
    let test = newresult.temp[chosenMethod[0]][tempSample]
    console.log("filter_test:",test)
    let legend = newresult.legendData[chosenMethod[0]][tempSample];

    v.data.test = test;
    v.data.chosenMethod = chosenMethod;
    v.data.chosenSample = chosenSample;
    v.data.pieR = pieR;
    v.data.methodList = newresult.methoddata;
    v.data.sampleList = newresult.sampleList;
    v.data.legend = legend;
    v.data.title = title;
    v.data.tickFontSize = tickFontSize;
    v.data.plotSize = plotSize;
    v.forceRedraw = true;
    v.run();
}

export function process(data){
    let methoddata = [];
    let legendData = {};
    let columns = [];
    let sampleList = [];
    let cells = [];
    let stageindex = [];
    let temp = {};
    columns = data.columns.slice(1);
    columns.forEach((item,d)=>{
        methoddata[d] = item.split('|')[1];
        cells[d] = item.split('|')[0];
        d+1!=columns.length ?(item.split('|')[1]!=columns[d+1].split('|')[1]? stageindex.push(d+1):null) :null
    });
    stageindex.unshift(0);
    stageindex.push(columns.length);
    methoddata = Array.from(new Set(methoddata)); 
    sampleList = data.map(d => d["ID"]); 
    methoddata.forEach((ditem,dindex)=>{
        temp[ditem] = [];
        legendData[ditem] = [];
        data.forEach((k,d) => {
            temp[ditem][k["ID"]] = []
            legendData[ditem][k["ID"]] = []
            columns.slice(stageindex[dindex],stageindex[dindex+1]).forEach((m,i) => {
                //const color = Oviz.color.Color.hsl((i%6)*60, 60+Math.floor((i/6))*10, 60+Math.floor((i/6))*10);
                legendData[ditem][k["ID"]].push({fill:colorMap[i],label:m.split('|')[0]});
                temp[ditem][k["ID"]].push({name:m.split('|')[0],value:k[m]*1,color:colorMap[i]})
            });
        });
    })
    return{columns,methoddata,temp,sampleList,legendData}

}