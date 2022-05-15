import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { chooseMethod } from "./index";

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



export function editorConfig(v: any): EditorDef {

    //const d = v.data;
    return {
        sections: [
            {
                id: "general",
                title: "General",
                layout: "tabs",
                tabs: [
                    {
                        id: "g-common",
                        name: "Common",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Grid width",
                                    type: "input",
                                    format: "int",
                                    value: {
                                        current: v.data.gridPlotWidth,
                                        callback(x) {
                                            v.data.gridPlotWidth = parseFloat(x);
                                            v.data._sizeUpdated = true;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    title: "Grid height",
                                    type: "input",
                                    format: "int",
                                    value: {
                                        current: v.data.gridPlotheight,
                                        callback(x) {
                                            v.data.gridPlotheight = parseFloat(x);
                                            v.data._sizeUpdated = true;
                                            update(v);
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        id: "p-common",
                        name: "Sample",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Grid width",
                                    type: "input",
                                    format: "int",
                                    value: {
                                        current: v.data.rectWidth,
                                        callback(x) {
                                            v.data.rectWidth = parseFloat(x);
                                            v.data._sizeUpdated = true;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    title: "Grid height",
                                    type: "input",
                                    format: "int",
                                    value: {
                                        current: v.data.rectHeight,
                                        callback(x) {
                                            v.data.rectHeight = parseFloat(x); 
                                            v.data._sizeUpdated = true;
                                            update(v);
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    //继续添加
                ],
            },
            //generateTestConfig(v)
        ]
    }
}



