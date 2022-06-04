import Oviz from "crux";
import template from "./template.bvt";
import { ComplexStackedBar } from "oviz-components/complex-stacked-bar";
import { C16Classifier, ClinicalProcessor } from "utils/general-classification";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

export function init(id, subtypePath, clinicalDataPath, eid, plot_name, vue_name) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: { ComplexStackedBar },
        data: {
            startX: 100, 
            startY: 50, 
            width: 300, 
            height: 500, 
            titleSize: 11, 
            labelSize: 13, 
            title: "", 
            ylabel: "", 
            xlabel: "", 
            plotRotation: 0, 
            xRotation: 0, 
            yRotation: 0,
            groups: {}
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
            this.data.width = 80 * Object.keys(this.data.ClinicalData.widMap).length
            this.data.height = 500
            this.data.groups = this.data.ClinicalData.colorMap
            this.size = {height: 700, width: 200+80*Object.keys(this.data.ClinicalData.widMap).length};
            this.data.acronyms = []
            Object.keys(this.data.c16Classification.group).forEach(cat => {
                this.data.ClinicalData.data[cat].forEach(d => {
                    let txt = d[0].split("__")
                    if(txt[0].length >= 10) this.data.acronyms.push("*" + txt[0].split("_").map(d=>d.split(" ")).flat().map(d => d[0].toUpperCase()+".").join("") + " : " + txt[0].split("_").join(" "))
                    if(txt[1].length >= 10) this.data.acronyms.push("*" + txt[1].split("_").map(d=>d.split(" ")).flat().map(d => d[0]).join(".") + " : " + txt[1].split("_").join(" "))
                })
            })
            this.data.acronyms = Array.from(new Set(this.data.acronyms))
            this.data.acronyms = this.data.acronyms.map(c => {
                if(c.length > 30) return [c.slice(0, 30), c.slice(30, 60), c.slice(60, 90), c.slice(90, 120), c.slice(120, 150), c.slice(150)]
                return c
            }).flat().filter(d=>d.length>0)
            console.log(this)
            registerEditorConfig(editorConfig(this, eid), vue_name, plot_name);
        }
    });
    //return editorConfig(this);
}