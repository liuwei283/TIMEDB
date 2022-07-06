
import { EditorDef } from "utils/editor";
import { copyObject } from "utils/object";
import { main,process, mergeDots} from "./index";


function run(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export const generateColorConfig = (v): any => ({
    id: "setting-bc",
    title: "Color Settings",
    layout: "single-page",
    view: {
        type: "list",
        items: [
            {
                type: "vue",
                ref:"oscolor",
                title: "OS Color",
                component: "color-picker",
                data: {
                    title: "OS Color",
                    scheme: copyObject(v.data.OSPlotdata.colormap),
                    id: "pwcolor",
                    callback(colors) {
                        v.data.OSPlotdata.colormap = {...colors};
                        run(v);
                    },
                },
            },
            {
                type: "vue",
                ref:"pfscolor",
                title: "PFS Color",
                component: "color-picker",
                data: {
                    title: "PFS Color",
                    scheme: copyObject(v.data.PFSPlotdata.colormap),
                    id: "pwcolor",
                    callback(colors) {
                        v.data.PFSPlotdata.colormap = {...colors};
                        run(v);
                    },
                },
            },
        ],
    },
});

export const generateCustomizedConfig = (v): any => ({

    id: "setting-gct",
    title: "Customized Settings",
    layout: "tabs",
    tabs: [
        {
            id: "p1",
            name: "OS",
            view: {
                type: "list",
                items: [
                    {
                        title: "Choose Clinical Type",
                        type: "select",
                        ref: "depthSelect",
                        options: v.data.OSPlotdata.select,
                        bind: {
                            object: v.data.OSPlotdata,
                            path: "select",
                            callback(d) {
                                v.data.OSPlotdata.chosenClinical = [d]
                                main(v.data.OSPlotdata.oridata,v.data.OSPlotdata,"OS")
                                process(v)
                                v.data.OSDotsdata = mergeDots(v.data.OSPlotdata)
                                editorRef.oscolor.config.data.scheme = v.data.OSPlotdata.colormap
                                v.run();
                            },
                        },
                    },
                    {
                        title: "Show Confidence Interval",
                        type: "checkbox",
                        Option:v.data.OSDataPlotConfidence,
                        value:{
                            callback(d){
                                // v.data.plotType = "bar"
                                // console.log("v.data.plotType:",v.data.plotType)
                                // console.log("check box:",d)
                                v.data.OSDataPlotConfidence = d
                                // v.data.PFSDataPlotConfidence = !d

                                v.root._sizeUpdated = true;
                                v.forceRedraw = true;
                                run(v); 
                            }
                        }
                    },

                ],
            },
        },
        {
            id: "p122",
            name: "PFS",
            view: {
                type: "list",
                items: [
                    {
                        title: "Choose Clinical Type",
                        type: "select",
                        ref: "depthSelect",
                        options: v.data.PFSPlotdata.select,
                        bind: {
                            object: v.data.PFSPlotdata,
                            path: "select",
                            callback(d) {
                                v.data.PFSPlotdata.chosenClinical = [d]
                                main(v.data.PFSPlotdata.oridata,v.data.PFSPlotdata,"PFS")
                                process(v)
                                v.data.PFSDotsdata = mergeDots(v.data.PFSPlotdata)
                                editorRef.pfscolor.config.data.scheme = v.data.PFSPlotdata.colormap
                                v.run();
                            },
                        },
                    },
                    {
                        title: "Show Confidence Interval",
                        type: "checkbox",
                        Option:v.data.OSDataPlotConfidence,
                        value:{
                            callback(d){
                                // v.data.plotType = "bar"
                                // console.log("v.data.plotType:",v.data.plotType)
                                // console.log("check box:",d)
                                // v.data.OSDataPlotConfidence = d
                                v.data.PFSDataPlotConfidence = d

                                v.root._sizeUpdated = true;
                                v.forceRedraw = true;
                                run(v); 
                            }
                        }
                    },
                ],
            },
        },
        
    ]
});


export const generateGeneralConfig = (v): any => ({

    id: "setting-gc",
    title: "General Settings",
    layout: "tabs",
    tabs: [
        {
            id: "p1",
            name: "OS",
            view: {
                type: "list",
                items: [
                    {
                        title: "Plot Width",
                        type: "input",
                        value: {
                            current: v.data.common.plotwidth,
                            callback(d) {
                                v.data.common.plotwidth = parseFloat(d);
                                process(v)
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Plot Height",
                        type: "input",
                        value: {
                            current: v.data.common.plotheight,
                            callback(d) {
                                v.data.common.plotheight = parseFloat(d);
                                process(v)
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Title Size",
                        type: "input",
                        value: {
                            current: v.data.common.titlesize,
                            callback(d) {
                                v.data.common.titlesize = parseFloat(d);
                                process(v)
                                run(v);
                            },
                        },
                    },
                ],
            },
        },
        {
            id: "p2",
            name: "PFS",
            view: {
                type: "list",
                items: [
                    {
                        title: "Plot Width",
                        type: "input",
                        value: {
                            current: v.data.common.plotwidth,
                            callback(d) {
                                v.data.common.plotwidth = parseFloat(d);
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Plot Height",
                        type: "input",
                        value: {
                            current: v.data.common.plotheight,
                            callback(d) {
                                v.data.common.plotheight = parseFloat(d);
                                run(v);
                            },
                        },
                    },
                    {
                        title: "Title Size",
                        type: "input",
                        value: {
                            current: v.data.common.titlesize,
                            callback(d) {
                                v.data.common.titlesize = parseFloat(d);
                                run(v);
                            },
                        },
                    },
                ],
            },
        },
        
    ]
});


export function editorConfig(v): EditorDef {
    return {
        sections: [
            generateGeneralConfig(v),
            generateColorConfig(v),
            generateCustomizedConfig(v),
        ],
    };
}

