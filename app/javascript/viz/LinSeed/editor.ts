import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export const generateImmuneConfig = (v): any => ({
    id: "setting-bc",
    title: "Color Settings",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            {
                type: "vue",
                title: "line color",
                component: "color-picker",
                data: {
                    title: "Customize colors",
                    scheme: copyObject(v.data.color),
                    id: "pwcolor",
                    //需要具体到一个字符串上而不仅仅只是数组 对象也可以
                    callback(colors) {
                        v.data.color = {...colors};
                        run(v);
                    },
                },
            },
            {
                title: "show dots",
                type: "checkbox",
                value: {
                    current: v.data.showDots,
                    callback(value) {
                        v.data.showDots = value
                        run(v);
                    },
                },
            },
            {
                title: "label rotation",
                type: "input",
                value: {
                    current: v.data.labelRotation,
                    callback(d) {
                        v.data.labelRotation = parseInt(d);
                        run(v);
                    },
                },
            },
            {
                title: "plot width",
                type: "input",
                value: {
                    current: v.data.plotSize[0],
                    callback(d) {
                        v.data.plotSize[0] = parseFloat(d);
                        run(v);
                    },
                },
            },
            {
                title: "plot height",
                type: "input",
                value: {
                    current: v.data.plotSize[1],
                    callback(d) {
                        v.data.plotSize[1] = parseFloat(d);
                        run(v);
                    },
                },
            },
            {
                title: "label size",
                type: "input",
                value: {
                    current: v.data.labelSize,
                    callback(d) {
                        v.data.labelSize = parseFloat(d);
                        run(v);
                    },
                },
            },
            {
                title: "y label",
                type: "input",
                value: {
                    current: v.data.yLabel,
                    callback(d) {
                        v.data.yLabel = d;
                        run(v);
                    },
                },
            },
        ],
    },
});

//生成对应的配置文件
//与index.ts连接
export function editorConfig(v): EditorDef {
    return {
        sections: [
            generateImmuneConfig(v),
            // generateMethod(v),
        ],
    };
}

