import Oviz from "crux";
import template from "./template.bvt";
import { processGraph } from "./spatical_data"
import { minmax } from "crux/dist/utils/math";
import { computeLog } from "utils/maths";
import { schemeRdYlBu } from "d3-scale-chromatic";
import * as d3 from "d3";


export class SpaticalInteraction extends Oviz.Component {

    public render() {
        return this.t`${template}`;
    }

    public willRender() {
        processGraph(this)
    }
    
    public getRibbonPathForNode(source, target, radius){
        var path = d3.ribbon()({
            source: {
                startAngle: source.circleAngle/180*Math.PI,
                endAngle: source.circleAngle/180*Math.PI,
                radius: radius,
            },
            target: {
                startAngle: target.circleAngle/180*Math.PI,
                endAngle: target.circleAngle/180*Math.PI,
                radius: radius,
            },          
        });     
        return path;
    }
    public getRibbonPath(pair, radius){
        var path = d3.ribbon()({
            source: {
                startAngle: pair.source.startAngle,
                endAngle: pair.source.endAngle,
                radius: radius,
            },
            target: {
                startAngle: pair.target.startAngle,
                endAngle: pair.target.endAngle,
                radius: radius,
            },          
        });       
        return path;      
    }
    public getArcPath(x){
        return d3.arc()(x);
    }

}

