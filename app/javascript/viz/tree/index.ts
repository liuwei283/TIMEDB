import Oviz from "crux";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";
import { register } from "page/visualizers";
import { registerEditorConfig } from "utils/editor";
import { editorConfig, editorRef } from "./editor";


import template from "./template.bvt";

import {annoLoaded, main, matrixLoaded} from "./data";

registerDefaultBioInfoComponents();

const MODULE_NAME = "tree";

function init() {
    if (window.gon.module_name !== MODULE_NAME) return;
    const { visualizer } = Oviz.visualize({
        el: "#canvas",
        template,
        renderer: "svg",
        theme: "light",
        loadData: {
            anno: {
                type: "tsv",
                fileKey: "anno",
                loaded: annoLoaded,
            },
            matrix: {
                type: "tsv",
                fileKey: "matrix",
                loaded: matrixLoaded,
            },
            tree: {
                type: "tsv",
                fileKey: "tree",
                dependsOn: ["matrix"],
                loaded: main,
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this), editorRef);
            if (this.data.tree.dataOpt.isRadical) {
                console.log(2 * this.data.tree.dataOpt.treeRadius);
                this.size.width = this.size.height = 1000;
                // this.size.height = this.size.width = 2 * this.data.tree.dataOpt.treeRadius + 200;
            } else {
                this.size.width = this.size.height = 1000;
            }
            this.defineGradient("colorScale", "horizontal", ["#CFE1E9", "#1565C0"]);
        },

    });
    return visualizer;
}

register(MODULE_NAME, init);
