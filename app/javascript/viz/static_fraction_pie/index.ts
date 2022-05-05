import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";
import{ plotDataloaded } from "./data"
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";


registerDefaultBioInfoComponents();

export function init(id,path,config = "c_ajcc_pathologic_n"){
    Oviz.visualize({
        el:id,
        template,
        renderer:"svg",
        theme: "light",
        components: { GridPlot, EditText},
        data: {
            legendPos: {x: 800, y: 0},
            chosenColumn:config,
            generText(str){
                str = str+"";
                console.log(typeof(str))
                str = str.replace(/_/g," ").replace(/c/g,"").replace(/n/g,"")
                console.log(str)
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
            console.log("this.data:",this["_data"]);
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