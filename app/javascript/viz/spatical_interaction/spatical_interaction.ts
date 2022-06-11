import Oviz from "crux";
import template from "./template.bvt";
//import { BarView } from "viz/spatial_deconvolution_bar_view/bar_view";
import { processMeta, processGraph } from "./spatical_data"
import { minmax } from "crux/dist/utils/math";
import { computeLog } from "utils/maths";
import { schemeRdYlBu } from "d3-scale-chromatic";
import * as d3 from "d3";


export class SpaticalInteraction extends Oviz.Component {

    public render() {
        return this.t`${template}`;
    }

    public willRender() {
        //processMeta(this, [])
        processGraph(this)
    }
    
    //对节点生成弦
    public getRibbonPathForNode(source, target, radius){
        // 弦生成器： d3.ribbon()
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
    //对路径生成弦
    public getRibbonPath(pair, radius){
        // 弦生成器： d3.ribbon()
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

