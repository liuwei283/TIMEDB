import template from "viz/tree/template.bvt"
import Oviz from "crux";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";
import {annoLoaded, main, matrixLoaded} from "viz/tree/data";

export function init(id, path, config) {
    Oviz.visualize({
        el: id,
        template,
        renderer: "svg",
        height: 1400,
        width: 2000,
        theme: "light",
        loadData: {
            anno: {
                type: "tsv",
                url: path["anno"],
                loaded: annoLoaded,
            },
            matrix: {
                type: "tsv",
                url: path["matrix"],
                loaded: matrixLoaded,
            },
            tree: {
                type: "tsv",
                url: path["tree"],
                dependsOn: ["matrix"],
                loaded: main,
            },
        },
        setup() {
            console.log(this["_data"]);
            if (this.data.tree.dataOpt.isRadical) {
                this.size.width = 2 * (this.data.tree.dataOpt.treeRadius
                    + Math.ceil(this.data.tree.dataOpt.maxTextLength)) + 140;
                this.size.height = 2 * (this.data.tree.dataOpt.treeRadius
                    + Math.ceil(this.data.tree.dataOpt.maxTextLength));
            } else {
                this.size.width = this.size.height = 1000;
            }
            console.log(this.size.width);
        },
    });
}
