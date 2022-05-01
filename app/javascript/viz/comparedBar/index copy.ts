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
                    cellpageindex [1] = Math.ceil(data[0].length/10)
                    data.forEach((ditem,dindex)=> {
                            console.log(ditem)
                            let eachBardata = [];
                            let columns = ditem.columns;
                            columns = columns.slice(1,-3)
                            for(var i=0;i<cellpageindex[1];i++){
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
                                    this.data.celldata = columns
                                    legenddata.push({[i]:eachlegendata})
                                }
                                };
                        
                            BarData.push(eachBardata)
                    
                        })

                        console.log("BarData",BarData)
                        cellpageindex [0] = this.data.buttonkey
                        this.data.cellpageindex = cellpageindex
                        this.data.BarData= BarData
                        this.data.colors= colors
                        this.data.legenddata=legenddata
                        //console.log("legenddata",sampleData)
                        this.data.methoddata=methoddata
                        this.data.sampleData = sampleData
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
    const hidden: Set<string> = v.data.hiddenSamples;
    v.data.filteredSamples = v.data.sampleData.filter(s => !hidden.has(s));
    v.data.cellpageindex[1] = Math.ceil(v.data.filteredSamples.length/10); 
}


