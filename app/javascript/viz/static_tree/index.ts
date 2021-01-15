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
    });
}