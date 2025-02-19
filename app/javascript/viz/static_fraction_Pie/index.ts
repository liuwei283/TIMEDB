import Oviz from "crux";
//import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";
import{ plotDataloaded } from "./data"
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";
import { editorConfig, editorRef } from "./editor";
import { registerEditorConfig } from "utils/editor";

registerDefaultBioInfoComponents();

export function init(id,path,config,eid,plot_name,vue_name){
    console.log("config:",config)
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        theme: "light",
        components: { GridPlot, EditText},
        data: {
            legendPos: {x: 760, y: 100},
            chosenColumn:config,
            generText(str){
                str = str+"";
                str = str.replace(/_/g," ") //.substring(1,str.length)
                return str;
            }
        },
        loadData: {
            clinicalPie: {
                type: "csv",
                url: path,
                multiple: false,
                loaded:plotDataloaded
            },
        },
        setup() { 
            console.log("fraction bar this.data:",this["_data"]);
            registerEditorConfig(editorConfig(this,eid), vue_name, plot_name);
            this.size.height = 600
            this.size.width = 900 + this.data.maxLegend + 5
        },
    })
}


export function buttonFunc(result,buttonkey){
    return result.temp[result.methoddata[buttonkey]]
} 

export function count(arr,element){
    let result = 0
    arr.forEach(item => {
        item == element? result= result +1 :null
    });
    return result
}
