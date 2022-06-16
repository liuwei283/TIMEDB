// export interface Viz {
//     vizOpts: any;
// }
import { registerLinSeed } from "./LinSeed";
import { registerLandscapeHeatmap} from "./Landscape_heatmap";
import { registerHRORMountain} from "./HRORMountain";
import { registerHRORTable } from "./HRORTable";
import { registerSpaticalInteraction } from "./spatical_interaction";
import { registerstackedBarsplot} from "./stackedBars";
import { registerUMAP } from "./UMAP";
import { registerSubtype } from "./Subtype";

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
        case "HRORMountain":
            registerHRORMountain();
            break;
        case "HRORTable":
            registerHRORTable();
            break;
        case "spatical_Interaction":
            registerSpaticalInteraction();
            break;
        case "stackedBars":
            registerstackedBarsplot();
            break;
        case "UMAP":
            registerUMAP();
            break;
        case "Subtype":
            registerSubtype();
            break;
    }
}
