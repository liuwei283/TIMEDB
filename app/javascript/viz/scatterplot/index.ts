import Oviz from "crux";

import {register} from "page/visualizers";
import { registerEditorConfig } from "utils/editor";

import template from "./template.bvt";
import { editorConfig, editorRef } from "./editor";

import { groupedChartColors } from "oviz-common/palette";
import { getGroups } from "utils/array";
import {rankDict} from "utils/bio-info";

import * as _ from "lodash";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { ComplexScatterplot, shapes } from "oviz-components/complex-scatterplot";
import { findBoundsForValues } from "utils/maths";

const MODULE_NAME = "scatterplot";

// tbd
function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        height: 700,
        components: { ComplexScatterplot, GridPlot, EditText},
        data: {
            colors: {
                strokeColor: "#999"
            },
            config: {
                plotSize: [300, 300],
                scatterSize: 6,
                hollow: false,
                drawEllipse: true,
                drawCenterStrokes: true,
                scatterOpacity: 0.9,
            },
            vectorLabel: null,
        },
        loadData: {
            scatterData: {
                fileKey: "scatterData",
                type: "tsv",
                multiple: true,
                dsvRowParser (row, _, columns) {
                    row["sampleId"] = row[columns[0]];
                    delete row[columns[0]];
                    for (let i = 1; i < columns.length; i++)
                        row[columns[i]] = parseFloat(row[columns[i]]);
                    return row;
                },
                loaded(d) {
                    const rankKeys = Object.keys(rankDict);
                    // hardcoded part
                    if (window.gon.analysis_name === "K-means Cluster" || (d.length === 1 && d[0].columns[0] === "")) {
                        d[0].columns[0] = "s";
                        this.data.speciesDict = {};
                        const shortSpecies = [];
                        for (let i = 1; i < d[0].columns.length; i ++) {
                            const splittedSpecies = d[0].columns[i].split("|");
                            shortSpecies.push([splittedSpecies[splittedSpecies.length - 1], d[0].columns[i]]);
                            this.data.speciesDict[splittedSpecies[splittedSpecies.length - 1]] = d[0].columns[i];
                        }
                        d[0] = d[0].map(x => {
                            const parsedX = {sampleId: x.sampleId};
                            shortSpecies.forEach(s => {
                                parsedX[s[0]] = x[s[1]];
                            });
                            return parsedX;
                        });
                        d[0].columns = ["s", ...shortSpecies.map(s => s[0])];
                    }
                    this.data.ranks = d.map(x => x.columns[0])
                                    .sort((a, b) => rankKeys.indexOf(a) - rankKeys.indexOf(b))
                                    .map((x, i) =>  ({value: rankDict[x], text: rankDict[x]}));

                    this.data.samples = d[0].map(x => x["sampleId"]);
                    const mainDict = {};
                    d.forEach((data, i) => {
                        mainDict[rankDict[data.columns[0]]] = data;
                    });
                    const selectedDataCols = d[0].columns;
                    this.data.availableAxises = selectedDataCols.filter((_, i) => i > 0)
                                .map((x, i) => ({value: i, text: x}));
                    this.data.mainDict = mainDict;
                    this.data.rank = this.data.ranks[0].text;
                    this.data.sampleInfoDict = {};
                    this.data.samples.forEach(k => this.data.sampleInfoDict[k] = {});
                    return mainDict[this.data.rankLabel];
                },
            },
            scatterGroupData: {
                fileKey: "scatterGroupData",
                type: "tsv",
                optional: true,
                dependsOn: ["scatterData"],
                loaded(data) {
                    if (!data) return;
                    const groups = getGroups(data, data.columns[1]);
                    const groupDict = {};
                    data.forEach(x => {
                        groupDict[x[data.columns[0]]] = x[data.columns[1]];
                    });
                    this.data.groupDict = groupDict;
                    this.data.groups = groups;
                    return null;
                },
            },
            scatterVectorData: {
                fileKey: "scatterVectorData",
                type: "tsv",
                optional: true,
                dependsOn: ["scatterData"],
                dsvRowParser (row, _, columns) {
                    for (let i = 1; i < columns.length; i++)
                        row[columns[i]] = parseFloat(row[columns[i]]);
                    return row;
                },
                loaded(data) {
                    if (!data) return;
                    this.data.vectorLabel = data.columns[0];
                },
            },
            scatterClusterData: {
                fileKey: "scatterClusterData",
                type: "tsv",
                optional: true,
                multiple: true,
                dependsOn: ["scatterData"],
                loaded(d) {
                    if (!d) return;
                    this.data.clusterDict = {};
                    d.forEach(x => {
                        const rankK = rankDict[x.columns[0]];
                        const sampleK = x.columns[0];
                        const clusterK = x.columns[1];
                        x.forEach(r => {
                            if (!this.data.clusterDict[r[sampleK]])
                                this.data.clusterDict[r[sampleK]] = {};
                            this.data.clusterDict[r[sampleK]][rankK] = r[clusterK];
                        });
                    });
                    const chosenRank = this.data.ranks[0].text;
                    const data = Object.keys(this.data.clusterDict).map(k => this.data.clusterDict[k]);
                    this.data.clusters = Object.keys(_.groupBy(data, chosenRank));
                    return null;
                },
            },
        },
        setup() {
            setMainData(this.data.mainDict[this.data.rank], this);
            this.data.clusters.forEach((k, i) => {
                this.data.colors[k] = groupedChartColors[i];
            });
            generateLegendData(this);
            setFunctionSize(this);
            registerEditorConfig(editorConfig(this), editorRef);
        },
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerScatterplot() {
    register(MODULE_NAME, init);
}

export const setMainData = (d, v, xLabel?, yLabel?) => {
    v.data.axises = d.columns.slice(1).map(x => ({value: x, text: x}));
    const chosenX = xLabel || v.data.axises[0].value;
    const chosenY = yLabel || v.data.axises[1].value;
    v.data.xLabel = chosenX;
    v.data.yLabel = chosenY;
    v.data.scatterData = [];
    processRawData(d, v);
    v.data.data = {
        xLabel: v.data.xLabel, yLabel: v.data.yLabel,
        data: v.data.scatterData,
        valueRange: v.data.yRange,
        categoryRange: v.data.xRange,
    };
    v.data.samples =  d.map(x => x.sampleId);
};

const processRawData = (d, v) => {
    const xValues = [];
    const yValues = [];
    d.forEach(x => {
        const xValue = parseFloat(x[v.data.xLabel]);
        const yValue = parseFloat(x[v.data.yLabel]);
        const temp = {sampleId: x.sampleId,
            show: true,
            pos: xValue,
            value: yValue,
            // values: [xValue, yValue]
            cluster: v.data.clusterDict[x.sampleId][v.data.rank],
            group: v.data.groupDict[x.sampleId]};
        temp[v.data.xLabel] = xValue;
        temp[v.data.yLabel] = yValue;
        v.data.scatterData.push(temp);
        xValues.push(xValue);
        yValues.push(yValue);
    });
    v.data.xRange = findBoundsForValues(xValues, 2, false, 0.1);
    v.data.yRange = findBoundsForValues(yValues, 2, false, 0.1);
};

function setFunctionSize(v) {
    v.size.height = v.data.config.plotSize[1] + 100;
    v.size.width = v.data.config.plotSize[0] + 100;
};

export function generateLegendData(v) {
    const legends = [];
    const legendOpts = {
        padding: 5,
    };
    if (!!v.data.clusters) {
        v.data.config.colorGetter = (d) => v.data.colors[d.cluster];
        legends.push({
            title: "Cluster",
            data: v.data.clusters.map(d => ({label: d, fill: v.data.colors[d], type: "Circle"})),
            ...legendOpts,
        });
        if (!!v.data.groups) {
            legends.push({
                title: "Group",
                data: v.data.groups.map((d, i) => ({label: d, fill: "#aaa", type: shapes[i]})),
                ...legendOpts,
            });
        }
    }
    v.data.legends = legends;
}
