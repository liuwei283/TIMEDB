import template from "./template.bvt";

import Oviz from "crux";

export class Revolution extends Oviz.Component {

    public legendPos: {x: 800, y: 0};
    public buttonkey:0;

    public render(){
        return this.t`${template}`;
    }
    public willRender() {
        this.legendPos = {x: 800, y: 0};
    }

    protected state = {
        legendPos:null
    }

    protected updateLegendPos(ev, el, deltaPos: [number, number]) {
        this.legendPos.x += deltaPos[0];
        this.legendPos.y += deltaPos[1];
        this.redraw();
    }

    protected buttonclick(d){
        this.buttonkey = d;
        console.log("buttonkey:",this.buttonkey);
        this.redraw();
    }
}
