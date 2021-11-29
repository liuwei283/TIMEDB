import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerEditorConfig } from "utils/editor";
import {register} from "page/visualizers";
import {DiverBoxPlot,diverplotDataProcess} from "oviz-components/diverboxplot";
import { groupBy, getGroups } from "utils/array";
import { findBoundsForValues } from "utils/maths";
import { isJSDocThisTag, isTemplateExpression } from "typescript";
import { currentEventContext } from "crux/src/event";
import {generateDiverConfig} from"./editor";


const MODULE_NAME = "comparedBar";
let BarData = [];
let categories=[];
let colors = {}
let legenddata = []
let celldata=[]
let methoddata=["method1","method2","method3","method4","method5","method6"]
let cellpageindex = []
let sampleData = []
let hiddenSamples =[]
let filteredSamples = []
let rowdata = []
let rowcolumns =[]
let choosesample =[]

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: {GridPlot },
        data: {
            // 拖动更新legend位置的function 可以放进component.ts里
            BarData,
            colors,
            legenddata,
            celldata,
            cellpageindex,
            methoddata,
            sampleData,
            hiddenSamples,
            filteredSamples,
            rowdata,
            rowcolumns,
            choosesample,
            buttonkey: 1,
            buttonclick(d){
                this.buttonkey = this.buttonkey + d
                this.redraw()
            },
        },
        loadData: {
            comparedBar: {
                fileKey: "comparedBar",
                type: "csv",
                multiple: true,
                loaded(data) {
                    data.forEach((ditem,dindex)=> {
                        rowdata.push(ditem)
                    })
                    this.data.rowcolumns = data[0].columns
                    cellpageindex [1] = generalparm(data[0])
                    data.forEach((ditem,dindex)=> {
                            const result= eachBardata(ditem,dindex,cellpageindex [1])   
                            BarData.push(result.eachBardata)
                            if(dindex==0){
                                this.data.sampleData = result.sampleData;
                                this.data.legenddata = result.insidelegendata;
                                this.data.celldata = result.cells
                                this.data.colors= result.colors
                            }
                        })
                    cellpageindex [0] = this.data.buttonkey
                    this.data.cellpageindex = cellpageindex
                    this.data.BarData= BarData
                    this.data.colors= colors
                    //console.log("legenddata",sampleData)
                    this.data.methoddata=methoddata
                    this.data.rowdata=rowdata
                    console.log("selecteddata",this.data.sampleData)
                    return null;
                },
            },
        },
        setup() {
            registerEditorConfig(generateDiverConfig(this));
        },
    });
    return visualizer;
}
register(MODULE_NAME, init);






export function filterSamples(v:any){
    BarData=[]
    v.data.buttonkey = 1
    const hidden: Set<string> = v.data.hiddenSamples;
    console.log("filteredSamples",v.data.sampleData)
    v.data.filteredSamples = v.data.sampleData.filter(s => !hidden.has(s));
    console.log("filteredSamples",v.data.filteredSamples)
    v.data.cellpageindex[1] = Math.ceil(v.data.filteredSamples.length/10); 
    const samples = v.data.filteredSamples
    let newdata=[]
    v.data.rowdata.forEach((item,index)=> {
        const filtered = item.filter(word => samples.includes(String(word[""])));
        filtered.columns= v.data.rowcolumns//v.data.filteredSample.includes(word[""]));
        newdata.push(filtered)
    });
    let cellpageindex =[]
    cellpageindex[1]  = generalparm(newdata[0])
    newdata.forEach((ditem,dindex)=> {
        const result= eachBardata(ditem,dindex,cellpageindex [1])   
        BarData.push(result.eachBardata)
        if(dindex==0){
            v.data.sampleData = result.sampleData;
            v.data.legenddata = result.insidelegendata;
            v.data.celldata = result.cells
            v.data.colors= result.colors
        }
    })
    cellpageindex [0] = v.data.buttonkey
    v.data.cellpageindex = cellpageindex
    v.data.BarData= BarData
    v.data.colors= colors
    //console.log("legenddata",sampleData)
    v.data.methoddata=methoddata
    v.data.rowdata=rowdata
    console.log("selecteddata",v.data.sampleData)
    v.forceRedraw = true;
    v.run();

} 

export function chooseSamples(v:any){
    BarData=[]
    v.data.buttonkey = 1
    const choose: Set<string> = v.data.choosesample;
    console.log("choose",choose)
    v.data.filteredSamples = v.data.sampleData.filter(s => choose.has(s));
    console.log("filteredSamples",v.data.filteredSamples)
    v.data.cellpageindex[1] = Math.ceil(v.data.filteredSamples.length/10); 
    const samples = v.data.filteredSamples
    let newdata=[]
    v.data.rowdata.forEach((item,index)=> {
        const filtered = item.filter(word => samples.includes(String(word[""])));
        filtered.columns= v.data.rowcolumns//v.data.filteredSample.includes(word[""]));
        newdata.push(filtered)
    });
    let cellpageindex =[]
    cellpageindex[1]  = generalparm(newdata[0])
    newdata.forEach((ditem,dindex)=> {
        const result= eachBardata(ditem,dindex,cellpageindex[1])   
        console.log("result",result)
        BarData.push(result.eachBardata)
        if(dindex==0){
            v.data.sampleData = result.sampleData;
            v.data.legenddata = result.insidelegendata;
            console.log(result.insidelegendata)
            v.data.celldata = result.cells
            v.data.colors= result.colors
        }
    })
    cellpageindex [0] = v.data.buttonkey
    v.data.cellpageindex = cellpageindex
    v.data.BarData= BarData
    v.data.colors= colors
    //console.log("legenddata",sampleData)
    v.data.methoddata=methoddata
    v.data.rowdata=rowdata
    console.log("selecteddata",v.data.sampleData)
    v.forceRedraw = true;
    v.run();

} 



export function generalparm(item){
    const allpage = Math.ceil(item.length/10)
    return allpage
}

export function eachBardata(ditem,dindex,number){
    let eachBardata = [];
    let cells
    let columns = ditem.columns;
    let sampleData =[]
    let insidelegendata = []
    columns = columns.slice(1,-3)
    for(var i=0;i<number;i++){
        let BarData_dindex = []
        let eachlegendata = []
        let dddata = ditem.slice(10*i,10*(i+1))
        columns.forEach((colitem,colindex) => {
            let eachcolumns = [];
            dddata.forEach((item,index)=> {
                eachcolumns.push([item[""],Number(item[colitem])]);
                categories.push([item[""]]);
                const color = Oviz.color.Color.hsl((index%6)*60, 60+Math.floor((index/6))*10, 60+Math.floor((index/6))*10)
                colors[item[""]] = color.string
                if(dindex==0&&colindex==0){
                    eachlegendata.push({fill:color.string, label:item[""]});
                    sampleData.push(item[""]);
                }
            });
            const ecolumnsobject ={[colitem]:eachcolumns} 
            BarData_dindex.push(ecolumnsobject)
        });
        eachBardata.push({[i]:BarData_dindex})
        if (dindex==0){
            cells = columns
            insidelegendata.push({[i]:eachlegendata})
        }
    };
    return {eachBardata,cells,insidelegendata,sampleData,colors}

}

