import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import {sorteditor } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

//在editor下添加功能模块
//一些单选多选
export const generateColorConfig = (v): any => (            {
    id: "setting-bc",
    title: "Color Setting",
    layout: "single-page",
    view: {
        type: "list",
        //添加项目
        items: [
            {
                type: "vue",
                title: "",
                component: "color-picker",
                data: {
                    title: "Customize colors",
                    scheme: copyObject(v.data.colorMap),
                    id: "pwcolor",
                    callback(colors) {
                        v.data.colorMap = colors;
                        run(v);
                    },
                },
            },
        ],
    },
});

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
                    {
                        title: "Feature",
                        type: "select",
                        //ref: "featureSelect",
                        options: v.data.config.sign,
                        bind: {
                            object: v.data.config,
                            path: "sign",
                            callback() {
                                v.data.sortsign = v.data.config.sign
                                console.log("v.data.config.sign:",v.data.config.sign) 
                                sorteditor(v)
                                run(v);
                                v.run();
                            },
                        },
                    },

                ]

            }
        },
        
    ]
})


//生成对应的配置文件
//与index.ts连接
export function editorConfig(v): EditorDef {
    return {
        sections: [
            // {
            //     id: "data",
            //     title: "edit Data",
            //     layout: "tabs",
            //     tabs: [
            //         {
            //             id: "gData",
            //             name: "General",
            //             view: {
            //                 type: "list",
            //                 items: [
            //                 {
            //                     title: "Range Lower Bound",
            //                     type: "input",
            //                     ref: "lowerBound",
            //                     value: {
            //                         //current: v.data.data.valueRange[0],
            //                         current: v.data.valueRange[0],
            //                         callback(d) {
            //                             v.data.valueRange[0] = parseFloat(d);
            //                             run(v);
            //                         },
            //                     },
            //                 },
            //                 {
            //                     title: "Range Upper Bound",
            //                     type: "input",
            //                     ref: "upperBound",
            //                     value: {
            //                         current: v.data.valueRange[1],
            //                         callback(d) {
            //                             v.data.valueRange[1] = parseFloat(d);
            //                             run(v);
            //                         },
            //                     },
            //                 },            
            //                 ],
            //             },
            //         },
            //     ],
            // },
            // {
            //     id: "general",
            //     title: "Choose Method",
            //     layout: "single-page",
            //     view: {
            //         type:"list",
            //         items:[
            //             {
            //                 type:"vue",
            //                 component: "filter-samples",
            //                 title:null,
            //                 ref:"highlightSpecies",
            //                 data:{
            //                     get samples() {
            //                         return Array.from(v.data.methoddata);
            //                     },
            //                     get defaultValue() {
            //                         return false;
            //                     },
            //                     get title() {
            //                         return "Choose Method";
            //                     },
            //                     callback(choosesmethod) {
            //                         v.data.chosenMethod = new Set(choosesmethod);
            //                         console.log("v.data.chosenMethod:",v.data.chosenMethod)
            //                         filteredMethod(v);
            //                         v.root._sizeUpdated = true;
            //                         run(v);
            //                     },
            //                 }

            //             },
            //         ]    
            //     }
            // },
            //generateGridConfig(v),
            generateColorConfig(v),
            generateChooseConfig(v),
        ],
    };
}
