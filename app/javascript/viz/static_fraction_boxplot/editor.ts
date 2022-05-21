import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
//import { filteredMethod } from "./data";

function run(v,eid) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

//在editor下添加功能模块
//一些单选多选
export const generateTestConfig = (v,eid): any => (            {
    id: eid+"1",
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
                    scheme: copyObject(v.data.colors),
                    id: "pwcolor",
                    callback(colors) {
                        v.data.colors = colors;
                        run(v,eid);
                    },
                },
            },
        ],
    },
});

export const generateGridConfig = (v,eid):any =>  ({
    id: eid+"2",
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
                        title: "Grid width",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.plotSize[0],
                            callback(x) {
                                v.data.plotSize[0] = parseFloat(x);
                                v.size.width = v.data.plotSize[0]*1 + 100; //设置svg的大小
                                v.size.height = v.data.plotSize[1] + 100;
                                v.data._sizeUpdated = true;
                                run(v,eid);
                            },
                        },
                    },
                    {
                        title: "Grid height",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.plotSize[1],
                            callback(x) {
                                v.data.plotSize[1] = parseFloat(x);
                                v.size.width = v.data.plotSize[0]*1 + 100; //设置svg的大小
                                v.size.height = v.data.plotSize[1] + 100;
                                v.data._sizeUpdated = true;
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
                        title: "Title Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.titleFontsize,
                            callback(x) {
                                v.data.titleFontsize = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v,eid);
                            },
                        },
                    },
                ],
            },
        },
        {
            id: "rg-common",
            name: "Value Range",
            view: {
                type: "list",
                items: [
                    {
                        title: "Range Lower Bound",
                        type: "input",
                        //format: "int",
                        value: {
                            current: v.data.valueRange[0],
                            callback(x) {
                                v.data.valueRange[0] = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v,eid);
                            },
                        },
                    },
                    {
                        title: "Range Upper Bound",
                        type: "input",
                        //format: "int",
                        value: {
                            current: v.data.valueRange[1],
                            callback(x) {
                                v.data.valueRange[1] = parseFloat(x);
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

export const generateColorConfig = (v,eid):any =>  ({
    id: eid+"3",
    title: "Color Setting",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            {
                type: "vue",
                title: "Box Color",
                component: "color-picker",
                data: {
                    title: "Choose Color",
                    scheme: copyObject(v.data.colorMap), //0515
                    id: "pwcolor",
                    callback(colors) {
                        console.log("colors:",colors)
                        v.data.colorMap = colors; //0515
                        v.data._sizeUpdated = true;
                        v.forceRedraw = true;
                        run(v,eid);
                    },
                },
            },
        ],
    },
});

//生成对应的配置文件
//与index.ts连接
export function editorConfig(v,eid): EditorDef {
    return {
        sections: [
            generateGridConfig(v,eid),
            generateColorConfig(v,eid),
        ],
    };
}
