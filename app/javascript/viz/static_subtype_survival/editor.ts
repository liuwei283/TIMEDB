import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.forceRedraw = true;
    v.run();
}

export const editorRef = {} as any;

const generalTabs = {
    "position": [
        "startX", 
        "startY"
    ],
    "plotSize": [
        "width", 
        "height"
    ], 
    "fontSize": [
        "titleSize", 
        "labelSize"
    ],
    "tag": [
        "title", 
        "ylabel", 
        "xlabel"
    ],
    "Rotation": [
        "xRotation", 
    ]
}

const generalSetting = ["startX", "startY", "width", "height", "titleSize", "labelSize", "title", "ylabel", "xlabel", "xRotation"]

export function editorConfig(v, eid): EditorDef {
    return {
        sections: ["os", "pfs"].map(plot => ({
            id: eid + plot,
            title: plot.toUpperCase() + " Setting",
            layout: "tabs",
            tabs: [... Object.entries(generalTabs).map(([tab, items]) => ({
                name: tab.replace(/([A-Z])/g," $1").toLowerCase(),
                id: plot+tab,
                view: {
                    type: "list",
                    items: items.map((item) => ({
                        title: item.replace(/([A-Z])/g," $1").toLowerCase(),
                        type: "input",
                        value: {
                            current: v.data.plotData[plot][item],
                            callback(d) {
                                v.data.plotData[plot][item] = parseInt(d);
                                run(v);
                            }
                        }
                    }))
                }
            })), {
                name: "color",
                id: plot+"color",
                view: {
                    type: "list",
                    items: [{
                        type: "vue",
                        title: "groups color",
                        component: "color-picker",
                        data: {
                            title: "groups colors",
                            scheme: copyObject(v.data.plotData[plot].groups.colors),
                            id: "pwcolor" + plot,
                            callback(colors) {
                                v.data.plotData[plot].groups.colors = {...colors};
                                run(v);
                            },
                        },
                    }]
                }
            }]
        }))
    };
}