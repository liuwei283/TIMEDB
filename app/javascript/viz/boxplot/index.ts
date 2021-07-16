import Oviz from "crux";
import { Color } from "crux/dist/color";
import { editorConfig } from "./editor";
import template from "./template.bvt";

import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { computeLog, findBoundsForValues } from "utils/maths";

import { groupedChartColors} from "oviz-common/palette";

const ylabel = "Beta diversity";
const title = "Beta Diversity";

const MODULE_NAME = "boxplot";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {ylabel, title,
            config: {
                rankIndex: 0,
                plotWidth: 1000,
                showOutliers: true,
                showP: true,
                hollowBox: true,
                xLabelRotation: 45,
                labelFontSize: 12,
            },
            colors: { default: groupedChartColors[0] },
            getBoxColors: (x, hollow = true) => {
                if (hollow) return [x, "white", x];
                else return [Color.literal(x).darken(30).string,
                    Color.literal(x).lighten(10).string, "white" ];
            },
        },
        loadData: {
            boxMain: {
                fileKey: "boxMain",
                type: "tsv",
                multiple: true,
                dsvHasHeader: false,
                loaded(data) {
                    this.data.mainDict = {};
                    const raw = {};
                    this.data.ranks = [];
                    data.sort((a, b) => sortByRankKey(a, b))
                        .forEach((d, i) => {
                            const rankLabel = rankDict[d[0][0]];
                            this.data.ranks.push(rankLabel);
                            const {rawData, boxData} = processRawData(d.slice(1, d.length));
                            this.data.mainDict[rankLabel] = boxData;
                            if (i === 0) this.data.boxData = boxData;
                            raw[rankLabel] = rawData;
                    });
                    this.data.ranks = this.data.ranks.map((x, i) =>  ({value: i, text: x}));
                    return raw;
                },
            },
            boxP: {
                fileKey: "boxP",
                type: "tsv",
                multiple: true,
                loaded(data) {
                    this.data.pDict = {};
                    data.forEach(d => {
                        const rankLabel = rankDict[d.columns[0]];
                        this.data.pDict[rankLabel] = d.map(r => {
                            const [source, target] = r[d.columns[0]].split(":");
                            const pValue = parseFloat(r[d.columns[1]]);
                            return {source, target, pValue};
                        });
                    });
                    return null;
                },
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this));
        },
    });

    return visualizer;
}

export function registerBoxplot() {
    register(MODULE_NAME, init);
}

function processRawData(data: any[]) {
    const rawData = {};
    const allValues = [];
    data.forEach(d => {
        rawData[d[0]] = d.splice(1, d.length).map(x => parseFloat(x));
        allValues.push(...rawData[d[0]]);
    });
    const boxData = {categories: Object.keys(rawData),
        valueRange: findBoundsForValues(allValues, 2, false, 0.5),
        values: [], outliers: [], means: [], max: Math.max(...allValues)};
    boxData.categories.forEach((k, i) => {
        const stat1 = new Oviz.algo.Statistics(rawData[k]);
        const interQuartileRange = stat1.Q3() - stat1.Q1();
        const result = [];
        rawData[k].forEach(d => {
            if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                boxData.outliers.push([i, d]);
            } else {
                result.push(d);
            }
        });
        const stat2 = new Oviz.algo.Statistics(result);
        boxData.values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
        boxData.means.push(stat2.mean());
    });
    return {rawData, boxData};
}

register(MODULE_NAME, init);
