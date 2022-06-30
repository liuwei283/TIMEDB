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
import{ plotDataloaded,clinicalDataloaded,extractWord, showAll, getMaxlength } from "./data"
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
          buttonclick(d){
            this.buttonkey = this.buttonkey*(-1);
            let config = showAll(this.oridata,this.buttonkey)
            this.RNAData.stackescolors = config["result"].stackescolors
            this.cellList = config["cellList"]
            this.RNAData.useData = config["result"].useData
            this.sampleList = config["sampleList"]
            this.gridPlotWidth = config["gridPlotWidth"]
            this.RNAData.result = config["result"].result
            this.RNAData.classifications =  config["result"].classifications
            this.RNAData.colorMap = config["result"].colorMap
            this.RNAData.columns = config["result"].columns
            this.RNAData.boxdata = config["result"].boxdata
            this.$v.size.height = this.cellList.length *12 + 170 + 
                            this.cellList.length*(this.gridPlotheight) + this.gridPlotheight/2
                            + (this.sortaddName.length-1) * this.gridPlotheight 
                            + 30
                            + this.tipsrow*7
          this.redraw();
          },
          updateLegendPos(ev, el, deltaPos) {
            this.legendPos.x += deltaPos[0];
            this.legendPos.y += deltaPos[1];
            this.redraw(); 
          },
          AcitiveDots:{
            index:null,
            number:null,
            rank:null
          },
          setPlot:false,
          setActive(x: number|string,y: number = null){
            if(typeof x=== "string"){
              const xPos = this.sampleList.indexOf(x)*(this.gridPlotWidth-2)+ 300
              this.setState({activeX: xPos});
              this.setPlot = true
            }else{this.setState({activeX: x, activeY:y})}
          },
          replaceUpper(text,width){
            let x = TextSize.measuredTextSize(text, 8).width;
            let final
            x>width*6/7? (final = extractWord(text,width),this.tips.push(text)):final = text
          
            this.tips = Array.from(this.tips)
            return final
          },
          join(tiplist,width){
            let str = []
            tiplist = Array.from(tiplist)
            tiplist = Array.from(new Set(tiplist))
            let textlength = []
            tiplist.forEach((item,index)=>{
              str.push(" "+extractWord(item,width)+": "+item)
              textlength.push(TextSize.measuredTextSize("* " +" "+extractWord(item,width)+": "+item,8).width)
            })
            let maxtextlength = Math.max(...textlength) + 60
            maxtextlength>this.$v.size.width? this.$v.size.width = maxtextlength:null
            str = Array.from(str)
            return str
          }
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

            this.defineGradient("gb", "vertical", [this.data.gbendColor, this.data.gbstartColor]);
            this.defineGradient("kg", "vertical", ["#dbdbdb", "blue"]);
            this.defineGradient("age", "horizontal", [this.data.ageStartColor, this.data.ageEndColor]);
            const padding = 60; 
            this.data.padding = padding;
            this.size.width = this.data.RNAData.useData[this.data.sampleList.length-1].col*(this.data.gridPlotWidth-1) + 330 + getMaxlength(this)
            this.size.height = this.data.cellList.length *12 + 170 + 
                              this.data.cellList.length*(this.data.gridPlotheight) + this.data.gridPlotheight/2
                              + (this.data.sortaddName.length-1) * this.data.gridPlotheight 
                              + 30
                              + this.data.tipsrow*7
                              
            //registerEditorConfig(editorConfig(this), editorRef);
            registerEditorConfig(editorConfig(this,eid), vue_name, plot_name);
            
          },
    })
}


