import { event } from "crux/dist/utils";
import { EditorDef, ToolbarDef } from "./editor-def";

const record: Record<string, [EditorDef, ToolbarDef]> = {};

export function registerEditorConfig(name: string, editorDef: EditorDef, toolbarDef: ToolbarDef, editorRef?: any) {
    record[name] = [editorDef, toolbarDef];
    const setupVue = (vue) => {
        vue.editorConfig = record[name][0];
        vue.toolbarConfig = record[name][1];
        if (editorRef) vue.$root.$data.editorRef = editorRef;
    };

    const vue = event.rpc("getVue");

    if (vue) {
        setupVue(vue);
    }

    event.on(event.CANVAS_MOUNTED, (_, vue) => {
        if (window.gon.module_name !== name) { return; }
        setupVue(vue);
    });
}

export { EditorDef, ToolbarDef };
