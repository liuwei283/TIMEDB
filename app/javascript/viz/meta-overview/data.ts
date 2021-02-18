import Oviz from "crux";
import { minmax } from "crux/dist/utils/math";
import { ColorScheme, ColorSchemeCategory, ColorSchemeGradient } from "crux/dist/color";
import { schemeSet3 } from "d3-scale-chromatic";
import { rainbowL,groupedColors2, rainbow1} from "oviz-common/palette";
import * as d3 from "d3";

const schemeSet = groupedColors2;

let nodeList: string[];

const rainbow = [ "hsl(340, 82%, 76%)",
"hsl(0, 73%, 77%)",
"hsl(14, 100%, 78%)",
"hsl(36, 100%, 75%)",
"hsl(45, 100%, 75%)",
"hsl(54, 90%, 72%)",
"hsl(66, 71%, 77%)",
"hsl(88, 50%, 76%)",
"hsl(122, 37%, 74%)",
"hsl(174, 42%, 65%)",
"hsl(187, 72%, 71%)",
"hsl(199, 92%, 74%)",
"hsl(207, 90%, 77%)",
"hsl(207, 90%, 77%)",
"hsl(231, 44%, 74%)",
"hsl(261, 46%, 74%)",
"hsl(291, 47%, 71%)",
];

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
          .map(x => x.id);
    const spDict = {};
    d.forEach(x => {
        const datum = {...x};
        delete datum[speciesLabel];
        Object.keys(datum).forEach(k => datum[k] = parseFloat(datum[k]));
        spDict[x[speciesLabel]] = datum;
    });
    this.data.hist = {
                    indexes: [...top5species],
                    // indexes: [...top10species, "other"],
                    result: {}};
    top5species.forEach(k => {
        this.data.hist.result[k] = Object.keys(spDict[k])
                            .map(x => [x, spDict[k][x]]);
        delete spDict[k];
    });
    const otherData = {};
    Object.keys(spDict).forEach(sp => {
        Object.keys(spDict[sp]).forEach(sm => {
            if (!otherData[sm])                otherData[sm] = spDict[sp][sm];
            else
                otherData[sm] += spDict[sp][sm];
        });
    });
    // this.data.hist.colorMap = Oviz.color.schemeCategory("light", top5species).colors;
    // console.log(this.data.hist.colorMap);
    // this.data.hist.colors = Object.values(this.data.hist.colorMap);

    this.data.hist.colors = schemeSet;
    this.data.hist.colorMap = {};
    top5species.forEach((x, i) => {
        this.data.hist.colorMap[x] = rainbowL[i % 16];
    });
    // this.data.hist.result.other = Object.keys(otherData)
    //                         .map(x => [x, otherData[x]]);
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
            if (values.length> 6) {
                this.data.discaredFeatures.push(k);
                this.data.metaFeatures.splice(i, 1);
                // alert(`Meta info "${k}" contains more than 6 categories, will not be drawn`);
            } else {
                this.data.metaInfo[k] = new MetaInfo(k, false, null, null, values);
                this.data.metaData[k] = this.data.samples.map(x => this.data.metaDict[x][k]);
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
    const valueRange = minmax(allValues);
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
    public colorStart = "#e5f0ff";
    public colorEnd = "#1a79ff";
    public colorMap: Record<string, string> = null;

    private simpleKey: string;
    private scheme: ColorScheme;

    constructor(public key: string, public isNumber: boolean, public min: number, public max: number, public values: string[]) {
        this.useNumber = isNumber;
        this.rangeMin = min;
        this.rangeMax = max;
        this.simpleKey = key.replace(/\(|\)| /g, "_");
        this.updateColorGetter();
    }

    public updateColorGetter() {
        if (this.colorMap === null && this.values) {
            this.colorMap = ColorSchemeCategory.create(this.values, schemeSet as string[]).colors;
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
