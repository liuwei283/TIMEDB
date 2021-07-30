
import Oviz from "crux";
import { Color } from "crux/dist/color";
import { Component, XYPlotOption } from "crux/dist/element";
import { findBoundsForValues } from "utils/maths";
import { GridPlotOption } from "../classifier/grid-plot";
import template from "./box.bvt";

interface ComplexBoxplotOption extends GridPlotOption {
    drawP: boolean;
    showOutliers: boolean;
    drawBox: boolean;
    drawViolin: boolean;
    drawScatter: boolean;
    pData: any;
    getColor: (pos: number) => string;
    getScatterColor: (pos: number) => string;
}

export class ComplexBoxplot extends Component<ComplexBoxplotOption> {

    protected boxMax: number;
    protected offsetY: number = 0;

    public render() {
        return this.t`${template}`;
    }

    public willRender() {
        if (this._firstRender) {
            // const this.prop = {values: [], categories: []};

            // @ts-ignore
            this.boxMax = this.prop.data.boxData.max;
        }
    }

    protected getBoxColors(x, hollow = true) {
        if (hollow) return [x, "white", x];
        else return [Color.literal(x).darken(30).string,
            Color.literal(x).lighten(10).string, "white" ];
    }

    public defaultProp() {
        return {
            ...super.defaultProp(),
            drawBox: true,
            showOutliers: true,
            drawViolin: false,
            drawScatter: false,
            drawP: true,
            getColor: (pos: number) => "#aaa",
            getScatterColor: (pos: number) => "pink",
        };
    }

    protected dragP(ev, el, delta) {
        this.offsetY += delta[1];
        this.redraw();
    }
}
export type BoxData = {
    categories: string[];
    values: any[];
    outliers: any[];
    means: any[];
    min?: number;
    max?: number;
};
export function processBoxData(values: number[][], categories: string[]): any {
    const boxData: BoxData = {
        categories,
        values: [],
        outliers: [],
        means: [],
    };
    const violinData: any = {
        categories, values: [], violins: [],
    };
    let min, max;
    categories.forEach((_, i) => {
        const stat1 = new Oviz.algo.Statistics(values[i]);
        if (i === 0) {
            min = stat1.min();
            max = stat1.max();
        } else if (stat1.min() < min) min = stat1.min();
        else if (stat1.max() > max) max = stat1.max();
        const hist = new Oviz.algo.Histogram(values[i], "count");
        violinData.violins.push({stat: stat1, bins: hist.getBins(),
            maxY: hist.getMax()});
        violinData.values.push([stat1.min(), stat1.max()]);
        const interQuartileRange = stat1.Q3() - stat1.Q1();
        const boxVals = [];
        values[i].forEach(d => {
            if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                boxData.outliers.push([i, d]);
            } else {
                boxVals.push(d);
            }
        });
        const stat2 = new Oviz.algo.Statistics(boxVals);
        boxData.values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
        boxData.means.push(stat2.mean());
    });
    boxData.max = max;
    boxData.min = min;

    const result = {
        data: { boxData, violinData,
            scatterData: categories.map((pos, i) =>
                ({pos, values: values[i] })),
        }, categories,
        valueRange: findBoundsForValues([min, max], 2, false, 0.5),
    };
    return result;
}
