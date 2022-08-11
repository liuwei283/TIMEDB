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
import{ plotDataloaded,clinicalDataloaded,extractWord, showAll, getMaxlength, butclick, getUpper, getGradientcolor, getPlotsize } from "./data"
import * as TextSize from "crux/dist/utils/text-size";

import { registerDefaultBioInfoComponents } from "crux/dist/element/global";

registerDefaultBioInfoComponents();

const dots_color = "blue";
const leftPadding = 200;
const legendLap = 20;

const title = "Clinical Data"

export function init(id,clinical_file_path,cellData_file_path,eid,plot_name,vue_name){
    //path1:cell Data
    //path2:Clinical Data
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        theme: "light",
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
                type: "csv",
                url: cellData_file_path,
                dsvHasHeader: true, 
                loaded:plotDataloaded
            },
            ClinicalData: {
              //Clinical
                url: clinical_file_path,
                type: "csv",
                dsvHasHeader:false,
                loaded:clinicalDataloaded
            }
        },
        setup() { 
            console.log("this.data:",this["_data"]);
            process(this)
            //registerEditorConfig(editorConfig(this), editorRef);
            registerEditorConfig(editorConfig(this,eid), vue_name, plot_name);
            
          },
    })
}

export function process(v){
  v.data.samplewidth = TextSize.measuredTextSize(v.data.sampleList[0],10)
  getGradientcolor(v)
  getPlotsize(v)
  v.data.textsampleList = v.data.sampleList.reverse()
}

