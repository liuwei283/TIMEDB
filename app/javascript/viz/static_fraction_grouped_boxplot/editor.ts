import { generateGridPlotConfig } from "oviz-components/grid-plot";
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { filter } from "vue/types/umd";
import { filterMethod } from "./data";
import { processconfigData } from "./index";
//import { filteredSample } from "./index";

function run(v,eid) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export const generateGridConfig = (v,eid):any =>  ({
    id: eid+"1",
    title: "General Settings",
    layout: "tabs",
    tabs: [
        {
            id: "g-common",
            name: "Plot Size",
            view: {
                type: "list",
                items: [
                    {
                        title: "Grid width",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.comparedBox.plotSize[0],
                            callback(x) {
                                v.data.comparedBox.plotSize[0] = parseFloat(x);
                                v.size.width = v.data.comparedBox.plotSize[0]*1 + 550; //设置svg的大小
                                v.size.height = v.data.comparedBox.plotSize[1] + 200;
                                v.data._sizeUpdated = true;
                                run(v,eid);
                            },
                        },
                    },
                    {
                        title: "Grid height",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.comparedBox.plotSize[1],
                            callback(x) {
                                v.data.comparedBox.plotSize[1] = parseFloat(x);
                                v.size.width = v.data.comparedBox.plotSize[0]*1 + 550; //设置svg的大小
                                v.size.height = v.data.comparedBox.plotSize[1] + 200;
                                v.data._sizeUpdated = true;
                                run(v,eid);
                            },
                        },
                    },
                ],
            },
        },
        {
            id: "k-common",
            name: "Font Size",
            view: {
                type: "list",
                items: [
                    {
                        title: "x Label Size",
                        type: "input",
                        format: "int",
                        value: {
                            current: v.data.xlabelFontsize,
                            callback(x) {
                                v.data.xlabelFontsize = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v,eid);
                            },
                        },
                    },
                ],
            },
        },
        {
            id: "rg-common",
            name: "Value Range",
            view: {
                type: "list",
                items: [
                    {
                        title: "Range Lower Bound",
                        type: "input",
                        //format: "int",
                        value: {
                            current: v.data.comparedBox.valueRange[0],
                            callback(x) {
                                v.data.valueRange[0] = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v,eid);
                            },
                        },
                    },
                    {
                        title: "Range Upper Bound",
                        type: "input",
                        //format: "int",
                        value: {
                            current: v.data.comparedBox.valueRange[1],
                            callback(x) {
                                v.data.valueRange[1] = parseFloat(x);
                                v.data._sizeUpdated = true;
                                run(v,eid);
                            },
                        },
                    },
                ],
            },
        },

    ]
});

export const generateColorConfig = (v,eid):any =>  ({
    id: eid+"2",
    title: "Color Setting",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            // {
            //     title: "plot size",
            //     type: "input",
            //     value: {
            //         current: v.data.xlabelFontsize,
            //         callback(d) {
            //             //v.data.pieR = parseFloat(d);
            //             v.forceRedraw = true;
            //             v.run();
            //         },
            //     },
            // },
            {
                type: "vue",
                title: "Method Color",
                component: "color-picker",
                data: {
                    title: "Method Color",
                    scheme: copyObject(v.data.colorMap), //0515
                    id: "pwcolor",
                    callback(colors) {
                        console.log("colors:",colors)
                        v.data.colorMap = colors; //0515
                        v.data._sizeUpdated = true;
                        v.forceRedraw = true;
                        run(v,eid);
                    },
                },
            },
        ],
    },
});

export const generateCusConfig = (v,eid):any =>  ({
    id: eid+"3",
    title: "Customized Setting",
    layout: "tabs",
    tabs: [
        {
            id: "z-common",
            name: "Filter Method",
            view: {
                type: "list",
                items: [
                    {
                        type:"vue",
                        component: "filter-samples",
                        title:null,
                        ref:"highlightSpecies",
                        data:{
                            get samples() {
                                return Array.from(v.data.methodData);
                            },
                            get defaultValue() {
                                return false;
                            },
                            get title() {
                                return "Choose Method";
                            },
                            callback(choosesample) {
                                //v.data.chosenSample = new Set(choosesample);
                                v.data.chosenmethodData = new Set(choosesample)
                                console.log("v.data.chosenmedthoData:",v.data.chosenmethodData)
                                //console.log("v.data.choosesample:",v.data.chosenSample)
                                //filteredSample(v);
                                
                                filterMethod(v);
                                processconfigData(v)
                                v.root._sizeUpdated = true;
                                run(v,eid);
                            },
                        }
                    },
                ],
            },
        },
    ]
});



export function editorConfig(v,eid): EditorDef {
    return {
        sections: [

        generateGridConfig(v,eid),
        generateColorConfig(v,eid),
        generateCusConfig(v,eid),
        ],
    };
}

