import Oviz from "crux";
import template from "./template.bvt"
import { editorConfig } from "./editor";
import { registerEditorConfig } from "utils/editor";

import {register} from "page/visualizers";
import {findBound} from "utils/maths";
import {minmax} from "crux/dist/utils/math"
import {signedChartColors} from "oviz-common/palette";


const MODULE_NAME = 'signed-barchart'

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        theme: "light",
        data: {
            colors: {
                ...signedChartColors,
            },
            config : {
                plotHeight: 600,
                plotWdith: 400,
                barWidth: 15,
            }
        },
        loadData:  {
            barchartData: {
                fileKey: `barchartData`,
                type: "tsv" ,
                dsvRowDef: {Zscore: ["float"]},
                loaded(data) {
                   const valueRange = minmax(data, "Zscore");
                   const lowerBound = -findBound(valueRange[0]*-1,0,1);
                   const upperBound = findBound(valueRange[1],0,1);
                   this.data.axisPos = -lowerBound/(upperBound - lowerBound)
                   this.data.plotHeight = 15 * data.length;
                   this.data.bounds = {lowerBound, upperBound};
                },
            },
        },
        setup() {
            this.data.plotHeight = this.data.config.plotHeight;
            this.data.plotWidth = this.data.config.plotWidth;
            registerEditorConfig(editorConfig(this));
        }
        
    });
    return visualizer;
}


register(MODULE_NAME, init);
