import Oviz from "crux";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

const generalSetting = ["startX", "startY", "width", "height", "titleSize", "labelSize", "title", "ylabel", "xlabel", "plotRotation", "xRotation", "yRotation"]

export const generateGeneralConfig = (v, eid): any => ({
    id: eid + "General",
    title: "General Setting",
    layout: "single-page",
    view: {
        type: "list",
        items: generalSetting.map((item) => ({
            title: item.replace(/([A-Z])/g," $1").toLowerCase(), //title 这里可以提供一个映射，每个属性展示的名字是什么，用法如titleMapper[item]
            type: "input",
            value: {
                current: v.data[item],
                callback(d) {
                    v.data[item] = parseInt(d);
                    run(v);
                }
            }
        }))
    }
})

export const generateColorConfig = (v, eid): any => ({
    id: eid,
    title: "Color Setting",
    layout: "single-page",
    view: {
		type: "list",
    	items: [{
            type: "vue",
            title: "groups color",
            component: "color-picker",
            data: {
                title: "groups colors",
                scheme: copyObject(v.data.groups.colors),
                id: "pwcolor",
                callback(colors) {
                    v.data.groups.colors = {...colors};
                    v.defineGradient("bg", "vertical", [colors["endColor"], colors["startColor"]]);
                    v.defineGradient("ng", "vertical", [colors["startColor"], colors["nendColor"]]);
                    v.data.config.colorScheme = Oviz.color.schemeGradient(colors["startColor"], colors["endColor"]),
                    v.data.config.negColorScheme = Oviz.color.schemeGradient(colors["nendColor"], colors["startColor"])
                    v.data.config.endColor = colors["endColor"]
                    v.data.config.startColor = colors["startColor"]
                    v.data.config.nendColor = colors["nendColor"]
                    run(v);
                },
            },
        }]
    }
})

export function editorConfig(v, eid): EditorDef {
    return {
        sections: [
            generateGeneralConfig(v, eid),
            generateColorConfig(v, eid),
        ],
    };
}