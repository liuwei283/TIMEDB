import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import {register} from "page/visualizers";
import {DiverBoxPlot,diverplotDataProcess} from "oviz-components/diverboxplot";
import { groupBy, getGroups } from "utils/array";
import { findBoundsForValues } from "utils/maths";

import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { ImportsNotUsedAsValues } from "typescript";

const boxW =10;
const yLabel = "Base Error";
const gapRatio=0.4;
const MODULE_NAME = "differential_test";
const myScheme = groupedChartColors;
function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { GridPlot, ComplexBoxplot, EditText, DiverBoxPlot},
        data: {
            plotHeight: 400,
            yLabel, legendTitle: "Methods",
            colors: myScheme,
            lineColor: "#666",
            legendPos: {x: 60, y: 50},
            // 拖动更新legend位置的function 可以放进component.ts里
            updateLegendPos(ev, el, deltaPos) {
                this.legendPos.x += deltaPos[0];
                this.legendPos.y += deltaPos[1];
                this.redraw();
            },
            boxW,
            drawViolin:false,
            drawBox:true,
            gapRatio,
        },
        loadData: {
            boxDiverMain: {
                fileKey: "boxDiverDiff",
                type: "tsv",
                loaded(data) {

                    const species = data.columns.slice(2);
                    const array = [];
                    data.forEach((row, i) => {
                        species.forEach(s => {
                            array.push({
                                sampleId: row[data.columns[0]],
                                group: row[data.columns[1]],
                                species: s,
                                abundance: row[s],
                            });
                        });
                    });
                    const allValues = array.map(x => {
                        const num = parseFloat(x.abundance);
                        if (isNaN(num)) return Number(x.abundance);
                        return num;
                    });
                    // console.log(allValues)
                    const result = diverplotDataProcess(array, "abundance", "group", "species");
                    const boxData1=result.boxData
                    // console.log(boxData1)
                    this.data.boxData = {};
                    boxData1.forEach((x, i) => {
                        this.data.boxData[`boxData${i}`] = x;
                    });
                    console.log(this.data.boxData)
                    this.data.valueRange = findBoundsForValues(allValues, 2, false);
                    this.data.classifications = result.classifications;
                    this.data.categories = result.categories;
                    this.data.legendData = result.classifications.map((x, i) => {
                        // const fillColor = Oviz.color.Color.literal(myScheme[i]);
                        return {type: "Custom", label: x, fill: myScheme[i]};
                            // stroke: gapRatiofillColor.darken(20).string
                    });
                    // console.log(this.data.categories)
                    return null;
                },
            },
        },
        setup() {
            // 在这边计算了箱子的宽度，每个category格子的宽度，xy-plot的width
            processconfigData(this)
        },
    });

    return visualizer;
}
export function processconfigData(v) {
    const gridW = v.data.gridW =  ((v.data.boxW + 2) * v.data.classifications.length) / (1-gapRatio);
    v.data.plotWidth = v.data.categories.length * gridW;
    // v.data.plotHeight= v.data.classifications.length* 50;
            // 以及定义了画布的宽度
    v.size.width = v.data.plotWidth + 300;
    v.size.height=v.data.plotHeight+300;
}
register(MODULE_NAME, init);