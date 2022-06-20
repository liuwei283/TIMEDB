import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.forceRedraw = true;
    v.run();
}

export const editorRef = {} as any;

export function editorConfig(v): EditorDef {
    return {
        sections: Object.entries(v.data.plotData).map(([plot, plotData]) => ({
            title: plot.replace(/([A-Z])/g," $1") + " Setting",
            id: plot + "general",
            layout: "tabs",
            tabs: Object.entries(plotData).map(([tab, items]) => ({
                name: tab.replace(/([A-Z])/g," $1").toLowerCase(),
                title: tab.replace(/([A-Z])/g," $1").toLowerCase(),
                id: plot + tab,
                view: tab == "customized"? {
                    type: "list",
                    items: [
                        // wirte your customized editor here
                        
                    ],
                }: tab == "color"? {
                    type: "list",
                    items: Object.keys(items).map((item) => ({
                        type: "vue",
                        title: item.replace(/([A-Z])/g," $1").toLowerCase(),
                        component: "color-picker",
                        data: {
                            title: item.replace(/([A-Z])/g," $1").toLowerCase(),
                            scheme: copyObject(v.data.plotData[plot][tab][item].colors),
                            id: "pwcolor",
                            callback(colors) {
                                v.data.plotData[plot][tab][item].colors = {...colors};
                                run(v);
                            },
                        },
                    }))
                }: {
                    type: "list",
                    items: Object.keys(items).map((item) => ({
                        title: item.replace(/([A-Z])/g," $1").toLowerCase(),
                        type: "input",
                        value: {
                            current: v.data.plotData[plot][tab][item],
                            callback(d) {
                                v.data.plotData[plot][tab][item] = parseInt(d);
                                run(v);
                            }
                        }
                    }))
                }
            }))
        }))
    };
}