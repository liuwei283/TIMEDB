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
import{ plotDataloaded,clinicalDataloaded,extractWord, showAll, getMaxlength, getGradientcolor, getPlotsize, butclick, getUpper } from "./data"
import * as TextSize from "crux/dist/utils/text-size";

import { registerDefaultBioInfoComponents } from "crux/dist/element/global";

registerDefaultBioInfoComponents();

const dots_color = "blue";
const leftPadding = 200;
const legendLap = 20;

const title = "Clinical Data"

const MODULE_NAME = "Landscape_heatmap";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {
          leftPadding,
          legendLap,
          title,
          tips:[],
          dots_color,
          legendPos: {x: 0, y: 0},
          buttonkey:1,
          samplenameshow:false,
          samplewidth:null,
          maxsamplelength:0,
          samplenamerotation:45,
          buttonclick(d){
            butclick(this);
            this.redraw();
          },
          setPlot:false,
          replaceUpper(text,width){
            let final = getUpper(text,width)
            return final
          },
          clinicalDatashow:true,
          cacutextPos(text,fontsize,angle,x0,y0){
            let len = TextSize.measuredTextSize(text,fontsize).width
            let x1 = x0 - len*Math.cos((angle/180)*Math.PI)
            let y1 = y0 + len*Math.sin((angle/180)*Math.PI)
            return {x1:x1,y1:y1}
          },

        },
        loadData: {
            RNAData: {
                fileKey: "RNAData",
                type: "csv",
                dsvHasHeader:true,
                loaded:plotDataloaded
            },
            ClinicalData:{
                fileKey: "ClinicalData",
                type: "csv",
                dsvHasHeader:false,
                loaded:clinicalDataloaded
            },
        },
        setup() {
          console.log("LandScape Heatmap this.data:",this["_data"]);
          process(this)

          //registerEditorConfig(editorConfig(this));
          registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);
        },
    });

    return visualizer;
}

export function registerLandscapeHeatmap() {
  register(MODULE_NAME, init);
}

register(MODULE_NAME, init);

export function process(v){
  v.data.samplewidth = TextSize.measuredTextSize(v.data.sampleList[0],10)
  getGradientcolor(v)
  getPlotsize(v)
  v.data.textsampleList = v.data.sampleList.reverse()
}
