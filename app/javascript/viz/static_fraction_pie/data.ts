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


const MODULE_NAME = "static_fraction_pie";

const title = "Proportion of Immune Cells for Each Sample";
const tickFontSize = 20;

export function plotDataloaded(_data){
    let quotaList = []
    let plotData = {}
    _data.columns.slice(2).forEach(item => {
        (item+"").substring(0,2)=="c_"? (quotaList.push(item),plotData[item] = []):null 
    });

    quotaList.forEach((ditem,d)=>{
        _data.forEach((m,n) => {
            plotData[ditem].includes(m[ditem])? null:plotData[ditem][m[ditem]] = []
        });
    })
    let temp = {}
    let legend = {}
    quotaList.forEach((ditem,d)=>{
        let each = _data.map(d=>d[ditem])
        temp[ditem] = []
        legend[ditem] = []
        let index = 0
        for (const [key, value] of Object.entries(plotData[ditem])) {
            index = index+1
            plotData[ditem][key] = count(each,key)
            const color = Oviz.color.Color.hsl((index%6)*60, 60+Math.floor((index/6))*10, 60+Math.floor((index/6))*10)
            temp[ditem].push({value:count(each,key),name:key,color:color.string})
            legend[ditem].push({label:key,fill:color.string})
        }
    })


    this.data.plot = temp
    this.data.legend = legend
    console.log("temp:",temp)
}

export function buttonFunc(result,buttonkey){
    return result.temp[result.methoddata[buttonkey]]
} 

export function count(arr,element){
    let result = 0
    arr.forEach(item => {
        item == element? result= result +1 :null
    });
    return result
}