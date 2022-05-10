import Oviz from "crux";
import { register } from "page/visualizers";
import template from "./template.bvt";
import { DraggableContainer } from "oviz-components/draggable-container";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

const MODULE_NAME = "LinSeed";

function init() {

    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: { DraggableContainer },
        data: {
            plotSize   : [600, 200],
            nameHeight : 20,
            rowPadding : 20,
            yLabel: "proportions",
            labelSize: 10,
            showDots: true,
            labelRotation: 0,
            color: {
                lineColor: "red",
                dotColor: "red"
            }
        },
        loadData: {
            LinSeedData: {
                fileKey: "LinSeedData",
                type: "csv",
                dsvHasHeader: false,
                loaded(data) {
                    const LinSeedData = {};
                    const classification = data[0].slice(1);
                    data.slice(1).forEach(d => {
                        LinSeedData[d[0]] = []
                        d.slice(1).forEach((col, index) => {
                            LinSeedData[d[0]].push([classification[index], parseFloat(col)]);
                        })
                    });
                    return LinSeedData;
                }
            }
        },
        setup() {
            registerEditorConfig(editorConfig(this));
        }
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerLinSeed() {
    register(MODULE_NAME, init);
}