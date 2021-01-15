export interface Viz {
    vizOpts: any;
}
import {registerSignedHeatmap} from "./signed-heatmap";
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
    }

}


