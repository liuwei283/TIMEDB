import { ListGroupPlugin } from "bootstrap-vue";
import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
//import { chooseMethod } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export let editorRef = {} as any;


function update(v) {
    v.forceRedraw = true;
    v.run();
}

export const generateTestConfig = (v): any => ({
    id: "plot_st",
    title: "General Setting",
    layout: "tabs",
    tabs:[
        {
            id:"g-common",
            name:"Size Setting",
            view:{
                type: "list",
                items:[
                    {
                        title: "Graph Radius Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.graphRadius,
                            callback(x) {
                                v.data.graphRadius = parseFloat(x);
                                v.size.height = (v.data.graphRadius-150)*2 + 700 + v.data.nodeRadius -5 + (this.data.maxlabellength -93)*2
                                v.size.width = (v.data.graphRadius-150)*5 + 1300 + v.data.nodeRadius -5 + (this.data.maxlabellength -93)*2
                                v.data._sizeUpdated = true;
                                update(v);
                            },
                        },
                    },
                    {
                        title: "Node Radius Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.nodeRadius,
                            callback(x) {
                                v.data.nodeRadius = parseFloat(x);
                                v.size.height = (v.data.graphRadius-150)*2 + 700 + v.data.nodeRadius -5 + (this.data.maxlabellength -93)*2
                                v.size.width = (v.data.graphRadius-150)*5 + 1300 + v.data.nodeRadius -5 + (this.data.maxlabellength -93)*2
                                v.data._sizeUpdated = true;
                                update(v);
                            },
                        },
                    },
                ]

            }
        },
        
    ]
})

export const generateColorConfig = (v): any => ({
    id: "plot_st2",
    title: "Color Setting",
    layout: "tabs",
    tabs:[
        {
            id:"g-common",
            name:"Node Color Setting",
            view:{
                type: "list",
                items:[
                    {
                        type: "vue",
                        title: "Method Color",
                        component: "color-picker",
                        data: {
                            title: "Node Color",
                            scheme: copyObject(v.data.colorMap),
                            id: "pwcolor",
                            callback(colors) {
                                v.data.colorMap = colors;
                                v.data._sizeUpdated = true;
                                v.forceRedraw = true;
                                run(v);
                            },
                        },
                    }
                ]

            }
        },
        
    ]
})


export const generateChooseConfig = (v): any => ({
    id: "plot_st3",
    title: "Custom Setting",
    layout: "tabs",
    tabs:[
        {
            id:"g-common",
            name:"Choose Feature and Group",
            view:{
                type: "list",
                items:[
                    {
                        title: "Feature",
                        type: "select",
                        options: v.data.config.features,
                        value:{
                            current:v.data.config.features,
                            callback(d){
                                v.data.selectedFeature = d
                                v.data.selectedGroup = v.data.feaMapgroup[v.data.selectedFeature][0]
                                editorRef.config = v.data.congroup[v.data.selectedFeature]
                                v.run();
                            }
                        }

                    },
                    {
                        title: "Group",
                        type: "select",
                        options: v.data.config.groups,
                        value:{
                            callback(d){
                                v.data.selectedGroup = d
                                v.run();
                            }
                        },
                    },
                ]

            }
        },
        
    ]
})

export function editorConfig(v): EditorDef {
    return {
        sections: [
            generateTestConfig(v),
            generateColorConfig(v),
            generateChooseConfig(v),
        ]
    }
}



