import Oviz from "crux"
import template from "./template.bvt"
import {register} from "page/visualizers";

import {groupBy, getGroups} from "utils/array"
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerEditorConfig } from "utils/editor";
import { groupedChartColors} from "oviz-common/palette";
import {DiverBoxPlot,diverplotDataProcess,datalogprocess} from "oviz-components/diverboxplot";
import { computeLog } from "utils/maths";
import { findBoundsForValues } from "utils/maths";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { generateDiverConfig } from "./editor";




const classifiedIndex = 0;
const valueRange = [2.5, 3.5];
const title = "grouped box plot"
//please change the displayed value range in the template by the prop: valueRange.
const MODULE_NAME = 'continuos-grouped-boxplot'
const boxW=5;
const gapRatio=0.05;
let valuemin;
let valuemax;
const ylabel = "Relative abundance(log10)";

interface BoxplotData {
    values: any[], 
    outliers: any[], 
    means: number[],
}

const myScheme = groupedChartColors;

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { GridPlot, ComplexBoxplot, EditText, DiverBoxPlot},
        data: {ylabel, valueRange, title,legendTitle: "Methods",lineColor: "#666",
            legendPos: {x: 60, y: 50},
            // 拖动更新legend位置的function 可以放进component.ts里
            updateLegendPos(ev, el, deltaPos) {
                this.legendPos.x += deltaPos[0];
                this.legendPos.y += deltaPos[1];
                this.redraw();
                
            },
            valuemin,
            valuemax,
            colors: myScheme,
            boxW,
            gapRatio,
        },
        loadData: {
            boxplotDataCont: {
                fileKey: "boxplotDataCont",
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    const groupKey = data.columns[0];
                    const valueKey = data.columns[1];
                    const catKey = data.columns[2];
                    const value=datalogprocess(data,valueKey,100)
                    const allvalues= value.map(x=>{
                        const num = parseFloat(x[valueKey]);
                        if (isNaN(num)) return Number(x[valueKey]);
                        return num;
                    });
                    //this.data.valueRange= findBoundsForValues(allvalues, 2, false);
                    this.data.valuemin=valueRange[0];
                    this.data.valuemax=valueRange[1];
                    const result = diverplotDataProcess(value, valueKey, groupKey, catKey);   
                    this.data.xTicks = [];
                    // // this is hardcoded due to xy plot bug
                    const boxData=result.boxData;
                    const boxData1=boxData.sort((a,b)=> - a.values.length - b.values.length);
                    this.data.boxData={}
                    boxData1.forEach((x, i) => {
                        this.data.boxData[`boxData${i}`] = x;
                    });
                    const classifications=result.classifications;
                    const categories=result.categories;

    
                    this.data.classifications = classifications;
                    this.data.categories = categories;
                    categories.filter((d, i, arr) => {
                        if (i === 0 || d % 10 === 0 || i === arr.length - 1)
                        this.data.xTicks.push({value: d, index: i});
                        return null;});
                    this.data.legendData = result.classifications.map((x, i) => {
                        return {type: "Custom", label: x, fill: myScheme[i]};
                    });
                },
            },
        },
        setup() {            
            this.data.plotWidth = 1000;
            processconfigData(this)
            registerEditorConfig(generateDiverConfig(this));
            console.log(this["_data"])
        },
    });
    
    return visualizer;
}

export function processconfigData(v) {
    console.log(v.data.classifications)
    const gridW = v.data.gridW =  ((v.data.boxW + 2) * v.data.classifications.length) / (1- v.data.gapRatio);
    v.data.plotWidth = v.data.categories.length * gridW;
    v.data.plotHeight=v.data.classifications.length* 200;
            // 以及定义了画布的宽度
    v.size.width = v.data.plotWidth + 150;
    v.size.height=v.data.plotHeight+500;
    // v.data.valueRange=[v.data.valuemin,v.data.valuemax];
}

register(MODULE_NAME, init);