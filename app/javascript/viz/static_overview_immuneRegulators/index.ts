import Oviz from "crux";
import template from "./template.bvt";
import { ComplexHeatMap } from "oviz-components/complex-heatmap";
import { C16Classifier, RNAProcessor } from "utils/general-classification";
import { nameMapper, CheckPoints } from "utils/general-classification";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

const startColor = "white";
const endColor = "red";
const negativeEndColor = "blue";

export function init(vid, subtypePath, RNAdataPath, eid, plot_name, vue_name) {

    const {visualizer} = Oviz.visualize({
        el: vid,
        template,
        components: { ComplexHeatMap },
        data: {
            config : {
                rotation : 0,
                valSize: 8,
                xPadding: 0,
                yPadding: 0,
                squareLength : 20,
                centered :false,
                showBar : false,
                showUpper: true,
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
            startX: 100, 
            startY: 15, 
            width: 1550, 
            height: 500, 
            titleSize: 11, 
            labelSize: 11, 
            title: "", 
            ylabel: "", 
            xlabel: "", 
            plotRotation: 0, 
            xRotation: 0, 
            yRotation: 0,
            squareLength: 20,
            groups: {
                colors :{
                    startColor,
                    endColor,
                    negativeEndColor: negativeEndColor
                }
            },
            nameMapper,
            checkPointColor: Oviz.color.schemeCategory("light", CheckPoints)
        },
        loadData: {
            subtype: {
                url: subtypePath,
                type: "csv",
                dsvHasHeader: false,
                loaded(data) {
                    this.data.c16Classification = C16Classifier(data);
                    const classifications = Object.keys(this.data.c16Classification.group).sort();
                    this.data.colorMap = Oviz.color.schemeCategory("light", classifications).colors;
                }
            },
            RNAdata: {
                url: RNAdataPath,
                type: "csv",
                dependsOn: ["subtype"],
                loaded(data) {
                    const RNAdata = RNAProcessor(data, this.data.c16Classification);
                    const maxs = [];
                    const mins = [];
                    Object.entries(RNAdata).forEach(([key, item]: [string, any]) => {
                        maxs.push(Math.max(... item.matrix.flat().map(d => Math.max(d, 0))));
                        mins.push(Math.min(... item.matrix.flat().map(d => Math.min(d, 0))));
                    })
                    this.data.valueRange = {negdataRange: [Math.min(...mins), 0], dataRange: [0, Math.max(...maxs)]}
                    return RNAdata;
                }
            }
        },
        setup() {
            this.defineGradient("bg", "vertical", [endColor, startColor]);
            this.defineGradient("ng", "vertical", [startColor, negativeEndColor]);
            this.size = {height: 400+Object.keys(this.data.colorMap).length, width: 1850}
            console.log(this)
            registerEditorConfig(editorConfig(this, eid), vue_name, plot_name);
        },
    });
    return visualizer;
}