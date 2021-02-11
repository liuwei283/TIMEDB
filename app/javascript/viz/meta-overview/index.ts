import Oviz from "crux";
import { register } from "page/visualizers";
import { MetaOverview } from "./meta-overview";
import { getLeafOrder, main, meta } from "./data";
import { registerEditorConfig } from "utils/editor";
import { editorConfig, editorRef } from "./editor";

import {controlGroupColors} from "oviz-common/palette";


const MODULE_NAME = "meta-overview";

function init() {
    if ( !window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        renderer: "svg",
        width: 1600,
        height: 750,
        root: new MetaOverview(),
        theme: "light",
        data: {
            colors: {
                control: controlGroupColors[0],
                gout: controlGroupColors[1]
            }
        },
        loadData: {
            ovTree: {
                fileKey: "ovTree",
                type: "newick",
                loaded(d) {
                    this.data.species = getLeafOrder(d);
                },
            },
            ovMain: {
                fileKey: "ovMain",
                type: "tsv",
                dependsOn: ["ovTree"],
                loaded: main,
            },
            ovMeta: {
                fileKey: "ovMeta",
                type: "tsv",
                dsvRowDef: {Age: "int", BMI: "int"},
                dependsOn: ["ovMain"],
                loaded: meta,
            },
        },
        setup() {
            console.log(this["_data"]);
            registerEditorConfig({sections:[]}, editorRef);
        },
    });
    return visualizer;
}

register(MODULE_NAME, init);
