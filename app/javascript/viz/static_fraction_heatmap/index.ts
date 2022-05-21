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
import{ plotDataloaded,clinicalDataloaded,extractWord } from "./data"
import * as TextSize from "crux/dist/utils/text-size";

import { registerDefaultBioInfoComponents } from "crux/dist/element/global";

registerDefaultBioInfoComponents();

const dots_color = "blue";
const leftPadding = 200;
const legendLap = 20;

const title = "Clinical Data"

export function init(id,clinical_file_path,cellData_file_path,eid,plot_name){
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
          setActive(data,rank){
            this.AcitiveDots.number=data[1];
            this.AcitiveDots.index=data[0];
            this.AcitiveDots.rank=rank;
            this.redraw();
          },
          replaceUpper(text,width){
            let x = TextSize.measuredTextSize(text, 8).width; //得到字的长度
            //console.log(x)
            let final
            x>width*2/3? (final = extractWord(text),this.tips.push(text)):final = text
            //console.log(this.tips)
            return final
          },
          join(tiplist){
            let str = []
            tiplist.forEach((item,index)=>{
              str.push(" "+extractWord(item)+": "+item)
            })
            //console.log(str)
            return str
          }
        },
        loadData: {
            result: {
                type: "csv",
                url: cellData_file_path,
                dsvHasHeader: true, 
                loaded:plotDataloaded
            },
            additional: {
              //Clinical
                url: clinical_file_path,
                type: "csv",
                dsvHasHeader:false,
                loaded:clinicalDataloaded
            }
        },
        setup() { 
            console.log("this.data:",this["_data"]);
            this.defineGradient("bg", "vertical", [this.data.bgstartColor, this.data.bgendColor]);
            this.defineGradient("gb", "vertical", [this.data.gbendColor, this.data.gbstartColor]);
            this.defineGradient("age", "horizontal", [this.data.ageStartColor, this.data.ageEndColor]);
            const padding = 60;
            this.data.padding = padding;
            this.size.width = this.data.result.useData[this.data.sampleList.length-1].col*(this.data.gridPlotWidth-1) + 380
            this.size.height = this.data.cellList.length *15 + 170 + 
                              this.data.cellList.length*(this.data.gridPlotheight) + this.data.gridPlotheight/2
                              + (this.data.sortaddName.length-1) * this.data.gridPlotheight 
                              + 50
            //registerEditorConfig(editorConfig(this), editorRef);

            if(this.data.dismethodlist.length>1){
              this.data.stackdis = this.data.result.useData[this.data.sampleList.length-1].col*(this.data.gridPlotWidth-1.6) - 5 -115
              this.data.middleTextdis = this.data.result.useData[this.data.sampleList.length-1].col*(this.data.gridPlotWidth-1.6) - 5 + 35
            }else{
              this.data.stackdis = this.data.result.useData[this.data.sampleList.length-1].col*(this.data.gridPlotWidth)
              this.data.middleTextdis = this.data.result.useData[this.data.sampleList.length-1].col*(this.data.gridPlotWidth)
            }

            registerEditorConfig(editorConfig(this,eid), plot_name);
        },
    })
}


