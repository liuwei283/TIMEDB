import { ListGroupPlugin } from "bootstrap-vue";
import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { getMaxlength, switchStyle } from "./data";
//import { chooseMethod } from "./index";

function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {
    rotation:false
} as any;

function update(v,eid) {
    v.forceRedraw = true;
    v.run();
}

export const generateTestConfig = (v,eid): any => ({
    id: "plot_st",
    title: "Customized Setting",
    layout: "tabs",
    tabs:[
        {
            id:"g-common",
            name:"Common",
            view:{
                type: "list",
                items:[
                    {
                        title: "Filter Legend-NA Block",
                        type: "checkbox",
                        value: {
                            current: v.data.legendStyle,
                            callback(d) {
                                v.data.clinicalDatashow? (v.data.legendStyle = d,switchStyle(v)):null
                                v.forceRedraw = true;
                                v.data._sizeUpdated = true;
                                update(v,eid);
                            },
                        },
                    },
                    {
                        title: "Show Sample Name",
                        type: "checkbox",
                        value: {
                            current: v.data.samplenameshow,
                            callback(d) {
                                // v.data.clinicalDatashow? (v.data.legendStyle = d,switchStyle(v)):null
                                v.data.samplenameshow = d
                                editorRef.rotation = d
                                d? v.data.maxsamplelength = v.data.propsamplelength:v.data.maxsamplelength =0
                                d? v.size.height = v.size.height + v.data.maxsamplelength : v.size.height = v.size.height - v.data.propsamplelength
                                v.forceRedraw = true;
                                v.data._sizeUpdated = true;
                                update(v,eid);
                            },
                        },
                    },
                    {
                        title:"Sample Name Rotation",
                        type:"input",
                        format:"float",
                        //disabled: v.data.samplenameshow,
                        value:{
                            current:v.data.samplenamerotation,
                            callback(x){
                                v.data.samplenamerotation = x
                                v.forceRedraw = true;
                                v.data._sizeUpdated = true;
                                update(v);
                            }
                        }
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
                title: "General Settings",
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
                                            v.data.gridPlotWidth = parseFloat(x);
                                            v.size.width = v.data.RNAData.useData[v.data.sampleList.length-1].col*(v.data.gridPlotWidth-1) + 330 + getMaxlength(v)
                                            v.size.height = v.data.cellList.length *12 + 170 + 
                                                            v.data.cellList.length*(v.data.gridPlotheight) + v.data.gridPlotheight/2
                                                            + (v.data.sortaddName.length-1) * v.data.gridPlotheight 
                                                            + 30
                                                            + v.data.tipsrow*7
                                            v.data._sizeUpdated = true;
                                            v.forceRedraw = true;
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



