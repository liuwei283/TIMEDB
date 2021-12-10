import Oviz from "crux";
import { Component } from "crux/dist/element";
import { GridPlotOption } from "./grid-plot";
import template from "./scatter.bvt";

export const shapes = ["Circle", "Rect", "Triangle"];

export interface ErrorEllipseDatum {
    dx: number;
    dy: number;
    ellipsePath: string;
    xAxisPath: string;
    yAxisPath: string;
}

export interface ScatterClusterDatum {
    center: {x, y};
    ellipseData: ErrorEllipseDatum;
}

export interface ComplextScatterplotOption extends GridPlotOption {
    hollow: boolean; // indicates whether the scatter is hollow or solid
    scatterSize: number; // indicates how big the scatter is 
    scatterOpacity: number;
    scatterFill?: string;
    scatterStroke?: string;
    generateTooltip?: (d) => string;
    shapeGetter?: (d) => string;
    colorGetter?: (d) => string;
    colors?: string[];
    clusters?: string[];
    groups?: string[];
    strokeColor: string;
    ellipseColor: string;
    drawEllipse: boolean;
    drawCenterStrokes: boolean;
}

export class ComplexScatterplot extends Component<ComplextScatterplotOption> {

    public dataChanged: boolean = true;

    protected clusterData: any;

    private shapeGetter: (d) => string = () => "Circle";
    private colorGetter: (d) => string = () => "#aaa";
    private generateTooltip: (d) => string = (d) => (Object.keys(d)
                                .filter(k => !["pos", "value", "show"].includes(k))
                                .map(k => `${k}: ${d[k]}`).join("<br>"));

    private markedScatter: string;

    private markedLines: [any, any] = [
        { x: 0, dashArray: "1,2", stroke: "#aaa"},
        { y: 0, dashArray: "1,2", stroke: "#aaa"},
    ];

    public render = Oviz.t`${template}`;

    public willRender() {
        debugger;
        if (this.prop.shapeGetter) this.shapeGetter = this.prop.shapeGetter;
        else if (this.prop.groups) this.shapeGetter = (d) => shapes[this.prop.groups.indexOf(d.group)];
        if (this.prop.colorGetter) this.colorGetter = this.prop.colorGetter;
        else if (this.prop.clusters && this.prop.colors)
            this.colorGetter = (d) => this.prop.colors[this.prop.clusters.indexOf(d.cluster)];;
        if (this.prop.generateTooltip) this.generateTooltip = this.prop.generateTooltip;
        if (this.prop.clusters && this.dataChanged) {
            this.clusterData = {};
            const svgRatioX = this.prop.plotSize[0] / (this.prop.categoryRange[1] - this.prop.categoryRange[0]);
            const svgRatioY = this.prop.plotSize[1] / (this.prop.valueRange[1] - this.prop.valueRange[0]);
            this.prop.clusters.forEach(key => {
                const initialData = this.prop.data.filter(x => x.cluster === key);
                const clusterDatum = this.computeErrorEllipse(initialData, this.prop.xLabel, this.prop.yLabel,
                    svgRatioX, svgRatioY);
                this.clusterData[key] = clusterDatum;
            });
            this.dataChanged = false;
        }
    }

    protected computeErrorEllipse(samples, xIndex, yIndex, svgRatioX, svgRatioY): ScatterClusterDatum {
        const ellipseData = {cx: 0, cy: 0, rx: 0, ry: 0, rotationAngle: 0};
        const s = 5.991;
        const statX = new Oviz.algo.Statistics(samples.map(x => x[xIndex]));
        const statY = new Oviz.algo.Statistics(samples.map(y => y[yIndex]));

        ellipseData.cx =  statX.mean();
        ellipseData.cy = statY.mean();

        let varX = 0, varY = 0, cov = 0;
        samples.forEach(d => {
            varX += Math.pow( (d[xIndex] - statX.mean()) * svgRatioX, 2) / (samples.length - 1);
            varY += Math.pow( (d[yIndex] - statY.mean()) * svgRatioY, 2) / (samples.length - 1);
            cov += (d[xIndex] - statX.mean()) * svgRatioX * (d[yIndex] - statY.mean()) * svgRatioY / (samples.length - 1);
        });

        const eParams = {a: 1, b: -(varX + varY), c: varX * varY - Math.pow(cov, 2)};
        const eigenValue1 = (-eParams.b + Math.sqrt(Math.pow(eParams.b, 2) - 4 * eParams.a * eParams.c)) / (2 * eParams.a);
        const eigenValue2 = (-eParams.b - Math.sqrt(Math.pow(eParams.b, 2) - 4 * eParams.a * eParams.c)) / (2 * eParams.a );
        ellipseData.rx = Math.sqrt(s * Math.abs(eigenValue1));
        ellipseData.ry = Math.sqrt(s * Math.abs(eigenValue2));

        const rotationRad = Math.atan((varX - eigenValue1) / cov);
        ellipseData.rotationAngle  = rotationRad * 180 / Math.PI;
        const triFunctions = {
            sin(r) { return r * Math.sin(rotationRad); },
            cos(r) { return r * Math.cos(rotationRad); },
        };
        const dx = triFunctions.cos(ellipseData.rx);
        const dy = triFunctions.sin(ellipseData.rx);
        const ellipsePath = `M 0 0
                    A ${ellipseData.rx} ${ellipseData.ry} ${ellipseData.rotationAngle} 0 1 ${2 * dx} ${2 * dy}
                    A ${ellipseData.rx} ${ellipseData.ry} ${ellipseData.rotationAngle} 0 1 0 0 Z`;
        const center = {x: statX.mean(), y: statY.mean()};
        const ellipseDatum = {
            dx,
            dy,
            ellipsePath,
            xAxisPath: `M 0 0 L ${2 * dx} ${2 * dy}`,
            yAxisPath: `M ${dx - triFunctions.sin(ellipseData.ry)} ${dy + triFunctions.cos(ellipseData.ry)}
            L ${dx + triFunctions.sin(ellipseData.ry)} ${dy - triFunctions.cos(ellipseData.ry)}`,
        };
        return {center, ellipseData: ellipseDatum};
    }

    protected markScatter(d) {
        if (d.data.sampleId === this.markedScatter) {
            this.markedScatter = null;
            this.redraw();
        } else {
            this.markedScatter = d.data.sampleId;
            this.markedLines[0].x = d.pos;
            this.markedLines[1].y = d.value;
            this.$v.forceRedraw = true;
            this.redraw();
        }
    }
    protected hideScatter(d) {
        const result = confirm(`You want to hide ${d.data.sampleId}?`);
        if (result) {
            if (d.data.sampleId === this.markedScatter) {
                this.markedScatter = null;
            }
            d.data.show = false;
            this.redraw();
        }
    }

    protected generateScatterContent(scatter) {
        return Object.keys(scatter)
                     .reduce(((acc, cur) => {
                        if (!!scatter[cur])
                            if (typeof scatter[cur] === "number")
                                return acc + `${cur}: ${scatter[cur].toFixed(3)}<br>`;
                            else
                                return acc + `${cur}: ${scatter[cur]}<br>`;
                        else return acc;
                }), "");
    }

    public defaultProp() {
        return {
            ...super.defaultProp,
            scatterSize: 8,
            flip: false,
            hollow: false,
            strokeColor: "#999",
            ellipseColor: "lightYellow",
            drawEllipse: true,
            scatterOpacity: 0.9,
        };
    }
}

type ScatterData = {
    valueRange: [number, number],
    categoryRange: [number, number],
    data: any[],
    xLabel: string,
    yLabel: string,
}
// export function processRawData(data: any[], xLabel: string, yLabel: string): ScatterData {
//     const result = {valueRange: null, categoryRange: null, data: null, xLabel, yLabel};
//     data.forEach()
//     return result;

// }