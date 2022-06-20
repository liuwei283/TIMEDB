import Oviz from "crux";
import { register } from "page/visualizers";
import template from "./template.bvt";
import { ComplexGroupedBars } from "oviz-components/complex-grouped-bars";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

const MODULE_NAME = "Subtype";

function init() {

    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { ComplexGroupedBars },
        data: {
            plotSize   : [1000, 600],
        },
        loadData: {
            SubtypeData: {
                fileKey: "subtype",
                type: "csv",
                loaded(data) {
                    // the data should dsvHasHeader
                    let classifications = [];
                    const cols = data.columns.filter((col) => col.slice(0, 15) == "c_sub_Quantile_")
                    const stat = {}
                    cols.forEach(col => {
                        stat[col.slice(15)] = {}
                    })
                    data.forEach(d => {
                        cols.forEach(col => {
                            let type = d[col].split("_").slice(-1)[0];
                            col = col.slice(15);
                            if(! classifications.includes(type)) {
                                classifications.push(type);
                                cols.forEach(col => {
                                    stat[col.slice(15)][type] = [0, 0, 0, 0, 0, 0];
                                })
                            }
                            stat[col][type][5] += 1;
                        })
                    })
                    classifications = classifications.sort();
                    const colorMap = Oviz.color.schemeCategory("light", classifications);
                    colorMap.colors["NA"]="#808080"
                    const result = {}
                    classifications.forEach(c => {
                        result[c] = {}
                        Object.entries(stat).forEach(([key, value]) => {
                            result[c][key] = value[c]
                        })
                    })
                    console.log(result)
                    console.log(stat)
                    console.log(classifications)
                    console.log(colorMap)
                    this.data.plotData = {
                        Subtype: {
                            position: {
                                startX: 100, 
                                startY: 0
                            },
                            plotSize: {
                                width: 1550, 
                                height: 500
                            },
                            fontSize: {
                                labelSize: 8
                            },
                            tag: {
                                yLabel: "sample size",
                            },
                            rotation: {
                                // plotRotation: 0,
                                xRotation: -20,
                                // yRoatation: 0
                            },
                            color: {
                                colorMap: colorMap
                            }
                        }
                    }
                    return {stat: result, classifications, colorMap};
                }
            }
        },
        setup() {
            console.log(this)
            registerEditorConfig(editorConfig(this), "getVue", "#task-output");
        }
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerSubtype() {
    register(MODULE_NAME, init);
}