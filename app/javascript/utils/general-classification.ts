import Oviz from "crux";

export function C16Classifier(data) {
    // the data should not dsvHasHeader
    const result = {}
    const mapper = {}
    data.slice(1).forEach(d=>{
        if(result["C"+d[1]] == null) result["C"+d[1]] = [];
        result["C"+d[1]].push(d[0]);
        mapper[d[0]] = "C"+d[1];
    });
    return {group: result, mapper};
}

export function T(data) {
    return data[0]? data[0].map((col, i) => {
        return data.map(d=>d[i])
    }) : []
}

export function C16Processor(row) {
    const stat = new Oviz.algo.Statistics(row);
    return [stat.min(), stat.Q1(), stat.median(), stat.Q3(), stat.max(), stat.mean()]
}

export function CellProcessor(data, c16Classification) {
    // // the data should not dsvHasHeader
    // // rows are C16, cols are gene
    // // matrix is Array<col>, process for each gene to get the col
    // c16Classification = c16Classification.group;
    // const result = {};
    // const classifications = Object.keys(c16Classification).sort();
    // data.forEach(d => {
    //     Object.entries(c16Classification).forEach(([key, value]: [string, string[]]) => {
    //         if(result[key] == null) result[key] = {};
    //         if(isNaN( value.map( val => parseFloat(d[val]) )[0] ) ) return;
    //         result[key][d[""]] = C16Processor(value.map(val => parseFloat(d[val])))
    //     });
    // });
    // const colorMap = Oviz.color.schemeCategory("light", classifications);
    // return {stat: result, classifications, colorMap, valueRange: [0, 1], ylabel: "Mean Fraction with Standard Error"};

    // the data should not dsvHasHeader
    // rows are C16, cols are gene
    // matrix is Array<col>, process for each gene to get the col
    let c16map = c16Classification.mapper;
    c16Classification = c16Classification.group;
    const result = {};
    const classifications = Object.keys(c16Classification).sort();
    let cellType = data[0].slice(2);
    Object.entries(c16Classification).forEach(([key, value]: [string, string[]]) => {
        result[key] = {};
        cellType.forEach(cell => result[key][cell] = []);
    });
    data.slice(1).forEach(d => {
        if(c16map[d[0]] == null) return;
        if(d[0]==""||d[0]==null) return;
        d.slice(2).forEach((cell, index) => {
            if(isNaN(parseFloat(cell))) return;
            result[c16map[d[0]]][cellType[index]].push(parseFloat(cell))
        })
    });
    Object.entries(c16Classification).forEach(([key, value]: [string, string[]]) => {
        cellType.forEach(cell => {
            let temp = [0,0,0,0,0,0];
            if(result[key][cell] != [] && result[key][cell].length != 0) temp = C16Processor(result[key][cell]);
            result[key][cell] = temp;
        });
    })
    const colorMap = Oviz.color.schemeCategory("light", classifications);
    return {stat: result, classifications, colorMap, valueRange: [0, 1], ylabel: "Mean Fraction with Standard Error"};
}

export function RNAProcessor(data, c16Classification ) {
    // the data should dsvHasHeader
    // rows are C16, cols are gene
    // matrix is Array<col>, process for each gene to get the col
    c16Classification = c16Classification.group;
    const result = {};
    data.forEach(d => {
        let gene = d["GeneSymbol"];
        result[gene] = [];
        Object.entries(c16Classification).forEach(([key, value]: [string, string[]]) => {
            result[gene].push(C16Processor(value.map(val => parseFloat(d[val])))[5]);
        })
    });
    const ret = {};
    const rowNames = Object.keys(c16Classification).sort();
    Object.entries(categoryMapper).forEach(([key, genes]) => {
        ret[key] = {rowNames: rowNames, colNames: [], matrix: []}
        genes.forEach(gene => {
            if(result[gene] != null) {
                ret[key].colNames.push(gene);
                ret[key].matrix.push(result[gene]);
            }
        })
        ret[key].matrix = T(ret[key].matrix);
    });
    return ret;
}

export function ClinicalProcessor(data, c16Classification ) {
    // the data should dsvHasHeader
    const result = {};
    const categories = [];
    const group = Object.keys(c16Classification.group).sort();
    const valid = Object.keys(c16Classification.mapper);
    const mapper = c16Classification.mapper;
    const survivalData = {os: {}, pfs: {}};
    Object.entries(c16Classification.mapper).forEach((d: [string, string]) => {
        mapper[d[0].slice(0,12)] = d[1];
    });
    const widMap = {};
    const idKey = "sample_name";
    const osKey = "os";
    const pfsKey = "pfs";
    group.forEach(c => {
        result[c] = {};
        survivalData.os[c] = [];
        survivalData.pfs[c] = [];
    });
    data.columns.forEach(col => {
        if(col.slice(0, 2) == "c_") {
            data.forEach(d => {
                if(! valid.includes(d[idKey])) return;
                let colName = col.slice(2)+"__"+d[col];
                if(widMap[colName] == null) {
                    widMap[colName] = 0;
                    categories.push(colName);
                    group.forEach(g => result[g][colName] = 0);
                };
                if(mapper[d[idKey]] != null) {
                    ++widMap[colName];
                    ++result[mapper[d[idKey]]][colName];
                    // survivalData.os[mapper[d[idKey]]].push(parseFloat(d[osKey]));
                    // survivalData.pfs[mapper[d[idKey]]].push(parseFloat(d[pfsKey]));
                }
            });
        }
    });
    data.forEach(d => {
        if(! valid.includes(d[idKey])) return;
        if(mapper[d[idKey]] != null) {
            survivalData.os[mapper[d[idKey]]].push(parseFloat(d[osKey]));
            survivalData.pfs[mapper[d[idKey]]].push(parseFloat(d[pfsKey]));
        }
    });
    group.forEach(g => {
        result[g] = Object.entries(result[g]).map((d: [string, number]) => [d[0], d[1]/widMap[d[0]]]);
    });
    const colorMap = Oviz.color.schemeCategory("light", group);
    return {data: result, classifications: group, widMap, colorMap, survivalData};
}

export const CheckPoints = ["Inhibitory", "Stimulatory", "NA"];

export const nameMapper = {
    "ADORA2A": {
        "FriendlyName": "ADORA2A",
        "CheckPoint": "Inhibitory"
    },
    "ARG1": {
        "FriendlyName": "ARG1",
        "CheckPoint": "Inhibitory"
    },
    "BTLA": {
        "FriendlyName": "BTLA",
        "CheckPoint": "Inhibitory"
    },
    "BTN3A1": {
        "FriendlyName": "BTN3A1",
        "CheckPoint": "Stimulatory"
    },
    "BTN3A2": {
        "FriendlyName": "BTN3A2",
        "CheckPoint": "Stimulatory"
    },
    "CCL5": {
        "FriendlyName": "RANTES",
        "CheckPoint": "Stimulatory"
    },
    "CD27": {
        "FriendlyName": "CD27",
        "CheckPoint": "Stimulatory"
    },
    "CD274": {
        "FriendlyName": "PD-L1",
        "CheckPoint": "Inhibitory"
    },
    "CD276": {
        "FriendlyName": "CD276",
        "CheckPoint": "Inhibitory"
    },
    "CD28": {
        "FriendlyName": "CD28",
        "CheckPoint": "Stimulatory"
    },
    "CD40": {
        "FriendlyName": "CD40",
        "CheckPoint": "Stimulatory"
    },
    "CD40LG": {
        "FriendlyName": "CD40LG",
        "CheckPoint": "Stimulatory"
    },
    "CD70": {
        "FriendlyName": "CD70",
        "CheckPoint": "Stimulatory"
    },
    "CD80": {
        "FriendlyName": "CD80",
        "CheckPoint": "Stimulatory"
    },
    "CTLA4": {
        "FriendlyName": "CTLA4",
        "CheckPoint": "Inhibitory"
    },
    "CX3CL1": {
        "FriendlyName": "CX3CL1",
        "CheckPoint": "Stimulatory"
    },
    "CXCL10": {
        "FriendlyName": "IP-10",
        "CheckPoint": "Stimulatory"
    },
    "CXCL9": {
        "FriendlyName": "CXCL9",
        "CheckPoint": "Stimulatory"
    },
    "EDNRB": {
        "FriendlyName": "EDNRB",
        "CheckPoint": "Inhibitory"
    },
    "ENTPD1": {
        "FriendlyName": "ENTPD1",
        "CheckPoint": "Stimulatory"
    },
    "GZMA": {
        "FriendlyName": "GZMA",
        "CheckPoint": "Stimulaotry"
    },
    "HAVCR2": {
        "FriendlyName": "TIM-3",
        "CheckPoint": "Inhibitory"
    },
    "HLA-A": {
        "FriendlyName": "HLA-A",
        "CheckPoint": "NA"
    },
    "HLA-B": {
        "FriendlyName": "HLA-B",
        "CheckPoint": "NA"
    },
    "HLA-C": {
        "FriendlyName": "HLA-C",
        "CheckPoint": "NA"
    },
    "HLA-DPA1": {
        "FriendlyName": "HLA-DPA1",
        "CheckPoint": "NA"
    },
    "HLA-DPB1": {
        "FriendlyName": "HLA-DPB1",
        "CheckPoint": "NA"
    },
    "HLA-DQA1": {
        "FriendlyName": "HLA-DQA1",
        "CheckPoint": "NA"
    },
    "HLA-DQA2": {
        "FriendlyName": "HLA-DQA2",
        "CheckPoint": "NA"
    },
    "HLA-DQB1": {
        "FriendlyName": "HLA-DQB1",
        "CheckPoint": "NA"
    },
    "HLA-DQB2": {
        "FriendlyName": "HLA-DQB2",
        "CheckPoint": "NA"
    },
    "HLA-DRA": {
        "FriendlyName": "HLA-DRA",
        "CheckPoint": "NA"
    },
    "HLA-DRB1": {
        "FriendlyName": "HLA-DRB1",
        "CheckPoint": "NA"
    },
    "HLA-DRB3": {
        "FriendlyName": "HLA-DRB3",
        "CheckPoint": "NA"
    },
    "HLA-DRB4": {
        "FriendlyName": "HLA-DRB4",
        "CheckPoint": "NA"
    },
    "HLA-DRB5": {
        "FriendlyName": "HLA-DRB5",
        "CheckPoint": "NA"
    },
    "HMGB1": {
        "FriendlyName": "HMGB1",
        "CheckPoint": "Stimulatory"
    },
    "ICAM1": {
        "FriendlyName": "ICAM1",
        "CheckPoint": "Stimulatory"
    },
    "ICOS": {
        "FriendlyName": "ICOS",
        "CheckPoint": "Stimulatory"
    },
    "ICOSLG": {
        "FriendlyName": "ICOSLG",
        "CheckPoint": "Stimulatory"
    },
    "IDO1": {
        "FriendlyName": "IDO1",
        "CheckPoint": "Inhibitory"
    },
    "IFNA1": {
        "FriendlyName": "IFNA1",
        "CheckPoint": "Stimulatory"
    },
    "IFNA2": {
        "FriendlyName": "IFNA2",
        "CheckPoint": "Stimulatory"
    },
    "IFNG": {
        "FriendlyName": "IFNG",
        "CheckPoint": "Stimulatory"
    },
    "IL10": {
        "FriendlyName": "IL10",
        "CheckPoint": "Inhibitory"
    },
    "IL12A": {
        "FriendlyName": "IL12",
        "CheckPoint": "Stumulatory"
    },
    "IL13": {
        "FriendlyName": "IL13",
        "CheckPoint": "Inhibitory"
    },
    "IL1A": {
        "FriendlyName": "IL1A",
        "CheckPoint": "Stimulatory"
    },
    "IL1B": {
        "FriendlyName": "IL1B",
        "CheckPoint": "Stimulatory"
    },
    "IL2": {
        "FriendlyName": "IL2",
        "CheckPoint": "Stimulatory"
    },
    "IL2RA": {
        "FriendlyName": "IL2RA",
        "CheckPoint": "Stimulatory"
    },
    "IL4": {
        "FriendlyName": "IL4",
        "CheckPoint": "Inhibitory"
    },
    "ITGB2": {
        "FriendlyName": "ITGB2",
        "CheckPoint": "Stimulatory"
    },
    "KIR2DL1": {
        "FriendlyName": "KIR2DL1",
        "CheckPoint": "Inhibitory"
    },
    "KIR2DL2": {
        "FriendlyName": "KIR2DL2",
        "CheckPoint": "Inhibitory"
    },
    "KIR2DL3": {
        "FriendlyName": "KIR2DL3",
        "CheckPoint": "Inhibitory"
    },
    "LAG3": {
        "FriendlyName": "LAG3",
        "CheckPoint": "Inhibitory"
    },
    "MICA": {
        "FriendlyName": "MICA",
        "CheckPoint": "NA"
    },
    "MICB": {
        "FriendlyName": "MICB",
        "CheckPoint": "NA"
    },
    "PDCD1": {
        "FriendlyName": "PD-1",
        "CheckPoint": "Inhibitory"
    },
    "PDCD1LG2": {
        "FriendlyName": "PD-L2",
        "CheckPoint": "NA"
    },
    "PRF1": {
        "FriendlyName": "PRF1",
        "CheckPoint": "Stimulatory"
    },
    "SELP": {
        "FriendlyName": "SELP",
        "CheckPoint": "Stimulatory"
    },
    "SLAMF7": {
        "FriendlyName": "SLAMF7",
        "CheckPoint": "Inhibitory"
    },
    "TGFB1": {
        "FriendlyName": "TGFB1",
        "CheckPoint": "Inhibitory"
    },
    "TIGIT": {
        "FriendlyName": "TIGIT",
        "CheckPoint": "Inhibitory"
    },
    "TLR4": {
        "FriendlyName": "TLR4",
        "CheckPoint": "Stimulatory"
    },
    "TNF": {
        "FriendlyName": "TNF",
        "CheckPoint": "Stimulatory"
    },
    "TNFRSF14": {
        "FriendlyName": "HVEM",
        "CheckPoint": "Stimulatory"
    },
    "TNFRSF18": {
        "FriendlyName": "TNFRSF18",
        "CheckPoint": "Stimulatory"
    },
    "TNFRSF4": {
        "FriendlyName": "OX40",
        "CheckPoint": "Stimulatory"
    },
    "TNFRSF9": {
        "FriendlyName": "4-1BB",
        "CheckPoint": "Stimulatory"
    },
    "TNFSF4": {
        "FriendlyName": "OX40L",
        "CheckPoint": "Stimulatory"
    },
    "TNFSF9": {
        "FriendlyName": " 4-1BB-L",
        "CheckPoint": "Stimulatory"
    },
    "VEGFA": {
        "FriendlyName": "VEGFA",
        "CheckPoint": "Inhibitory"
    },
    "VEGFB": {
        "FriendlyName": "VEGFB",
        "CheckPoint": "Inhibitory"
    },
    "C10orf54": {
        "FriendlyName": "VISTA",
        "CheckPoint": "Inhibitory"
    },
    "VTCN1": {
        "FriendlyName": "VTCN1",
        "CheckPoint": "Inhibitory"
    }
}

export const categoryMapper = {
    "Other": [
        "ARG1",
        "ENTPD1",
        "GZMA",
        "HMGB1",
        "IDO1",
        "PRF1"
    ],
    "Ligand": [
        "CCL5",
        "CD40LG",
        "CD70",
        "CX3CL1",
        "CXCL10",
        "CXCL9",
        "IFNA1",
        "IFNA2",
        "IFNG",
        "IL10",
        "IL12A",
        "IL13",
        "IL1A",
        "IL1B",
        "IL2",
        "IL4",
        "TGFB1",
        "TNF",
        "TNFSF4",
        "TNFSF9",
        "VEGFA",
        "VEGFB"
    ],
    "Co-inhibitor": [
        "BTN3A1",
        "BTN3A2",
        "CD274",
        "CD276",
        "PDCD1LG2",
        "SLAMF7",
        "C10orf54",
        "VTCN1"
    ],
    "Antigen presentation": [
        "HLA-A",
        "HLA-B",
        "HLA-C",
        "HLA-DPA1",
        "HLA-DPB1",
        "HLA-DQA1",
        "HLA-DQA2",
        "HLA-DQB1",
        "HLA-DQB2",
        "HLA-DRA",
        "HLA-DRB1",
        "HLA-DRB3",
        "HLA-DRB4",
        "HLA-DRB5",
        "MICA",
        "MICB"
    ],
    "Receptor": [
        "ADORA2A",
        "BTLA",
        "CD27",
        "CD40",
        "CTLA4",
        "EDNRB",
        "HAVCR2",
        "ICOS",
        "IL2RA",
        "KIR2DL1",
        "KIR2DL2",
        "KIR2DL3",
        "LAG3",
        "PDCD1",
        "TIGIT",
        "TLR4",
        "TNFRSF14",
        "TNFRSF18",
        "TNFRSF4",
        "TNFRSF9"
    ],
    "Cell adhesion": [
        "ICAM1",
        "ITGB2",
        "SELP"
    ],
    "Co-stimulator": [
        "CD28",
        "CD80",
        "ICOSLG"
    ]
}