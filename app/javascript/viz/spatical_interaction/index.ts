import Oviz from "crux";

import { editorConfig, editorRef } from "./editor";
import { SpaticalInteraction } from "./spatical_interaction";
import * as d3 from "d3";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { ComplexScatterplot } from "oviz-components/complex-scatterplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { groupedChartColors } from "oviz-common/palette";
import { register } from "page/visualizers";
import { rankDict, sortByRankKey} from "utils/bio-info";
import DataUtils from "utils/data";
import { registerEditorConfig } from "utils/editor";
import { findBoundsForValues } from "utils/maths";
import * as TextSize from "crux/dist/utils/text-size";

//import { minmax } from "crux/dist/utils/math";
import { brewPalette, MetaInfo } from "viz/meta-overview/data";
import { Rows } from "crux/dist/element";
import { mapColor } from "./spatical_data";


const MODULE_NAME = "spatical_interaction";


function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        //root:new SpaticalInteraction(),
        root: new SpaticalInteraction(),
        //template,
        components: {GridPlot, EditText},
        renderer: "svg",
        width: 1300,
        height: 700,
        
        data: {
            hiddenSamples: new Set(),
            gridSize: [4, 12],
            tempFeature:"c_tumor_stage",
            colors: {
                // control: controlGroupColors[0],
                // gout: controlGroupColors[1],
                na: "#999", //"#777",
                abd0: "#999", // "#333",
                // start: "#fff7f3",
                // end: "#0A2299",
                start: "#800000",
                org: "#FF5050",
                end: "#FFFF00",
            },
            drawTree: false,
            getR(text){
                let textlength = TextSize.measuredTextSize(text, 8).width;
                return textlength*5/8
            }
        },
        loadData: {
            graphData: {
                fileKey: "graphData",
                type: "csv",
                loaded(data) {
                    //设置第一幅图的点的大小 根据P值改变
                    console.log("graphData:",data)
                    let pValue = [1,0.180058736,0.438484609,0.093095968,0.060386346,0.101205517,0.409336727,0.035703033]
                    let nodeR = pValue.map(d => 5 +d*10)
                    this.data.nodeR = nodeR
                    console.log("nodeR:",nodeR)
                    this.data.nodeRadius = 5
                    this.data.graphRadius = 150
                    //let selectedFeature = []
                    
                    let newlabel = data.map(d=>d.Row)
                    let featurelist = getCol(data,"Feature")




                    newlabel = Array.from(new Set(newlabel))
                    console.log("newlabel:",newlabel)
                    this.data.newlabel=newlabel
                    this.data.colorMap = {}
                    this.data.features = []
                    this.data.feaMapgroup = {}
                    this.data.congroup = {}
                    this.data.newlabel.forEach((item,index) => {
                        this.data.colorMap[item] = mapColor(item)
                    });
                    featurelist.forEach((item,index) => {
                        this.data.features.push(item)
                        this.data.feaMapgroup[item] = []
                        this.data.congroup[item] = []
                        data.forEach((ditem,dindex) => {
                            if(ditem["Feature"]==item&&ditem["Value"]!="NA"){
                                this.data.feaMapgroup[item].push(ditem["Group"])
                                this.data.feaMapgroup[item] = Array.from(new Set(this.data.feaMapgroup[item]))
                            }
                        });
                    });
                    featurelist.forEach((item,index) => {
                        this.data.feaMapgroup[item].forEach((ditem,dindex) => {
                            this.data.congroup[item].push({value:ditem+"",text:ditem})
                        });
                    });
                    console.log("this.data.feaMapgroup:",this.data.feaMapgroup)
                    console.log("this.data.congroup:",this.data.congroup)
                    console.log("this.data.colorMap:",this.data.colorMap)
                    console.log("this.data.features:",this.data.features)

                    this.data.selectedFeature = "c_tumor_stage"
                    this.data.selectedGroup = "Stage I"
                    
                    let config = {
                        features:this.data.features,
                        groups:this.data.congroup[this.data.selectedFeature],
                        selectedFeature:"c_tumor_stage",
                        selectedGroup:"Stage I",
                        temp:null,
                    }
                    this.data.text = "groups"

                    
                    this.data.config = config
                    


                    
                }
            }
        },
        setup() {
            console.log("this.data",this["_data"]); 
            registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);
            //registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);

        },
    });
    return visualizer;
}
register(MODULE_NAME, init);

export function registerSpaticalInteraction() {
    register(MODULE_NAME, init);
}

export function getCol(data,index){
    let result = []
    data.forEach(item => {
        item.Value == "NA"? null:result.push(item[index])
    });
    result = Array.from(new Set(result))
    return result
}
