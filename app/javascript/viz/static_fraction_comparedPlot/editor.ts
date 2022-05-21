import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
//import { filterSamples,chooseSamples,chooseMethod } from "./data";
import { chooseSamples,chooseMethod } from "./data";

function run(v) {
    // if(v.configchange = true) processconfigData(v);
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export const generateSampleConfig = (v): any => ({
    id: "setting-bc",
    title: "Bar or Pie",
    layout: "single-page",
    view:{
        type:"list",
        items:[
            {
                title: "isPie?",
                type: "checkbox",
                Option:v.data.plotType,
                value:{
                    //current: v.data.plotType,
                    callback(d){
                        v.data.plotType = "false"
                        console.log("v.data.plotType:",v.data.plotType)
                        v.root._sizeUpdated = true;
                        v.forceRedraw = true;
                        run(v); 
                    }
                }
            },

        ]
    }
});

export function generateDiverConfig (v): EditorDef {
    return{
        sections:[
            {
                id: "general",
                title: "Sample",
                layout: "single-page",
                view: {
                    type:"list",
                    items:[
                        {
                            type:"vue",
                            component: "filter-samples",
                            title:null,
                            ref:"filterSample",
                            data:{
                                get samples() {
                                    return Array.from(v.data.sampleData);
                                },
                                get defaultValue() {
                                    return true;
                                },
                                get title() {
                                    return "Filter Samples";
                                },
                                callback(_,hiddenSamples) {
                                    v.data.hiddenSamples= new Set(hiddenSamples);
                                    filterSamples(v);
                                    v.root._sizeUpdated = true;
                                    run(v);
                                },
                            }

                        },
                        {
                            type:"vue",
                            component: "filter-samples",
                            title:null,
                            ref:"highlightSpecies",
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
                                    console.log("v.data.choosesample:",v.data.choosesample)
                                    chooseSamples(v);
                                    v.root._sizeUpdated = true;
                                    run(v);
                                },
                            }
                        }
                    ]    
                }
            },
            {
                id: "method",
                title: "Method",
                layout: "single-page",
                view: {
                    type:"list",
                    items:[
                        {
                            type:"vue",
                            component: "filter-samples",
                            title:null,
                            ref:"highlightSpecies",
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
                                    console.log("v.data.chooseMethod:",choosemethod)
                                    v.data.BarData = chooseMethod(v.data.chosenMethod,v.data.tempBardata);
                                    v.data.PieData = chooseMethod(v.data.chosenMethod,v.data.tempPiedata);
                                    //filterMethod(v);
                                    v.root._sizeUpdated = true;
                                    run(v);
                                },
                            }

                        },
                    ]    
                }
            },
            {
                id: "config",
                title: "Config",
                layout: "single-page",
                view: {
                    type:"list",
                    items:[
                        {
                            title: "gridheight",
                            type: "input",
                            value: {
                                current: v.data.config.gridheight,
                                callback(d) {
                                    v.data.config.gridheight = parseFloat(d);
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
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "padding",
                            type: "input",
                            value: {
                                current: v.data.config.padding,
                                callback(d) {
                                    v.data.config.padding = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                    ]    
                }
                    
                
            },
            generateSampleConfig(v)
            
        ]
    }

}
