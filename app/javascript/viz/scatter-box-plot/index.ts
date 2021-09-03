import Oviz from "crux";

import { editorConfig, editorRef } from "./editor";
import { ScatterBoxPlot } from "./scatter-box-plot";

import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { ComplexScatterplot } from "oviz-components/complex-scatterplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { register } from "page/visualizers";
import { rankDict, sortByRankKey} from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { findBoundsForValues } from "utils/maths";

import { minmax } from "crux/dist/utils/math";
import { brewPalette, MetaInfo } from "viz/meta-overview/data";

const xAxisIndex = 0;
const yAxisIndex = 1;
const startColor = "blue";
const endColor = "red";

const ageDiv = 40;
const shapes = ["Circle", "Triangle", "Rect"];

const colorScheme = Oviz.color.ColorSchemeGradient.create(startColor, endColor);

const MODULE_NAME = "scatter-box-plot";

function init() {

    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        root: new ScatterBoxPlot(),
        components: {GridPlot, EditText, ComplexBoxplot, ComplexScatterplot},
        renderer: "svg",
        width: 800,
        height: 800,
        data: {
            colorScheme, startColor, endColor, shapes, ageDiv,
            colors: {},
            mainGridLength: 300,
            boxGridHeight: 100,
            scatterConfig: {
                hasPadding: false,
                labelFontSize: 12,
                tickFontSize: 12,
                scatterSize: 8,
            },
            boxConfig: {
                showOutliers: true,
                drawViolin: false,
                drawScatter: true,
                hollowBox: true,
                labelFontSize: 12,
                tickFontSize: 12,
                useCat: true,
            },
            xBoxConfig: {
                invertValueAxis: true,
                flip: true,
                discreteCategory: true,
            },
            yBoxConfig: {
              
            },
        },
        loadData: {
            scatterBoxMain: {
                fileKey: "scatterBoxMain",
                type: "tsv",
                multiple: true,
                dependsOn: ["scatterBoxGroup"],
                loaded(data) {
                    this.data.mainDict = {};
                    this.data.ranks = [];
                    data.forEach((d, i) => {
                        const rankLabel = rankDict[d.columns[0]];
                        this.data.ranks.push({value: rankLabel, text: rankLabel});
                        const mainD = d.map(x => {
                            x["sampleId"] = x[d.columns[0]];
                            delete x[d.columns[0]];
                            return x;
                        });
                        this.data.mainDict[rankLabel] = {data: mainD};
                        if (i === 0) {
                            this.data.rank = rankLabel;
                            this.data.axises = d.columns.slice(1);
                            const chosenX = this.data.axises[xAxisIndex];
                            const chosenY = this.data.axises[yAxisIndex];
                            this.data.xLabel = chosenX;
                            this.data.yLabel = chosenY;
                            this.data.scatterData = [];
                            processRawData(d, this);

                            const shapeGetter = (s) => shapes[s.groupIndex];
                            const colorGetter = (s) => this.data.metaInfo[this.data.catKey].color(s[this.data.catKey]);
                            this.data.data = {
                                xLabel: this.data.xLabel, yLabel: this.data.yLabel,
                                data: this.data.scatterData,
                                valueRange: this.data.yRange,
                                categoryRange: this.data.xRange,
                                shapeGetter, colorGetter,
                            };
                            this.data.boxDataX.valueRange = this.data.data.categoryRange;
                            this.data.boxDataY.valueRange = this.data.data.valueRange;
                        }
                    });
                    return null;
                },
            },
            scatterBoxGroup: {
                fileKey: "scatterBoxGroup",
                type: "tsv",
                loaded(data) {
                    this.data.metaFeatures = data.columns.slice(1, data.columns.length);
                    // this.data.metaDict = {};
                    this.data.metaInfo = {};
                    this.data.discardedFeatures = [];
                    let curPos = 0;
                    this.data.metaFeatures.forEach((k, i) => {
                        if (!isNaN(parseFloat(data[0][k]))) {
                            const values = data.map(x => parseFloat(x[k]));
                            const [min, max] = minmax(values);
                            this.data.metaInfo[k] = new MetaInfo(k, true, min, max, values);
                            this.data.metaInfo[k].colorStart = "#0247FE";
                            this.data.metaInfo[k].colorEnd = "#FE4702";
                            this.data.metaInfo[k].updateColorGetter();
                            // this.data.metaData[k] = this.data.samples.map(x => this.data.metaDict[x][k]);
                        } else {
                            const values = data.map(x => x[k]).reduce((a, x) => {
                                if (a.indexOf(x) < 0 && x !== "NA") a.push(x);
                                return a;
                            }, []);
                            if (values.length > 10) {
                                this.data.discardedFeatures.push(k);
                                this.data.metaFeatures.splice(i, 1);
                                alert(`Meta info "${k}" contains more than 10 categories, will not be drawn`);
                            } else {
                                this.data.metaInfo[k] = new MetaInfo(k, false, null, null, values,
                                    curPos + values.length <= brewPalette.length ?
                                        brewPalette.slice(curPos, curPos + values.length) : null);
                                // this.data.metaData[k] = this.data.samples.map(x => this.data.metaDict[x][k]);
                                curPos += values.length;
                            }
                        }
                    });
                    const sampleKey = data.columns[0];
                    const groupKey = this.data.groupKey = data.columns[1];
                    const catKey = this.data.catKey = data.columns[2] || data.columns[1];
                    if (this.data.metaInfo[catKey].isNumber) {
                        this.data.catDiv = Oviz.algo.statistics(this.data.metaInfo[catKey].values).median();
                        this.data.catDiv = 40;
                        this.data.categories = [`<=${this.data.catDiv}`, `>${this.data.catDiv}`];
                    } else {
                        this.data.categories = this.data.metaInfo[catKey].values;
                    }
                    this.data.groupDict = {};
                    this.data.groups = this.data.metaInfo[groupKey].values;
                    this.data.groupLegend = this.data.groups.map((x, i) => {
                        return {label: x, fill: "#aaa", type: shapes[i]};
                    });
                    data.forEach(x => {
                        this.data.groupDict[x[sampleKey]] = {...x,
                            groupIndex: this.data.groups.indexOf(x[groupKey])};
                    });
                    return null;
                },
            },
        },
        setup() {
            console.log(this["_data"]);
            // set cat colors
            if (this.data.catDiv) {
                this.data.colors.cats = [this.data.metaInfo[this.data.catKey].colorStart,
                                this.data.metaInfo[this.data.catKey].colorEnd];
            } else {
                this.data.colors.cats = this.data.categories.map(x =>
                        this.data.metaInfo[this.data.catKey].color(x));
            }
            this.defineGradient("bg", "horizontal", [startColor, endColor]);
            registerEditorConfig(editorConfig(this), editorRef);
            this.data.data.generateTooltip =  (d) => {
                return [this.data.xLabel, this.data.yLabel, ...this.data.metaFeatures].map(k =>
                    `${k}: ${typeof d[k] === "number" ?  d[k].toFixed(3) : d[k]}<br>`).join("");
            };
            this.data.legendWidth = this.data.boxGridHeight + 40;
        },
    });

    return visualizer;
}

const processRawData = (d, v) => {
    const xValues = [];
    const yValues = [];
    d.forEach(x => {
        const xValue = parseFloat(x[v.data.xLabel]);
        const yValue = parseFloat(x[v.data.yLabel]);
        const temp = {sampleId: x.sampleId,
            pos: xValue,
            value: yValue,
            // values: [xValue, yValue]
            ...v.data.groupDict[x.sampleId]};
        temp[v.data.xLabel] = xValue;
        temp[v.data.yLabel] = yValue;
        v.data.scatterData.push(temp);
        xValues.push(xValue);
        yValues.push(yValue);
    });
    v.data.xRange = findBoundsForValues(xValues, 2, false, 0.1);
    v.data.yRange = findBoundsForValues(yValues, 2, false, 0.1);

    const categories = v.data.categories;
    const xBoxValues = categories.map(_ => []);
    const yBoxValues = categories.map(_ => []);
    if (v.data.catDiv) {
        v.data.scatterData.forEach(x => {
            if (parseFloat(x[v.data.catKey]) <= v.data.catDiv) {
                xBoxValues[0].push(x.pos);
                yBoxValues[0].push(x.value);
            } else {
                xBoxValues[1].push(x.pos);
                yBoxValues[1].push(x.value);
            }
        });
    } else {
        v.data.scatterData.forEach(x => {
            const catIndex = categories.indexOf(x[v.data.catKey]);
            xBoxValues[catIndex].push(x.pos);
            yBoxValues[catIndex].push(x.value);
        });
    }
    v.data.boxDataX = processBoxData(xBoxValues, categories);
    v.data.boxDataY = processBoxData(yBoxValues, categories);
};

register(MODULE_NAME, init);

export function registerScatterBoxPlot() {
    register(MODULE_NAME, init);
}
