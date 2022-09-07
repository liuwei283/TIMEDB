import Oviz from "crux";
import { register } from "page/visualizers";
import template from "./template.bvt";
import { ComplexHeatMap } from "oviz-components/complex-heatmap";
import { DraggableContainer } from "oviz-components/draggable-container";
import { ComplexStackedBar } from "oviz-components/complex-stacked-bar";
import { EditText } from "oviz-components/edit-text";
import { CheckPoints } from "utils/general-classification";
import datasetModule from "crux/dist/rendering/vdom/modules/dataset";
import { PaginationContainer } from "oviz-components/pagination-container";
import { T, categoryMapper, nameMapper } from "utils/general-classification";
import { editorConfig } from "./editor";
import { registerEditorConfig } from "utils/editor";

const MODULE_NAME = "immunoRegulator";

const startColor = "white";
const endColor = "red";
const negativeEndColor = "blue";
const chosenIndexName = ["rhesus_brain", "mouse_liver"];
const chosenIndex = [null, null];
const chosenValue = 0.39;
const radius = 5;
const pivot = 0;

function init() {

    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { ComplexHeatMap, DraggableContainer, EditText, ComplexStackedBar, PaginationContainer },
        data: {
            chosenIndex, chosenValue, radius,
            highlightColor: "#6565bf",
            nameMapper,
            config : {
                pivot: pivot,
                rotation : 0,
                valSize: 8,
                squareLength : 15,
                centered :false,
                showBar : false,
                showUpper: true,
                showLower: true,
                showVal : false,
                xPadding: 5,
                yPadding: 5,
                showCircle: true,
                showRowad: false,
                colorScheme: Oviz.color.schemeGradient(startColor, endColor),
                negColorScheme: Oviz.color.schemeGradient(negativeEndColor, startColor),
                startColor,
                endColor,
                nendColor: negativeEndColor
            },
            startX: 150, 
            startY: 0, 
            width: 1550, 
            height: 500, 
            titleSize: 11, 
            labelSize: 11, 
            title: "", 
            ylabel: "", 
            xlabel: "", 
            plotRotation: 90, 
            xRotation: -150, 
            yRotation: 0,
            squareLength: 20,
            pKey: "P.Value",
            groups: {
                colors :{
                    startColor,
                    endColor,
                    negativeEndColor: negativeEndColor
                }
            },
            checkPointColor: Oviz.color.schemeCategory("light", CheckPoints),
            partition(item, matrix) {
                const stackedData = {pos: {}, neg: {}}
                item.colNames.forEach(col => stackedData.pos[col] = stackedData.neg[col] = 0)
                matrix.forEach(d => {
                    d.forEach( (val, col) => {
                        if(val < pivot) stackedData.neg[item.colNames[col]] += pivot - val;
                        if(val >= pivot) stackedData.pos[item.colNames[col]] += val - pivot;
                    })
                });
                stackedData.pos = Object.entries(stackedData.pos)
                stackedData.neg = Object.entries(stackedData.neg)
                return stackedData;
            }
        },
        loadData: {
            RNAdata: {
                fileKey: "data",
                // content: data,
                type: "csv",
                loaded(data) {
                    console.log("Data")
                    let groupKey = "Group";
                    let IDKey = "ID";
                    let vKey = "logFC"
                    let rF = "P.Value"
                    let rS = "adj.P.Val"
                    let rowNames = Array.from(new Set(data.map(d => d[groupKey])));
                    let givenGenes = Array.from(new Set(data.map(d => d[IDKey])))
                    console.log(rowNames)
                    const ret = {}
                    console.log(Object.entries(categoryMapper))
                    Object.entries(categoryMapper).forEach(([category, genes]) => {
                        let colNames = genes.filter((gene:string) => givenGenes.includes(gene) )
                        console.log(colNames)
                        ret[category] = {
                            matrix: [],
                            rMatrix: [],
                            rMatrixS: [],
                            rowNames: rowNames,
                            colNames: colNames,
                            stackedData: {},
                            config: this.data.config,
                        };
                        rowNames.forEach(row => {
                            ret[category].matrix.push(colNames.map(gene => data.filter(d => d[groupKey]==row&&d[IDKey] == gene).map(d => parseFloat(d[vKey]))[0] ));
                            ret[category].rMatrix.push(colNames.map(gene => data.filter(d => d[groupKey]==row&&d[IDKey] == gene).map(d => parseFloat(d[rF]))[0] ));
                            ret[category].rMatrixS.push(colNames.map(gene => data.filter(d => d[groupKey]==row&&d[IDKey] == gene).map(d => parseFloat(d[rS]))[0] ));
                        })
                    });
                    const maxs = [];
                    const mins = [];
                    Object.entries(ret).forEach(([key, item]) => {
                        maxs.push(Math.max(... item.matrix.flat().map(d => Math.max(d, pivot))));
                        mins.push(Math.min(... item.matrix.flat().map(d => Math.min(d, pivot))));
                    })
                    this.data.valueRange = {negdataRange: [Math.min(...mins), pivot], dataRange: [pivot, Math.max(...maxs)]}
                    console.log(ret)
                    return ret;
                },
            },
        },
        setup() {
            this.defineGradient("bg", "vertical", [endColor, startColor]);
            this.defineGradient("ng", "vertical", [startColor, negativeEndColor]);
            registerEditorConfig(editorConfig(this, 1), "getVue", "#task-output");
        },
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerimmunoRegulator() {
    register(MODULE_NAME, init);
}