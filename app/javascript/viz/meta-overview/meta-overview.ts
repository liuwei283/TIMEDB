import Oviz from "crux";
import template from "./template.bvt";

import { minmax } from "crux/dist/utils/math";
import * as d3 from "d3";
import {computeLog} from "utils/maths";

export class MetaOverview extends Oviz.Component {
    public colors: any;
    public ovMain: any;
    public ovTree: any;
    public mainHeatmap: number[][];
    public filteredSamples: string[];
    public species: string[];
    public mainColorGetter: any;

    public mainDict;

    public metaFeatures;
    public metaDict;
    public metaInfo;
    public metaData;
    public boxplot;

    public sampleOrderChanged = true;
    private valueRange;
    // private colors = ["pink", "skyblue"];
    private fullDisplay = true;

    private sizeSettings = {
        offsetX: 150,
        mainHeight: 300,
        mainWidth: 1200,
        barHeight: 180,
        boxHeight: 250,
        padding: 20,
        gapX: 10,
        gapY: 10,
        gridW: 8,
        gridH: 12,
    };
    private yPos = 0;
    private gridW = 4;
    private gridH = 12;
    private mainHeight = 300;
    private mainWidth = 1200;
    private controllerMode = "scroll";
    private offsetX = 150;

    private histLegendLabels;
    private mainRange = [];
    private mainGradientFills = [];
    private histLegendPos = {x: 1000, y: 20};
    private mainLegendPos = {x: 1000, y: 210};
    private boxLegendPos = {x: 1000, y: 210};

    private debug = {};

    private _sizeUpdated = true;
    public render() {
        return this.t`${template}`;
    }

    public willRender() {
        if (this._firstRender) {
            this.histLegendLabels = this.species.filter(s => s !== "Other")
                    .map(s => {
                        const labels = [null, s];
                        const names = s.split("|");
                        const name = names[names.length - 1];
                        labels[0] = name.split("_")[2];
                        return labels;
                    }).sort();

            if (this.species.indexOf("Other")) this.histLegendLabels.push(["Other", "Other"]);

            const [min, max] = minmax(this.mainHeatmap.flat().filter(x => x > 0));
            // console.log([[min, max]);
            // this.mainRange = [Math.log10(min) , Math.log10(max)];
            this.mainRange = [computeLog(min) , computeLog(max)];
            const gradient = d3.scaleLinear()
                // .range([this.colors.start, this.colors.end])
                // .domain(this.mainRange);
                .range([this.colors.start, this.colors.org, this.colors.end])
                .domain([this.mainRange[0], (this.mainRange[1] + this.mainRange[0])/2
                            , this.mainRange[1]]);
                /* @debug
            this.debug.scale1 = (x) => d3.scaleLinear().range([0, 200])
                                    .domain([-5, 2])(x);
            this.debug.scale2 = (x) => d3.scaleLinear().range([0, 200])
                        .domain([min, max])(x);
            const debug = this.mainHeatmap.flat().filter(x => x > 0).sort();
            this.debug.data = [];
            for (let i = 0; i < debug.length; i += 6) {
                this.debug.data.push([computeLog(debug[i]), debug[i]]);
            }*/
            const div = (this.mainRange[1] - this.mainRange[0]) / 20;
            for (let i = 0; i <= 20; i ++) {
                this.mainGradientFills.push(gradient(this.mainRange[0] + i * div));
            }
            this.mainColorGetter = (d) => {
                if (d === 0)
                    return this.colors.na;
                else {
                    return gradient(computeLog(d));
                }
            };
            this.valueRange = [0, max];
            const mainH = this.species.length * this.gridH;
            if (mainH < this.mainHeight) {
                this.mainHeight = this.sizeSettings.mainHeight = mainH;
            } else {
                this.gridH = this.mainHeight / this.species.length;
            }
            const mainW = this.filteredSamples.length * this.gridW;
            if (mainW < this.mainWidth) {
                this.mainWidth = this.sizeSettings.mainWidth = mainW;
            } else {
                this.gridW = this.mainWidth / this.filteredSamples.length;
            }
            this.histLegendPos.x = this.offsetX + this.mainWidth + this.sizeSettings.gapX;
            this.mainLegendPos = {
                x: this.offsetX + this.mainWidth + this.sizeSettings.gapX + 100,
                y: this.sizeSettings.barHeight - 40,
            };
            this.boxLegendPos = {x: this.sizeSettings.offsetX + this.mainWidth
                        + this.sizeSettings.boxHeight,
                    y: this.sizeSettings.barHeight + this.sizeSettings.padding };
        }
        if (this._sizeUpdated) {
            this._sizeUpdated = false;
            this.mainWidth = this.filteredSamples.length * this.gridW;
            this.boxLegendPos = {x: this.sizeSettings.offsetX + this.mainWidth
                        + this.sizeSettings.boxHeight,
                    y: this.sizeSettings.barHeight + this.sizeSettings.padding };
            this.$v.size.width = this.mainWidth + this.sizeSettings.boxHeight
                + this.offsetX + 2 * this.sizeSettings.gapX + 2 * this.sizeSettings.padding;
        }
    }

    protected state = {
        activeX: null,
        activeY: null,
        newX: null,
        newHeight: null,
        mode: null,
        updated: null,
        dragStartPos: null,
        legendPos: null,
    };

    private setActive(x: number|string, y: number = null) {
        if (typeof x === "string") {
            const xPos = this.filteredSamples.indexOf(x) * this.gridW + this.offsetX;
            this.setState({activeX: xPos});
        } else
            this.setState({ activeX: x, activeY: y });
    }

    private controlMain(ev) {
        if (this.controllerMode === "zoom") {
            this.updateRange(ev);
        } else {
            this.$v.forceRedraw = false;
            this.updatePos(ev);
        }
    }
    private updateRange(ev) {
        const newHeight = (1 - ev.deltaY  / 1000) * this.mainHeight;
        this.mainHeight = newHeight > this.species.length * this.gridH ? this.species.length * this.gridH
                        : newHeight < 300 ? 300 : newHeight;
        this.setState({newHeight: this.mainHeight});
    }
    private updatePos(ev) {

        this.yPos = this.yPos + ev.deltaY > 0 ? 0
                : this.yPos + ev.deltaY < -this.mainHeight + 300
                    ? -this.mainHeight + 300 : this.yPos + ev.deltaY;
        this.setState({newX: this.yPos});
    }

    private swicthMode() {
        if (this.controllerMode === "zoom") {
            this.$v.forceRedraw = false;
            this.controllerMode = "scroll";
        } else {
            this.$v.forceRedraw = true;
            this.controllerMode = "zoom";
        }
        this.setState({ mode: this.controllerMode });
    }

    private fitSize() {
        this.fullDisplay = !this.fullDisplay;
        this.yPos = 0;
        this.$v.size.height = this.fullDisplay ? this.mainHeight + 450 : 750;
        this.$v.run();
        // this.setState({updated: true});
    }

    protected dragStart(ev, el) {
        const [x, y] = Oviz.utils.mouse(el.$parent, ev);
        this.setState({dragStartPos: {x, y}});
        el.$parent.$on["mousemove"] = (evp, elp) => {
            const [newX, newY] = Oviz.utils.mouse(elp, evp);
            if (el.id === "boxLegend") {
                this.boxLegendPos = {x: this.boxLegendPos.x + newX
                        - this.state.dragStartPos.x,
                    y: this.boxLegendPos.y + newY - this.state.dragStartPos.y};
            } else if (el.id === "histLegend") {
                this.histLegendPos = {x: this.histLegendPos.x + newX
                        - this.state.dragStartPos.x,
                    y: this.histLegendPos.y + newY - this.state.dragStartPos.y};
            } else {
                this.mainLegendPos = {x: this.mainLegendPos.x + newX
                        - this.state.dragStartPos.x,
                    y: this.mainLegendPos.y + newY - this.state.dragStartPos.y};
            }
            this.setState({dragStartPos: {x: newX, y: newY}});
        };
        el.stage = "dragging";
    }

    protected dragEnd(ev, el) {
        el.stage = null;
        delete el.$parent.$on["mousemove"];
        this.setState({dragStartPos: null});
        // this.setState({legendX: null, legendY: null});
    }
}
