import {defaultLayoutConf as conf} from "utils/editor"
import { genDefaultPalette, withDefaultPalette } from "oviz-common/palette";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { forEachChild } from "typescript";

function run(v) {
    console.log(v)
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
    return {
        sections: [
            {
                id: "files",
                title: "Files",
                builtin: "files"
            },
            {
                id: "data",
                title: "Data",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "X-Axis",
                            type: "select",
                            options: v.data.availableAxises,
                            value: {
                                current: "2",
                                callback(d) {
                                    console.log(d)
                                    v.data.availableAxises.forEach(axis => {
                                        if(axis.string === d)
                                            v.data.config.xAxisIndex = axis.value;
                                    })
                                    
                                    v.forceRedraw = true;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Y-Axis",
                            type: "select",
                            options: v.data.availableAxises,
                            value: {
                                current: "1",
                                callback(i) {
                                    v.data.config.yAxisIndex = parseInt(i);
                                    v.forceRedraw = true;
                                    run(v);
                                },
                            },
                        },
                    ]
                }
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
                            title: "Range Upper Bound",
                            type: "input",
                            bind: {
                                object: conf,
                                path: "max",
                                callback() {
                                    v.data.config.rangeMax = conf.max;
                                    run(v);
                                },
                            },
                            value: {
                                current: v.data.config.rangeMax,
                                callback() {},
                            },
                        },
                        {
                            title: "Range Lower Bound",
                            type: "input",
                            bind: {
                                object: conf,
                                path: "min",
                                callback() {
                                    v.data.config.rangeMin = conf.min;
                                    run(v);
                                },
                            },
                            value: {
                                current: v.data.config.rangeMin,
                                callback() {},
                            },
                        },
                    ],
                },
            },
        ],
    };
}
