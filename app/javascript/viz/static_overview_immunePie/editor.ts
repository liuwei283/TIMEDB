import Oviz from "crux";
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
        "height"
    ], 
    "fontSize": [
        "titleSize"
    ],
    "label": [
        "title"
    ],
    "Rotation": [
        "plotRotation"
    ]
}

const generalSetting = ["startX", "startY", "height", "titleSize", "title", "plotRotation"]


export const generatePlotConfig = (v, eid): any => ({
    id: eid + "Plot",
    title: "Plot Setting",
    layout: "tabs",
    tabs: [... Object.entries(generalTabs).map(([tab, items]) => ({
        name: tab.replace(/([A-Z])/g," $1").toLowerCase(),
        id: tab,
        view: {
            type: "list",
            items: items.map((item) => ({
                title: item.replace(/([A-Z])/g," $1").toLowerCase(),
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
    })), {
        name: "color",
        id: "color",
        view: {
            type: "list",
            items: [{
                type: "vue",
                title: "groups color",
                component: "color-picker",
                data: {
                    title: "groups colors",
                    scheme: v.data.groups.colors,
                    id: "pwcolor",
                    callback(colors) {
                        console.log(colors)
                        v.data.pieData.forEach(d=>{
                            d.color = Oviz.color.Color.literal(colors[d.name])
                        })
                        run(v);
                    },
                },
            }]
        }
    }]
})

// export const generatePlotConfig = (v, eid): any => ({
//     id: eid + "1",
//     title: "Plot Setting",
//     layout: "single-page",
//     view: {
//         type: "list",
//         items: generalSetting.map((item) => ({
//             title: item.replace(/([A-Z])/g," $1").toLowerCase(), //title 这里可以提供一个映射，每个属性展示的名字是什么，用法如titleMapper[item]
//             type: "input",
//             value: {
//                 current: v.data[item],
//                 callback(d) {
//                     v.data[item] = parseInt(d);
//                     run(v);
//                 }
//             }
//         }))
//     }
// })

// export const generateColorConfig = (v, eid): any => ({
//     id: eid + "2",
//     title: "Color Setting",
//     layout: "single-page",
//     view: {
// 		type: "list",
//     	items: [{
//             type: "vue",
//             title: "groups color",
//             component: "color-picker",
//             data: {
//                 title: "groups colors",
//                 scheme: v.data.groups.colors,
//                 id: "pwcolor",
//                 callback(colors) {
//                     console.log(colors)
//                     v.data.pieData.forEach(d=>{
//                         d.color = Oviz.color.Color.literal(colors[d.name])
//                     })
//                     run(v);
//                 },
//             },
//         }]
//     }
// })

export function editorConfig(v, eid): EditorDef {
    return {
        sections: [
            generatePlotConfig(v, eid),
            // generateColorConfig(v, eid),
        ],
    };
}
