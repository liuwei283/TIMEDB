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


export function init(id, path) {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: {GridPlot},
        data: {
            buttonkey: 1, 
            buttonclick(d){
                this.buttonkey = this.buttonkey + d
                this.redraw()
            },
            config:{
                gridheight:120,
                gridwidth:120,
                padding:4,
            },
        },
        loadData: {
            comparedData: {
                fileKey: "comparedData",
                type: "csv",
                loaded: plotDataloaded,
            },
            clinicData:{
                fileKey:"clinicData",
                type:"csv",
                loaded(){}
            }
        },
        setup() {
            console.log("this.data",this["_data"]); 
            registerEditorConfig(generateDiverConfig(this));
        },
    });
    return visualizer;
}
register(MODULE_NAME, init);
