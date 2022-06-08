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
import{ plotDataloaded,clinicalDataloaded,extractWord} from "./data"
import {showAll} from "./data"
import * as TextSize from "crux/dist/utils/text-size";

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
          buttonclick(d){
            //console.log("ori:",this.buttonkey)
            this.buttonkey = this.buttonkey*(-1);
            //console.log("new:",this.buttonkey)
          
          
            let config = showAll(this.oridata,this.buttonkey)
            //console.log("config:",config)
            this.result.stackescolors = config["result"].stackescolors
            this.cellList = config["cellList"]
            this.result.useData = config["result"].useData
            this.sampleList = config["sampleList"]
            this.gridPlotWidth = config["gridPlotWidth"]
            this.result.result = config["result"].result
            this.result.classifications =  config["result"].classifications
            this.result.colorMap = config["result"].colorMap
            this.result.columns = config["result"].columns
            this.result.boxdata = config["result"].boxdata
            this.$v.size.width = this.result.useData[this.sampleList.length-1].col*(this.gridPlotWidth-1) + 450
            this.$v.size.height = this.cellList.length *12 + 170 + 
                            this.cellList.length*(this.gridPlotheight) + this.gridPlotheight/2
                            + (this.sortaddName.length-1) * this.gridPlotheight 
                            + 50
          

          
          
          console.log("this:",this)
          //console.log("buttonkey",this.buttonkey)
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
          x>width*6/7? (final = extractWord(text),this.tips.push(text)):final = text
          this.tips = Array.from(this.tips)
          return final
        },
        join(tiplist){
          let str = []
          tiplist = Array.from(tiplist)
          tiplist = Array.from(new Set(tiplist))
          tiplist.forEach((item,index)=>{
            str.push(" "+extractWord(item)+": "+item)
          })
          //console.log(str)
          str = Array.from(str)
          return str
        }
         
        },
        loadData: {
            result: {
                fileKey: "immuneheatmapMain", 
                type: "csv", 
                dsvHasHeader: true, 
                loaded:plotDataloaded
            },
            additional: {
              fileKey: "immuneheatmapAdd",
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
          this.size.width = this.data.result.useData[this.data.sampleList.length-1].col*(this.data.gridPlotWidth-1) + 450
          this.size.height = this.data.cellList.length *12 + 170 + 
                            this.data.cellList.length*(this.data.gridPlotheight) + this.data.gridPlotheight/2
                            + (this.data.sortaddName.length-1) * this.data.gridPlotheight 
                            + 50
          registerEditorConfig(editorConfig(this), editorRef);
      

        },
    });

    return visualizer;
}

export function registerLandscapeHeatmap() {
    register(MODULE_NAME, init);
}

register(MODULE_NAME, init);



