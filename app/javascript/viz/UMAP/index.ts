import Oviz from "crux";
import template from "./template.bvt";
import { register } from "page/visualizers";
import { ComplexGroupedScatters } from "oviz-components/complex-grouped-scatters";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

const MODULE_NAME = "UMAP";

function init() {

    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { ComplexGroupedScatters },
        data: {
            plotSize   : [600, 600],
            ylabel: "y",
            xlabel: "x",
        },
        loadData: {
            UMAPData: {
                fileKey: "umap",
                type: "csv",
                dsvHasHeader: false,
                loaded(data) {
                    // the data should not dsvHasHeader
                    data = data.slice(1)
                    let classifications: string[] = Array.from(new Set(data.map(d => d[0].split("_")[0])));
                    const result = {}
                    classifications.forEach(c => {
                        result[c] = {}
                    })
                    data.forEach(d => {
                        let classi = d[0].split("_");
                        result[classi[0]][classi[1]] = [parseFloat(d[1]), parseFloat(d[2])]
                    })
                    let minX = Math.floor(Math.min(... data.map(d => parseFloat(d[1]))))
                    let minY = Math.floor(Math.min(... data.map(d => parseFloat(d[2]))))
                    let maxX = Math.ceil(Math.max(... data.map(d => parseFloat(d[1]))))
                    let maxY = Math.ceil(Math.max(... data.map(d => parseFloat(d[2]))))
                    const colorMap = Oviz.color.schemeCategory("light", classifications);
                    console.log(classifications)
                    console.log(colorMap)
                    this.data.plotData = {
                        UMap: {
                            position: {
                                startX: 100, 
                                startY: 0
                            },
                            plotSize: {
                                width: 600, 
                                height: 600
                            },
                            tag: {
                                xLabel: "X",
                                yLabel: "Y",
                            },
                            color: {
                                colorMap: colorMap
                            },
                            customized: {
                                showLabel: true,
                                showConvexHull: true,
                                radius: 3
                            }
                        }
                    }
                    return {data: result, classifications, colorMap, categroyRange: [minX, maxX], valueRange: [minY, maxY], radius: 3}
                }
            }
        },
        setup() {
            console.log(this)
            // this.data.plotData = {UMAPData: this.data.UMAPData}
            registerEditorConfig(editorConfig(this), "getVue", "#task-output");
        }
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerUMAP() {
    register(MODULE_NAME, init);
}