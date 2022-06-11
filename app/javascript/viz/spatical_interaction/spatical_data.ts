import Oviz from "crux";
import { ColorScheme, ColorSchemeCategory, ColorSchemeGradient } from "crux/dist/color";
import { minmax } from "crux/dist/utils/math";
import { groupedColors2, rainbow1, rainbowL} from "oviz-common/palette";
// d3-scale-chromatic 这个模块提供了用来表示序列、发散以及分类的颜色方案
import { schemeRdPu, interpolateSpectral, schemeRdYlBu } from "d3-scale-chromatic";
import { findBoundsForValues} from "utils/maths";
import { parse } from "utils/newick";
import * as d3 from "d3";
//import { ColorSchemeNumeric } from "viz/heatmap/defs";
import { scaleLinear, ScaleSequential, scaleLog, scaleQuantize, scaleThreshold, scaleSequential } from "d3-scale";


//设置默认主题颜色
const defaultScheme = groupedColors2;


export function processGraph(v) {

    let newlabel = v.graphData.map(d=>d[v.graphData.columns[0]])
    newlabel = Array.from(new Set(newlabel))
    //console.log("newlabel:",newlabel)
    let featureList = v.graphData.map(d=>d["Feature"])
    let groupList = v.graphData.map(d=>d["Group"])

    let matrixSum = {}

    console.log("v.config.temp:",v.config.temp)


    matrixSum[v.selectedFeature] = {}
    matrixSum[v.selectedFeature][v.selectedGroup]=[]
    newlabel.forEach((m,t) => {
        let tempm = []
        newlabel.forEach((m,t) => {
            tempm.push(0)
        });
        matrixSum[v.selectedFeature][v.selectedGroup].push(tempm)
    });


    v.graphData.forEach((k,n) => {

        
        if(k.Feature == v.selectedFeature && k.Group == v.selectedGroup){
            let row = newlabel.indexOf(k.Row)
            //console.log(k.Row,row)
            let col = newlabel.indexOf(k.Col)
            k.Value == "NA"? k.Value= 0:null
            matrixSum[v.selectedFeature][v.selectedGroup][row][col] = (k.Value*1)
        }

    });


    var d = v.graphData 

    v.graphLabel = newlabel

    matrix = matrixSum[v.selectedFeature][v.selectedGroup]
    v.graphMatrix = matrix  



    v.graphCord = d3.chord()  
        .padAngle(0.1)     
        (v.graphMatrix)   
    

    let testgraphCord = d3.chord()  
        .padAngle(0.05)     
        .sortSubgroups(d3.descending) 
        (matrix)   
    
    v.graphMatrixScheme = ColorSchemeNumeric.create([schemeRdPu[3][0], schemeRdPu[3][2]], { type: "linear", domain: minmax(v.graphMatrix.flat())});
    

    v.graphNode = {}


    v.graphCord.groups.forEach((x, i) => {
        var label = v.graphLabel[x.index]
        if (!Object.keys(v.graphNode).includes(label)){ 
            x.label = label
            x.innerRadius = v.graphRadius - v.nodeRadius  
            x.outerRadius = v.graphRadius  
            x.circleAngle = x.index * 360/v.graphLabel.length 
            x.color = interpolateSpectral(i/v.graphLabel.length); 

            v.graphNode[label] = x 
        }
    });
    console.log('---graph---', v)
}




export function mapColor(cell){
    let colour
    let colorMap = {
        "Hematopoietic stem cell":"#bc0c00",
        "HSC":"#bc0c00",
        "Common lymphoid progenitor cell":"#0055bc",
        "CLP":"#0055bc",
        "B cell":"#45a7db",
        "B cells":"#45a7db",
        "B-cells":"#45a7db",
        "Bcell":"#45a7db",
        "B_cell":"#45a7db",
        "B_cells":"#45a7db",
        "Bcells":"#45a7db",
        "B cell mermory":"#a8c1fe",
        "B memory cells":"#a8c1fe",
        "B cells memory":"#a8c1fe",
        "B memory":"#a8c1fe",
        "B Memory":"#a8c1fe",
        "B cell naive":"#a8c1db",
        "B cells naive":"#a8c1db",
        
        "B naive cells":"#a8c1db",
        "naive B-cells":"#a8c1db",
        "B Naive":"#a8c1db",
        "B cell plasma":"#90c1db",
        "Class-switched memory B cell":"#f4a640",
        "Memory B-cells":"#f4a640",
        "Class-switched memory B-cells":"#f4a640",
        "Pro B cell":"#42c1db",
        "pro B-cells":"#42c1db",
        "Common lymphoid progeniotr":"#ffcb40",
        "NK cell":"#f4a640",
        "NK":"#f4a640",
        "NK cells":"#f4a640",
        "NKcells":"#f4a640",
        "NK_cells":"#f4a640",
        "NK cell actived":"#f4bc74",
        "NK cells activated":"#f4bc74",
  
        "NK cells resting":"#f4b28f",
        "NK cell resting":"#f4b28f",
  
        "Plasmacytoid dendritic cell (pDC)":"#f48940",
        "Plasma cells":"#f48940",
        "Plasma_cells":"#f48940",
        "Plasmablasts":"#f48940",
        "pDC cells":"#f48940",
        "pDCs":"#f48940",
        "pDC":"#f48940",
  
        "Cytotoxic cell":"#f46e40",
        "Cytotoxic":"#f46e40",
        "Cytotoxic cells":"#f46e40",
        "Cytotoxic_cells":"#f46e40",
        "Cytotoxic lymphocytes":"#f46e40",
  
        "T cell":"#dd3c67",
        "T cells":"#dd3c67",
  
        "T cell CD4+":"#3271c2",
        "T_cell.CD4":"#3271c2",
        "CD4_Tcells":"#3271c2",
        "CD4_T":"#3271c2",
        "T cells CD4":"#3271c2",
        "T_cells_CD4":"#3271c2",
        "T CD4 cells":"#3271c2",
  
        "T cell CD4+ (non-regulatory)":"#6b91ec",
        "CD4+ T-cells":"#6b91ec",
  
        "T cell regulatory (Tregs)":"#dd8683",
        "T_regulatory_cells":"#dd8683",
        "T cells regulatory (Tregs)":"#dd8683",
        "Tregs":"#dd8683",
  
        "T cell CD4+ Th1":"#b1c1ff",
        "Th1 cells":"#b1c1ff",
        "Th1":"#b1c1ff",
  
        "T cell CD4+ Th2":"#97c1ff",
        "Th2 cells":"#97c1ff",
        "Th2":"#97c1ff",
  
        "T cell CD4+ Th17":"#79c1ff",
        "Th17":"#79c1ff",
  
        "T cell CD4+ naive":"#79c1d6",
        "CD4+ naive T-cells":"#79c1d6",
        "T CD4 Naive":"#79c1d6",
        "CD4_naive":"#79c1d6",
        "T CD4 naive cells":"#79c1d6",
        "T cells CD4 naive":"#79c1d6",
        
        "T cell follicular helper(Tfh)":"#79c1c2",
        "Tfh":"#79c1c2",
        "T cells follicular helper":"#79c1c2",
        "Tfh cells":"#79c1c2",
  
        "induced Treg (iTreg)":"#89a2dd",
        "iTreg":"#89a2dd",
  
        "natural Treg (nTreg)":"#89a2c2",
        "nTreg":"#89a2c2",
  
        "Type 1 regular T cell (Trl)":"#89a2b3",
        "Tr1":"#89a2b3",
  
        "T cell CD4+ memory actived":"#dacfe0",
        "T cells CD4 memory activated":"#dacfe0",
        "T CD4 memory cells":"#dacfe0",
  
        "T cell CD4+ memory resting":"#c7cfe0",
        "T cells CD4 memory resting":"#c7cfe0",
        "T CD4 Memory":"#c7cfe0",
  
        "T cell CD4+ central memory (CD4+ Tcm)":"#a8cfe0",
        "CD4+ Tcm":"#a8cfe0",
  
        "T cell CD4+ effector memory (CD8+ Tem)":"#8bcfe0",
        "CD8+ Tem":"#8bcfe0",
        "T cell CD4+ effector memory (CD4+ Tem)":"#8bcfe0",
        "CD4+ Tem":"#8bcfe0",
  
        "T cell CD8+":"#426586",
        "T_cell.CD8":"#426586",
        " T cells CD8":"#426586",
        "CD8 T cells":"#426586",
        "T CD8 cells":"#426586",
        "CD8_Tcells":"#426586",
        "CD8_T":"#426586",
        "T cells CD8":"#426586",
        "T_cells_CD8":"#426586",
        "CD8+ T-cells":"#426586",
  
        "T cell CD8+ memory":"#576f86",
        "T CD8 Memory":"#576f86",
  
        "T cell CD8+ naive":"#588886",
        "CD8+ naive T-cells":"#588886",
        "T CD8 Naive":"#588886",
        "CD8_naive":"#588886",
        "T CD8 naive cells":"#588886",
  
        "T cell CD8+ central memory (CD8+ Tcm)":"#6c7986",
        "CD8+ Tcm":"#6c7986",
  
        "T cell CD8+ effector memory (CD8+ Tem)":"#6d7a9a",
        
        "T cell gamma delta (Tgd)":"#427a86",
        "T_cells_gamma_delta":"#427a86",
        "T cells gamma delta":"#427a86",
        "Gamma_delta":"#427a86",
  
        "Tgd cells":"#557d99",
        "T gd Vd2":"#557d99",
  
        "T gd non-Vd2":"#557d86",
  
        "T cell NK (NKT)":"#3371e1",
        "NKT cells":"#3371e1",
        "NKT":"#3371e1",
  
        "Mucosal assiociated invariant T cell (MAIT)":"#338fe1",
        "MAIT":"#338fe1",
        "Mucosal assiociated invariant T cell":"#338fe1",
        "MAIT cells":"#338fe1",
  
        "Memory cell":"#33aae2",
  
        "Central memory":"#72bee2",
        "Central_memory":"#72bee2",
  
        "Effector memory":"#72bed1",
        "Effector_memory":"#72bed1",
  
        "Exhausted T cell":"#33aac6",
        "Exhausted":"#33aac6",
  
        "Interstitial dendritic cell(iDC)":"#4000bc",
        "iDC":"#4000bc",
        "Dendritic cells":"#4000bc",
        "Dendritic_cells":"#4000bc",
  
        "Common mteloid progenitor cell (CMP)":"#bc0085",
        "CMP":"#bc0085",
  
        "Basophil":"#683157",
        "Basophils":"#683157",
        "Basophils LD":"#683157",
  
        "Common myeloid progenitor":"#9fc157",
        "Myeloid dendritic cells":"#9fc157",
        "mDCs":"#9fc157",
  
        "Granulocyte-monocyte progenitor (GMP)":"#ff393a",
        "GMP":"#ff393a",
  
        "Eosinophil":"#ce3157",
        "Eosinophils":"#ce3157",
  
        "Mast cell":"#ee243e",
        "Mast cells":"#ee243e",
        "Mast_cells":"#ee243e",
  
        "Mast cell activated":"#ee495e",
        "Mast cells activated":"#ee495e",
  
        "Mast cell resting":"#ee7d7e",
        "Mast cells resting":"#ee7d7e",
  
        "Megakaryocyte-erythroid progenitor cell(MEP)":"#c14b71",
        "MEP":"#c14b71",
  
        "Megakaryocyte":"#c1748d",
        "Megakaryocytes":"#c1748d",
  
        "Platelets":"#c195a3",
  
        "Erythrocytes":"#c17470",
  
        "Monocytic lineage":"#fd4a70",
  
        "B lineage":"#579dd3",
  
        "Marophage":"#fd71c3",
        "Marophages":"#fd71c3",
        "Macrophages":"#fd71c3",
        "Macrophage":"#fd71c3",
  
        "Macrphoage M0":"#fdd7ff",
        "Macrophages M0":"#fdd7ff",
  
        "Macrophage M1":"#fdd7d8",
        "Macrophages M1":"#fdd7d8",
        "Macrophages_M1":"#fdd7d8",
  
        "Macrophage M2":"#fdd7bb",
        "Macrophages M2":"#fdd7bb",
        "Macrophages_M2":"#fdd7bb",
  
        "Monocyte":"#fd718f",
        "Monocytes":"#fd718f", 
  
        "Monocytes C":"#fd8ea6",
  
        "Monocytes NC+1":"#fda1a6",
        "Monocytes NC+I":"#fda1a6",
  
        "Myeloid dendritic cell (mDC/cDC)":"#fd7161",
        "cDC":"#fd7161",
        "mDC cells":"#fd7161",
  
        "Dendritic cell activated":"#fd9d92",
        "Dendritic cells activated":"#fd9d92",
  
        "aDC cells":"#edbcd8",
        "aDC":"#edbcd8",
  
        "Dendritic cell resting":"#fd9d6a",
        "Dendritic cells resting":"#fd9d6a",
  
        "Neutrophil":"#ff5c5d",
        "Neutrophils":"#ff5c5d",
        "Neutrophils LD":"#ff5c5d",
  
        "T cell CD4+ memory":"#79c1e0",
        "CD4+ memory T-cells":"#79c1e0",
  
        "Mesenchymal stem cell (MSC)":"#edbcbc",
        "MSC":"#edbcbc",
  
        "Muscle cell (Myocytes)":"#ffd4d4",
        "Myocytes":"#ffd4d4",
  
        "Smooth muscle":"#edd4d4",
  
        "Skeletal muscle":"#cbbcbc",
  
        "Adipocyte":"#aabbbc",
  
        "Astrocytes":"#92bcbc",
  
        "Osteoblast":"#5ebbbc",
  
        "Neurons":"#cabcbc",
  
        "Chondrocyte":"#3b9ebc",
        "Chondrocytes":"#3b9ebc",
  
        "Fibroblast":"#3b90bc",
        "Fibroblasts":"#3b90bc",
  
        "Cancer associated fibroblasts (CAFS)":"#6ca0bc",
        "CAFs":"#6ca0bc",
  
        "Stromal cell":"#3b72bc",
  
        "Dendritic cell (DC)":"#00bc04",
        "DC cells":"#00bc04",
        "DC":"#00bc04",
  
        "Multipotential Progenitor (MPP)":"#e8e512",
        "MPP":"#e8e512",
  
        "Other cell":"#35478e",
        "other":"#35478e",
        "otherCells":"#35478e",
  
        "Cancer cell":"#293856",
        "Melanoma cell":"#56618e",
        "Ovarian carcinoma cell":"#a9618e",
  
        "Preadipocytes":"#293857",
        "Adipocytes":"#293857",
  
        "Pericytes":"#9ce27e",
        "mv Endothelial cells":"#b698cd",
        //"mv Endothelial cells":"#b698cd",
        "ly Endothelial cells":"#b698ac",
  
        "Endothelial cell":"#a977cd",
        "Endothelial":"#a977cd",
        "Endothelial cells":"#a977cd",
        "Endothelials":"#a977cd", 
  
        "Sebocytes":"#df8380",
  
        "Epithelial cell":"#dfa3a1",
        "Epithelial cells":"#dfa3a1",
  
        "Mesangial cells":"#bd577a",
        "Uncharacterized cell (other)":"#df80d2",
  
        "Melanocytes":"#dfa280",
        "Keratinocytes":"#dfa29e",
        "Hepatocytes":"#dfa2bd",
    }
    for (const [key, value] of Object.entries(colorMap)) {
        //console.log(`${key}: ${value}`);
        key == cell? colour = value:"black"
    }
    return colour
    
  }


  export class ColorSchemeNumeric implements ColorScheme {
    public scale: any;

    private type: ColorSchemeNumericOptions["type"] = "linear";
    private domain: ColorSchemeNumericOptions["domain"] = [0, 1];
    private nice: boolean = true;
    private nlegendPoints = 5;
    // private colors?: number[];
    // private bounds?: number[];

    constructor(public colors: [string, string, ...string[]] | ((t: number) => string) = ["red", "blue"], options?: ColorSchemeNumericOptions) {
        if (options) {
            this.type = options.type;
            this.domain = options.domain;
            switch (options.type) {
                case "linear":
                    if (typeof colors === "function") {
                        this.scale = scaleSequential(colors).domain(this.domain.slice(0, 2) as [number, number]).clamp(true);
                    } else {
                        this.scale = scaleLinear<string>().domain(this.domain).range(colors as string[]).clamp(true);
                    }
                    if (options.numLegendPoints) this.nlegendPoints = options.numLegendPoints;
                    break;
                // case "log":
                //     this.numberScale = scaleLog().range([0, 1]).domain(options.domain).clamp(true);
                //     if (options.base) this.numberScale.base(options.base);
                //     break;
                // case "threshold":
                //     const l1 = options.thresholds.length + (+options.minDistinct) + (+options.maxDistinct);
                //     const q1 = 1 / l1;
                //     this.colors = Array.from(Array(l1 + 1)).map((_, i) => i * q1);
                //     const bounds = [
                //         ...options.minDistinct ? [options.domain[0] + Number.EPSILON] : [],
                //         ...options.thresholds,
                //         ...options.maxDistinct ? [options.domain[1] - Number.EPSILON] : [],
                //     ];
                //     this.bounds = [options.domain[0]].concat(bounds).concat([options.domain[1]]);
                //     this.numberScale = scaleThreshold().range(this.colors).domain(bounds);
                //     break;
                // case "quantize":
                //     const l2 = options.groups - 1;
                //     const q2 = 1 / l2;
                //     this.colors = Array.from(Array(l2 + 1)).map((_, i) => i * q2);
                //     const range = options.domain[1] - options.domain[0];
                //     this.bounds = this.colors.map(d => options.domain[0] + d * range);
                //     this.numberScale = scaleQuantize().range(this.colors).domain(options.domain);
                //     break;
            }
        } else {
            if (typeof colors === "function") {
                this.scale = scaleSequential(colors).domain(this.domain as [number, number]).clamp(true);
            } else {
                this.scale = scaleLinear<string>().domain(this.domain).range(colors.slice(0, 2)).clamp(true);
            }
        }

        if ((typeof colors != "function") && this.nice) {
            this.scale.nice(this.nlegendPoints);
        }
    }

    public get(c: number) {
        return this.scale(c);
    }

    public legendData(exceedMin: boolean = false, exceedMax: boolean = false, allLabel: boolean = false) {
        switch (this.type) {
            case "linear":
                let ticks = [];
                if (typeof this.colors != "function") { // extract as property
                    ticks = this.scale.ticks(this.nlegendPoints);
                } else {
                    const partion: number = 1 / this.nlegendPoints;
                    for (let i = 0; i < this.nlegendPoints - 1; ++i) {
                        ticks.push(i * partion);
                    }
                    ticks.push(1);
                }

                const legendData = ticks.map((t, idx) => ({
                    label: allLabel ? t : (idx === 0 || idx === ticks.length - 1) ? t : " ",
                    fill: this.scale(t),
                })).reverse();

                if (exceedMax) legendData[0].label = ">=" + legendData[0].label;
                if (exceedMin) legendData[legendData.length - 1].label = "<=" + legendData[legendData.length - 1].label;

                return legendData;
        }
    }

    public static create(colors: [string, string, ...string[]] | ((t: number) => string), options?: ColorSchemeNumericOptions): ColorSchemeNumeric {
        return new ColorSchemeNumeric(colors, options);
    }
}
