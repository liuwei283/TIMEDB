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


export function editorConfig(v,eid): EditorDef {
    return {
        sections: [
            
            generateGridConfig(v,eid)
            //generateImmuneConfig(v),
        ],
    };
}

