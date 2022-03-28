import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerEditorConfig } from "utils/editor";
import { register } from "page/visualizers";
import { generateDiverConfig } from"./editor";
import { plotDataloaded } from"./data";


const MODULE_NAME = "static_comparedPlot";

import { registerDefaultBioInfoComponents } from "crux/dist/element/global";

registerDefaultBioInfoComponents();

export function init(id,path,type){
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        width:2000,
        height:5000,
        theme: "light",
        data: {
            buttonkey: 1,
            buttonclick(d){
                this.buttonkey += d;
                console.log("buttonkey:",this.buttonkey);
                this.redraw();
            },
            config:{
                gridheight:94,
                gridwidth:94,
                padding:4,
            },
            plotType:type
            //type = "bar" or "pie"
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
            //registerEditorConfig(editorConfig(this), editorRef);
        },
    })
}





