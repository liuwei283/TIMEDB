import { event } from "crux/dist/utils";
import { EditorDef, ToolbarDef } from "utils/editor";
import { copyObject } from "utils/object";
import { filterSamples } from "./data";

export const editorRef: any = {};

const conf: any = {
    sampleSortBy: ["age"],
};

function updateHistoData(v, idx) {
    for (const h of v.data.data) {
        let counter = 0;
        const rev = [...v.data.histoKeys[idx]].reverse();
        for (const hk of rev) {
            const value = parseFloat(h[hk.rawKey]);
            h._histo[idx][hk.key][0] = counter;
            h._histo[idx][hk.key][1] = counter + value;
            counter += value;
        }
    }
    updateHistoLegendData(v);
}

function updateHistoLegendData(v) {
    v.data.histoLegendData = v.data.histoKeys.map((h, i) => h.map(hk => ({ label: hk.key, fill: v.data.colorScales.histo[i].get(hk.key) })));
}

const samplesVueData: any = {};

function updateSampleSorting(v, keys) {
    const getters = [];

    for (const sampleSortBy of keys) {
        const sOrder = sampleSortBy[0];
        const sKey = sampleSortBy.substr(1);

        let getter: any;
        switch (sKey) {
            case "id":
                getter = s => s;
                break;
            default:
                const s = sKey.indexOf("_");
                // const panel = sKey.substr(0, s);
                const key = sKey.substr(s + 1);
                if (key === "age" || key === "BMI") {
                    getter = s => Number.isNaN(v.data.metaDict[s][key]) ? Number.MAX_VALUE : v.data.metaDict[s][key];
                } else {
                    getter = s => v.data.metaDict[s][key];
                }
        }
        getters.push([getter, sOrder === "a"]);
    }
    v.data.samples = sort(v.data, getters);
    filterSamples(v);
    update(v);
}
function sort(data: any, getters: [any, boolean][]) {
    return data.samples.sort((a, b) => {
        let result = 0;
        for (const getter of getters) {
            result = compare(a, b, getter[0], getter[1]);
            if (result !== 0) break;
        }
        return result;
    });
}

function selectGenes(genes: any[], str: string) {
    if (str.length === 0 || str === "0") return genes;

    const result = [];
    for (const s of str.split(",")) {
        const trimmed = s.trim();
        if (trimmed.indexOf("-")) {
            const [start_, end_] = trimmed.split("-").map(x => (x.length ? parseInt(x) : null));
            if (!(start_ === null || start_ > 0)) return null;
            if (!(end_ === null || end_ > 0)) return null;
            const start = start_ === null ? 1 : start_;
            const end = end_ === null ? undefined : end_;
            result.push(...genes.slice(start - 1, end));
        } else {
            const g = genes[parseInt(trimmed) - 1];
            if (!g) return null;
            result.push(g);
        }
    }

    return result;
}

function compare(a: any, b: any, getter: any, asc: boolean) {
    const a_ = getter(a),
        b_ = getter(b);
    const va = asc ? a_ : b_;
    const vb = asc ? b_ : a_;
    if (va < vb) return -1;
    else if (va > vb) return 1;
    else return 0;
}

function update(v) {
    v.forceRedraw = true;
    v.run();
}

export function editorConfig(v: any): EditorDef {
    // conf.histoMaxValue = Array.from(v.data.histoMaxValue);
    // conf.displaySampleLabel = Array.from(v.data.displaySampleLabel);
    // conf.histoLabel = Array.from(v.data.histoLabel);
    // conf.histoHidden = Array.from(v.data.histoHidden);
    // conf.histoName = Array.from(v.data.histoName);
    // conf.columnWidth = v.data.columnWidth;
    // conf.genePanelRightInfo = v.data.geneInfo.display;
    // conf.geneLeftLabel = v.data.geneLeftLabel;
    // conf.geneLeftMaxValue = v.data.geneLeftMaxValue;
    // conf.geneRightMaxValue = v.data.geneRightMaxValue;
    // conf.qValueLine = v.data.qValueLine;

    // Object.assign(samplesVueData, {
    //     compact: true,
    //     needAutoUpdate: true,
    //     title: "Reorder samples manually",
    //     array: Array.from(v.data.samples),
    //     callback(d) {
    //         v.data.samples = samplesVueData.array = d;
    //         filterSamples(v);
    //         update(v);
    //     },
    // });

    // const panelDefs = v.data.panelKeyOrder.filter(key => key !== "pw").map(key => genPanelEditorDef(v, key, v.data.panelNames[key]));

    const d = v.data;
    const sampleReorderOpts = [
        ["id", "Sample ID"],
        // ["bis", "Bisection"],
        // ...d.histoKeys.map((h, i) => [`^hist_${i}`, `Histogram ${h[0].name}: Total`]),
        // ...d.histoKeys.flat().map(k => [k.rawKey, k.key, `Histogram ${k.name}`]),
        ...d.metaFeatures.map(k => [`mt_${k}`, k, "Meta info"]),
    ].flatMap(([k, name, p]) => [
            { value: `a${k}`, text: `${p ? `${p}: ` : ""}${name} ↑` },
            { value: `d${k}`, text: `${p ? `${p}: ` : ""}${name} ↓` },
        ]);

    return {
        sections: [
            {
                id: "general",
                title: "General",
                layout: "tabs",
                tabs: [
                    {
                        id: "g-common",
                        name: "Common",
                        view: {
                            type: "list",
                            items: [
                                // {
                                //     title: "Grid width",
                                //     type: "input",
                                //     format: "int",
                                //     bind: {
                                //         object: conf,
                                //         path: "columnWidth",
                                //         callback() {
                                //             v.data.columnWidth = parseFloat(conf.columnWidth);
                                //             update(v);
                                //         },
                                //     },
                                // },
                                {
                                    type: "vue",
                                    component: "color-picker",
                                    ref: "naColorPicker",
                                    data: {
                                        title: "Color for N/A",
                                        scheme: {},
                                        naColor: v.data.NAColor,
                                        id: "group",
                                        callback(_, naColor) {
                                            v.data.NAColor = naColor;
                                            update(v);
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        id: "g-sample",
                        name: "Samples",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Reorder samples by",
                                    type: "vue",
                                    component: "reorder-sample",
                                    data: {
                                        options: sampleReorderOpts,
                                        keys: Array.from(conf.sampleSortBy),
                                        // mutTypes: Array.from(v.data.mutTypes),
                                        callback: (s, neg, pos, g, sortPos, sortNeg) => {
                                            updateSampleSorting(v, s);
                                        },
                                    },
                                },
                                // {
                                //     type: "vue",
                                //     component: "reorder",
                                //     title: "Reorder samples",
                                //     data: samplesVueData,
                                // },
                                {
                                    type: "vue",
                                    component: "filter-sample",
                                    title: "Filter Samples",
                                    ref: "filterSample",
                                    data: {
                                        get samples() {
                                            return Array.from(v.data.samples);
                                        },
                                        callback(hiddenSamples) {
                                            v.data.hiddenSamples = new Set(hiddenSamples);
                                            filterSamples(v);
                                            v.root._sizeUpdated = true;
                                            update(v);
                                        },
                                    },
                                },
                                {
                                    type: "button",
                                    title: "Show ordered sample list",
                                    action() {
                                        const hidden = v.data.hiddenSamples;
                                        event.emit("show-msgbox", {title:"Sample List", 
                                            content: v.data.samples.map(s => (hidden.has(s) ? `${s} (hidden)` : s)).join("<br>"),
                                            html: true});
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
            {
                id: "meta",
                title: "Meta Panel",
                layout: "tabs",
                tabs: [
                    {
                        name: "Settings",
                        id: "content",
                        view: {
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
                                    update(v);
                                },
                            },
                        },
                    },
                    {
                        name: "Reorder",
                        id: "reorder",
                        view: {
                            type: "vue",
                            component: "reorder",
                            data: {
                                title: `Reorder meta features`,
                                array:  v.data.metaFeatures,
                                callback(array) {
                                    v.data.metaFeatures = array;
                                    update(v);
                                },
                            },
                        },
                    },
                ],
            },
        ],
    };
}

function histoPanelDef(v: any, h: any, i: number) {
    return {
        id: `histo-${i}`,
        title: `Histogram ${h[0].name}`,
        layout: "tabs",
        tabs: [
            {
                id: `h-settings-${i}`,
                name: "Settings",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "Name",
                            type: "input",
                            bind: {
                                object: conf,
                                path: `histoName.#${i}`,
                                callback() {
                                    v.data.histoName[i] = conf.histoName[i];
                                    update(v);
                                },
                            },
                        },
                        {
                            title: "Hidden",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: `histoHidden.#${i}`,
                                callback() {
                                    v.data.histoHidden[i] = conf.histoHidden[i];
                                    update(v);
                                },
                            },
                        },
                        {
                            title: "Display sample labels",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: `displaySampleLabel.#${i}`,
                                callback() {
                                    v.data.displaySampleLabel[i] = conf.displaySampleLabel[i];
                                    update(v);
                                },
                            },
                        },
                        {
                            title: "Max value for Y axis",
                            type: "input",
                            format: "float",
                            bind: {
                                object: conf,
                                path: `histoMaxValue.#${i}`,
                                callback() {
                                    v.data.histoMaxValue[i] = parseInt(conf.histoMaxValue[i]);
                                    update(v);
                                },
                            },
                        },
                        {
                            title: "Y axis label",
                            type: "input",
                            bind: {
                                object: conf,
                                path: `histoLabel.#${i}`,
                                callback() {
                                    v.data.histoLabel[i] = conf.histoLabel[i];
                                    update(v);
                                },
                            },
                        },
                    ],
                },
            },
            {
                name: "Data",
                id: `h-data-${i}`,
                view: {
                    type: "list",
                    items: [
                        {
                            type: "vue",
                            component: "reorder",
                            data: {
                                title: "Reorder groups in histogram",
                                array: v.data.histoKeys[i].map(h => h.key),
                                callback(array) {
                                    v.data.histoKeys[i] = array.map(x => v.data.histoKeys[i].find(h => h.key === x));
                                    updateHistoData(v, i);
                                    update(v);
                                },
                            },
                        },
                        {
                            type: "vue",
                            component: "color-picker",
                            data: {
                                title: "Customize colors",
                                scheme: copyObject(v.data.colorScales.histo[i].colors),
                                id: "histo",
                                callback(colors) {
                                    v.data.colorScales.histo[i].colors = colors;
                                    updateHistoLegendData(v);
                                    update(v);
                                },
                            },
                        },
                    ],
                },
            },
        ],
    };
}

export const toolbar: ToolbarDef = [];
