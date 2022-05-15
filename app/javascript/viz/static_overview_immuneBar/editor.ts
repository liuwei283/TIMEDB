import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

const generalSetting = ["startX", "startY", "width", "height", "titleSize", "labelSize", "title", "ylabel", "xlabel", "plotRotation", "xRotation", "yRotation"]

export const generateGeneralConfig = (v, bid): any => ({
    id: bid,
    title: "Color Setting",
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

export const generateColorConfig = (v, bid): any => ({
    id: bid,
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
                    run(v);
                },
            },
        }]
    }
})

export function editorConfig(v, bid): EditorDef {
    return {
        sections: [
            generateGeneralConfig(v, bid),
            generateColorConfig(v, bid),
        ],
    };
}