import Oviz from "crux";
import template from "./template.bvt";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import {register} from "page/visualizers";
import { findBoundsForValues } from "utils/maths";
import{ plotDataloaded } from "./data"
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";
import { registerEditorConfig } from "utils/editor";
import { editorConfig, editorRef } from "./editor";


registerDefaultBioInfoComponents();

export function init(id,path,eid,plot_name, vue_name){
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        theme: "light",
        components: { GridPlot, EditText},
        data: {
            lineColor: "#666",
            xlabelFontsize: 12,
            legendPos: {x: 60, y: 50},
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
            getIndex(arr,item){
                let index
                arr.forEach((m,n) => {
                    item == m ? index = n:null
                });
                return index
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
            //registerEditorConfig(editorConfig(this,eid),vue_name, plot_name);
        },
    })
}


export function processconfigData(v) {
    const gridW = v.data.comparedBox.gridW =  ((v.data.comparedBox.boxW + 2) * v.data.comparedBox.methodData.length) / (1-v.data.comparedBox.gapRatio);
    v.data.comparedBox.plotSize[0] = v.data.comparedBox.categories.length * (gridW+2);
    v.size.width = v.data.comparedBox.plotSize[0]*1 + 250;
    v.size.height = v.data.comparedBox.plotSize[1] + 200;
    v.data.legendPos.x = 0;
}


