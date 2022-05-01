import Oviz from "crux";
import template from "./template.bvt";
import { ComplexHeatMap } from "oviz-components/complex-heatmap";
import { C16Classifier, RNAProcessor } from "utils/general-classification";
import { groupedColors2 } from "oviz-common/palette";
import { nameMapper, CheckPoints } from "utils/general-classification";

const startColor = "white";
const endColor = "red";
const nendColor = "blue";

export function init(id, subtypePath, RNAdataPath, config) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: { ComplexHeatMap },
        data: {
            groupedColors2,
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
                negColorScheme: Oviz.color.schemeGradient("blue", startColor),
            },
            nameMapper,
            checkPointColor: Oviz.color.schemeCategory("light", CheckPoints)
        },
        loadData: {
            subtype: {
                url: subtypePath,
                // fileKey: "subtype",
                type: "csv",
                dsvHasHeader: false,
                loaded(data) {
                    this.data.c16Classification = C16Classifier(data);
                    console.log("C16Classifior:");
                    console.log(this.data.c16Classification);
                }
            },
            RNAdata: {
                url: RNAdataPath,
                // fileKey: "RNAdata",
                type: "csv",
                dependsOn: ["subtype"],
                loaded(data) {
                    const RNAdata = RNAProcessor(data, this.data.c16Classification);
                    console.log(RNAdata);
                    const maxs = []
                    const mins = []
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
            this.defineGradient("ng", "vertical", [startColor, nendColor]);
        },
    });
    return visualizer;
}