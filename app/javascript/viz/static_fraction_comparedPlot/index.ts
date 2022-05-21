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

registerDefaultBioInfoComponents();

export function init(id,path,type,eid,plot_name){
    console.log("comparedPlot start___________!!!")
    console.log("type:",type)
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        theme: "light",
        data: {
            buttonkey: 1,
            buttonclick(d){
                this.buttonkey = this.buttonkey + d;
                console.log("buttonkey",this.buttonkey)
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
            registerEditorConfig(editorConfig(this,eid), plot_name); //如果想要启用editor 请去掉这行代码的注释
        },
    })
}

export function processconfig(v){
    if(v.data.plotType=="pie"){
        v.size.height = v.data.config.gridheight*12 + 100
        v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
    }else{
        v.size.height = v.data.config.gridheight* (v.data.celldata.length+2) + 100
        v.size.width = v.data.config.gridwidth * (v.data.chosenMethod.length+1) + 300
    }
}






