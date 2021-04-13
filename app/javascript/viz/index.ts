export interface Viz {
    vizOpts: any;
}
import {registerSignedHeatmap} from "./signed-heatmap";
import {registerScatterplot} from "./scatterplot";
import { registerScatterBoxPlot } from "./scatter-box-plot";
import { registerBoxplot} from "./boxplot";
import { registerBoxplotSingle } from "./boxplot-single";
import { registerHierTree} from "./hier-tree";
import { registerGroupedBoxP } from "./grouped-boxplot-p";

declare global {
    interface GonInfo {
        urls?: any;
        required_data?: any; 
        module_name?: string;
    }
    interface Window {
        gon: GonInfo;
    }
}
export function registerViz(moduleName) {
    switch(moduleName){
        case "signed-heatmap":
            registerSignedHeatmap();
            break;
        case "scatterplot":
            registerScatterplot();
            break;
        case "scatter-box-plot":
            registerScatterBoxPlot();
            break;
        case "boxplot":
            registerBoxplot();
            break;
        case "boxplot-single":
            registerBoxplotSingle();
            break;
        case "hier-tree":
            registerHierTree();
            break;
        case "grouped-boxplot-p":
            registerGroupedBoxP();
            break;

    }

}


