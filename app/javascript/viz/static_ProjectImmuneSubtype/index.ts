import Oviz from "crux";
import template from "./template.bvt";
import { ComplexStackedBar } from "oviz-components/complex-stacked-bar";
import { SurvivalLine } from "oviz-components/survival-line";
import { DraggableContainer } from "oviz-components/draggable-container";
import { C16Classifier, ClinicalProcessor } from "utils/general-classification";

const xlabel = "project type";
const ylabel = "proportion";

export function init(id, subtypePath, clinicalDataPath, config) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: { ComplexStackedBar, DraggableContainer, SurvivalLine },
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
    });
    return visualizer;
}