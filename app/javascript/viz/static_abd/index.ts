import Crux from "crux";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";
import { Revolution } from "./revolution";
import template from "./template.bvt";

import {treeLoaded} from "./data";

registerDefaultBioInfoComponents();

export function init(id, path, config) {
    Crux.visualize({
        el: id,
        template,
        root: new Revolution(0),
        renderer: "svg",
        height: 1000,
        width: 1000,
        theme: "light",
        loadData: {
            tree: {
                type: "tsv",
                url: path,
                loaded: treeLoaded,
            },
        },
        setup() {
            this.size.height = this.data.tree.dataOpt.maxLength;
            this.size.width = this.data.tree.dataOpt.treeRadius * 2 + 400;
            this.defineGradient("colorScale", "horizontal", ["#eef4fa", "#1565C0"]);
        },
    });
}
