import { defaultLayoutConf as conf} from "utils/editor";
import { EditorDef } from "utils/editor";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
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
                            title: "Node Name",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: "showNodeNames",
                                callback() {
                                    v.data.config.showNodeNames = conf.showNodeNames;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "Max Radius",
                            type: "input",
                            value: {
                                current: v.data.config.maxR,
                                callback(x) {
                                    v.data.config.maxR = parseFloat(x);
                                    console.log(v.root.$refs)
                                    v.root.$ref.network.resetLayout = true;
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "",
                            type: "vue",
                            component: "color-picker",
                            data: {
                                title: "Color Palette",
                                scheme: v.data.colorMap,
                                id: "pwcolor",
                                callback(colors) {
                                    v.data.colorMap = colors;
                                    v.forceRedraw = true;
                                    run(v);
                                },
                            }
                        }
                    ]
                }
            }
        ],
    };
}
