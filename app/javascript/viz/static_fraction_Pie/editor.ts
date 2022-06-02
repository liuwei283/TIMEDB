import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { filter } from "vue/types/umd";
//import { filterMethod,filteredSample } from "./index";

function run(v,eid) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

//color change
// export const generateImmuneConfig = (v): any => (            {
//     id: "setting-bc",
//     title: "test content settings",
//     layout: "single-page",
//     view: {
//         type: "list",
//         items: [
//             {
//                 type: "vue",
//                 title: "",
//                 component: "color-picker",
//                 data: {
//                     title: "Customize colors",
//                     scheme: copyObject(v.data.colors),
//                     id: "pwcolor",
//                     callback(colors) {
//                         v.data.colors = colors;
//                         run(v);
//                     },
                    
//                 },
//             },
//         ],
//     },
// });

export const generateGridConfig = (v,eid):any =>  ({
    id: eid+"1",
    title: "Plot Settings",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            {
                title:"size of pie",
                type:"input",
                value:{
                    current: v.data.pieR,
                    callback(d){
                        v.data.pieR = parseFloat(d);
                        v.forceRedraw = true;
                        run(v,eid);
                    }

                }
            },
            {
                title: "tick font size",
                type: "input",
                value: {
                    current: v.data.tickFontSize,
                    callback(d) {
                        v.data.tickFontSize = parseFloat(d);
                        v.forceRedraw = true;
                        run(v,eid);
                    },
                },
            },
        ],
    },
});


export const generateColor = (v,eid):any =>  ({
    id: eid + "2",
    title: "Color Setting",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            {
                type: "vue",
                title: "Method Color",
                component: "color-picker",
                data: {
                    title: "Method Color",
                    scheme: copyObject(v.data.colorMap["c_"+v.data.chosenColumn]), //0515
                    id: "pwcolor",
                    callback(colors) {
                        console.log("colors:",colors)
                        v.data.colorMap["c_"+v.data.chosenColumn] = colors; //0515
                        v.data._sizeUpdated = true;
                        v.forceRedraw = true;
                        run(v,eid);
                    },
                },
            },
        ],
    },
});


export function editorConfig(v,eid): EditorDef {
    return {
        sections: [
            
            generateGridConfig(v,eid),
            generateColor(v,eid)
            //generateImmuneConfig(v),
        ],
    };
}

