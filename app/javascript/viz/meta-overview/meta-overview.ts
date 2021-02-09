import Oviz from "crux";
import template from "./template.bvt";
import { minmax, max } from "crux/dist/utils/math";
import * as d3 from "d3";

export class MetaOverview extends Oviz.Component {
    public ovMain: any;
    public ovTree: any;
    public mainHeatmap: number[][];
    public samples: string[];
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
    private colors = ["pink", "skyblue"];
    private fullDisplay = false;

    private yPos = 0;
    private gridH = 12;
    private mainHeight = 300;
    private controllerMode = "scroll";
    public render() {
        return this.t`${template}`;
    }

    public willRender() {
        if (this._firstRender) {
            const [min, max] = minmax(this.mainHeatmap.flat().filter(x => x > 0));
            this.mainColorGetter = (d) => {
                if (d === 0)
                    return "#aaa";
                else {
                    return d3.scaleLinear()
                        .range(["hsl(50, 80%, 60%)", "hsl(10, 80%, 60%)"])
                        .domain([Math.log10(min) , Math.log10(max)])(Math.log10(d));
                }
            };
            this.valueRange = [0, max];
            // this.mainHeatmap.forEach(d => {
            //     console.log(max(d));
            // })
        }

        if (this.sampleOrderChanged) {
            const sortIndex = "Group";
            // const sortSample = [...this.samples];
            this.samples.sort((a, b) => {
                return this.metaDict[a][sortIndex] < this.metaDict[b][sortIndex] ? -1 : 1;
            });
            console.log(this.samples.slice(0,10).map(x => this.metaDict[x][sortIndex]));
            this.species.forEach((spc, i) => {
                this.samples.forEach((sample, j) => {
                    this.mainHeatmap[i][j] = this.mainDict[spc][sample];
                });
            });
            this.metaFeatures.forEach(k => {
                this.metaData[k] = this.samples.map(x => this.metaDict[x][k]);
            });
            this.sampleOrderChanged = false;
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

    private setActive(x: number, y: number) {
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
        console.log(this.mainHeight);
        this.setState({newHeight: this.mainHeight});
    }
    private updatePos(ev) {

        this.yPos = this.yPos + ev.deltaY > 0 ? 0
                : this.yPos + ev.deltaY < -this.mainHeight + 300
                    ? -this.mainHeight + 300 : this.yPos + ev.deltaY;
        console.log(this.yPos);
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
}
