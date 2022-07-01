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


const MODULE_NAME = "static_comparedPlot";

import { registerDefaultBioInfoComponents } from "crux/dist/element/global";

registerDefaultBioInfoComponents();

export function init(id,path,type,eid,plot_name, vue_name){
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        theme: "light",
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
            plotType:type,
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
                type: "csv",
                url: path,
                loaded: plotDataloaded,
            },
        },
        setup() { 
            console.log("comparedPlot: this.data:",this["_data"]);
            processconfig(this)
            //registerEditorConfig(editorConfig(this,eid), vue_name, plot_name); //如果想要启用editor 请去掉这行代码的注释
        },
    })
}

export function processconfig(v){
    v.data.maxText>90? (v.data.config.gridheight = v.data.config.gridwidth = v.data.maxText + 16 ):null
    if(v.data.plotType=="pie"){
        v.size.height = v.data.config.gridheight*12 + 100
        v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxchosencelldatatextlength - 95.6
    }else{
        v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
        v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300 + v.data.maxsampletextlength - 77.77
    }
    v.data.BarData = v.data.BarData.slice(0,v.data.chosenMethod.length)
    v.data.PieData = v.data.PieData.slice(0,v.data.chosenMethod.length)
}






