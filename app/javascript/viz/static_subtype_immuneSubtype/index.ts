import Oviz from "crux";
import template from "./template.bvt";
import { ComplexStackedBar } from "oviz-components/complex-stacked-bar";
import { C16Classifier, ClinicalProcessor } from "utils/general-classification";

let xlabel = "Time(day)";
let ylabel = "Survival";

export function init(id, subtypePath, clinicalDataPath, config) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: { ComplexStackedBar },
        data: { xlabel, ylabel, xy: {xlabel, ylabel} },
        loadData: {
            subtype: {
                url: subtypePath, // c1 c6 subtype
                type: "csv" ,
                dsvHasHeader: false,
                loaded(data) {
                    this.data.c16Classification = C16Classifier(data);
                },
            },
            ClinicalData: {
                url: clinicalDataPath, // Clinical data
                type: "csv" ,
                dependsOn: ["subtype"],
                loaded(data) {
                    return ClinicalProcessor(data, this.data.c16Classification)
                },
            },
        },
        setup() {
            console.log(this)
            this.size = {height: 700, width: 200+60*Object.keys(this.data.ClinicalData.widMap).length};
        }
    });
    return visualizer;
}