import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import {sorteditor } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export const generateGridConfig = (v):any =>  ({
    id: "stg"+"1",
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
                        title: "Grid height",
                        type: "input",
                        value: {
                            current: v.data.plotheight,
                            callback(d) {
                                v.data.plotheight = parseFloat(d);
                                v.data.data.plotheight = parseFloat(d);
                                v.size.height = v.data.cell.length*v.data.plotheight + 300
                                run(v);
                            },
                        },
                    },
                ],
            },
        },
    ]
});

export const generateColorConfig = (v): any => (            {
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
                    title: "color",
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
    title: "Customized Setting",
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


export function editorConfig(v): EditorDef {
    return {
        sections: [
            generateGridConfig(v),
            generateColorConfig(v),
            generateChooseConfig(v),
        ],
    };
}
