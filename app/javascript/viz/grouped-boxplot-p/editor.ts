import { defaultLayoutConf as conf} from "utils/editor";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { genDefaultPalette, withDefaultPalette, genPaletteMap} from "oviz-common/palette";
import { processconfigData } from ".";

const cbpPalette = {
    cBioPortal: {
        name: "cBioPortal",
        // miss, inframe, trunc, other, text, active layer, line, icon stroke
        colors: ["#3d7f08", "#913810", "#000000", "#c55ebc", "#000000", "#777", "#555", "#fff"],
    },
};

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

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
                                            v.data.data = v.data.mainDict[v.data.rank];
                                            processconfigData(v);
                                            editorRef.lowerBound = v.data.data.valueRange[0];
                                            editorRef.upperBound = v.data.data.valueRange[1];
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "Range Lower Bound",
                                    type: "input",
                                    ref: "lowerBound",
                                    value: {
                                        current: v.data.data.valueRange[0],
                                        callback(d) {
                                            v.data.data.valueRange[0] = parseFloat(d);
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "Range Upper Bound",
                                    type: "input",
                                    ref: "upperBound",
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
                                palettes: withDefaultPalette(defaultPalette, cbpPalette),
                                id: "pwcolor",
                                paletteMap: genPaletteMap(Object.keys(v.data.colors)),
                                callback(colors) {
                                    v.data.colors = colors;
                                    // v.forceRedraw = true;
                                    v.data.legendData.forEach((x, i) => {
                                        x.fill = colors[i];
                                    });
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Plot Height",
                            type: "input",
                            value: {
                                current: v.data.config.plotSize[1],
                                callback(value) {
                                    v.data.config.plotSize[1] = parseFloat(value);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Plot Margin(y)",
                            type: "input",
                            value: {
                                current: v.data.config.margin[1],
                                callback(value) {
                                    if (parseFloat(value) > 0.1) {
                                        window.alert("margin should be smaller than 0.1")
                                        return;
                                    }
                                    v.data.config.margin[1] = parseFloat(value);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Box Width",
                            type: "input",
                            value: {
                                current: v.data.config.boxW,
                                callback(value) {
                                    v.data.config.boxW = parseFloat(value);
                                    processconfigData(v);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Outliers",
                            type: "checkbox",
                            value: {
                                current: v.data.config.drawOutlier,
                                callback(value) {
                                    v.data.config.drawOutlier = value
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "P annotation",
                            type: "checkbox",
                            value: {
                                current: v.data.config.drawP,
                                callback(value) {
                                    v.data.config.drawP = value;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Background axises",
                            type: "checkbox",
                            value: {
                                current: v.data.config.drawBackgroundAxis,
                                callback(value) {
                                    v.data.config.drawBackgroundAxis = value;
                                    run(v);
                                },
                            },
                        },
                    ]
                }
            }
        ],
    };
}
