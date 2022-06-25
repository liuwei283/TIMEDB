import Oviz from "crux";
import template from "./template.bvt";
import { register } from "page/visualizers";
import { ComplexHeatMap } from "oviz-components/complex-heatmap"; 
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

const MODULE_NAME = "CellCorrelation";

const startColor = "white";
const endColor = "red";
const negativeEndColor = "blue";

function init() {

    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { ComplexHeatMap },
        data: {
            config : {
                rotation : 0,
                valSize: 8,
                xPadding: 0,
                yPadding: 0,
                squareLength : 30,
                centered :false,
                showBar : false,
                showUpper: false,
                showLower: true,
                showVal : false,
                showCircle: false,
                showRowad: false,
                colorScheme: Oviz.color.schemeGradient(startColor, endColor),
                negColorScheme: Oviz.color.schemeGradient(negativeEndColor, startColor),
                startColor,
                endColor,
                nendColor: negativeEndColor
            },
            startX: 0, 
            startY: 0, 
            labelSize: 11, 
            squareLength: 30,
            groups: {
                colors :{
                    startColor,
                    endColor,
                    negativeEndColor: negativeEndColor
                }
            },
        },
        loadData: {
            CorrelationData: {
                fileKey: "correlation",
                type: "csv",
                loaded(data) {
                    // the data should dsvHasHeader
                    console.log(data)
                    let rowKey = "Row"
                    let colKey = "Col"
                    let valKey = "Value"
                    let pvalKey = "PValue"
                    let groupKey = "Group"
                    let rowNames = Array.from(new Set(data.map(d => d[rowKey])))
                    let colNames = Array.from(new Set(data.map(d => d[colKey])))
                    let group = Array.from(new Set(data.map(d => d[groupKey])))
                    let matrix = colNames.map(col => rowNames.map(row => 0))
                    let rMatrix = colNames.map(col => rowNames.map(row => 0))
                    console.log(rowNames)
                    console.log(colNames)
                    console.log(matrix)
                    console.log(rMatrix)
                    console.log(group)

                    console.log(data.length/rowNames.length/rowNames.length)
                    data.forEach((d, index) => {
                        let row = index%colNames.length
                        let col = Math.floor(index/colNames.length)%colNames.length
                        // console.log([row, col])
                        let val = parseFloat(d[valKey])
                        val = isNaN(val)? 0: val
                        let pval = parseFloat(d[pvalKey])
                        pval = isNaN(pval)? 0: pval
                        matrix[col][row] += val/(data.length/rowNames.length/rowNames.length)
                        rMatrix[col][row] += pval/(data.length/rowNames.length/rowNames.length)
                    })
                    this.data.valueRange = {negdataRange: [Math.min(...matrix.flat()), 0], dataRange: [0, Math.max(...matrix.flat())]}
                    return {rowNames, colNames, matrix, rMatrix}
                }
            }
        },
        setup() {
            this.defineGradient("bg", "vertical", [endColor, startColor]);
            this.defineGradient("ng", "vertical", [startColor, negativeEndColor]);
            console.log(this)
            registerEditorConfig(editorConfig(this, 1), "getVue", "#task-output");
        }
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerCellCorrelation() {
    register(MODULE_NAME, init);
}