import Oviz from "crux";
import template from "./template.bvt";
import { ComplexGroupedBars } from "oviz-components/complex-grouped-bars";
import { C16Classifier, CellProcessor } from "utils/general-classification";

export function init(id, subtypePath, CellDataPath, config) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: { ComplexGroupedBars },
        data: {},
        loadData: {
            subtype: {
                url: subtypePath,
                type: "csv",
                dsvHasHeader: false,
                loaded(data) {
                    this.data.c16Classification = C16Classifier(data);
                    console.log("C16Classifior:");
                    console.log(this.data.c16Classification);
                }
            },
            CellData: {
                url: CellDataPath,
                type: "csv",
                dependsOn: ["subtype"],
                loaded(data) {
                    return CellProcessor(data, this.data.c16Classification);
                }
            }
        },
    });

    return visualizer;
}
