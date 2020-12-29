import { event } from "crux/dist/utils";
import { EditorDef, ToolbarDef } from "./editor-def";

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
export function registerEditorConfig(editorConf, editorRef?) {
    const vue = event.rpc("getVue");
    if (vue) {
        vue.conf = editorConf;
        if (editorRef) vue.$root.$data.editorRef = editorRef;
    }
}
export { EditorDef, ToolbarDef };
