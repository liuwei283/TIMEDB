import Oviz from "crux";
import { ColorScheme, ColorSchemeCategory, ColorSchemeGradient } from "crux/dist/color";
import { minmax } from "crux/dist/utils/math";
import { scaleLinear } from "d3-scale";
// import { schemeSet3 } from "d3-scale-chromatic";
import { groupedColors2, rainbow1, rainbowL} from "oviz-common/palette";
import { findBoundsForValues} from "utils/maths";

const defaultScheme = groupedColors2;

let nodeList: string[];

// const rainbow = [
//     "hsl(340, 82%, 73%)",
//     "hsl(355, 82%, 73%)",
//     "hsl(0, 73%, 72%)",
//     "hsl(14, 100%, 75%)",
//     "hsl(36, 100%, 74%)",
//     "hsl(45, 100%, 74%)",
//     "hsl(54, 90%, 72%)",
//     "hsl(66, 71%, 77%)",
//     "hsl(88, 50%, 76%)",
//     "hsl(100, 50%, 76%)",
//     "hsl(122, 37%, 74%)",
//     "hsl(148, 37%, 74%)",
//     "hsl(174, 42%, 65%)",
//     "hsl(187, 72%, 71%)",
//     "hsl(199, 92%, 74%)",
//     "hsl(207, 90%, 77%)",
//     "hsl(207, 90%, 77%)",
//     "hsl(231, 44%, 74%)",
//     "hsl(261, 46%, 74%)",
//     "hsl(287, 46%, 74%)",
//     "hsl(320, 47%, 71%)",
//     "#AF7AC5",
// ];
const rainbow = [
    "hsl(340, 85%, 73%)",
    "hsl(355, 85%, 73%)",
    "hsl(0, 78%, 72%)",
    "hsl(14, 100%, 75%)",
    "hsl(36, 100%, 74%)",
    "hsl(45, 100%, 74%)",
    "hsl(54, 95%, 72%)",
    "hsl(66, 76%, 77%)",
    "hsl(88, 55%, 76%)",
    "hsl(100, 55%, 76%)",
    "hsl(122, 43%, 74%)",
    "hsl(148, 43%, 74%)",
    "hsl(174, 47%, 65%)",
    "hsl(187, 77%, 71%)",
    "hsl(199, 97%, 74%)",
    "hsl(207, 95%, 77%)",
    "hsl(207, 95%, 77%)",
    "hsl(231, 50%, 74%)",
    "hsl(261, 50%, 74%)",
    "hsl(287, 50%, 74%)",
    "hsl(320, 52%, 71%)",
    "#AF7AC5",
];
const brewPalette = [
    "#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#d9d9d9",
    "#bc80bd",
    "#ccebc5",
    "#ffed6f",
];

const rainbow2 = [
    "#EC7063", "#E74C3C", "#F5B7B1", "#E59866", "#DC7633",
    "#D35400", "#F0B27A", "#F5B041", "#F39C12", "#F7DC6F",
    "#F4D03F", "#F1C40F", "#82E0AA", "#58D68D", "#28B463",
    "#76D7C4", "#3498DB", "#85C1E9", "#3498DB", "#D2B4DE",
    "#AF7AC5",
];
const rainbow3 = [
    "#FE2712", "#E74C3C", "#CB4335", "#FB9902", "#FCBA12",
    "#FDDC22", "#FDED2A", "#FEFE33", "#CBE432", "#98CA32",
    "#66B032", "#559E54", "#448D76", "#347B98", "#6395F2",
    "#678FFE", "#8C78E8", "#905BEC", "#A33AF2", "#C91BFE",
    "#ED5094",
];
//", const paletteColors = ["#900", "#ffc", "#009"];
const paletteColors = ["#9e0142", "#ffffbf", "#313695"];

export function main(d) {
    const speciesLabel = d.columns[0];
    this.data.samples = this.data.filteredSamples = d.columns.splice(1, d.columns.length - 1);
    this.data.mainDict = {};
    d.forEach(x => {
        const temp = {...x};
        const speciesID = temp[speciesLabel];
        delete temp[speciesLabel];
        Object.keys(temp).forEach(k => {
            temp[k] = parseFloat(temp[k]);
        });
        this.data.mainDict[speciesID] = temp;
    });
    this.data.mainHeatmap = [];
    const spComp = [];
    this.data.species.forEach(s => {
        const row = [];
        d.forEach(x => {
            if (x[speciesLabel] === s) {
                this.data.samples.forEach(k => {
                    row.push(parseFloat(x[k]));
                });
            }
        });
        spComp.push({
            id: s,
            sum: row.reduce((a, b) => a + b, 0),
        });
        this.data.mainHeatmap.push(row);
    });
    const top5species = spComp.sort((a, b) => a.sum - b.sum)
          .splice(0, 21)
          .map(x => x.id)
          .sort((a, b) => {
              if (a === "Other") return 1;
              else if (b === "Other") return -1;
              else {
                const getLastRank = (s): string => {
                    const names = s.split("|");
                    const name = names[names.length - 1];
                    return name.split("_")[2];
                };
                if (getLastRank(a) < getLastRank(b)) return -1;
                else return 1;
              }
          });
    const spDict = {};
    d.forEach(x => {
        const datum = {...x};
        delete datum[speciesLabel];
        Object.keys(datum).forEach(k => datum[k] = parseFloat(datum[k]));
        spDict[x[speciesLabel]] = datum;
    });
    this.data.hist = {
                    indexes: [...top5species],
                    result: {}};
    top5species.forEach(k => {
        this.data.hist.result[k] = Object.keys(spDict[k])
                            .map(x => [x, spDict[k][x]]);
        delete spDict[k];
    });
    const otherData = {};
    Object.keys(spDict).forEach(sp => {
        Object.keys(spDict[sp]).forEach(sm => {
            if (!otherData[sm]) otherData[sm] = spDict[sp][sm];
            else
                otherData[sm] += spDict[sp][sm];
        });
    });

    this.data.hist.colorMap = {};
    const palette = scaleLinear().domain([0, 1, 2]).range(paletteColors);
    top5species.forEach((x, i) => {
        // let hslString = rainbow1[i % 16];
        // if (i >= 16) {
        //     const div = Math.floor(i / 16);
        //     const attrs = hslString.split("(")[1].substring(0, hslString.length - 1);
        //     const h = parseFloat(attrs.split(",")[0]);
        //     const s = parseInt(attrs.split(",")[1].substring(0, hslString.length - 1)) + 5;
        //     const l = parseInt(attrs.split(",")[2].substring(0, hslString.length - 1)) - 10;
        //     hslString =  `hsl(${h},${s}%,${l}%)`;
        // }
        // this.data.hist.colorMap[x] = hslString;
        this.data.hist.colorMap[x] = rainbow[i];
    });
}

export function getLeafOrder(rootNode): string[] {
    nodeList = [];
    sortTree(rootNode);
    return nodeList;
}

export function meta(d) {
    const sampleIdKey = d.columns[0];
    this.data.metaFeatures = d.columns.slice(1, d.columns.length);
    this.data.metaDict = {};
    d.forEach(x => {
        const sampleId = x[sampleIdKey];
        delete x[sampleIdKey];
        this.data.metaDict[sampleId] = x;
    });
    this.data.metaData = {};
    this.data.metaInfo = {};
    this.data.discaredFeatures = [];
    let curPos = 0;
    this.data.metaFeatures.forEach((k, i) => {
        if (k === "Age" || k === "age" || k === "BMI") {
            const [min, max] = minmax(d.map(x => x[k]));
            this.data.metaInfo[k] = new MetaInfo(k, true, min, max, []);
            this.data.metaData[k] = this.data.samples.map(x => this.data.metaDict[x][k]);
        } else {
            const values = d.map(x => x[k]).reduce((a, x) => {
                if (a.indexOf(x) < 0 && x !== "NA") a.push(x);
                return a;
            }, []);
            if (values.length > 6) {
                this.data.discaredFeatures.push(k);
                this.data.metaFeatures.splice(i, 1);
                // alert(`Meta info "${k}" contains more than 6 categories, will not be drawn`);
            } else {
                this.data.metaInfo[k] = new MetaInfo(k, false, null, null, values,
                    curPos + values.length <= brewPalette.length ?
                        brewPalette.slice(curPos, curPos + values.length) : null);
                this.data.metaData[k] = this.data.samples.map(x => this.data.metaDict[x][k]);
                curPos += values.length;
            }
        }
    });
    // compute left boxplot
    const categories = [...this.data.species];
    const classifications = this.data.metaInfo["Group"].values;
    const boxData = [{values: [], outliers: [], means: [], categories}, {values: [], outliers: [], means: [], categories}];
    const allValues = [];
    categories.forEach((c, i) => {
        const initialData = [[], []];
        this.data.samples.forEach(s => {
            allValues.push(this.data.mainDict[c][s]);
            if (this.data.metaDict[s].Group === classifications[0]) {
                initialData[0].push(this.data.mainDict[c][s]);
                // initialData[0].push(Math.log10(parseFloat(mainDict[c][s])));
            } else {
                initialData[1].push(this.data.mainDict[c][s]);
                // initialData[1].push(Math.log10(parseFloat(mainDict[c][s])));
            }
        });
        classifications.forEach((_, j) => {
            const result = [];
            const stat1 = new Oviz.algo.Statistics(initialData[j]);
            const interQuartileRange = stat1.Q3() - stat1.Q1();
            initialData[j].forEach(d => {
                if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                    boxData[j].outliers.push([i, d]);
                } else {
                    result.push(d);
                }
            });
            const stat2 = new Oviz.algo.Statistics(result);
            boxData[j].values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
            boxData[j].means.push(stat2.mean());
        });
    });
    const valueRange = findBoundsForValues(allValues, 2);
    this.data.boxplot = {categories, classifications, boxData, valueRange};
}

export class MetaInfo {
    public static keys = [
        "isNumber",
        "useNumber",
        "useGroup",
        "min",
        "max",
        "groupCount",
        "useThres",
        "thres",
        "minDistinct",
        "maxDistinct",
        "values",
        "colorMap",
        "colorStart",
        "colorEnd",
        "rangeMin",
        "rangeMax",
    ];
    public useNumber = false;
    public useGroup = false;
    public groupCount = 4;
    public useThres = false;
    public thres: number[] = [];
    public minDistinct = false;
    public maxDistinct = false;

    public rangeMin: number;
    public rangeMax: number;
    public colorStart = "#f7fcfd";
    // public colorEnd = "#006d2c";
    public colorEnd = "#0247FE";
    public colorMap: Record<string, string> = null;

    private simpleKey: string;
    private scheme: ColorScheme;
    private schemeSet;

    constructor(public key: string, public isNumber: boolean, public min: number,
            public max: number, public values: string[], schemeSet = defaultScheme) {
        this.useNumber = isNumber;
        this.rangeMin = min;
        this.rangeMax = max;
        this.simpleKey = key.replace(/\(|\)| /g, "_");
        this.schemeSet = schemeSet;
        this.updateColorGetter();
    }

    public updateColorGetter() {
        if (this.colorMap === null && this.values) {
            this.colorMap = ColorSchemeCategory.create(this.values, this.schemeSet as string[]).colors;
        }
        if (this.useNumber) {
            let opt;
            if (this.useGroup) {
                if (this.useThres) {
                    opt = {
                        type: "threshold",
                        thresholds: this.thres,
                        domain: [this.min, this.max],
                        minDistinct: this.minDistinct,
                        maxDistinct: this.maxDistinct,
                    };
                } else {
                    opt = {
                        type: "quantize",
                        groups: this.groupCount,
                        domain: [this.min, this.max],
                    };
                }
            } else {
                opt = { type: "linear", domain: [this.rangeMin, this.rangeMax] };
            }
            this.scheme = ColorSchemeGradient.create(this.colorStart, this.colorEnd, opt);
            // v.defineGradient(`md_${this.simpleKey}`, "horizontal", [this.colorStart, this.colorEnd]);
        } else {
            this.scheme = new ColorSchemeCategory(this.colorMap);
        }
    }

    public color(c: number | string) {
        if (c === "NA" || Number.isNaN(c) ) return NaN;
        return this.scheme.get(c);
    }

    public legendData() {
        if (this.useNumber && !this.useGroup) {
            return [null, `md_${this.simpleKey}`, this.rangeMin, this.rangeMax];
        }
        const lgData = this.scheme.legendData();
        return this.useNumber ? lgData : this.values.map(v => lgData.find(x => x.label === v));
    }

    public toObject() {
        const obj = { hasValues: !!this.values };
        for (const k of MetaInfo.keys) obj[k] = this[k];
        return obj;
    }

    public update(v: any, obj: any) {
        for (const k of MetaInfo.keys) {
            if (k === "thres" || (k === "values" && obj[k])) {
                this[k] = [...obj[k]];
            } else {
                this[k] = obj[k];
            }
        }
        this.updateColorGetter();
    }
}

function sortTree(d): any {
    if (d.children) {
        d.children.forEach(c => {
            sortTree(c);
        });
    } else {
        nodeList.push(d.name);
    }
}

export function filterSamples(v: any) {
    const hidden: Set<string> = v.data.hiddenSamples;
    v.data.filteredSamples = v.data.samples.filter(s => !hidden.has(s));
    v.data.sampleCount = v.data.filteredSamples.length;
    Object.keys(v.data.hist.result).forEach(k => {
        v.data.hist.result[k] = v.data.filteredSamples.map(x => [x, v.data.mainDict[k][x]]);
    });
    Object.keys(v.data.metaData).forEach(k => {
        v.data.metaData[k] = v.data.filteredSamples.map(x => v.data.metaDict[x][k])
    });
    v.data.mainHeatmap = v.data.mainHeatmap.map((_, i) => {
        return v.data.filteredSamples.map(s => 
            v.data.mainDict[v.data.species[i]][s]);
    });
}

export class GradientBar {
    public colors: string[];
    public stops: number[];
    private getColor: any;
    constructor(colors, stops) {
        this.colors = colors;
        this.stops = stops;
        this.getColor = d3.scaleLinear().range(colors).domain(stops);
    }
}
