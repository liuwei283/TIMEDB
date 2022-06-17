import { ListGroupPlugin } from "bootstrap-vue";
import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
//import { chooseMethod } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

//在editor下添加功能模块
//一些单选多选
// export const generateTestConfig = (v): any => ({
//     id: "setting-bc",
//     title: "choose method",
//     layout: "single-page",
//     view:{
//         type:"list",
//         items:[
//             {
//                 title: "method1",
//                 type: "checkbox",
//                 Option:v.data.chosenMethod[0],
//                 value:{
//                     current: v.data.chosenMethod[0],
//                     callback(d){
//                         v.data.chosenMethod[0] = "method1";
//                         //let tempMethod = v.data.BarData
//                         console.log("v.data.chosenMethod[0]",v.data.chosenMethod[0]);
//                         console.log(v.data.BarData);
//                         console.log("第一个v.data.chosenMethod:",v.data.chosenMethod)
//                         v.data.BarData = chooseMethod(v.data.chosenMethod,v.data.tempBardata);
//                         console.log("第一次v.data.BarData",v.data.BarData)
//                         v.data.topMethod.push("method1");
//                         v.root._sizeUpdated = true;
//                         v.forceRedraw = true;
//                         run(v); 
//                     }
//                 }
//             },
//             {
//                 title: "method4",
//                 type: "checkbox",
//                 value:{
//                     current: v.data.chosenMethod[3],
//                     callback(d){
//                         v.data.chosenMethod[3] = "method4";
//                         console.log("v.data.chosenMethod[3]",v.data.chosenMethod[3]);
//                         console.log(v.data.BarData);
//                         console.log("第二个v.data.chosenMethod:",v.data.chosenMethod)
//                         v.data.BarData = chooseMethod(v.data.chosenMethod,v.data.tempBardata);
//                         console.log("第二次v.data.BarData",v.data.BarData)
//                         v.root._sizeUpdated = true;
//                         v.forceRedraw = true;
//                         run(v); 
//                     }
//                 }
//             },
//         ]
//     }
// });


// export const generateGridConfig = (v):any =>  ({
//     id: "plot-st",
//     title: "Plot Settings",
//     layout: "single-page",
//     view: {
//         type: "list",
//         items: [
//             {
//                 title: "plot width",
//                 type: "input",
//                 value: {
//                     current: v.data.plotSize[1],
//                     callback(d) {
//                         v.data.plotSize[1] = parseFloat(d);
//                         v.forceRedraw = true;
//                         v.run();
//                     },
//                 },
//             },
//             {
//                 title: "plot height",
//                 type: "input",
//                 value: {
//                     current: v.data.plotSize[0],
//                     callback(d) {
//                         v.data.plotSize[0] = parseFloat(d);
//                         v.forceRedraw = true;
//                         v.run();
//                     },
//                 },
//             },
//             {
//                 title: "label font size",
//                 type: "input",
//                 value: {
//                     current: v.data.labelFontSize,
//                     callback(d) {
//                         v.data.labelFontSize = parseFloat(d);
//                         v.forceRedraw = true;
//                         v.run();
//                     },
//                 },
//             },
//             {
//                 title: "tick font size",
//                 type: "input",
//                 value: {
//                     current: v.data.tickFontSize,
//                     callback(d) {
//                         v.data.tickFontSize = parseFloat(d);
//                         v.forceRedraw = true;
//                         v.run();
//                     },
//                 },
//             },
//             {
//                 title: "rotate x axis labels",
//                 type: "checkbox",
//                 value: {
//                     current: v.data.xAxisRotated,
//                     callback(d) {
//                         v.data.xAxisRotated = d;
//                         v.forceRedraw = true;
//                         v.run();
//                     },
//                 },
//             },
//         ],
//     },
// });


//生成对应的配置文件
//与index.ts连接
// export function editorConfig(v): EditorDef {
//     return {
//         sections: [
//             {
//                 id: "data",
//                 title: "edit Data",
//                 layout: "tabs",
//                 tabs: [
//                     {
//                         id: "gData",
//                         name: "General",
//                         view: {
//                             type: "list",
//                             items: [
//                             {
//                                 title: "Range Lower Bound",
//                                 type: "input",
//                                 ref: "lowerBound",
//                                 value: {
//                                     //current: v.data.data.valueRange[0],
//                                     current: v.data.mainDict[0],
//                                     callback(d) {
//                                         v.data.mainDict[0] = parseFloat(d);
//                                         run(v);
//                                     },
//                                 },
//                             },
//                             {
//                                 title: "Range Upper Bound",
//                                 type: "input",
//                                 ref: "upperBound",
//                                 value: {
//                                     current: v.data.mainDict[1],
//                                     callback(d) {
//                                         v.data.mainDict[1] = parseFloat(d);
//                                         run(v);
//                                     },
//                                 },
//                             },                               
//                             ],
//                         },
//                     },
//                 ],
//             },
//             //generateGridConfig(v),
//             //generateTestConfig(v),
//         ],
//     };
// }

function update(v) {
    v.forceRedraw = true;
    v.run();
}

export const generateTestConfig = (v): any => ({
    id: "plot_st",
    title: "General Setting",
    layout: "tabs",
    tabs:[
        {
            id:"g-common",
            name:"Size Setting",
            view:{
                type: "list",
                items:[
                    {
                        title: "Graph Radius Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.graphRadius,
                            callback(x) {
                                //v.data.gridPlotWidth = parseFloat(x);
                                console.log("v.graphRadius:",v)
                                v.data.graphRadius = parseFloat(x);
                                v.size.height = (v.data.graphRadius-150)*2 + 700
                                v.size.width = (v.data.graphRadius-150)*5 + 1300
                                v.data._sizeUpdated = true;
                                update(v);
                            },
                        },
                    },
                    {
                        title: "Node Radius Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.nodeRadius,
                            callback(x) {
                                //v.data.gridPlotWidth = parseFloat(x);
                                v.data.nodeRadius = parseFloat(x);
                                v.data._sizeUpdated = true;
                                update(v);
                            },
                        },
                    },

                    // {
                    //     title: "Filter Legend-NA Block",
                    //     type: "checkbox",
                    //     value: {
                    //         current: v.data.legendStyle,
                    //         callback(d) {
                    //             v.data.legendStyle = d;
                    //             console.log("now style:",v.data.legendStyle)
                    //             switchStyle(v); //0608
                    //             v.forceRedraw = true;
                    //             v.data._sizeUpdated = true;
                    //             update(v);
                    //         },
                    //     },
                    // },
                ]

            }
        },
        
    ]
})

export const generateColorConfig = (v): any => ({
    id: "plot_st2",
    title: "Color Setting",
    layout: "tabs",
    tabs:[
        {
            id:"g-common",
            name:"Node Color Setting",
            view:{
                type: "list",
                items:[
                    {
                        type: "vue",
                        title: "Method Color",
                        component: "color-picker",
                        data: {
                            title: "Node Color",
                            scheme: copyObject(v.data.colorMap), //0515
                            id: "pwcolor",
                            callback(colors) {
                                console.log("colors:",colors)
                                v.data.colorMap = colors; //0515
                                v.data._sizeUpdated = true;
                                v.forceRedraw = true;
                                run(v);
                            },
                        },
                    }
                ]

            }
        },
        
    ]
})


export const generateChooseConfig = (v): any => ({
    id: "plot_st3",
    title: "Custom Setting",
    layout: "tabs",
    tabs:[
        {
            id:"g-common",
            name:"Choose Feature and Group",
            view:{
                type: "list",
                items:[
                    // {
                    //     title: "Feature",
                    //     type: "select",
                    //     //ref: "featureSelect",
                    //     options: v.data.config.features,
                    //     bind: {
                    //         object: v.data.config,
                    //         path: "features",
                    //         callback() {
                    //             v.data.selectedFeature = v.data.config.features
                    //             v.data.config.temp = v.data.config.features
                    //             console.log("v.data.config.temp:",v.data.config.temp)
                    //             v.data.config.groups = v.data.congroup[v.data.selectedFeature]
                    //             v.data.selectedGroup = v.data.feaMapgroup[v.data.selectedFeature][0]
                    //             v.run();
                    //         },
                    //     },
                    // },
                    {
                        type:"vue",
                        component: "filter-samples",
                        title:null,
                        //ref:"highlightSpecies",
                        data:{
                            get samples() {
                                return Array.from(v.data.features);
                            },
                            get defaultValue() {
                                return false;
                            },
                            get title() {
                                return "Choose Feature";
                            },
                            callback(choosesample) {
                                console.log("choosesample:",choosesample)
                                v.data.selectedFeature = choosesample[0]
                                v.data.selectedGroup = v.data.feaMapgroup[v.data.selectedFeature][0]
                                v.root._sizeUpdated = true;
                                run(v);
                            },
                        }
                    },
                    {
                        type:"vue",
                        component: "filter-samples",
                        title:null,
                        //ref:"highlightSpecies",
                        data:{
                            get samples() {
                                return Array.from(v.data.feaMapgroup[v.data.selectedFeature]);
                            },
                            get defaultValue() {
                                return false;
                            },
                            get title() {
                                return "Choose Group";
                            },
                            callback(choosesample) {
                                console.log("choosesample:",choosesample)
                                v.data.selectedGroup = choosesample[0]
                                v.root._sizeUpdated = true;
                                run(v);
                            },
                        }
                    },
                ]

            }
        },
        
    ]
})


// export const generateColorConfig = (v): any => ({
//     id: "plot_st",
//     title: "Plot Settings",
//     layout: "tabs",
//     tabs:[
//         {
//             id:"g-common",
//             name:"common",
//             view:{
//                 type: "list",
//                 items:[
//                     {
//                         title: "rotate x axis labels",
//                         type: "checkbox",
//                         value: {
//                             current: v.data.legendStyle,
//                             callback(d) {
//                                 v.data.legendStyle = d;
//                                 console.log("now style:",v.data.legendStyle)
//                                 switchStyle(v); //0608
//                                 v.forceRedraw = true;
//                                 v.data._sizeUpdated = true;
//                                 update(v);
//                             },
//                         },
//                     },
//                 ]

//             }
//         },
        
//     ]
// })


export function editorConfig(v): EditorDef {

    //const d = v.data;
    return {
        sections: [
            // {
            //     id:"1",
            //     title: "General",
            //     layout: "tabs",
            //     tabs: [
            //         {
            //             id: "g-common",
            //             name: "Common",
            //             view: {
            //                 type: "list",
            //                 items: [
            //                     {
            //                         title: "Grid width",
            //                         type: "input",
            //                         format: "int",
            //                         value: {
            //                             current: v.data.gridPlotWidth,
            //                             callback(x) {
            //                                 //v.data.gridPlotWidth = parseFloat(x);
            //                                 v.data._sizeUpdated = true;
            //                                 update(v);
            //                             },
            //                         },
            //                     },
            //                     // {
            //                     //     title: "Grid height",
            //                     //     type: "input",
            //                     //     format: "int",
            //                     //     value: {
            //                     //         current: v.data.gridPlotheight,
            //                     //         callback(x) {
            //                     //             v.data.gridPlotheight = parseFloat(x);
            //                     //             v.data._sizeUpdated = true;
            //                     //             update(v,eid);
            //                     //         },
            //                     //     },
            //                     // },
            //                 ],
            //             },
            //         },
            //         // {
            //         //     id: "p-common",
            //         //     name: "Sample",
            //         //     view: {
            //         //         type: "list",
            //         //         items: [
            //         //             {
            //         //                 title: "Grid width",
            //         //                 type: "input",
            //         //                 format: "int",
            //         //                 value: {
            //         //                     current: v.data.rectWidth,
            //         //                     callback(x) {
            //         //                         v.data.rectWidth = parseFloat(x);
            //         //                         v.data._sizeUpdated = true;
            //         //                         update(v,eid);
            //         //                     },
            //         //                 },
            //         //             },
            //         //             {
            //         //                 title: "Grid height",
            //         //                 type: "input",
            //         //                 format: "int",
            //         //                 value: {
            //         //                     current: v.data.rectHeight,
            //         //                     callback(x) {
            //         //                         v.data.rectHeight = parseFloat(x); 
            //         //                         v.data._sizeUpdated = true;
            //         //                         update(v,eid);
            //         //                     },
            //         //                 },
            //         //             },
            //         //         ],
            //         //     },
            //         // },
            //         //继续添加
            //     ],
            // },
            //generateTestConfig(v)
            generateTestConfig(v),
            generateColorConfig(v),
            generateChooseConfig(v),
        ]
    }
}



