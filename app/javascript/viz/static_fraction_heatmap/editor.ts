import { ListGroupPlugin } from "bootstrap-vue";
import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { switchStyle } from "./data";
//import { chooseMethod } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;


function update(v,eid) {
    v.forceRedraw = true;
    v.run();
}

export const generateTestConfig = (v,eid): any => ({
    id: "plot_st",
    title: "Custom Setting",
    layout: "tabs",
    tabs:[
        {
            id:"g-common",
            name:"common",
            view:{
                type: "list",
                items:[
                    {
                        title: "Filter Legend-NA Block",
                        type: "checkbox",
                        value: {
                            current: v.data.legendStyle,
                            callback(d) {
                                v.data.legendStyle = d;
                                console.log("now style:",v.data.legendStyle)
                                switchStyle(v); //0608
                                v.forceRedraw = true;
                                v.data._sizeUpdated = true;
                                update(v,eid);
                            },
                        },
                    },
                ]

            }
        },
        
    ]
})



export function editorConfig(v,eid): EditorDef {

    //const d = v.data;
    return {
        sections: [
            {
                id: eid+"1",
                title: "General Setting",
                layout: "tabs",
                tabs: [
                    {
                        id: "g-common",
                        name: "Common",
                        view: {
                            type: "list",
                            items: [
                                {
                                    title: "Grid width",
                                    type: "input",
                                    format: "int",
                                    value: {
                                        current: v.data.gridPlotWidth,
                                        callback(x) {
                                            //v.data.gridPlotWidth = parseFloat(x);
                                            v.data._sizeUpdated = true;
                                            update(v,eid);
                                        },
                                    },
                                },
                                
                            ],
                        },
                    },
                    
                ],
            },
            //generateTestConfig(v)
            generateTestConfig(v,eid),
        ]
    }
}



