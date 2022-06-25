import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
//import { filterSamples,chooseSamples,chooseMethod } from "./data";
import { chooseSamples,chooseMethod } from "./data";
import {processconfig} from "./index"

function run(v) {
    // if(v.configchange = true) processconfigData(v);
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export const generatePieBarConfig = (v):any =>  ({})

export const generateGridConfig = (v):any =>  ({
    id: "stg"+"1",
    title: "General Settings",
    layout: "tabs",
    tabs: [
        {
            id: "g-common",
            name: "Plot Size",
            view: {
                type: "list",
                items: [
                    {
                        title: "gridheight",
                        type: "input",
                        value: {
                            current: v.data.config.gridheight,
                            callback(d) {
                                v.data.config.gridheight = parseFloat(d);
                                if(v.data.plotType=="pie"){
                                    v.size.height = v.data.config.gridheight*12 + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxchosencelldatatextlength - 95.6
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxsampletextlength - 77.77
                                }
                                //console.log("v.size:",v.size.width)
                                run(v);
                            },
                        },
                    },
                    {
                        title: "gridwidth",
                        type: "input",
                        value: {
                            current: v.data.config.gridwidth,
                            callback(d) {
                                v.data.config.gridwidth = parseFloat(d);
                                if(v.data.plotType=="pie"){
                                    v.size.height = v.data.config.gridheight*12 + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxchosencelldatatextlength - 95.6
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxsampletextlength - 77.77
                                }
                                //console.log("v.size:",v.size.width)
                                run(v);
                            },
                        },
                    },
                ],
            },
        },
        {
            id: "k-common",
            name: "Font Size",
            view: {
                type: "list",
                items: [
                    {
                        title: "Method Label Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.methodFontsize,
                            callback(x) {
                                v.data.methodFontsize= parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Sample Label Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.sampleFontsize,
                            callback(x) {
                                v.data.sampleFontsize = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Cell Label Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.cellFontsize,
                            callback(x) {
                                v.data.cellFontsize = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                ],
            },
        },
    ]
});


export const generateCusConfig = (v):any =>  ({
    id: "skg" + "2",
    title: "Customized Setting",
    layout: "tabs",
    tabs: [
        {
            id: "ztl-common",
            name: "Filter Method",
            view: {
                type: "list",
                items: [
                    {
                        type:"vue",
                        component: "filter-samples",
                        title:null,
                        //ref:"highlightSpecies",
                        data:{
                            get samples() {
                                return Array.from(v.data.methoddata);
                            },
                            get defaultValue() {
                                return false;
                            },
                            get title() {
                                return "Choose Method";
                            },
                            callback(choosemethod) {
                                //v.data.chosenMethod = new Set(choosemethod);
                                v.data.chosenMethod = choosemethod
                                // console.log("v.data.chooseMethod:",choosemethod)
                                v.data.BarData = chooseMethod(v.data.chosenMethod,v.data.tempBardata);
                                v.data.PieData = chooseMethod(v.data.chosenMethod,v.data.tempPiedata);
                                if(v.data.plotType=="pie"){
                                    v.size.height = v.data.config.gridheight*12 + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxchosencelldatatextlength - 95.6
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxsampletextlength - 77.77
                                }
                                //filterMethod(v);
                                v.root._sizeUpdated = true;
                                run(v);
                            },
                        }

                    },
                ],
            },
        },
        {
            id:"sng"+"csty-common",
            name:"Switch Pie or Bar",
            view:{
                type:"list",
                items:[
                    {
                        title: "Pie",
                        type: "checkbox",
                        Option:v.data.plotType,
                        value:{
                            //current: v.data.plotType,
                            //plotType=="bar"
                            callback(d){
                                v.data.plotType = "pie"
                                // console.log("v.data.plotType:",v.data.plotType)
                                if(v.data.plotType=="pie"){
                                    v.size.height = v.data.config.gridheight*12 + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxchosencelldatatextlength - 95.6
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxsampletextlength - 77.77
                                }
                                v.root._sizeUpdated = true; //更新画布大小
                                v.forceRedraw = true;
                                run(v);
                            }
                        }
                    },
                    {
                        title: "Bar",
                        type: "checkbox",
                        Option:v.data.plotType,
                        value:{
                            //current: v.data.plotType,
                            //plotType=="bar"
                            callback(d){
                                v.data.plotType = "bar"
                                // console.log("v.data.plotType:",v.data.plotType)
                                if(v.data.plotType=="pie"){
                                    v.size.height = v.data.config.gridheight*12 + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxchosencelldatatextlength - 95.6
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxsampletextlength - 77.77
                                }
                                v.root._sizeUpdated = true;
                                v.forceRedraw = true;
                                run(v); 
                            }
                        }
                    },
                ]
            }
        },
        
    ]
});

export function editorConfig (v): EditorDef {
    return{
        sections:[
            generateGridConfig(v),
            generateCusConfig(v),
            
        ]
    }

}
