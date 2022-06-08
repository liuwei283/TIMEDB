// export interface Viz {
//     vizOpts: any;
// }
import { registerLinSeed } from "./LinSeed";
import { registerLandscapeHeatmap} from "./Landscape_heatmap";

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
    console.log("Now s registering module: ");
    console.log(moduleName);
    switch (moduleName) {
        case "LinSeed":
            registerLinSeed();
            break;
        case "Landscape_heatmap":
            registerLandscapeHeatmap();
            break;
    }
}
