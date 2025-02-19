import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
//import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import * as TextSize from "crux/dist/utils/text-size";

//const pDict = "";
const xlabel = "gene type";
const ylabel = "expression";
const title = "Expression of different gene";

const MODULE_NAME = "stackedBars";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        //components: { xlabel, ylabel, title},
        data: {xlabel, ylabel, title,},
        loadData: {
            data: {
                fileKey: "stackedData",
                type: "csv",
                loaded(data) {

                    const classificationKey = data.columns[0]; //Type
                    const classifications = data.map(d => d[classificationKey]); //第一列的名字 //横坐标
                    let categories = data.columns.slice(2); //纵坐标
                    
                    const result = {}; //数据
                    const colorMap = Oviz.color.schemeCategory("light", categories).colors; //颜色
                    const colors = Object.values(colorMap); //颜色值

                    //纵坐标为一级键值
                    categories.forEach((item,index) => {
                        result[item] = [];
                    });


                    categories.sort((a,b)=>a-b)


                    

                    let array = {}
                    

                    classifications.forEach((ditem,dindex) => {
                        let sum = 0
                        data.forEach((item,index) => {
                            if(item[classificationKey] == ditem){
                                categories.forEach((k,n) => {
                                    sum = sum + item[k]*1
                                    
                                });
                            }
                        });
                        array[ditem] = sum
                        
                    });



                    categories.forEach((item,index) => {
                        data.forEach((ditem,dindex) => {
                            result[item].push([ditem[classificationKey],parseFloat(ditem[item])/array[ditem[classificationKey]]])
                        });
                    });

                    let color = { C1:"#2870eb",C2:"#f5ab3d",C3:"#ed3b79",C4:"#0fc79f",C5:"#a841f1",C6:"#f2d72c"}
                    this.data.color = color

                    this.data.height = 500
                    this.data.gridwidth = 12
                    this.data.padding = 2
                    this.data.angle = 45 
                    this.data.bottomfontsize = 10 
                    let tmplenlist = []
                    classifications.forEach(element => {
                        tmplenlist.push(TextSize.measuredTextSize(element,this.data.bottomfontsize).width)
                    });
                    this.data.maxsamplelen = Math.max(...tmplenlist)
                    
                    
                    return {result, classifications, colorMap, colors, categories};

                },
            },
        },
        setup() {
            console.log(this["_data"]);
            this.size.height = this.data.height + 220 + this.data.maxsamplelen
            this.size.width = this.data.data.classifications.length*this.data.gridwidth  + 200
            registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);
            //registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);

        },
    });

    return visualizer;
}

export function registerstackedBarsplot() {
    register(MODULE_NAME, init);
}

register(MODULE_NAME, init);
