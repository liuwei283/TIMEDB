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
import { isJSDocThisTag } from "typescript";


const boxW =10;
const yLabel = "Base Error";
const gapRatio=0.4;
const MODULE_NAME = "comparedBox";
const myScheme = groupedChartColors;
let pDict;
const pposition={};
let min,max;
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
            pDict,
            pposition,
        },
        loadData: {
            comparedBox: {
                fileKey: "comparedBox",
                type: "csv",
                loaded(data) {
                    console.log(data)
                    let columns=data.columns;
                    columns = columns.slice(0,-3)
                    console.log(columns)
                    this.data.pDict={};
                    let praw= data
                    praw=praw[0];
                    console.log("praw=",praw)
                    //data=data.slice(0,-3);
                    data.columns=columns;
                    const species = data.columns.slice(2);
                    const speciesraw=species.map((item,index)=> {
                        const words = item.split('_');
                        return(words[words.length-1])
                    });
                    //console.log("species",species)

                    //get boxdata
                    const array = [];
                    data.forEach((row, i) => {
                        species.forEach(s => {
                            const words = s.split('_');
                            array.push({
                                sampleId: row[data.columns[0]],
                                group: row[data.columns[1]],
                                species: words[words.length-1],
                                abundance: row[s],
                            });
                        });
                    });
                    console.log("species",array)
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
                    this.data.valueRange = findBoundsForValues(allValues, 2, false);
                    this.data.classifications = result.classifications;
                    this.data.categories = result.categories;
                    this.data.legendData = result.classifications.map((x, i) => {
                        // const fillColor = Oviz.color.Color.literal(myScheme[i]);
                        return {type: "Custom", label: x, fill: myScheme[i]};
                            // stroke: gapRatiofillColor.darken(20).string
                    });
                    //get p
                    this.data.pDict=this.data.categories.map((item,index) => {
                        const eachpvalue = parseFloat(praw[species[index]]);
                        const [cat1,cat2] = [item,item];
                        const pos1 = this.data.categories.indexOf(cat1);
                        const pos2 = this.data.categories.indexOf(cat2);
                        const results={source: cat1, target: cat2, eachpvalue,
                            sourcePos: pos1, targetPos: pos2};
                        return results;
                    });
                    this.data.categories.forEach((x, i) =>{
                        boxData1.forEach((item,index) =>{
                            const stat1 = new Oviz.algo.Statistics(boxData1[index].values[i]);
                            console.log("10min",item,index,stat1.max())
                            if (index == 0){
                                min = stat1.min();
                                max = stat1.max();
                            }if(stat1.min() < min) {
                                min = stat1.min();
                            }
                            if(stat1.max() > max) {
                                max = stat1.max();
                                console.log("yyyy");}
                            });
                            console.log("max",max);
                            pposition[x]=max;
                    });
                    this.data.pposition=pposition;

                    
                    console.log("pposition",this.data.pposition)
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