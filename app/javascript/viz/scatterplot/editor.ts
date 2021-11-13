import { genDefaultPalette, withDefaultPalette } from "oviz-common/palette";
import { EditorDef } from "utils/editor";
import { parse } from "utils/newick";
import { copyObject } from "utils/object";
import { generateLegendData, setMainData } from ".";

function run(v) {
    v.forceRedraw = true;
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
                id: "data",
                title: "Data",
                layout: "tabs",
                tabs: [
                    {
                        id: "gData",
                        name: "General",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Taxonomic rank",
                                    type: "select",
                                    options: v.data.ranks,
                                    value: {
                                        current: v.data.rank,
                                        callback(d) {
                                            v.data.rank = d;
                                            v.root.rankChanged = true;
                                            run(v);
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        id: "xData",
                        name: "X-Axis",
                        view: {
                            type: "list",
                            items: [
                                {
                                    ref: "xAxis",
                                    title: "X-Axis",
                                    type: "select",
                                    options: v.data.axises,
                                    value: {
                                        current: v.data.xLabel,
                                        callback(d) {
                                            v.data.xLabel = d;
                                            v.root.$ref.scatter.dataChanged = true;
                                            setMainData(v.data.mainDict[v.data.rank], v, v.data.xLabel, v.data.yLabel);
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "X Range Lower Bound",
                                    type: "input",
                                    value: {
                                        current: v.data.data.categoryRange[0],
                                        callback(d) {
                                            v.data.data.categoryRange[0] = parseFloat(d);
                                            v.root.$ref.scatter.dataChanged = true;
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "X Range Upper Bound",
                                    type: "input",
                                    value: {
                                        current: v.data.data.categoryRange[1],
                                        callback(d) {
                                            v.data.data.categoryRange[1] = parseFloat(d);
                                            v.root.$ref.scatter.dataChanged = true;
                                            run(v);
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        id: "yData",
                        name: "Y-Axis",
                        view: {
                            type: "list",
                            items: [
                                {
                                    ref: "yAxis",
                                    title: "Y-Axis",
                                    type: "select",
                                    options: v.data.axises,
                                    value: {
                                        current: v.data.yLabel,
                                        callback(d) {
                                            v.data.yLabel = d;
                                            v.root.$ref.scatter.dataChanged = true;
                                            setMainData(v.data.mainDict[v.data.rank], v, v.data.xLabel, v.data.yLabel);
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "Y Range Lower Bound",
                                    type: "input",
                                    value: {
                                        current: v.data.data.valueRange[0],
                                        callback(d) {
                                            v.data.data.valueRange[0] = parseFloat(d);
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "Y Range Upper Bound",
                                    type: "input",
                                    value: {
                                        current: v.data.data.valueRange[1],
                                        callback(d) {
                                            v.data.data.valueRange[1] = parseFloat(d);
                                            run(v);
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
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
                                // palettes: withDefaultPalette(defaultPalette, cbpPalette),
                                // paletteMap: {"0": 0, "1": 1},
                                id: "pwcolor",
                                callback(colors) {
                                    v.data.colors = colors;
                                    generateLegendData(v);
                                    run(v);
                                },
                            },
                        },
                        // {
                        //     type: "vue",
                        //     title: "Range",
                        //     component: "slider-input",
                        //     data: {
                        //         id: "slider",
                        //         value: 0,
                        //         range: [0,100],
                        //         callback() {
                        //             console.log("???");
                        //         },
                        //     },
                        // },
                        {
                            title: "Scatter Size: ",
                            type: "input",
                            value: {
                                current: v.data.config.scatterSize,
                                callback(d) {
                                    v.data.config.scatterSize = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Scatter Opacity: ",
                            type: "input",
                            value: {
                                current: v.data.config.scatterOpacity,
                                callback(d) {
                                    v.data.config.scatterOpacity = parseFloat(d);
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
                        {
                            title: "Draw Lines to center",
                            type: "checkbox",
                            value: {
                                current: v.data.config.drawCenterStrokes,
                                callback(d) {
                                    v.data.config.drawCenterStrokes = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Draw Ellipse",
                            type: "checkbox",
                            value: {
                                current: v.data.config.drawEllipse,
                                callback(d) {
                                    v.data.config.drawEllipse = d;
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
