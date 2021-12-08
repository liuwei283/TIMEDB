import { genDefaultPalette, withDefaultPalette } from "oviz-common/palette";
import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;
// const [defaultPalette] = genDefaultPalette(v.data.colors, v.data.values);

function genPaletteMap(values) {
    const map = {};
    Object.keys(values).forEach((key, i)=> map[key] = i);
    return map;
}
export const generateBoxConfig = (v): any => (            {
    id: "setting-bc",
    title: "Box content settings",
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
                    scheme: copyObject({ ...v.data.colorCats,...v.data.colors}),
                    palettes: withDefaultPalette(genDefaultPalette(v.data.colorCats)[0]),
                    paletteMap: genPaletteMap(v.data.colorCats),
                    id: "pwcolor",
                    callback(colors) {
                        Object.keys(v.data.colors).forEach(k => {
                            v.data.colors[k] = colors[k];
                        });
                        v.data.palette = Object.keys(v.data.colorCats).map(k => colors[k]);
                        // v.data.colorCats = colors;
                        run(v);
                    },
                },
            },
            {
                title: "Hollow box",
                type: "checkbox",
                value: {
                    current: v.data.config.hollowBox,
                    callback(d) {
                        v.data.config.hollowBox = d;
                        run(v);
                    },
                },
            },
            {
                title: "Color by categories",
                type: "checkbox",
                value: {
                    current: v.data.config.useCat,
                    callback(d) {
                        v.data.config.useCat = d;
                        run(v);
                    },
                },
            },
            {
                title: "Show Mean values",
                type: "checkbox",
                value: {
                    current: v.data.config.drawMean,
                    callback(d) {
                        v.data.config.drawMean = d;
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
});
export function editorConfig(v): EditorDef {
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
                                    title: "Chart(beta)",
                                    type: "text",
                                    content: "beta"
                                },
                                {
                                    title: "Taxonomic rank",
                                    type: "select",
                                    options: v.data.ranks,
                                    value: {
                                        current: v.data.rank,
                                        callback(d) {
                                            v.data.rank = d;
                                            v.data.data = v.data.mainDict[d];
                                            editorRef.lowerBound.value = v.data.data.valueRange[0];
                                            editorRef.upperBound.value = v.data.data.valueRange[1];
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
            generateGridPlotConfig(v),
            generateBoxConfig(v),
        ],
    };
}
