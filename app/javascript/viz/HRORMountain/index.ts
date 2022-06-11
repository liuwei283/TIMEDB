
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
import { parse } from "utils/newick";

const MODULE_NAME = "HRORMountain";

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
                fileKey: "module4Plot2",
                type: "csv",
                multiple: false,
                loaded(data) {
                    console.log("data:",data)
                    this.data.oridata = data
                    // Variable 细胞种类
                    // Survival 分组
                    // pretty_p p值
                    // Metric 矩阵类型
                    let cells = []
                    let methoddata = []
                    let stage = []
                    
                    data.forEach((item,index) => {
                        cells.includes(item.Variable)? null:cells.push(item.Variable) //纵坐标细胞种类
                        methoddata.includes(item.Metric)? null:methoddata.push(item.Metric)  //对应editor需要选择的方法
                        stage.includes(item.Survival)? null:stage.push(item.Survival)  //横坐标 对应的阶段
                    });
                    
                    
                    console.log("stage",stage)
                    //这里对cell进行排序
                    console.log("???","c_sub_hclust(hclust_G4 vs. hclust_G1)".slice(0,5))
                    cells = sortsubtype(data,cells,"1")
                    console.log("cells:",cells)

                    this.data.cells = cells //
                    this.data.tempcells = cells  //
                    this.data.methoddata = methoddata //
                    
                    
                    let pdata = []
                    data.forEach(item => {
                        let p = parseFloat(item.pretty_p.replace(/[^\d]/g,'.').replace(".0.","0."));
                        pdata.push({pretty_p:p,Variable:item.Variable})
                    });
                    //pdata = pdata.sort(sortBy('pretty_p',true))
                    pdata = pdata.sort(compare('pretty_p'))
                    //pdata = pdata.sort(sortBy('pretty_p',false)) //从大到小
                    let pcells = pdata.map(d=>d.Variable)
                    pcells = Array.from(new Set(pcells))
                    this.data.pcells = pcells //
                    console.log("pdata:",pdata)
                    console.log("this.data.pcells:",this.data.pcells)

                    let hrdata = []
                    data.forEach(item => {
                        hrdata.push({pretty_R:item.pretty_R,Variable:item.Variable})
                    });
                    //hrdata = hrdata.sort(compare('pretty_R'))
                    hrdata = hrdata.sort(sortBy('pretty_p',false)) //从大到小
                    let hrcells = hrdata.map(d=>d.Variable)
                    hrcells = Array.from(new Set(hrcells))
                    this.data.hrcells = hrcells //
                    console.log("hrdata:",hrdata)
                    console.log("this.data.hrcells:",this.data.hrcells)

                    this.data.sortsign = "nosort" //"psort"

                    this.data.config = {
                        sign:[
                            {value:"nosort",text:"Sort by Subtype"},
                            {value:"psort",text:"Sort by P Value"},
                            {value:"hrsort",text:"Sort by HR Value"},
                        ]
                    }

                    
                    switch(this.data.sortsign){
                        case "hrsort":
                            this.data.cells = this.data.hrcells;
                            break;
                        case "psort":
                            this.data.cells = this.data.pcells;
                            break;
                        case "nosort":
                            this.data.cells = cells;
                            break;
                    }

                    const diff_method = methoddata.map(x=>new Object({"methodkey":x,"data":[]}))
                    let colorMap = {">=1":"red","<1":"blue"}
                    this.data.colorMap = colorMap
                    diff_method.forEach((item,index)=>{
                        data.forEach((ditem,dindex)=> {
                            if(ditem.Metric == item.methodkey){
                                item.data.push(ditem)
                            }
                        });
                    });
                    console.log("diff_method:",diff_method);
                    //barData
                    let maxlengthPCR = []
                    let barData = {}
                    let barData2 = {}
                    let eachbar = []
                    let eachbar2 = []
                    
                    diff_method.forEach((item,index)=>{
                        console.log("item:",item)
                        barData[item.methodkey] = []
                        barData2[item.methodkey] = []
                        //lineData
                        item.data.forEach((ditem,dindex)=> {
                            //if(ditem.metric == "Hazard Ratio"){
                                let color
                                let num1 = parseFloat(ditem.pretty_p.replace(/[^\d]/g,'.').replace(".0.","0.")); //p值
                                num1>=1? color = colorMap[">=1"]:color = colorMap["<1"]
                                //let str = num1 + ""+"("+(num1*0.9).toFixed(2)+""+"-"+(num1*1.1).toFixed(2)+""+")"
                                //barData[item.methodkey].push([cells.indexOf(ditem.feature),num1*0.8,ditem.value,color,str,ditem["p value"],ditem["95% ci lower"],ditem["95% ci upper"]])
                                //
                                let str = ditem["pretty_RCI"]
                                maxlengthPCR.push(TextSize.measuredTextSize(ditem["pretty_RCI"], 12).width)
                                num1>2? num1 = Math.log(num1-1)+1:null
                                isNaN(ditem.lower95)||isNaN(ditem.upper95)? (ditem.lower95 = 0,ditem.upper95 = 0):null
                                
                                barData[item.methodkey].push([this.data.cells.indexOf(ditem.Variable),num1*0.8,num1,color,str,ditem.pretty_p,ditem.lower95,ditem.upper95])
                        });
                    })
                    chosenMethod.length == 0? chosenMethod = ["HR"] : null
                    eachbar = barData[chosenMethod[0]]
                    eachbar2 = barData2[chosenMethod[0]]
                    // cells.unshift("")
                    // cells.push("")
                    console.log(cells)
                    console.log("eachbar:", eachbar)

                    let cell = []
                    let maxlength = []
                    this.data.cells.forEach((item)=>{
                        cell.push(item.replace(/_/g," ").replace(/sub /g," ").slice(1))
                        maxlength.push(TextSize.measuredTextSize(item, 12).width)
                    })
                    console.log("maxlength:",maxlength)
                    let maxtextcell = Math.max(...maxlength)
                    let maxtextPRC = Math.max(...maxlengthPCR)
                    //= TextSize.measuredTextSize("test", 8).width;
                    this.data.chosenMethod = chosenMethod
                    this.data.cell = cell
                    this.data.eachbar = eachbar
                    this.data.eachbar2 = eachbar2
                    let eachline = []
                    let eachtext = []
                    this.data.eachline = eachline
                    this.data.eachtext = eachtext
                    this.data.stage = stage
                    this.data.maxtextcell = maxtextcell
                    this.data.maxtextPRC = maxtextPRC
                    chosenMethod[0] == "HR"? this.data.title = "Hazard Radio":this.data.title = "Odds Radio"

                    return {maxtextcell,maxtextPRC}
                },
            },
        },
        setup() {
            console.log(this["_data"]);
            registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);
            this.size.height = this.data.cell.length*15 + 200
            //this.size.width = this.data.maxtextPRC + 150 + 150
        },
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerHRORMountain() {
    register(MODULE_NAME, init);
}

register(MODULE_NAME, init);



export function sorteditor(v){
    switch(v.data.sortsign){
        case "hrsort":
            v.data.cells = v.data.hrcells;
            break;
        case "psort":
            v.data.cells = v.data.pcells;
            break;
        case "nosort":
            v.data.cells = v.data.tempcells;
            break;
    }
    console.log("????.>",v.data.sortsign)
    console.log("v.data.cells:",v.data.cells) 
    
    const newdiff_method = v.data.methoddata.map(x=>new Object({"methodkey":x,"data":[]}))
    let colorMap = {">=1":"red","<1":"blue"}
    v.data.colorMap = colorMap
    newdiff_method.forEach((item,index)=>{
        v.data.oridata.forEach((ditem,dindex)=> {
            if(ditem.Metric == item.methodkey){
                item.data.push(ditem)
            }
        });
    });
    //barData
    let maxlengthPCR = []
    let barData = {}
    let barData2 = {}
    let eachbar = []
    let eachbar2 = []
    let pdata = []
                    
    newdiff_method.forEach((item,index)=>{
        console.log("item:",item)
        barData[item.methodkey] = []
        barData2[item.methodkey] = []
        //lineData
        item.data.forEach((ditem,dindex)=> {
            let color
            let num1 = parseFloat(ditem.pretty_p.replace(/[^\d]/g,'.').replace(".0.","0.")); //p值
            num1>=1? color = colorMap[">=1"]:color = colorMap["<1"]
            let str = ditem["pretty_RCI"]
            maxlengthPCR.push(TextSize.measuredTextSize(ditem["pretty_RCI"], 12).width)
            num1>2? num1 = Math.log(num1-1)+1:null
            isNaN(ditem.lower95)||isNaN(ditem.upper95)? (ditem.lower95 = 0,ditem.upper95 = 0):null                 
            barData[item.methodkey].push([v.data.cells.indexOf(ditem.Variable),num1*0.8,num1,color,str,ditem.pretty_p,ditem.lower95,ditem.upper95])
        });
    })
    chosenMethod.length == 0? chosenMethod = ["HR"] : null
    eachbar = barData[chosenMethod[0]]
    eachbar2 = barData2[chosenMethod[0]]

    let cell = []
    let maxlength = []
    v.data.cells.forEach((item)=>{
        cell.push(item.replace(/_/g," ").replace(/sub /g," ").slice(1))
        maxlength.push(TextSize.measuredTextSize(item, 12).width)
    })
    let maxtextcell = Math.max(...maxlength)
    let maxtextPRC = Math.max(...maxlengthPCR)

    v.data.chosenMethod = chosenMethod
    v.data.cell = cell
    v.data.eachbar = eachbar
    v.data.eachbar2 = eachbar2
    let eachline = []
    let eachtext = []
    v.data.eachline = eachline
    v.data.eachtext = eachtext
    v.data.maxtextcell = maxtextcell
    v.data.maxtextPRC = maxtextPRC
    chosenMethod[0] == "HR"? v.data.title = "Hazard Radio":v.data.title = "Odds Radio"

}

export function compare(property){
    return function(a,b){
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
    }
}

function sortBy(attr,rev){
    //第二个参数没有传递 默认升序排列
    if(rev ==  undefined){
        rev = 1;
    }else{
        rev = (rev) ? 1 : -1;
    }
    
    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}




export function sortsubtype(data,arr,category){
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


