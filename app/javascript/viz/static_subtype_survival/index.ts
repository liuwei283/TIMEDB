import Oviz from "crux";
import template from "./template.bvt";
import { SurvivalLine } from "oviz-components/survival-line";
import { C16Classifier, ClinicalProcessor } from "utils/general-classification";
import { copyObject } from "utils/object";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

const config = {
    startX: 100, 
    startY: 100, 
    width: 300, 
    height: 300, 
    titleSize: 11, 
    labelSize: 11, 
    title: "PFS", 
    ylabel: "Survival", 
    xlabel: "Time(Day)", 
    plotRotation: 0, 
    xRotation: 0, 
    yRotation: 0,
    groups: {}
}

let pfs = copyObject(config)
let os = copyObject(config)

export function init(id, subtypePath, clinicalDataPath, eid, plot_name) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: { SurvivalLine },
        data: {
            plots: ["pfs", "os"],
            plotData: {
                pfs,
                os: Object.assign(os, {startX: 600, title: "OS"})
            }
        },
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
                    this.data.ClinicalData = ClinicalProcessor(data, this.data.c16Classification)
                },
            },
        },
        setup() {
            this.data.plotData.os.groups = this.data.ClinicalData.colorMap;
            this.data.plotData.pfs.groups = this.data.ClinicalData.colorMap;
            console.log(this)
            registerEditorConfig(editorConfig(this, eid), plot_name);
        }
    });
}