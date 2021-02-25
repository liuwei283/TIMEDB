export interface Viz {
    vizOpts: any;
}
import {registerSignedHeatmap} from "./signed-heatmap";
import {registerScatterplot} from "./scatterplot";
import { registerBoxplot} from "./boxplot";

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
        case "boxplot":
            registerBoxplot();
            break;
    }

}


