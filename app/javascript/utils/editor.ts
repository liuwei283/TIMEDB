import { event } from "crux/dist/utils";
import { EditorDef, ToolbarDef } from "./editor-def";
import {viz_mode} from "page/visualizers";

const record: Record<string, [EditorDef, ToolbarDef]> = {};

export const defaultLayoutConf: any = {
    currLayout: "Topdown",
};


// export function registerEditorConfig(name: string, editorDef: EditorDef, toolbarDef: ToolbarDef, editorRef?: any) {
//     record[name] = [editorDef, toolbarDef];
//     const setupVue = (vue) => {
//         vue.editorConfig = record[name][0];
//         vue.toolbarConfig = record[name][1];
//         if (editorRef) vue.$root.$data.editorRef = editorRef;
//     };

//     const vue = event.rpc("getVue");

//     if (vue) {
//         setupVue(vue);
//     }

//     event.on(event.CANVAS_MOUNTED, (_, vue) => {
//         if (window.gon.module_name !== name) { return; }
//         setupVue(vue);
//     });
// }
const fileConf = {
    id: "files",
    title: "Files",
    layout: "single-page",
    view: {
        type: "vue",
        component: "section-files",
        data: {}
    }
};

export function registerDefaultEditorConfig() {
    const vue = event.rpc("getVue");
    if (vue) {
        console.log(`registered`);
        vue.conf = {
            sections: [fileConf],
        };
    }
}

export function registerEditorConfig(editorConf, vue_name, plot_name?, editorRef?) {
    const vue = event.rpc(vue_name);
    if (vue) {
        if (window.gon.viz_mode === viz_mode.ANALYSIS)
            editorConf.sections = [fileConf, ...editorConf.sections];
        if (plot_name == "overview_bar_viz") {
            vue.overview_conf_bar = editorConf;
        }
        else if (plot_name == "overview_pie_viz") {
            vue.overview_conf_pie = editorConf;
        }
        else if (plot_name == "overview_landscape_viz") {
            vue.overview_conf_landscape = editorConf;
        }
        else if (plot_name == "overview_regulator_viz") {
            vue.overview_conf_regulator = editorConf;
        }
        else if (plot_name == "subtype_landscape_viz") {
            vue.subtype_conf_landscape = editorConf;
        }
        else if (plot_name == "subtype_boxplot_viz") {
            vue.subtype_conf_boxplot = editorConf;
        }
        else if (plot_name == "subtype_curve_viz") {
            vue.subtype_conf_curve = editorConf;
        }
        else if (plot_name == "subtype_regulator_viz") {
            vue.subtype_conf_regulator = editorConf;
        }
        else if (plot_name == "fraction_pie_viz") {
            vue.fraction_conf_pie = editorConf;
        }
        else if (plot_name == "fraction_boxplot_viz") {
            vue.fraction_conf_boxplot = editorConf;
        }
        else if (plot_name == "fraction_heatmap_viz") {
            vue.fraction_conf_heatmap = editorConf;
        }
        else if (plot_name == "fraction_landscape_viz") {
            vue.fraction_conf_landscape = editorConf;
        }
        else {
            vue.conf = editorConf;
        }
        if (editorRef) {
            vue.$root.$data.editorRef = editorRef;
        }
    }
}
export { EditorDef, ToolbarDef };
