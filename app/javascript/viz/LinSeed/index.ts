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
            plotSize   : [800, 200],
            nameHeight : 20,
            rowPadding : 20,
            yLabel: "proportions",
            labelSize: 10,
            showDots: true,
            labelRotation: 90,
            // color: {
            //     // lineColor: "red",
            //     // dotColor: "red"
            // }
        },
        loadData: {
            LinSeedData: {
                fileKey: "LinSeedData",
                type: "csv",
                dsvHasHeader: false,
                loaded(data) {
                    const LinSeedData = {};
                    const classification = data[0].slice(1);
                    const project: string[] = Array.from(new Set(classification.map(d=>d.split("_")[0])))
                    const projectData = {}
                    this.data.color = Oviz.color.schemeCategory("dark", project).colors
                    project.forEach((p: string) => {
                        projectData[p] = {}
                    })
                    data.slice(1).forEach(d => {
                        project.forEach((p: string) => {
                            projectData[p][d[0]] = []
                        })
                        LinSeedData[d[0]] = []
                        d.slice(1).forEach((col, index) => {
                            LinSeedData[d[0]].push([classification[index], parseFloat(col)]);
                            let sit = classification[index].split("_")
                            projectData[sit[0]][d[0]].push([sit[1], parseFloat(col)])
                        })
                    });
                    console.log(project)
                    this.data.projectData = projectData
                    this.data.le = data.length-1
                    return LinSeedData;
                }
            }
        },
        setup() {
            console.log(this)
            this.size = {height: 200+200*this.data.le, width: 200+900*Object.keys(this.data.color).length}
            registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);
        }
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerLinSeed() {
    register(MODULE_NAME, init);
}