import Oviz from "crux";
import template from "./template.bvt"

import {copyObject} from "utils/object"
import { event } from "crux/dist/utils";
import {register} from "page/visualizers";

import {findBound} from "utils/maths";
import {minmax} from "crux/dist/utils/math"
import { setSourceMapRange } from "typescript";


const MODULE_NAME = 'signed-barchart'

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const vizOpts = generateDefaultVizOpts();
    const {visualizer} = Oviz.visualize(vizOpts);
    return visualizer;
}


// function initVizWithDeepomics(fileDefs :any){
//     const vizOpts = copyObject(generateDefaultVizOpts());
//     Object.keys(vizOpts.loadData).forEach( dataType => {
//         console.log(dataType);
//         if (vizOpts.loadData[dataType].fileKey) vizOpts.loadData[dataType].fileKey = null;
//         if (fileDefs[dataType])
//             vizOpts.loadData[dataType].url =  `/api/public?path=${btoa(fileDefs[dataType].path)}`
//         else {
//             delete vizOpts.loadData[dataType];
//             vizOpts.data[dataType] = null;
//         }
//     })
//     Object.keys(vizOpts.loadData).forEach( dataType => {console.log(vizOpts.loadData[dataType])})
//     const {visualizer} = Oviz.visualize(vizOpts);
//     return {visualizer, editorConf: editorConfig(visualizer)};

// }

function initViz() {
    const vizOpts = generateDefaultVizOpts();
    const {visualizer} = Oviz.visualize(vizOpts);
    return visualizer;
}

function generateDefaultVizOpts() {
    const vizOpts = {
        el: "#canvas",
        template,
        theme: "light",
        data: {
            config : {
                plotHeight: 600,
                plotWdith: 400,
                barWidth: 15,
            }
        },
        loadData:  {
            barchartData: {
                fileKey: `barchartData`,
                type: "tsv" ,
                dsvRowDef: {Zscore: ["float"]},
                loaded(data) {
                   const valueRange = minmax(data, "Zscore");
                   const lowerBound = -findBound(valueRange[0]*-1,0,1);
                   const upperBound = findBound(valueRange[1],0,1);
                   this.data.axisPos = -lowerBound/(upperBound - lowerBound)
                   this.data.plotHeight = 15 * data.length;
                   this.data.bounds = {lowerBound, upperBound};
                },
            },
        },
        setup() {
            this.data.plotHeight = this.data.config.plotHeight;
            this.data.plotWidth = this.data.config.plotWidth;
        }
        
    };
    return vizOpts; 
}


register(MODULE_NAME, init);
