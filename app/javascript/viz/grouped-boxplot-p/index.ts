import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import {register} from "page/visualizers";
import {DiverBoxPlot,diverplotDataProcess, processData} from "oviz-components/diverboxplot";
import { findBoundsForValues } from "utils/maths";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { editorConfig, editorRef } from "./editor";
import { registerEditorConfig } from "utils/editor";

import * as TextSize from "crux/dist/utils/text-size";

const boxW =20;
const yLabel = "Abundance Log(x + 1)";
const gapRatio=0.2;
const MODULE_NAME = "grouped-boxplot-p";
const colors = groupedChartColors;
// ["#7DCEA0", "#F1948A", "#85C1E9"];

type boxData = {
    values: [], 
    outliers: [], 
    means?: [], 
    categories: string[]
};
type GroupedBoxInput = {
    classifications: string[],
    categories: string[],
    boxData: boxData[],
    valueRange: [number, number]
    // violinData,
};

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { GridPlot, EditText, DiverBoxPlot},
        data: {
            yLabel, legendTitle: "Methods",
            colors,
            lineColor: "#666",
            deltaX: 40,
            legendPos: {x: null, y: null},
            // 拖动更新legend位置的function 可以放进component.ts里
            updateLegendPos(ev, el, deltaPos) {
                this.legendPos.x += deltaPos[0];
                this.legendPos.y += deltaPos[1];
                this.redraw();
            },
            config: {
                drawBox:true,
                drawOutlier:true,
                drawP:true,
                plotSize: [null, 350],
                boxW,gapRatio,
                labelFontSize: 12, tickFontSize: 12, xAxisRotated: true,
                drawBackgroundAxis: true,
                margin: [0, 0.1],
            }
        },
        loadData: {
            bpGroup: {
                fileKey: "bpGroup",
                type: "tsv",
                loaded(data) {
                    this.data.groupDict = {};
                    this.data.groups = [];
                    data.forEach(d => {
                        this.data.groupDict[d[data.columns[0]]] = d[data.columns[1]];
                        if (!this.data.groups.includes(d[data.columns[1]]))
                            this.data.groups.push(d[data.columns[1]]);
                    });
                    this.data.legendData = this.data.groups.map((x, i) => {
                        return {type: "Custom", label: x, fill: colors[i]};
                    });
                }
            },
            boxplotDataGroupedP: {
                fileKey: "boxplotDataGroupedP",
                type: "tsv",
                multiple: true,
                dependsOn: ["bpGroup"],
                loaded(data) {
                    const mainDict = {};
                    // console.log(data);
                    data.forEach((d, i) => {
                        if (d.length === 0) return;

                        // process rank info
                        const idKey = d.columns[0];
                        const rankLabel = d[0][idKey].split("_")[0];
                        const samples = d.columns.slice(1, d.columns.length);
                        const initialData = [];
                        const values = [];
                        d.forEach(row => {
                            const speciesName = row[idKey];
                            samples.forEach(sample => {
                                initialData.push({
                                    speciesName, sample, abd: row[sample],
                                    group: this.data.groupDict[sample] 
                                });
                                values.push(parseFloat(row[sample]));
                            });
                        });
                        const result = processData(initialData, "abd", "group", "speciesName", true);
                        // const bounds = findBoundsForValues(result.valueRange, 2);
                        const boxDict = {};
                        result.boxData.forEach((x,i) => {
                            boxDict[`box${i}`] = x;
                        });
                        result.valueRange = findBoundsForValues(result.valueRange, 2);
                        result["data"] = boxDict;
                        if (i===0) {
                            this.data.data = result;
                            this.data.rank = rankDict[rankLabel];
                        }
                        mainDict[rankDict[rankLabel]] = result;
                    });
                    this.data.mainDict = mainDict;
                    this.data.ranks = Object.keys(mainDict).map(x => ({text: x, value: x}));
                    return null;
                }
            },
            bpPData: {
                fileKey: "bpPData",
                type: "tsv",
                dependsOn: ["boxplotDataGroupedP"],
                multiple: true,
                loaded(data) {
                    this.data.pDict = {};
                    const ranks = this.data.ranks.map(x => x.text);
                    data.forEach(d => {
                        if (d.length === 0) return;
                        const idKey = d.columns[0];
                        const pKey = "pvalue";
                        const rank = rankDict[d[0][idKey].split("_")[0]];
                        if (ranks.includes(rank)) {
                            const {categories, stat1Maxes, stat2Maxes} = this.data.mainDict[rank];
                            const temp = [];
                            d.filter(x => categories.indexOf(x[idKey]) >= 0)
                            .sort((a, b) => {
                                return categories.indexOf(a[idKey]) - categories.indexOf(b[idKey]);
                            }).forEach((row, i) => {
                                const value = Number(row[pKey]);
                                temp.push({
                                    stat1Max: stat1Maxes[i], stat2Max: stat2Maxes[i], value,
                                    notation: value < 0.005 ? "**" : value < 0.05 ? "*" : "",
                                });
                            });
                            this.data.pDict[rank] = temp;
                            this.data.mainDict[rank].pData = temp;
                        } 
                    });
                }
            }
        },
        setup() {
            // 在这边计算了箱子的宽度，每个category格子的宽度，xy-plot的width
            processconfigData(this);
            registerEditorConfig(editorConfig(this), editorRef);
        },
    });

    return visualizer;
}
export function processconfigData(v) {
    const textLength = TextSize.measuredTextSize(v.data.data.categories[0]).width;
    const deltaX = Math.cos(Math.PI / 6) * textLength;
    if (deltaX > 40) v.data.deltaX = deltaX + 10;

    const gridW = v.data.config.gridW =  ((v.data.config.boxW + 2) * 
        v.data.data.classifications.length) / (1-v.data.config.gapRatio);
    v.data.config.plotSize[0] = v.data.data.categories.length * gridW;
    // v.data.plotHeight= v.data.classifications.length* 50;
    // 以及定义了画布的宽度
    v.size.width = v.data.config.plotSize[0] + deltaX + 50;
    v.size.height= v.data.config.plotSize[1] + 300;
    v.data.legendPos = {x: 5, y: v.data.config.plotSize[1]};
}
export function registerGroupedBoxP() {
    register(MODULE_NAME, init);
}
register(MODULE_NAME, init);
