import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

//在editor下添加功能模块
//一些单选多选
export const generateTestConfig = (v): any => (            {
    id: "setting-bc",
    title: "test content settings",
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
                    callback(colorMap) {
                        v.data.colorMap = colorMap;
                        run(v);
                    },
                },
            },
        ],
    },
});

export const generateGridConfig = (v):any =>  ({
    id: "plot-st",
    title: "Plot Settings",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            {
                title: "plot width",
                type: "input",
                value: {
                    current: v.data.plotSize[1],
                    callback(d) {
                        v.data.plotSize[1] = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
            {
                title: "plot height",
                type: "input",
                value: {
                    current: v.data.plotSize[0],
                    callback(d) {
                        v.data.plotSize[0] = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
            {
                title: "label font size",
                type: "input",
                value: {
                    current: v.data.labelFontSize,
                    callback(d) {
                        v.data.labelFontSize = parseFloat(d);
                        v.forceRedraw = true;
                        v.run();
                    },
                },
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
            {
                title: "rotate x axis labels",
                type: "checkbox",
                value: {
                    current: v.data.xAxisRotated,
                    callback(d) {
                        v.data.xAxisRotated = d;
                        v.forceRedraw = true;
                        v.run();
                    },
                },
            },
        ],
    },
});


//生成对应的配置文件
//与index.ts连接
export function editorConfig(v): EditorDef {
    return {
        sections: [
            {
                id: "data",
                title: "edit Data",
                layout: "tabs",
                tabs: [
                    {
                        id: "gData",
                        name: "General",
                        view: {
                            type: "list",
                            items: [
                            {
                                title: "Range Lower Bound",
                                type: "input",
                                ref: "lowerBound",
                                value: {
                                    //current: v.data.data.valueRange[0],
                                    current: v.data.mainDict[0],
                                    callback(d) {
                                        v.data.mainDict[0] = parseFloat(d);
                                        run(v);
                                    },
                                },
                            },
                            {
                                title: "Range Upper Bound",
                                type: "input",
                                ref: "upperBound",
                                value: {
                                    current: v.data.mainDict[1],
                                    callback(d) {
                                        v.data.mainDict[1] = parseFloat(d);
                                        run(v);
                                    },
                                },
                            },                               
                            ],
                        },
                    },
                ],
            },
            generateGridConfig(v),
            generateTestConfig(v),
        ],
    };
}

