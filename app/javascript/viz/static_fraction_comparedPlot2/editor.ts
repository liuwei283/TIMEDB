import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
//import { filterSamples,chooseSamples,chooseMethod } from "./data";
import { chooseSamples,chooseMethod } from "./data";

function run(v,eid) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export const generatePieBarConfig = (v,eid):any =>  ({})

export const generateGridConfig = (v,eid):any =>  ({
    id: eid+"1",
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
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }
                                run(v,eid);
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
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }
                                run(v,eid);
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
                                run(v,eid);
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
                                run(v,eid);
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
                                run(v,eid);
                            },
                        },
                    },
                ],
            },
        },
    ]
});


export const generateCusConfig = (v,eid):any =>  ({
    id: eid + "2",
    title: "Customized Setting",
    layout: "tabs",
    tabs: [
        {
            id: "z-common",
            name: "Filter Sample",
            view: {
                type: "list",
                items: [
                    {
                        type:"vue",
                        component: "filter-samples",
                        title:null,
                        data:{
                            get samples() {
                                return Array.from(v.data.sampleData);
                            },
                            get defaultValue() {
                                return false;
                            },
                            get title() {
                                return "Choose Samples";
                            },
                            callback(choosesample) {
                                v.data.choosesample= new Set(choosesample);
                                chooseSamples(v);
                                v.root._sizeUpdated = true;
                                run(v,eid);
                            },
                        }
                    },
                ],
            },
        },
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
                                v.data.chosenMethod = choosemethod
                                v.data.BarData = chooseMethod(v.data.chosenMethod,v.data.tempBardata);
                                v.data.PieData = chooseMethod(v.data.chosenMethod,v.data.tempPiedata);
                                if(v.data.plotType=="pie"){
                                    v.size.height = v.data.config.gridheight*12 + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }
                                v.root._sizeUpdated = true;
                                run(v,eid);
                            },
                        }

                    },
                ],
            },
        },
        {
            id:"csty-common",
            name:"Choose Pie or Bar",
            view:{
                type:"list",
                items:[
                    {
                        title: "Pie",
                        type: "checkbox",
                        Option:v.data.plotType,
                        value:{
                            callback(d){
                                v.data.plotType = "pie"
                                if(v.data.plotType=="pie"){
                                    v.size.height = v.data.config.gridheight*12 + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }
                                v.root._sizeUpdated = true; 
                                v.forceRedraw = true;
                                run(v,eid);
                            }
                        }
                    },
                    {
                        title: "Bar",
                        type: "checkbox",
                        Option:v.data.plotType,
                        value:{
                            callback(d){
                                v.data.plotType = "bar"
                                if(v.data.plotType=="pie"){
                                    v.size.height = v.data.config.gridheight*12 + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }else{
                                    v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
                                    v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
                                }
                                v.root._sizeUpdated = true;
                                v.forceRedraw = true;
                                run(v,eid); 
                            }
                        }
                    },
                ]
            }
        },
        
    ]
});

export function editorConfig (v,eid): EditorDef {
    return{
        sections:[
            generateGridConfig(v,eid),
            generateCusConfig(v,eid),
            
        ]
    }

}
