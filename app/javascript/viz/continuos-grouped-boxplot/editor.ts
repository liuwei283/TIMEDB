import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
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
                            title: "ymin",
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
                            title:"ymax",
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
                            title: "gapRatio",
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
                            title:"boxWith",
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
