import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerEditorConfig } from "utils/editor";
import { register } from "page/visualizers";
import { generateDiverConfig } from"./editor";
import { plotDataloaded,processconfig } from"./data";


const MODULE_NAME = "static_comparedPlot";

import { registerDefaultBioInfoComponents } from "crux/dist/element/global";

registerDefaultBioInfoComponents();

export function init(id,path,type="pie"){
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        theme: "light",
        data: {
            buttonkey: 1,
            buttonclick(d){
                this.buttonkey = d;
                this.redraw();
            },
            config:{
                gridheight:98,
                gridwidth:98,
                padding:4,
            },
            plotType:type
        },
        loadData: {
            comparedData: {
                type: "csv",
                url: path,
                loaded: plotDataloaded,
            },
        },
        setup() { 
            console.log("this.data:",this["_data"]);
            processconfig(this)
            //registerEditorConfig(editorConfig(this), editorRef);
        },
    })
}






