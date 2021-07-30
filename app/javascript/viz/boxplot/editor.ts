import { genDefaultPalette, withDefaultPalette } from "oviz-common/palette";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

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
                                        current: v.data.config.rankIndex.toString(),
                                        callback(d) {
                                            v.data.config.rankIndex = parseInt(d);
                                            const rankLabel = v.data.ranks[parseInt(d)].text;
                                            this.data.rank = rankLabel;
                                            v.data.boxData = v.data.mainDict[rankLabel];
                                            v.forceRedraw = true;
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    title: "Range Lower Bound",
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
                                    title: "Range Upper Bound",
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
                                current: v.data.config.plotSize[0],
                                callback(d) {
                                    v.data.config.plotSize[0] = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "plot height",
                            type: "input",
                            value: {
                                current: v.data.config.plotSize[1],
                                callback(d) {
                                    v.data.config.plotSize[1] = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "label font size",
                            type: "input",
                            value: {
                                current: v.data.config.labelFontSize,
                                callback(d) {
                                    v.data.config.labelFontSize = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "tick font size",
                            type: "input",
                            value: {
                                current: v.data.config.tickFontSize,
                                callback(d) {
                                    v.data.config.tickFontSize = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "rotate x axis labels",
                            type: "checkbox",
                            value: {
                                current: v.data.config.xAxisRotated,
                                callback(d) {
                                    v.data.config.xAxisRotated = d;
                                    run(v);
                                },
                            },
                        },
                    ],
                },
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
                                paletteMap: {"0": 0, "1": 1},
                                id: "pwcolor",
                                callback(colors) {
                                    v.data.colors = [colors["0"]];
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Outliers",
                            type: "checkbox",
                            value: {
                                current: v.data.config.showOutliers,
                                callback(d) {
                                    v.data.config.showOutliers = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "P-value",
                            type: "checkbox",
                            value: {
                                current: v.data.config.drawP,
                                callback(d) {
                                    v.data.config.drawP = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Sample scatter",
                            type: "checkbox",
                            value: {
                                current: v.data.config.drawScatter,
                                callback(d) {
                                    v.data.config.drawScatter = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Draw violin",
                            type: "checkbox",
                            value: {
                                current: v.data.config.drawViolin,
                                callback(d) {
                                    v.data.config.drawViolin = d;
                                    v.data.config.drawBox = !d;
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
