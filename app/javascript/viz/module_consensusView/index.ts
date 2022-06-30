import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerEditorConfig } from "utils/editor";
import { register } from "page/visualizers";
import { editorConfig} from"./editor";
import { plotDataloaded,checkIfNaN } from"./data";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";
import { configlayout } from "./layout";


const MODULE_NAME = "module_consensusView";

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
            showbox:true,
            showpie:false,
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
            consensusView: {
                fileKey: "consensusView",
                type: "csv",
                loaded: plotDataloaded,
            },
            
        },
        setup() {
            console.log("comparedPlot: this.data:",this["_data"]);
            processconfig(this)
            configlayout(this.size.height,this.size.width,8)
            registerEditorConfig(editorConfig(this),"getVue","#task-output"); //如果想要启用editor 请去掉这行代码的注释
        },
    });
    return visualizer;
}

export function registerModuleConsensusView(){
    register(MODULE_NAME, init);
}
register(MODULE_NAME, init);

export function processconfig(v){
    v.size.width = 1400 + v.data.plotData.boxData.bwidth - 700 + 2*v.data.plotData.pieData.pr - 300
    v.size.height = 800 + v.data.plotData.boxData.bheight - 300 + 2*v.data.plotData.pieData.pr - 300
}

