import { ListGroupPlugin } from "bootstrap-vue";
import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
//import { chooseMethod } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

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
                                //v.data.gridPlotWidth = parseFloat(x);
                                v.data.graphRadius = parseFloat(x);
                                v.size.height = (v.data.graphRadius-150)*2 + 700
                                v.size.width = (v.data.graphRadius-150)*5 + 1300
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
                                //v.data.gridPlotWidth = parseFloat(x);
                                v.data.nodeRadius = parseFloat(x);
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
                            scheme: copyObject(v.data.colorMap), //0515
                            id: "pwcolor",
                            callback(colors) {
                                v.data.colorMap = colors; //0515
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
                        type:"vue",
                        component: "filter-samples",
                        title:null,
                        //ref:"highlightSpecies",
                        data:{
                            get samples() {
                                return Array.from(v.data.features);
                            },
                            get defaultValue() {
                                return false;
                            },
                            get title() {
                                return "Choose Feature";
                            },
                            callback(choosesample) {
                                v.data.selectedFeature = choosesample[0]
                                v.data.selectedGroup = v.data.feaMapgroup[v.data.selectedFeature][0]
                                v.root._sizeUpdated = true;
                                run(v);
                            },
                        }
                    },
                    {
                        type:"vue",
                        component: "filter-samples",
                        title:null,
                        //ref:"highlightSpecies",
                        data:{
                            get samples() {
                                return Array.from(v.data.feaMapgroup[v.data.selectedFeature]);
                            },
                            get defaultValue() {
                                return false;
                            },
                            get title() {
                                return "Choose Group";
                            },
                            callback(choosesample) {
                                v.data.selectedGroup = choosesample[0]
                                v.root._sizeUpdated = true;
                                run(v);
                            },
                        }
                    },
                ]

            }
        },
        
    ]
})



export function editorConfig(v): EditorDef {

    //const d = v.data;
    return {
        sections: [
            //generateTestConfig(v)
            generateTestConfig(v),
            generateColorConfig(v),
            generateChooseConfig(v),
        ]
    }
}



