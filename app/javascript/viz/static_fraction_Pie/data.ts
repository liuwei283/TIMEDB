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


export function plotDataloaded(_data){
    //console.log("staic fraction pie___________________")
    //console.log("_data:",_data)
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
    //console.log("sort???",plotData)
    let newPlotdata = {}

    let maxLegendtext = []
    for (const [key, value] of Object.entries(plotData)) {
        newPlotdata[key] = []
        Object.keys(plotData[key]).map(k=>k!="NA"? k:"}").sort().forEach((item,index)=>{
            item == "}"? item = "NA":null
            newPlotdata[key][item] = []
            maxLegendtext.push(item.length)
        })
    }
    //console.log("newPlotdata:",newPlotdata)

    let maxLegend = Math.max(...maxLegendtext)

    plotData = newPlotdata

    // console.log("maxLegend:",maxLegend)
    this.data.maxLegend = maxLegend
    

    let temp = {}
    let legend = {}
    let colorMap = {}
    //console.log("sort???",quotaList.sort())

    quotaList.sort().forEach((ditem,d)=>{
        let each = _data.map(d=>d[ditem])
        temp[ditem] = []
        legend[ditem] = []
        colorMap[ditem] = []
        let index = 0
        for (const [key, value] of Object.entries(plotData[ditem].sort())) {
            index = index+1
            plotData[ditem][key] = count(each,key)
            let lecolor,piecolor
            let color = Oviz.color.Color.hsl((index%6)*60, 60+Math.floor((index/6))*10, 60+Math.floor((index/6))*10).string
            key == "NA"? piecolor = "grey":piecolor = color
            temp[ditem].push({value:count(each,key),name:key,color:piecolor,proportion:((count(each,key)/_data.length)*100).toFixed(2)})
            key == "NA"? lecolor = "grey":lecolor = color
            legend[ditem].push({label:key,fill:lecolor})
            colorMap[ditem][key] = lecolor
        }
    })


    this.data.plot = temp
    this.data.legend = legend
    this.data.listlength = _data.length
    this.data.pieR = 120
    this.data.tickFontSize = 16
    this.data.colorMap = colorMap
    // console.log("this.data.colorMap:",this.data.colorMap)
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