import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";
import { findBoundsForValues } from "utils/maths";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { PieChart } from "crux/dist/element";
//import { chooseMethod } from "viz/comparedBar2";
import { isThisTypeNode } from "typescript";
import{ plotDataloaded } from "./data"
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";


const MODULE_NAME = "static_method_immuneBox";

const title = "Proportion of Immune Cells for Each Sample";
const xlabel = "";
const ylabel = "Proportion"; 


registerDefaultBioInfoComponents();

export function init(id,path,eid,plot_name, vue_name){
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        // width:1100,
        // height:600,
        theme: "light",
        data: {
            title,
            xlabel,
            ylabel,
        },
        loadData: {
            comparedBox: {
                type: "csv",
                url: path,
                multiple: false,
                loaded:plotDataloaded
            },
        },
        setup() { 
            console.log("this.data:",this["_data"]);
            this.size.width = this.data.plotSize[0] + 100
            this.size.height = this.data.plotSize[1] + 100 
            registerEditorConfig(editorConfig(this,eid), vue_name, plot_name);
        },
    })
}


