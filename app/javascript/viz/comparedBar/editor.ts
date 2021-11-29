import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { filterSamples,chooseSamples } from "./index";

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
                id: "general",
                title: "Sample",
                layout: "single-page",
                view: {
                    type:"list",
                    items:[
                        {
                            type:"vue",
                            component: "filter-samples",
                            title:null,
                            ref:"filterSample",
                            data:{
                                get samples() {
                                    return Array.from(v.data.sampleData);
                                },
                                get defaultValue() {
                                    return true;
                                },
                                get title() {
                                    return "Filter Samples";
                                },
                                callback(_,hiddenSamples) {
                                    v.data.hiddenSamples= new Set(hiddenSamples);
                                    filterSamples(v);
                                    v.root._sizeUpdated = true;
                                    run(v);
                                },
                            }

                        },
                        {
                            type:"vue",
                            component: "filter-samples",
                            title:null,
                            ref:"highlightSpecies",
                            data:{
                                get samples() {
                                    return Array.from(v.data.sampleData);
                                },
                                get defaultValue() {
                                    return false;
                                },
                                get title() {
                                    return "Choose Samples";
                                },
                                callback(choosesample) {
                                    v.data.choosesample= new Set(choosesample);
                                    chooseSamples(v);
                                    v.root._sizeUpdated = true;
                                    run(v);
                                },
                            }

                        }
                    ]    
                }
                    
                
            }
        ]
    }

}
