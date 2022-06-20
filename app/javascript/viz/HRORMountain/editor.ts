import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import {sorteditor } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;


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
            generateColorConfig(v),
            generateChooseConfig(v),
        ],
    };
}
