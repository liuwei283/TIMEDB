import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { PieChart } from "crux/dist/element";
import { isThisTypeNode } from "typescript";

const colorMap = ["#D9222A","#BEDECC","#BAD05D","#F5F4C6","#ECB7A2",
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

export let dataOpt = {
    chosenSample: [],
    chosenMethod: [],
    pieR: 120,
    rowdata: [],
    colorMap: colorMap,
    title: "Proportion of Immune Cells for Each Sample",
    tickFontSize: 20,
}

export function pieDataloaded(_data){
    dataOpt.rowdata = _data;
    let result = process(dataOpt.rowdata)
    console.log("result:",result)
    let newresult = result.temp[result.methoddata[0]]
    console.log("newresult:",newresult)

    dataOpt.chosenMethod.length == 0? dataOpt.chosenMethod[0] = result.methoddata[0]:null
    dataOpt.chosenSample.length == 0? dataOpt.chosenSample[0] = result.sampleList[0]:null
    let test = result.temp[dataOpt.chosenMethod[0]][dataOpt.chosenSample[0]]
    let legend = result.legendData[dataOpt.chosenMethod[0]][dataOpt.chosenSample[0]];

    console.log("-----------------------")
    this.data.test = test;
    this.data.pieChartdata = result.temp;
    this.data.legendData = result.legendData;
    this.data.chosenMethod = dataOpt.chosenMethod;
    this.data.chosenSample = dataOpt.chosenSample;
    this.data.pieR = dataOpt.pieR;
    this.data.methodList = result.methoddata;
    this.data.sampleList = result.sampleList;
    this.data.legend = legend;
    this.data.title = dataOpt.title;
    this.data.tickFontSize = dataOpt.tickFontSize;
    
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