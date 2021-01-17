export interface Viz {
    vizOpts: any;
}
import {registerSignedHeatmap} from "./signed-heatmap";
import {registerScatterplot} from "./scatterplot";
export {default as Demo} from "./demo"

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
            registerSignedHeatmap();
            break;
    }

}


