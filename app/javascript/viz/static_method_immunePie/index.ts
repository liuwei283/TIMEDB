import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";
import{ pieDataloaded } from "./data"

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { PieChart } from "crux/dist/element";
//import { chooseMethod } from "viz/comparedBar2";
import { isThisTypeNode } from "typescript";


import { registerDefaultBioInfoComponents } from "crux/dist/element/global";

registerDefaultBioInfoComponents();

export function init(id,path,config,eid,plot_name){
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        width:1000,
        height:870,
        theme: "light",
        data: {
            buttonkey: 0,
            buttonclick(d){
                this.buttonkey = d;
                console.log("buttonkey:",this.buttonkey);
                this.redraw();
            },
            legendPos: {x: 840, y: 20},
            updateLegendPos(ev, el, deltaPos) {
                this.legendPos.x += deltaPos[0];
                this.legendPos.y += deltaPos[1];
                console.log("yes!")
                this.redraw();
            },
        },
        loadData: {
            pieData: {
                type: "tsv",
                url: path,
                multiple: false,
                loaded: pieDataloaded,
            },
        },
        setup() { 
            console.log("this.data:",this["_data"]);
            // this.data.methodList = this.data.methodList.slice(5)
            // process(this)
            //registerEditorConfig(editorConfig(this), editorRef);
            //registerEditorConfig(editorConfig(this,eid), plot_name);
        },
    })
}
