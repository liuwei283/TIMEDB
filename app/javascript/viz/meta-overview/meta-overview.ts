import Oviz from "crux";
import template from "./template.bvt";
import { minmax, max } from "crux/dist/utils/math";
import * as d3 from "d3";

export class MetaOverview extends Oviz.Component {
    public colors:any;
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
    }
    private yPos = 0;
    private gridW = 6;
    private gridH = 12;
    private mainHeight = 300;
    private mainWidth = 1200;
    private controllerMode = "scroll";
    private offsetX = 150;

    private histLegendLabels;
    private mainRange = [];
    private mainGradientFills = [];
    private boxLegendPos = {x: 1000, y: 210};

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
            this.mainRange = [Math.log10(min) , Math.log10(max)];
            const gradient = d3.scaleLinear()
                //.range(["#FFEB3B", "#8E24AA"])
                .range(["#9999ff", "#ff9933"])
                .domain(this.mainRange);
            const div = (this.mainRange[1] - this.mainRange[0])/20;
            for (let i = 0; i <= 20; i ++) {
                this.mainGradientFills.push(gradient(this.mainRange[0] + i * div));
            }
            this.mainColorGetter = (d) => {
                if (d === 0)
                    return this.colors.na;
                else {
                    return d3.scaleLinear()
                        // .range(["hsl(50, 80%, 60%)", "hsl(10, 80%, 60%)"])
                        //.range(["#FFEB3B", "#8E24AA"])
                        .range(["#9999ff", "#ff9933"])
                        .domain(this.mainRange)(Math.log10(d));
                        //.domain([min , max])(d);
                }
            };
            this.valueRange = [0, max];
            // this.mainHeatmap.forEach(d => {
            //     console.log(max(d));
            // })
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

    private zoomMain(orientation: string, zoomIn :boolean = false) {
        if (orientation === "h") {

        } else {

        } 
    }

    protected dragStart(ev, el) {
        el.$parent.$on['mousemove'] = (evp, elp) => {
            let [legendX, legendY] = Oviz.utils.mouse(elp, evp);
            if (el.id === "boxLegend") {
                this.boxLegendPos = {x: legendX+35, y: legendY-30};
            }
            this.setState({legendX, legendY});
        }
        el.stage = "dragging";
    }

    protected dragEnd(ev, el) {
        delete el.$parent.$on['mousemove'];
        el.stage = null;
        this.setState({legendX:null, legendY:null});
    }
}
