import Oviz from "crux";

import template from "./template.bvt";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { ComplexScatterplot } from "oviz-components/complex-scatterplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { groupedChartColors } from "oviz-common/palette";
import { register } from "page/visualizers";
import { rankDict, sortByRankKey} from "utils/bio-info";
import DataUtils from "utils/data";
import { registerEditorConfig } from "utils/editor";
import { findBoundsForValues } from "utils/maths";

import { minmax } from "crux/dist/utils/math";
import { brewPalette, MetaInfo } from "viz/meta-overview/data";


const MODULE_NAME = "phylogenetic-tree";

function init() {

    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: {GridPlot, EditText, ComplexBoxplot, ComplexScatterplot},
        data: {
        },
        loadData: {
            phylogenetic: {
                fileKey: "phylogenetic_tree",
                type: "newick",
                loaded(data) {
            
                    return data;
                },
            }
        },
        setup() {
            // console.log(this["_data"]);
        },
    });

    return visualizer;
}

register(MODULE_NAME, init);

export function registerScatterBoxPlot() {
    register(MODULE_NAME, init);
}
