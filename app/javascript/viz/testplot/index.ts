import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";
//import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { GridPlot } from "oviz-components/grid-plot";
import { EditText } from "oviz-components/edit-text";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import {ThreeDNA} from "./three-DNA";
import { array } from "crux/src/rendering/vdom/is";
import { findBoundsForValues } from "./maths";
import { XYPlotOption} from "crux/dist/element";
import {ComplexScatterplot} from "oviz-components/complex-scatterplot"
import { ScatterBoxPlot } from "viz/scatter-box-plot/scatter-box-plot";


const groupedChartColors = [

    "#f79256", "#60A5FA", "#A3A3A3", "#00b2ca", "#2563EB","#744DA9"
    ];
const  sigChartColors = [

    "#f79256", "#7C3AED", "#7dcfb6", "#FDE047", "#2563EB","#EF4444"
    ];
const groupedDeeperColors=[
    "#F7630C","#1D4ED8","#44403C"
]

const MODULE_NAME = "testplot";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { GridPlot, EditText, ThreeDNA,ComplexScatterplot},
        data: {
            config:{
                plotSize: [300, 700],
                holloBox: false,
                xAxisRotated: true,
                showOutliers:true,
                labelFontSize: 12, 
                labelOffsetVer: 30, 
                tickFontSize: 12, 
            },
            sigData:null,
            stackedData:null,
            treedata:null,
            scatterData:null,
            markedDots:null,
            markDots(d){
                this.markedDots = d
                this.redraw();
            }
        },
    
        loadData: {
            sigData: {
                fileKey: "testdata", 
                type: "json", 
                dsvHasHeader: false, 
                loaded(d) { 
                    console.log("d",d)
                    let Samples =[]
                    d.forEach((item,index) => {
                        Samples.push(item.sampleId)                       
                    });
                    this.data.sigData.yLabel = "Type";
                    this.data.sigData.xLabel = "Abundance";
                    const categories = [];
                    const result = [];
                    const classifications = [];
                    const colorMap = {};
                    Samples.forEach((item,index) => {
                        const allValues = []
                        const results = []
                        const legend =[]
                        d.forEach((litem,lindex)=> {
                            if(litem.sampleId==item){
                                Object.entries(litem.result).forEach(([k, d], i) => {
                                    if(index==0)
                                        classifications.push(k);
                                        console.log(classifications)
                                    Object.entries(litem.result[k]).forEach(([k0, d0]) => {
                                        const val = parseFloat(d0);
                                        allValues.push(val);
                                        results.push({mut: k, codon: k0, pos: `${k}:${k0}`,
                                            id: `${k}:${k0}`, value: d0});
                                    });
                                    colorMap[k] = sigChartColors[i];
                                    legend.push({label: k, fill: sigChartColors[i], stroke: "#666"});
                                });    
                            }
                            
                        });
                        console.log(allValues)
                        let valueRange= findBoundsForValues(allValues,2,false,0)
                        valueRange[1]= findBoundsForValues(allValues,2,false,0)[1]+3
                        result.push({sampleID:item,Values:{legendData:legend,result:results,colorMap:colorMap,valueRange:valueRange,sampleID:item}})
                    });

                    this.data.sigData.result = result;
                    this.data.sigData.classifications = classifications;    
                    
                },
            },
            stackedData:{
                fileKey: "stackeddata", 
                type: "json",
                loaded(d){
                    const colorMap = {};
                    const colordeeperMap = {};
                    const legend=[]
                    const legendmarked=[]
                    const allvalues=[]
                    const allsubvalues=[];
                    const valueRange =[];
                    const species = Object.keys(d)
                    const columns = Object.keys(d[species[0]])
                    let Stacked = {}
                    species.forEach((sitem,sindex)=>{
                        let all=0
                        columns.forEach((citem,cindex)=> {
                            all += parseFloat(d[sitem][citem])
                            allsubvalues.push(parseFloat(d[sitem][citem]))
                        });
                        allvalues.push(all)
                    })
                    valueRange[1] = findBoundsForValues(allvalues,0,false,0)[1]+5000;//This is hoping to leave a blank at the bar top;
                    valueRange[0] = findBoundsForValues(allsubvalues,0,false,0)[0]>0?0:findBoundsForValues(allsubvalues,0,false,0)[0];//This is to fix the bug from maths.ts;
                    columns.forEach((item,index) => {
                        let eachcolvalue = []
                        colorMap[item] = groupedChartColors[index];
                        colordeeperMap[item] = groupedDeeperColors[index];
                        legend.push({label: item, fill: groupedChartColors[index], stroke: "#666"});
                        legendmarked.push({label: item, fill: groupedDeeperColors[index], stroke: "#666"});
                        species.forEach((sitem,sindex) => {
                            const array =[]
                            array.push(sitem)
                            array.push(d[sitem][item])
                            eachcolvalue.push(array) 
                        });
                        Stacked[item]=eachcolvalue
                    });
                    this.data.stackedData.classifications = columns
                    this.data.stackedData.data = Stacked
                    this.data.stackedData.colorMap = colorMap
                    this.data.stackedData.legendData = legend
                    this.data.stackedData.valueRange = valueRange
                    this.data.stackedData.markedlegendData = legendmarked
                    this.data.stackedData.markedColorMap = colordeeperMap

                }
            },
            treedata:{
                type: "newick",
                fileKey: "treedata",
                loaded(d){
                }
            },
            scatterData:{
                fileKey: "scatterData", 
                type: "json",
                loaded(d){
                    const species = Object.keys(d)
                    const result=[]
                    const allvalues=[]
                    species.forEach((item,index)=>{
                        const eachvalue= parseFloat((d[item]["dn"]/d[item]["ds"]).toFixed(2))
                        const obj = {key:item,value:eachvalue}
                        allvalues.push(eachvalue)
                        result.push(obj)
                    })
                    let valueRange = findBoundsForValues(allvalues,0,false,0);
                    
                    this.data.scatterData.data=result
                    this.data.scatterData.valueRange=valueRange
                    this.data.scatterData.categories=species
                    this.data.scatterData.categoryRange=species

                }
            }

        },
        setup() {
            console.log(this["_data"]);

        },
    });

    return visualizer;
}

register(MODULE_NAME, init);

