import { setSyntheticLeadingComments } from "typescript";
import { EditorDef } from "utils/editor";
import { generateBoxConfig } from "viz/boxplot/editor";
import { setMainData } from ".";

export const editorRef = {} as any;

function run(v) {
    v.forceRedraw = true;
    v.run();
}
function scatterConfig(v){
    return ({
        id: "scatter",
        title: "Scatterplot Content",
        layout: "single-page",
        icon: "",
        view: {
            type: "list",
            items: [
                {
                    title: "",
                    ref: "filterSamples",
                    type: "vue",
                    component: "filter-species",
                    data: {
                        get species() {
                            return Array.from(v.data.samples);
                        },
                        get defaultValue() {
                            return true;
                        },
                        get title() {
                            return "Filter Samples";
                        },
                        callback(_, hiddenSamples) {
                            v.data.hiddenSamples = new Set(hiddenSamples);
                            run(v);
                        },
                    },
                },
            ],
        },
    });
}
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
                                    type: "select",
                                    title: "Taxonomic rank",
                                    options: v.data.ranks,
                                    value: {
                                        current: v.data.rank,
                                        callback(d) {
                                            v.data.rank = d;
                                            setMainData(v.data.mainDict[d], v);
                                            run(v);
                                        },
                                    },
                                },
                                {
                                    type: "select",
                                    title: "Group by",
                                    options: Object.keys(v.data.metaInfo).map(x => ({value: x, text: x})),
                                    value: {
                                        current: v.data.catKey,
                                        callback(d) {
                                            v.data.catKey = d;
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    // {
                    //     id: "xData",
                    //     name: "X-Axis",
                    //     view: {
                    //         type: "list",
                    //         items: [
                    //             {
                    //                 ref: "xAxis",
                    //                 title: "X-Axis",
                    //                 type: "select",
                    //                 options: v.data.availableAxises,
                    //                 value: {
                    //                     current: v.data.config.xAxisIndex.toString(),
                    //                     callback(d) {
                    //                         v.data.config.xAxisIndex = parseInt(d);
                    //                         v.root.dataChanged = true;
                    //                         v.forceRedraw = true;
                    //                         run(v);
                    //                     },
                    //                 },
                    //             },
                    //             {
                    //                 title: "X Range Lower Bound",
                    //                 type: "input",
                    //                 value: {
                    //                     current: 0,
                    //                     callback(d) {
                    //                         v.data.config.categoryRange[0] = parseFloat(d);
                    //                         if (!!v.data.config.categoryRange[0]
                    //                             && !!v.data.config.categoryRange[1]) {
                    //                                 v.forceRedraw = true;
                    //                                 v.root.dataChanged = true;
                    //                                 run(v);
                    //                             }
                    //                     },
                    //                 },
                    //             },
                    //             {
                    //                 title: "X Range Upper Bound",
                    //                 type: "input",
                    //                 value: {
                    //                     current: 0,
                    //                     callback(d) {
                    //                         v.data.config.categoryRange[1] = parseFloat(d);
                    //                         if (!!v.data.config.categoryRange[0] 
                    //                             && !!v.data.config.categoryRange[1]) {
                    //                                 v.forceRedraw = true;
                    //                                 v.root.dataChanged = true;
                    //                                 run(v);
                    //                             }
                    //                     },
                    //                 },
                    //             },
                    //         ],
                    //     },
                    // },
                    // {
                    //     id: "yData",
                    //     name: "Y-Axis",
                    //     view: {
                    //         type: "list",
                    //         items: [
                    //             {
                    //                 ref: "yAxis",
                    //                 title: "Y-Axis",
                    //                 type: "select",
                    //                 options: v.data.availableAxises,
                    //                 value: {
                    //                     current: v.data.config.yAxisIndex.toString(),
                    //                     callback(d) {
                    //                         v.data.config.yAxisIndex = parseInt(d);
                    //                         v.forceRedraw = true;
                    //                         v.root.dataChanged = true;
                    //                         run(v);
                    //                     },
                    //                 },
                    //             },
                    //             {
                    //                 title: "Y Range Lower Bound",
                    //                 type: "input",
                    //                 value: {
                    //                     current: 0,
                    //                     callback(d) {
                    //                         v.data.config.valueRange[0] = parseFloat(d);
                    //                         if (!!v.data.config.valueRange[0] 
                    //                             && !!v.data.config.valueRange[1]) {
                    //                                 v.forceRedraw = true;
                    //                                 run(v);
                    //                             }
                    //                     },
                    //                 },
                    //             },
                    //             {
                    //                 title: "Y Range Upper Bound",
                    //                 type: "input",
                    //                 value: {
                    //                     current: 0,
                    //                     callback(d) {
                    //                         v.data.config.valueRange[1] = parseFloat(d);
                    //                         if (!!v.data.config.valueRange[0] 
                    //                             && !!v.data.config.valueRange[1]) {
                    //                                 v.forceRedraw = true;
                    //                                 run(v);
                    //                             }
                    //                     },
                    //                 },
                    //             },
                    //         ],
                    //     },
                    // },
                ],
            },
            {
                id: "setting-general",
                title: "General settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        // {
                        //     type: "vue",
                        //     title: "",
                        //     component: "color-picker",
                        //     data: {
                        //         title: "Customize colors",
                        //         scheme: copyObject(v.data.colors),
                        //         id: "pwcolor",
                        //         callback(colors) {
                        //             v.data.colors = colors;
                        //             run(v);
                        //         },
                        //     },
                        // },
                        {
                            title: "grid length",
                            type: "input",
                            value: {
                                current: v.data.mainGridLength,
                                callback(d) {
                                    v.data.mainGridLength = parseFloat(d);
                                    v.forceRedraw = true;
                                    v.run();
                                },
                            },
                        },
                        {
                            title: "scatter size",
                            type: "input",
                            value: {
                                current: v.data.scatterConfig.scatterSize,
                                callback(d) {
                                    v.data.scatterConfig.scatterSize = parseInt(d);
                                    v.forceRedraw = true;
                                    v.run();
                                },
                            },
                        },
                        {
                            title: "box height",
                            type: "input",
                            value: {
                                current: v.data.boxGridHeight,
                                callback(d) {
                                    v.data.boxGridHeight = parseFloat(d);
                                    v.forceRedraw = true;
                                    v.run();
                                },
                            },
                        },
                    ],
                },
            },
            scatterConfig(v),
            {
                id: "setting-bc",
                title: "Box content settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [                       
                        {
                            title: "Hollow box",
                            type: "checkbox",
                            value: {
                                current: v.data.boxConfig.hollowBox,
                                callback(d) {
                                    v.data.boxConfig.hollowBox = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Outliers",
                            type: "checkbox",
                            value: {
                                current: v.data.boxConfig.showOutliers,
                                callback(d) {
                                    v.data.boxConfig.showOutliers = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Sample scatter",
                            type: "checkbox",
                            value: {
                                current: v.data.boxConfig.drawScatter,
                                callback(d) {
                                    v.data.boxConfig.drawScatter = d;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Draw violin",
                            type: "checkbox",
                            value: {
                                current: v.data.boxConfig.drawViolin,
                                callback(d) {
                                    v.data.boxConfig.drawViolin = d;
                                    v.data.boxConfig.drawBox = !d;
                                    run(v);
                                },
                            },
                        },
                    ],
                },
            },
            {
                id: "meta",
                title: "Meta Panel",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "meta info",
                            type: "vue",
                            component: "meta-info",
                            data: {
                                data: v.data.metaFeatures.map(k => ({
                                    name: k, ...v.data.metaInfo[k],
                                })),
                                callback(obj) {
                                    // console.log(Object.keys(v.data.metaInfo));
                                    for (const o of obj) {
                                        v.data.metaInfo[o.name].update(v, o);
                                    }
                                    // console.log(v.data.metaInfo);
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
