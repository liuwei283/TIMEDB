import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

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
                        title: "Plot width",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.gridwidth,
                            callback(x) {
                                v.data.gridwidth = parseFloat(x);
                                v.size.height = v.data.height + 220 + v.data.maxsamplelen
                                v.size.width = v.data.data.classifications.length*v.data.gridwidth  + 200
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Plot height",
                        type: "input",
                        format: "int",
                        value: {
                            current:  v.data.height ,
                            callback(x) {
                                v.data.height = parseFloat(x);
                                v.size.height = v.data.height + 220 + v.data.maxsamplelen
                                v.size.width = v.data.data.classifications.length*v.data.gridwidth  + 200
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Padding",
                        type: "input",
                        format: "int",
                        value: {
                            current:  v.data.padding,
                            callback(x) {
                                v.data.padding = parseFloat(x);
                                v.size.height = v.data.height + 220 + v.data.maxsamplelen
                                v.size.width = v.data.data.classifications.length*v.data.gridwidth  + 200
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                ]
            }
        },
        {
            id:"gm-common",
            name:"Other Setting",
            view:{
                type: "list",
                items:[
                    {
                        title: "Rotation angle",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.angle,
                            callback(x) {
                                v.data.angle = parseFloat(x);
                                v.size.height = v.data.height + 220 + v.data.maxsamplelen
                                v.size.width = v.data.data.classifications.length*v.data.gridwidth  + 200
                                v.data._sizeUpdated = true;
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Sample name font size",
                        type: "input",
                        format: "int",
                        value: {
                            current:  v.data.bottomfontsize,
                            callback(x) {
                                v.data.bottomfontsize = parseFloat(x);
                                v.size.height = v.data.height + 220 + v.data.maxsamplelen
                                v.size.width = v.data.data.classifications.length*v.data.gridwidth  + 200
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

export const generateColorconfig = (v): any => ({
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
                    scheme: copyObject(v.data.color),
                    id: "pwcolor",
                    callback(colors) {
                        v.data.color = colors;
                        run(v);
                    },
                },
            },
        ],
    },
});
export function editorConfig(v): EditorDef {
    return {
        sections: [

            //generateGridPlotConfig(v),
            //generateBoxConfig(v),
            generateTextconfig(v),
            generateColorconfig(v),
        ],
    };
}
