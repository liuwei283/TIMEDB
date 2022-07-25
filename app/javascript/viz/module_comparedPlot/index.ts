import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerEditorConfig } from "utils/editor";
import { register } from "page/visualizers";
import { editorConfig} from"./editor";
//import { plotDataloaded,processconfig } from"./data";
import { plotDataloaded,checkIfNaN } from"./data";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";


const MODULE_NAME = "module_comparedPlot";

registerDefaultBioInfoComponents();



function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: {GridPlot},
        data: {
            buttonkey: 1,
            buttonclick(d){
                this.buttonkey = this.buttonkey + d;
                this.redraw();
            },
            config:{
                gridheight:98,
                gridwidth:98,
                padding:4,
            },
            plotType:"bar",
            findNA(sampleData){
                let num = 0,plot
                sampleData.forEach((item,index) => {
                    checkIfNaN(item["value"]) ? num = num +1:null
                });
                num == sampleData.length? plot = false:plot = true
                return plot
            }
        },
        loadData: {
            comparedData: {
                fileKey: "comparedData",
                type: "csv",
                loaded: plotDataloaded,
            },
            
        },
        setup() {
            console.log("comparedPlot: this.data:",this["_data"]);
            processconfig(this)
            registerEditorConfig(editorConfig(this),"getVue","#task-output");
        },
    });
    return visualizer;
}

register(MODULE_NAME, init);

export function registerModuleComparedPlot(){
    register(MODULE_NAME, init);
}


export function processconfig(v){
    v.data.maxText>90? (v.data.config.gridheight = v.data.config.gridwidth = v.data.maxText + 16 ):null

    if(v.data.plotType=="pie"){
        v.size.height = v.data.config.gridheight*12 + 100
        v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+3) + 300 + v.data.maxchosencelldatatextlength - 95.6
    }else{
        v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
        v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+3) + 300 + v.data.maxsampletextlength - 77.77
    }
    v.data.BarData = v.data.BarData.slice(0,v.data.chosenMethod.length)
    v.data.PieData = v.data.PieData.slice(0,v.data.chosenMethod.length)
}


