import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v, eid) {
    v.forceRedraw = true;
    v.run();
}

export const editorRef = {} as any;

const generalSetting = ["startX", "startY", "width", "height", "titleSize", "labelSize", "title", "ylabel", "xlabel", "plotRotation", "xRotation", "yRotation"]

export const generateCompositeGeneralConfig = (v, eid): any => ({
    id: eid + "general",
    title: "General Setting",
    layout: "tabs",
    tabs: v.data.plots.map((plot) => ({
    	id: plot,
    	name: plot.toUpperCase(),
    	view: {
            type: "list",
            items: generalSetting.map((item) => ({
                title: item.replace(/([A-Z])/g," $1").toLowerCase(),
                type: "input",
                value: {
                    current: v.data.plotData[plot][item],
                    callback(d) {
                        v.data.plotData[plot][item] = parseInt(d);
                        run(v, eid);
                    }
                }
            }))
        }
	}))
})

export const generateCompositeColorConfig = (v, eid): any => ({
    id: eid + "color",
    title: "Color Setting",
    layout: "tabs",
    tabs: v.data.plots.map((plot) => ({
    	id: plot,
    	name: plot.toUpperCase(),
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
                        run(v, eid);
                    },
                },
            }],
        }
	}))
})

export function editorConfig(v, eid): EditorDef {
    return {
        sections: [
            generateCompositeGeneralConfig(v, eid),
            generateCompositeColorConfig(v, eid),
        ],
    };
}