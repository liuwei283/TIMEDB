import Oviz from "crux";
import { Color } from "crux/dist/color";
import template from "./template.bvt";

import { groupedChartColors } from "oviz-common/palette";
import { register } from "page/visualizers";
import { getGroups } from "utils/array";
import { rankDict, sortByRank } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { findBoundsForValues } from "utils/maths";
import { editorConfig } from "./editor";

// please change the displayed value range in the template by the prop: valueRange.
const MODULE_NAME = "boxplot-single";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {
            config: {
                plotWidth: 1000,
                showOutliers: true,
                showP: true,
                xLabelRotation: 45,
            },
            colors: { default: groupedChartColors[0] },
            ylabel: "Alpha diversity",
            getBoxColors: (x, hollow = true) => {
                if (hollow) return [x, "white", x];
                else return [Color.literal(x).darken(30).string,
                    Color.literal(x).lighten(10).string, "white" ];
            },
        },
        loadData: {
            boxSingleMain: {
                fileKey: "boxSingleMain",
                type: "tsv",
                dependsOn: ["boxSingleGroup"],
                dsvHasHeader: true,
                loaded(data) {
                    const samples = data.columns.slice(1);
                    const rankKey = data.columns[0];
                    this.data.ranks = [];
                    this.data.mainDict = {};
                    data.forEach(d => {
                        const rankLabel = rankDict[d[rankKey]];
                        this.data.ranks.push(rankLabel);
                        const allValues = [];
                        const initialData = [[], []];
                        samples.forEach(s => {
                            const v = parseFloat(d[s]);
                            allValues.push(v);
                            if (this.data.groupDict[s] === this.data.groups[0])
                                initialData[0].push(v);
                            else
                                initialData[1].push(v);
                        });
                        const boxData = { categories: [...this.data.groups],
                            valueRange: findBoundsForValues(allValues, 2, false, 0.5),
                            values: [], outliers: [], means: [], max: Math.max(...allValues)};
                        this.data.groups.forEach((group, i) => {
                            const result = [];
                            const stat1 = new Oviz.algo.Statistics(initialData[i]);
                            const interQuartileRange = stat1.Q3() - stat1.Q1();
                            initialData[i].forEach(x => {
                                if ((x < stat1.Q3() - 1.5 * interQuartileRange) || (x > stat1.Q3() + 1.5 * interQuartileRange))  {
                                    boxData.outliers.push([i, x]);
                                } else {
                                    result.push(x);
                                }
                            });
                            const stat2 = new Oviz.algo.Statistics(result);
                            console.log([group, stat2.Q3()]);
                            boxData.values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
                            boxData.means.push(stat2.mean());
                        });
                        this.data.mainDict[rankLabel] = {...boxData};
                    });
                    this.data.ranks = this.data.ranks.sort((a, b) => sortByRank(a,b));
                    this.data.boxData = this.data.mainDict[this.data.ranks[3]];
                    return null;
                },
            },
            boxSingleGroup: {
                fileKey: "boxSingleGroup",
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    this.data.groupDict = {};
                    this.data.groups = getGroups(data, data.columns[1]);
                    data.forEach(d => {
                        this.data.groupDict[d[data.columns[0]]] = d[data.columns[1]];
                    });
                    return null;
                },
            },
            boxSingleP: {
                fileKey: "boxSingleP",
                type: "tsv",
                dsvHasHeader: true,
                dependsOn: ["boxSingleMain"],
                loaded(data) {
                    this.data.pDict = {};
                    data.forEach(d => {
                        const rankLabel = rankDict[d[data.columns[0]]]; 
                        this.data.pDict[rankLabel] = parseFloat(d[data.columns[1]]);
                    });
                    this.data.pValue = this.data.pDict[this.data.ranks[3]];
                },
            },
        },
        setup() {
            this.data.plotWidth = 1000;
            registerEditorConfig(editorConfig(this));
        },
    });

    return visualizer;
}

register(MODULE_NAME, init);
export function registerBoxplotSingle() {
    register(MODULE_NAME, init);
}