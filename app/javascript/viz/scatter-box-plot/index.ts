import Oviz from "crux";
import * as d3 from "d3";
import { ScatterBoxPlot } from "./scatter-box-plot";

import { findBoundsForValues } from "utils/maths";

import { editorRef, editorConfig } from "./editor";
import { registerEditorConfig } from "utils/editor";
import { rankDict, sortByRankKey} from "utils/bio-info";
import { register } from "page/visualizers";

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
        renderer: "svg",
        width: 800,
        height: 800,
        data: {
            colorScheme, startColor, endColor, shapes,
        },
        loadData: {
            scatterBoxMain: {
                fileKey: "scatterBoxMain",
                type: "tsv",
                multiple: true,
                dependsOn: ["scatterBoxGroup"],
                loaded(data) {
                    this.data.mainDict = {};
                    const raw = {};
                    this.data.ranks = [];
                    data.forEach((d, i) => {
                        const rankLabel = rankDict[d.columns[0]];
                        this.data.ranks.push(rankLabel);
                        const mainD = d.map(x => {
                            x["sampleId"] = x[d.columns[0]];
                            delete x[d.columns[0]];
                            return x;
                        });
                        this.data.mainDict[rankLabel] = {data: mainD};
                        if (i === 0) {
                            this.data.axises = d.columns.slice(1);
                            const chosenX = this.data.axises[xAxisIndex];
                            const chosenY = this.data.axises[yAxisIndex];
                            this.data.xLabel = chosenX;
                            this.data.yLabel = chosenY;
                            this.data.scatterData = [];
                            const xValues = [];
                            const yValues = [];
                            d.forEach(x => {
                                const xValue = parseFloat(x[chosenX]);
                                const yValue = parseFloat(x[chosenY]);
                                this.data.scatterData.push({sampleId: x.sampleId,
                                    values: [ xValue, yValue],
                                    ...this.data.groupDict[x.sampleId]});
                                xValues.push(xValue);
                                yValues.push(yValue);
                            });

                            this.data.xRange = findBoundsForValues(xValues, 2, false, 0.1);
                            this.data.yRange = findBoundsForValues(yValues, 2, false, 0.1);
                            
                            const categories = [`<=${ageDiv}`, `>${ageDiv}`];
                            const boxDataX = {categories, means: [], outliers: [], values: []};
                            const boxDataY = {categories, means: [], outliers: [], values: []};
                            categories.forEach((c, i) => {
                                let valueArrayX, valueArrayY;
                                if (i === 0 ) {
                                    valueArrayX = this.data.scatterData
                                                            .filter(x => x.age <= ageDiv)
                                                            .map(x => x.values[0]);
                                    
                                    valueArrayY = this.data.scatterData
                                                    .filter(x => x.age <= ageDiv)
                                                    .map(x => x.values[1]);
                                } else {
                                    valueArrayX = this.data.scatterData
                                                            .filter(x => x.age > ageDiv)
                                                            .map(x => x.values[0]);
                                    valueArrayY = this.data.scatterData
                                                    .filter(x => x.age > ageDiv)
                                                    .map(x => x.values[1]);
                                }

                                const statX = new Oviz.algo.Statistics(valueArrayX);
                                const statY = new Oviz.algo.Statistics(valueArrayY);
                                boxDataX.means.push(statX.mean());
                                boxDataX.values.push([statX.min(), statX.Q1(), statX.median(), statX.Q3(), statX.max()]);
                                boxDataY.means.push(statY.mean());
                                boxDataY.values.push([statY.min(), statY.Q1(), statY.median(), statY.Q3(), statY.max()]);
                            });
                            this.data.boxDataX = boxDataX;
                            this.data.boxDataY = boxDataY;
                        }
                    });
                    return raw;
                },
            },
            scatterBoxGroup: {
                fileKey: "scatterBoxGroup",
                type: "tsv",
                loaded(data) {
                    const sampleKey = data.columns[0];
                    const groupKey = data.columns[1];
                    const ageKey = data.columns[2];
                    this.data.groupDict = {};
                    this.data.groups = [];
                    this.data.ageRange = [Number.MAX_VALUE, Number.MIN_VALUE];
                    data.forEach(d => {
                        if (this.data.groups.indexOf(d[groupKey]) < 0) this.data.groups.push(d[groupKey]);
                        const age = parseInt(d[ageKey]);
                        if (this.data.ageRange[0] > age ) this.data.ageRange[0] = age;
                        if (this.data.ageRange[1] < age) this.data.ageRange[1] = age;
                        this.data.groupDict[d[sampleKey]] = {
                            group: d[groupKey], age,
                            shape: shapes[this.data.groups.indexOf(d[groupKey])],
                        };
                    });
                    this.data.colorGetter = (s) => d3.scaleLinear().range([startColor, endColor]).domain(this.data.ageRange)(this.data.groupDict[s].age);
                    return null;
                },
            },
        },
        setup() {
            this.defineGradient("bg", "horizontal", [startColor, endColor]);
            registerEditorConfig(editorConfig(this), editorRef);
            const legendWidth = this.size.width * 0.3 - 80;
            this.data.legendWidth = legendWidth;
        },
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerScatterBoxPlot() {
    register(MODULE_NAME, init);
}
