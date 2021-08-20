
import Oviz from "crux";
import { FMT } from "./root";

import { register } from "page/visualizers";
import { registerEditorConfig } from "utils/editor";
import { main, meta } from "./data";

import { editorConfig, editorRef } from "./editor";

const MODULE_NAME = "fmt-overview";

function init() {
    if ( !window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        // renderer: "svg",
        // width: 1600,
        // height: 750,
        // template,
        root: new FMT(),
        data: {
            labelAngle: 45,
            italicLabel: false,
            gridW: 12,
            plotHeight: 120,
        },
        theme: "light",
        loadData: {
            fmtMain: {
                fileKey: "fmtMain",
                type: "tsv",
                loaded: main,
            },
            fmtMeta: {
                fileKey: "fmtMeta",
                type: "tsv",
                dependsOn: ["fmtMain"],
                loaded: meta,
            },
        },
        setup() {
            this.data.mainWidth = this.data.gridW * this.data.speciesCount;
            this.size.height = this.data.hist.samples.length * this.data.plotHeight + 250;
            registerEditorConfig(editorConfig(this), editorRef);
        },
    });
    return visualizer;
}

register(MODULE_NAME, init);
