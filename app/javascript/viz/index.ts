export interface Viz {
    vizOpts: any;
}
import {default as DiscreteHeatmap} from "./discrete-heatmap"
import {default as SignedHeatmap} from "./signed-heatmap"
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
export function getVizByTaskOutput(output: any){
    switch (output.visualizer) {
        case "DiscreteHeatmap":
            console.log("=>DiscreteHeatmap");
            return DiscreteHeatmap.initVizWithDeepomics(output.files);
        case "SignedHeatmap":
            console.log("=>SignedHeatmap");
            return SignedHeatmap.initVizWithDeepomics(output.files);
        default:
            break;
    }
}


