import Oviz from "crux";
import template from "./template.bvt";
import { minmax, max } from "crux/dist/utils/math";
import * as d3 from "d3";

export class ScatterBoxPlot extends Oviz.Component {

    public groups;
    public scatterData;
    public groupDict;
    public colorGetter;
    public xRange;
    public yRange;
    public shapes;
    public xLabel;
    public yLabel;
    public ageDiv;

    public render() {
        return this.t`${template}`;
    }

    public willRender() {
        
    }

}