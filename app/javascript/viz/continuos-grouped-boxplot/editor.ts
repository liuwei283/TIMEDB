import { EditorDef } from "utils/editor";
import { processconfigData } from "./index"

function run(v) {
    // if(v.configchange = true) processconfigData(v);
    v.forceRedraw = true;
    v.run();
}

export const editorRef = {} as any;

export function generateDiverConfig (v): EditorDef {
    return{
        sections:[
            {
                id: "settings",
                title: "Settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "range min",
                            type: "input",
                            value: {
                                current: v.data.valueRange[0],
                                callback(d) {
                                    v.data.valueRange[0] = parseFloat(d);
                                    run(v);
                                },
                            },
                            
                        },
                        {
                            title:"range max",
                            type:"input",
                            value: {
                                current:v.data.valueRange[1],
                                callback(d){
                                    v.data.valueRange[1] = parseFloat(d);
                                    run(v);
                                },
                            },
                        },
                        {
                            title: "gap ratio",
                            type: "input",
                            value: {
                                current: v.data.gapRatio,
                                callback(d) {
                                    v.data.gapRatio = parseFloat(d);
                                    processconfigData(v);
                                    run(v);
                                },
                            },
                            
                        },
                        {
                            title:"box width",
                            type:"input",
                            value: {
                                current:v.data.boxW,
                                callback(d){
                                    v.data.boxW = parseFloat(d);
                                    run(v);
                                },
                            },

                        },
                    ]
                }
            }
        ]
    }
}
