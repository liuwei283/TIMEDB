import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { filter } from "vue/types/umd";
import { filterMethod,filteredSample } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

//color change
// export const generateImmuneConfig = (v): any => (            {
//     id: "setting-bc",
//     title: "test content settings",
//     layout: "single-page",
//     view: {
//         type: "list",
//         items: [
//             {
//                 type: "vue",
//                 title: "",
//                 component: "color-picker",
//                 data: {
//                     title: "Customize colors",
//                     scheme: copyObject(v.data.colors),
//                     id: "pwcolor",
//                     callback(colors) {
//                         v.data.colors = colors;
//                         run(v);
//                     },
                    
//                 },
//             },
//         ],
//     },
// });

export const generateGridConfig = (v):any =>  ({
    id: "plot-st",
    title: "Plot Settings",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            {
                title:"size of pie",
                type:"input",
                value:{
                    current: v.data.pieR,
                    callback(d){
                        v.data.pieR = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    }

                }
            },
            {
                title: "tick font size",
                type: "input",
                value: {
                    current: v.data.tickFontSize,
                    callback(d) {
                        v.data.tickFontSize = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
        ],
    },
});


export function editorConfig(v): EditorDef {
    return {
        sections: [
            {
                id: "general",
                title: "Choose Sample & Method",
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
                                    return Array.from(v.data.sampleList);
                                },
                                get defaultValue() {
                                    return false;
                                },
                                get title() {
                                    return "Choose Samples";
                                },
                                callback(choosesample) {
                                    v.data.chosenSample = new Set(choosesample);
                                    console.log("v.data.choosesample:",v.data.chosenSample)
                                    filteredSample(v);
                                    v.root._sizeUpdated = true;
                                    run(v);
                                },
                            }

                        },
                        {
                            type:"vue",
                            component:"filter-samples",
                            title:null,
                            ref:"filterSample",
                            data:{
                                get samples(){
                                    return Array.from(v.data.methodList);
                                },
                                get defaultValue(){
                                    return false;
                                },
                                get title(){
                                    return "Choose Method";
                                },
                                callback(chooseMethod){
                                    v.data.chosenMethod = new Set(chooseMethod);
                                    console.log("v.data.choosemethod",v.data.chosenMethod)
                                    filterMethod(v);
                                    v.root._sizeUpdated = true;
                                    run(v);
                                }
                            }
                        }
                    ]    
                }
            },
            generateGridConfig(v),
            //generateImmuneConfig(v),
        ],
    };
}

