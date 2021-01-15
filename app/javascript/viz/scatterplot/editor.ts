import {defaultLayoutConf as conf} from "utils/editor"
import { genDefaultPalette, withDefaultPalette } from "oviz-common/palette";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { forEachChild } from "typescript";

function run(v) {
    v.data._changed = true;
    v.run();
}
export const editorRef = {} as any;

const cbpPalette = {
    cBioPortal: {
        name: "cBioPortal",
        // miss, inframe, trunc, other, text, active layer, line, icon stroke
        colors: ["#3d7f08", "#913810", "#000000", "#c55ebc", "#000000", "#777", "#555", "#fff"],
    },
};

export function editorConfig(v): EditorDef {
    const [defaultPalette] = genDefaultPalette(v.data.colors);
    console.log(v.data.availableAxises);
    return {
        sections: [
            {
                id: "data",
                title: "Data",
                layout: "tabs",
                tabs: [
                    {
                        id: "xData",
                        name: "X-Axis Data",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "X-Axis",
                                    type: "select",
                                    options: v.data.availableAxises,
                                    value: {
                                        current: v.data.config.xAxisIndex.toString(),
                                        callback(d) {
                                            v.data.config.xAxisIndex = parseInt(d);
                                            v.forceRedraw = true;
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "X Range Lower Bound",
                                    type: "input",
                                    value: {
                                        current: 0,
                                        callback(d) {
                                            v.data.config.categoryRange[0] = parseFloat(d);
                                            if (!!v.data.config.categoryRange[0] 
                                                && !!v.data.config.categoryRange[1]) {
                                                    v.forceRedraw = true;
                                                    run(v);
                                                }
                                            
                                        },
                                    },
                                },
                                {
                                    title: "X Range Upper Bound",
                                    type: "input",
                                    value: {
                                        current: 0,
                                        callback(d) {
                                            v.data.config.categoryRange[1] = parseFloat(d);
                                            if (!!v.data.config.categoryRange[0] 
                                                && !!v.data.config.categoryRange[1]) {
                                                    v.forceRedraw = true;
                                                    run(v);
                                                }
                                        },
                                    },
                                },
                            ]
                        }
                    },
                    {
                        id: "yData",
                        name: "Y-Axis Data",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Y-Axis",
                                    type: "select",
                                    options: v.data.availableAxises,
                                    value: {
                                        current: v.data.config.yAxisIndex.toString(),
                                        callback(d) {
                                            v.data.config.yAxisIndex = parseInt(d);
                                            v.forceRedraw = true;
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "Y Range Lower Bound",
                                    type: "input",
                                    value: {
                                        current: 0,
                                        callback(d) {
                                            v.data.config.valueRange[0] = parseFloat(d);
                                            if (!!v.data.config.valueRange[0] 
                                                && !!v.data.config.valueRange[1]) {
                                                    v.forceRedraw = true;
                                                    run(v);
                                                }
                                            
                                        },
                                    },
                                },
                                {
                                    title: "Y Range Upper Bound",
                                    type: "input",
                                    value: {
                                        current: 0,
                                        callback(d) {
                                            v.data.config.valueRange[1] = parseFloat(d);
                                            if (!!v.data.config.valueRange[0] 
                                                && !!v.data.config.valueRange[1]) {
                                                    v.forceRedraw = true;
                                                    run(v);
                                                }
                                        },
                                    },
                                },
                            ]
                        }
                    }
                ]
            },
            {
                id: "settings",
                title: "Settings",
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
                                scheme: copyObject(v.data.colors),
                                palettes: withDefaultPalette(defaultPalette, cbpPalette),
                                paletteMap: {"0":0,"1":1},
                                id: "pwcolor",
                                callback(colors) {
                                    v.data.colors = [colors['0'], colors['1']];
                                    v.forceRedraw = true;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Scatter Size: ",
                            type: "input",
                            value: {
                                current: v.data.config.scatterSize,
                                callback(d) {
                                    v.data.config.scatterSize = parseFloat(d);
                                    v.forceRedraw = true;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Hollow Scatter",
                            type: "checkbox",
                            value: {
                                current: v.data.config.hollow,
                                callback(d) {
                                    v.data.config.hollow = d;
                                    run(v);
                                },
                            },
                        },
                    ],
                },
            },
        ],
    };
}
