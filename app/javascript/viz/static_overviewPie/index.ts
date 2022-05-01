import Oviz from "crux";
import template from "./template.bvt";
import { registerDefaultBioInfoComponents } from "crux/dist/element/global";
import { Revolution } from "./revolution";
import{ pieDataloaded } from "./data"

registerDefaultBioInfoComponents();

export function init(id,path){
    Oviz.visualize({
        el:id,
        template,
        root: new Revolution(),
        renderer:"svg",
        width:1200,
        height:870,
        theme: "light",
        data: {
            buttonkey: 0,
            buttonclick(d){
                this.buttonkey = d;
                console.log("buttonkey:",this.buttonkey);
                this.redraw();
            },
            legendPos: {x: 900, y: 0},
            updateLegendPos(ev, el, deltaPos) {
                this.legendPos.x += deltaPos[0];
                this.legendPos.y += deltaPos[1];
                console.log("yes!")
                this.redraw();
                
            },
        },
        loadData: {
            pieData: {
                type: "csv",
                url: path,
                multiple: false,
                loaded: pieDataloaded,
            },
        },
        setup() { 
            console.log("this.data:",this["_data"]);
            console.log("ytdvcdhc");
            //registerEditorConfig(editorConfig(this), editorRef);
        },
    })
}


