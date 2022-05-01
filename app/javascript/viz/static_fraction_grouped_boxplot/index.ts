import Oviz from "crux";
import template from "./template.bvt";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import {register} from "page/visualizers";
import { findBoundsForValues } from "utils/maths";
import{ plotDataloaded } from "./data"
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";

const boxW = 6;
const gapRatio=0.3;
const MODULE_NAME = "static_immune_method-box";

const yLabel = "proportion"

registerDefaultBioInfoComponents();

export function init(id,path){
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        theme: "light",
        components: { GridPlot, EditText},
        data: {
            lineColor: "#666",
            legendPos: {x: 60, y: 50},
            //更新legend位置坐标的函数
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
            }
        },
        loadData: {
            comparedBox: {
                type: "csv",
                url: path,
                multiple: false,
                loaded: plotDataloaded,
            },
        },
        setup() { 
            processconfigData(this)
            console.log("this.data:",this["_data"]);
        },
    })
}

export function processconfigData(v) {
    const gridW = v.data.comparedBox.gridW =  ((v.data.comparedBox.boxW + 2) * v.data.comparedBox.methodData.length) / (1-v.data.comparedBox.gapRatio);
    v.data.comparedBox.plotSize[0] = v.data.comparedBox.categories.length * (gridW+2);
    v.size.width = v.data.comparedBox.plotSize[0]*1.1 + 100;
    v.size.height = v.data.comparedBox.plotSize[1] + 300;
    v.data.legendPos.x = v.data.comparedBox.plotSize[0]*1.005 + 30;
}