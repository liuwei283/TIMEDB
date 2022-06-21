import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
//import { filteredMethod } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export const generateTextconfig = (v): any => ({
    id: "setting-bcg",
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
                        title: "Width",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.data.plotwidth,
                            callback(x) {
                                v.data.data.plotwidth = parseFloat(x);
                                v.size.width = 320 + v.data.data.plotwidth + v.data.maxcelllength;
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Height",
                        type: "input",
                        format: "int",
                        value: {
                            current:  v.data.data.gridheight ,
                            callback(x) {
                                v.data.data.gridheight = parseFloat(x);
                                v.size.height = v.data.cell.length * v.data.data.gridheight  + 200
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                ]
            }
        }
    ]
});


export const generateColorConfig = (v): any => ({
    id: "setting-bc",
    title: "Color Setting",
    layout: "single-page",
    view: {
        type: "list",
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

//生成对应的配置文件
//与index.ts连接
export function editorConfig(v): EditorDef {
    return {
        sections: [
            generateTextconfig(v),
            generateColorConfig(v),
        ],
    };
}
