import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerEditorConfig } from "utils/editor";
import {register} from "page/visualizers";
import {DiverBoxPlot,diverplotDataProcess} from "oviz-components/diverboxplot";
import { groupBy, getGroups } from "utils/array";
import { findBoundsForValues } from "./math";
import { createCallSignature, isJSDocThisTag, isTemplateExpression } from "typescript";
import { currentEventContext } from "crux/src/event";
import { NAME } from "crux/src/template/compiler/tokens";
import * as TextSize from "crux/dist/utils/text-size";
import { parseData } from "crux/dist/element";


export const mainlayout = {

}

export function configlayout(svgheight,svgwidth,n,padding = 10){
    // n => 2
    // n => 4
    // n => 9
    // 以正方形为优先值
    let row = Math.sqrt(n).toFixed(0)
    console.log("row:",row)

    //计算各个坐标点
    for(let i; i<n; i++){
        console.log(i)
        let innerheight = (svgheight-(n+1)*padding)/parseFloat(row)
        console.log("innerheight:",innerheight)
    }
    // svgheight-10

}