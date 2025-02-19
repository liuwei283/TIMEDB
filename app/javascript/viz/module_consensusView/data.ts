import Oviz from "crux";
import template from "./template.bvt";

import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import { registerEditorConfig } from "utils/editor";
import {register} from "page/visualizers";
import {DiverBoxPlot,diverplotDataProcess} from "oviz-components/diverboxplot";
import { groupBy, getGroups } from "utils/array";
import { findBoundsForValues } from "./math";
import { createCallSignature, isJSDocThisTag, isTemplateExpression } from "typescript";
import { currentEventContext } from "crux/src/event";
import { NAME } from "crux/src/template/compiler/tokens";
import * as TextSize from "crux/dist/utils/text-size";


export let plotData = {
    common:{
        samplelist:[],
        methodlist:[],
        celllist:{},
        title:"",
        padding:null,
        pien:null,
    },
    pieData:{
        piePlotdata:[],
        colorMap:{},
        pr:150,
    },
    boxData:{
        boxPlotdata:{},
        colorMap:{},
        valueRange:[],
        bheight:300,
        bwidth:800,
        fontsize:9,
    },
    chosenMethod:null,
    chosenSample:null,

}

export function checkIfNaN(value) {
    return value !== value;
}

export let diff_method_data = {}

export function getCelllist(_data,plotData){
    plotData.common.celllist = {}
    plotData.common.methodlist.forEach((item,index)=>{
        plotData.common.celllist[item] = []
        _data.columns.slice(1).forEach((ditem,dindex) => {
            // ditem.split("|")[1] == item ? plotData.common.celllist[item].push(ditem.split("|")[0]):null
            ditem.split("|")[1] == item ? plotData.common.celllist[item].push(ditem):null
        });
    })
}
export function oriDataload(_data){
    // console.log("no change:",_data)
    this.data.nochangData = _data
}

export function plotDataloaded(_data){

    // console.log("_data:",_data)
    let initialdata = []
    _data.forEach((item,index) => {
        initialdata.push(item)
    });
    this.data.initialdata =initialdata
    // console.log("initial data:",initialdata)

    plotData.common.samplelist = Array.from(new Set(_data.map(d => d["sample_name"]))) //sample list
    plotData.common.methodlist = Array.from(new Set(_data.columns.slice(1).map(x=>x.split("|")[1]))) //method list

    getCelllist(_data,plotData)


    plotData.chosenMethod == null? plotData.chosenMethod = plotData.common.methodlist[0]:null

    let testnon = filteritemmethod(_data,plotData.chosenMethod)

    getBoxdata(plotData,testnon)
    getPiedata(plotData,testnon)

    this.data.valueRange = range(plotData.boxData.boxPlotdata.values,plotData.boxData.boxPlotdata.means)

    // console.log("又来了又来了")
    //get colormap
    this.data.piecolormap = getcolormap(plotData)
    this.data.plotData = plotData

    const methodselect = plotData.common.methodlist.map((x =>new Object({"text":x,"value":x})))
    // const sampleselect = plotData.common.samplelist.map((x,index)=>new Object({"text":x,"value":index}))
    this.data.methodselect = methodselect

} 

export function filteritemmethod(_data,method){
    let tempcell = []
    let newdata = {}
    let tempData = []
    _data.forEach(ditem => {
        tempData.push(JSON.parse(JSON.stringify(ditem)))
    });
    _data.columns.slice(1).forEach((k,t)=>{
        k.split("|")[1] != method? tempcell.push(k):null
    })
    // console.log("temcell:",tempcell,tempcell.length)
    //
    tempcell.forEach((item,index)=>{
        // item 需要删掉的方法
        // 
        newdata = tempData.map((m,n)=>{
            delete m[item]
            return m
        })
        // newdata[item] = []
        // tempData.forEach((m,n) => {
        //     delete m[item]
        //     newdata[item] = m
        // });        
        // delete itemobj[item]
        // newdata = itemobj
    })
    // console.log("newdata:",newdata)
    return newdata
}

export function getMaxtextwidth(arr,type = "arr"){
    if(type == "arr"){
        let count = []
        arr.forEach((item,index) => {
            count.push(TextSize.measuredTextSize(item, 10).width)
        });
        let maxlength = Math.max(...count)
        return maxlength
    }
    if(type == "object"){
        let count = []
        arr.forEach((item,index) => {
            item.i.forEach((ditem,dindex) => {
                count.push(TextSize.measuredTextSize(ditem, 10).width)
            });
        });
        let maxlength = Math.max(...count)
        return maxlength
    }
}

export function getcolormap(plotData){
    let piecolormap = {}
    plotData.common.celllist[plotData.chosenMethod].forEach((item,index)=>{
        piecolormap[item.split("|")[0]] = mapColor(item.split("|")[0])
    })
    return piecolormap
}


export function getPiedata(plotData,diff_method_data){
    let tempData = diff_method_data
    let values = {}
    plotData.pieData.piePlotdata= []
    // console.log("getPiedata plotData.chosenMethod:",plotData.chosenMethod)
    plotData.common.celllist[plotData.chosenMethod].forEach((ditem,dindex) => {
        // console.log("ditem:",ditem)
        // ditem => cell name
        values[ditem] = 0
        tempData.forEach((item,index) => {
            // item
            delete item["sample_name"]
            // console.log("pie data item:",item)
            // console.log("pie item[ditem]:",item[ditem])
            values[ditem] += parseFloat(item[ditem])
        });
        plotData.pieData.piePlotdata.push({name:ditem,value:values[ditem]})
    });
    // console.log("plotData.pieData.piePlotdata:",plotData.pieData.piePlotdata)
    // plotData.pieData.piePlotdata = plotData.pieData.piePlotdata.slice(2)
}

// export function filterdiffcell(item,method,celllist){
//     //item => { xx:xx,bb:bb}
//     //method => 
//     let result = {}
//     for (const [key, value] of Object.entries(item)) {
//         //console.log(`${key}: ${value}`);
//         // console.log("diff key:",key.split("|")[1])
//         // key.split("|")[1]==method? null:delete item[key]
//         celllist[item].forEach((m,n) => {
//             if((m+"|"+method)==key){
//                 result[key] = value
//             }
//         });
//     }
//     // console.log("item????",item)
//     return result

// }

export function getDiffdata(plotData,_data){
    const diff_method_data = plotData.common.methodlist.map(x=>new Object({"methodkey":x,"data":[]}))
    // console.log("initial diff data:",diff_method_data)
    diff_method_data.forEach((item,index)=>{
        _data.forEach((ditem,dindex)=> {
            // if(ditem.method==item.methodkey){
            //     item.data.push(ditem)
            // }
            // filteritemmethod(_data,newdata,item)

            // let tempitem = filteritemmethod(_data,item.methodkey,ditem)
            // item.data.push(tempitem)

            // let filteritemmethod(_data,newdata)
            // let tempditem = filterdiffcell(ditem,item.methodkey)
            // item.data.push(tempditem)
            // item.data.push(ditem)
        });
    })
    // console.log("twice diff data:",diff_method_data)

    return diff_method_data
}

export function getBoxdata(plotData,diff_method_data){
    const result = []
    const means = []
    plotData.common.celllist[plotData.chosenMethod].forEach((item,index) => {
        const temp1 = []
        // console.log("boxplot item:",item)
        diff_method_data.forEach((ditem,dindex) => {
            // console.log("boxplot ditem:",ditem)
            isNaN(ditem[item])? ditem[item] = 0:null
            temp1.push(parseFloat(ditem[item]))
        });
        const stat = new Oviz.algo.Statistics(temp1);                    
        result.push([stat._min, stat._firstQuartile, stat._median, stat._thirdQuartile, stat._max]);
        means.push(stat._mean);
    });
    plotData.boxData.boxPlotdata =  { values: result, outliers:[], means, categories: plotData.common.celllist[plotData.chosenMethod]}

}


export function range(mapdata,mapdata2){
    let resultMax = []
    let resultMin = []
    mapdata.forEach((item,i) => {
        resultMax.push(Math.max(...item))
        resultMin.push(Math.min(...item))
    });
    let mapdata2Higher = parseFloat(Math.max(...mapdata2).toFixed(1))
    let mapdata2Lower = parseFloat((Math.min(...mapdata2)).toFixed(1))
    let resultrange1 = parseFloat((Math.min(...resultMin)).toFixed(1))
    let resultrange2 = parseFloat((Math.ceil(Math.max(...resultMax))).toFixed(1))

    let returnrange1,returnrange2
    mapdata2Higher>resultrange2? returnrange2 = mapdata2Higher: returnrange2 = resultrange2
    mapdata2Lower<resultrange1? returnrange1 = mapdata2Lower-0.1 : returnrange1 =  resultrange1 -0.1
    return [returnrange1, returnrange2]

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


export function findBounds(dataarray){
    let max;
    let min;
    dataarray.forEach((item,index)=> {
        if(index==0){
            min=item[0]
            max=item[1]
        }else{
            min>item[0]?min=item[0]:min=min
            max<item[1]?max=item[1]:max=max
        }
        
    });
    max=((max+1)/10).toFixed(1)
    return [min,max]
}






