import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { PieChart } from "crux/dist/element";
import { chooseMethod } from "viz/comparedBar2";
import { isThisTypeNode } from "typescript";


let chosenSample = [];
let chosenMethod = [];
let textSample = [];
let textMethod = [];
let plotSize = [1200,600];
let tempSample = [];
let rowdata = [];

const title = "Proportion of Immune Cells for Each Sample";
const xlabel = "";
const ylabel = "proportion";

export function plotDataloaded(_data){
    console.log("data:",_data)
    let eachcell = _data.columns.slice(2)
    let newData =  dataHandler(_data,eachcell)

    this.data.columns = newData.columns;
    this.data.rowcolumns = eachcell;
    this.data.chosenMethod = chosenMethod;
    this.data.colors = ["#FCE4EC"];
    this.data.boxdata = {values: newData.result,means: newData.means,outliers:[], categories: newData.columns }
    console.log("data:",newData.result)

    //计算valueRange
                    
    this.data.valueRange = range(newData.result)
                    
    const plotwidth = 800;
    const padding = 60;
    this.data.plotwidth = plotwidth;
    this.data.padding = padding;
    this.data.gridwidth = (plotwidth - 2 * padding) / this.data.columns.length;
    
}

export function range(mapdata){
    let resultMax = []
    let resultMin = []
    mapdata.forEach((item,i) => {
        resultMax.push(Math.max(...item))
        resultMin.push(Math.min(...item))
    });
    return [0,(Math.ceil(Math.max(...resultMax))+Math.log(Math.ceil(Math.max(...resultMax))))]

}


export function dataHandler(data: any,rowcolumns){
    const result = [];
    const means = [];
    rowcolumns.forEach((arr) => {
      const temp1 = [];
      data.forEach((d) => {
        d[arr] == "NA"? d[arr] = 0:null
        temp1.push(parseFloat(d[arr]));
      });
      const stat = new Oviz.algo.Statistics(temp1);
      result.push([
        stat.min(),
        stat.Q1(),
        stat.median(),
        stat.Q3(),
        stat.max(),
      ]);
      means.push(stat.mean());
    });
    return { result: result, means, columns: rowcolumns }
  }
