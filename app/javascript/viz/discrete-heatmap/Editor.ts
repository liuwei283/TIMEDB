// import { conf } from "app/gb/editor";
// import { withDefaultPalette } from "common/palette";

import {Editor} from "oviz-editor"
import {EditorDef, ItemDef} from "utils/editor-def"

export const conf: any = {
    sortBy: "a_name",
    treeScale: "scale",
};

function run(v) {
    v.data._changed = true;
    v.run();
}
export const editorRef = {} as any;

export function editorConfig(v):EditorDef {
    return {
        sections: [
            {
                id: "settings",
                title: "Settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "Column Label Rotation Angle",
                            type: "input",
                            format: "int",
                            value: {
                                current: 90,
                                callback(newValue) {
                                    let val = parseInt(newValue as any);
                                    if (val < 0) val = 0;
                                    if (val > 90) val = 90;
                                    v.data.config.colLabelRotation = val;
                                    run(v);
                                }
                              }
                        },
                    ],
                },
            },
        ],
    };
}

export function defaultEditorConfig(v):EditorDef {
    return {
        sections: [
            {
                id: "settings",
                title: "Settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "Default",
                            type: "input",
                            format: "int",
                            value: {
                                current: 0,
                                callback(newValue) {
                                    let val = parseInt(newValue as any);
                                    if (val < 0) val = 0;
                                    if (val > 90) val = 90;
                                    v.data.config.colLabelRotation = val;
                                    run(v);
                                }
                              }
                        },
                    ],
                },
            },
        ],
    };
}