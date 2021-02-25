import { defaultLayoutConf as conf} from "utils/editor";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

export const editorRef = {} as any;

export function editorConfig(v): EditorDef {

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
                            title: "Outliers",
                            type: "checkbox",
                            value: {
                                current: true,
                                callback(value) {
                                    v.data.config.showOutliers = value
                                    v.run;
                                },
                            },
                        },
                        
                    ]
                }
            }
        ]
    };
}