import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { getBoxdata,getcolormap,getPiedata, filteritemmethod } from "./data";
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
            id: "gstcommon",
            name: "Boxplot Size",
            view: {
                type: "list",
                items: [
                    {
                        title: "Boxplot Gridheight",
                        type: "input",
                        value: {
                            current: v.data.plotData.boxData.bheight,
                            callback(d) {
                                v.data.plotData.boxData.bheight = parseFloat(d);
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Boxplot Gridwidth",
                        type: "input",
                        value: {
                            current: v.data.plotData.boxData.bwidth,
                            callback(d) {
                                v.data.plotData.boxData.bwidth = parseFloat(d);
                                run(v);
                            },
                        },
                    },
                ],
            },
        },
        {
            id: "ktmcommon",
            name: "Pieplot Size",
            view: {
                type: "list",
                items: [
                    {
                        title: "Pieplot Size",
                        type: "input",
                        value: {
                            current: v.data.plotData.pieData.pr,
                            callback(d) {
                                v.data.plotData.pieData.pr = parseFloat(d);
                                run(v);
                            },
                        },
                    },
                ],
            },
        },
        {
            id: "arccommon",
            name: "Boxplot Font Size",
            view: {
                type: "list",
                items: [
                    {
                        title: "Boxplot Label Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.plotData.boxData.fontsize,
                            callback(x) {
                                v.data.plotData.boxData.fontsize = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                ],
            },
        },
        {
            id: "ttxt",
            name: "Boxplot Value Range",
            view: {
                type: "list",
                items: [
                    {
                        title: "Boxplot Value Range Higher ",
                        type: "input",
                        format: "float",
                        value: {
                            current: v.data.valueRange[1],
                            callback(x) {
                                v.data.valueRange[1] = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Boxplot Value Range Lower ",
                        type: "input",
                        format: "float",
                        value: {
                            current: v.data.valueRange[0],
                            callback(x) {
                                v.data.valueRange[0] = parseFloat(x);
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
            id: "ztltk-common",
            name: "Choose Sample",
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
                                return Array.from(v.data.plotData.common.samplelist);
                            },
                            get defaultValue() {
                                return false;
                            },
                            get title() {
                                return "Choose Sample";
                            },
                            callback(choosesample) {
                                v.data.plotData.chosenSample = choosesample
                                console.log("test chosen:",v.data.plotData.chosenSample)
                                v.root._sizeUpdated = true;
                                run(v);
                            },
                        }

                    },
                ],
            },
        },

        
    ]
});

export const selectData = {

}

export const generateSelectConfig = (v):any =>  ({
    id: "stg"+"3",
    title: "Customized Settings",
    layout: "tabs",
    tabs: [
        {
            id: "p1",
            name: "Choose Plot Parameters",
            view: {
                type: "list",
                items: [
                    {
                        title: "Choose Clinical Type",
                        type: "select",
                        //ref: "depthSelect",
                        options: v.data.methodselect,
                        bind: {
                            object: v.data,
                            path: "methodselect",
                            callback(d) {

                                v.data.plotData.chosenMethod = d

                                console.log("d::",d)

                                console.log("v.data.oridata:",v.data.initialdata)

                                let newtestnon = filteritemmethod(v.data.nochangData,v.data.plotData.chosenMethod+"")
                                console.log("editor testnon::",newtestnon)
                                
                                getBoxdata(v.data.plotData,newtestnon)
                                getPiedata(v.data.plotData,newtestnon)

                                v.data.piecolormap = getcolormap(v.data.plotData)
                                v.data.plotData = v.data.plotData
                                v.forceRedraw = true;
                                v.run();
                            },
                        },
                    },
                    {
                        title: "Show Boxplot",
                        type: "checkbox",
                        Option:v.data.showbox,
                        value:{
                            callback(d){
                                v.data.showbox = true
                                v.data.showpie = false
                                v.root._sizeUpdated = true; 
                                v.forceRedraw = true;
                                run(v);
                            }
                        }
                    },
                    {
                        title: "Show Pieplot",
                        type: "checkbox",
                        Option:v.data.showpie,
                        value:{
                            callback(d){
                                v.data.showpie = true
                                v.data.showbox = false
                                v.root._sizeUpdated = true; //更新画布大小
                                v.forceRedraw = true;
                                run(v);
                            }
                        }
                    },
                ],
            },
        },
        // {
        //     id: "ktmcommon",
        //     name: "Pieplot Size",
        //     view: {
        //         type: "list",
        //         items: [
        //             {
        //                 title: "Pieplot Gridheight",
        //                 type: "input",
        //                 value: {
        //                     current: v.data.plotData.pieData.pheigth,
        //                     callback(d) {
        //                         v.data.plotData.pieData.pheigth = parseFloat(d);
        //                         run(v);
        //                     },
        //                 },
        //             },
        //         ],
        //     },
        // },
    ]
});


export function editorConfig (v): EditorDef {
    return{
        sections:[
            generateGridConfig(v),
            generateSelectConfig(v),
            //generateCusConfig(v),
        ]
    }

}
