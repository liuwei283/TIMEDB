import Oviz from "crux";
import template from "./template.bvt";
import { ComplexGroupedBars } from "oviz-components/complex-grouped-bars";
import { C16Classifier, CellProcessor } from "utils/general-classification";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

export function init(id, subtypePath, CellDataPath, eid, plot_name) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: { ComplexGroupedBars },
        data: {
            startX: 100, 
            startY: 70, 
            width: 1550, 
            height: 500, 
            titleSize: 11, 
            labelSize: 11, 
            title: "", 
            ylabel: "", 
            xlabel: "", 
            plotRotation: 0, 
            xRotation: -20, 
            yRotation: 0,
            groups: {}
        },
        loadData: {
            subtype: {
                url: subtypePath,
                type: "csv",
                dsvHasHeader: false,
                loaded(data) {
                    this.data.c16Classification = C16Classifier(data);
                }
            },
            CellData: {
                url: CellDataPath,
                type: "csv",
                dsvHasHeader: false,
                dependsOn: ["subtype"],
                loaded(data) {
                    this.data.CellData = CellProcessor(data, this.data.c16Classification);
                    this.data.groups = this.data.CellData.colorMap
                }
            }
        },
        setup() {
            console.log(this)
            registerEditorConfig(editorConfig(this, eid), plot_name);
        }
    });
}
