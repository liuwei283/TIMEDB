
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
import * as TextSize from "crux/dist/utils/text-size";

const MODULE_NAME = "HRORTable";

let cells = []
let methoddata = []
let stage = []
let dotdata = {}
let dots = []
let chosenMethod = []

const title = "Proportion of Immune Cells for Each Sample";
const xlabel = "";
const ylabel = "proportion";


function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: {},
        data: {
            title,
            xlabel,
            ylabel,
        },
        loadData: {
            data: {
                fileKey: "module4Plot1",
                type: "csv",
                multiple: false,
                loaded(data) {


                    data.forEach((item,index) => {
                        cells.includes(item.Variable)? null:cells.push(item.Variable) //纵坐标细胞种类
                        methoddata.includes(item.Metric)? null:methoddata.push(item.Metric)  //对应editor需要选择的方法
                        stage.includes(item.Survival)? null:stage.push(item.Survival)  //横坐标 对应的阶段
                    });

                    cells = sortsubtype(cells,"1")

                    

                    const diff_method = methoddata.map(x=>new Object({"methodkey":x,"data":[]}))
                    diff_method.forEach((item,index)=>{
                        data.forEach((ditem,dindex)=> {
                            if(ditem.Metric==item.methodkey){
                                item.data.push(ditem)
                            }
                            //console.log("",typeof(ditem.upper95))
                        });
                    });
                    console.log("diff_method:",diff_method);

                    diff_method.forEach((item,index)=>{
                        console.log("item:",item)
                        dotdata[item.methodkey] = []
                        item.data.forEach((ditem,dindex)=> {
                            //
                            let num1 = parseFloat(ditem.pretty_p.replace(/[^\d]/g,'.').replace(".0.","0."));
                            //console.log("num1:",num1)
                            let r = 8 - num1*4
                            r<0? r = 1:null
                            console.log("r:",r) 
                            let color
                            num1>=1? color = "red":color = "blue"
                            //console.log("r:",ditem["p value"])
                            dotdata[item.methodkey].push([stage.indexOf(ditem.Survival),cells.indexOf(ditem.Variable),r,num1*1,color])
                            
                            //dotdata[item.methodkey].push([stage.indexOf(ditem.group),cells.indexOf(ditem.feature)])
                        });
                    })
                    chosenMethod.length == 0? chosenMethod = ["HR"] : null //选择方法
                    dots = dotdata[chosenMethod[0]]
                    console.log("dotdata:",dotdata)
                    // cells.unshift("")
                    // cells.push("")
                    console.log(cells)
                    let cell = []
                    cells.forEach((item)=>{
                        cell.push(item.replace(/_/g," ").replace(/sub /g," ").slice(1))
                    })

                    this.data.chosenMethod = chosenMethod
                    this.data.cell = cell
                    this.data.dots = dots
                    this.data.stage = stage
                    this.data.valueRange = [-1,cell.length]

                },
            },
        },
        setup() {
            console.log(this["_data"]);
            registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);
            this.size.height = this.data.cell.length * 30 + 200
        },
    });

    return visualizer;
}

export function registerHRORTable() {
    register(MODULE_NAME, init);
}

register(MODULE_NAME, init);

export function sortsubtype(arr,category){
    let result = []
    if(category=="1"){
        arr.forEach((k,n) => {
            if(k.slice(0,5)=="c_sub"){
                result.push(k)
            }
        });
        arr.forEach((k,n) => {
            if(k.slice(0,5)=="c_ajc"){
                result.push(k)
            }
        });
        arr.forEach((k,n) => {
            if(k.slice(0,5)!="c_sub"&&k.slice(0,5)!="c_ajc"){
                result.push(k)
            }
        });
        
    }
    return result
}