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
    barPlotdata: [],
    piePlotdata: [],
    BarData: [],
    BarData2:[],
    PieData: [],
    categories: [],
    colors: {},
    legenddata: [],
    celldata: [],
    methoddata: [], 
    cellpageindex: [], 
    sampleData: [],
    hiddenSamples: [],  
    filteredSamples: [],
    rowdata: [], 
    rowcolumns: [], 
    choosesample: [],
    valuerange: [],
    chosenMethod: [],
    sampleList: [],
}

export function checkIfNaN(value) {
    return value !== value;
}


export function plotDataloaded(_data){
    this.data.rowcolumns = _data.columns.slice(2,)
    let temp = _data
    plotData.sampleList = _data.map(d => d["sample_name"])
    plotData.sampleList = Array.from(new Set(plotData.sampleList))

    _data.forEach((item,index) => {
        plotData.methoddata.includes(item.method)? null :plotData.methoddata.push(item.method)
    });
    
    const different_method_data = plotData.methoddata.map(x=>new Object({"methodkey":x,"data":[]}))
    different_method_data.forEach((item,index)=>{
        _data.forEach((ditem,dindex)=> {
            if(ditem.method==item.methodkey){
                item.data.push(ditem)
            }
        });
    })
    plotData.rowdata = different_method_data

    let eachmethodcells =[]
    plotData.cellpageindex [1] = generalparm(plotData.sampleList)

    different_method_data.forEach((ditem,dindex)=> { 
            const barresult= eachBardata(ditem.data,dindex,plotData.cellpageindex[1],this.data.rowcolumns,"positive") 
            plotData.BarData.push(barresult.eachBardata)
            eachmethodcells.push({"method":ditem.methodkey,"result":barresult.cellvalues})
            plotData.valuerange.push(barresult.valuerange)
            if(dindex==0){ 
                this.data.sampleData = barresult.sampleData;
                this.data.barlegenddata = barresult.insidelegendata; 
                this.data.celldata = barresult.cells 
                this.data.barcolors= barresult.colors
            }
    })

    different_method_data.forEach((ditem,dindex)=> { 
        const barresult2 = eachBardata2(ditem.data,dindex,plotData.cellpageindex[1],this.data.rowcolumns) 
        plotData.BarData2.push(barresult2.eachBardata)
        plotData.valuerange.push(barresult2.valuerange)
    })

    


    let tempMaxsample = []
    different_method_data.forEach((item,index) => {
        tempMaxsample.push(item["data"].length)
    });
    let maxSamplenum = Math.max(...tempMaxsample)

    let pieDiff_methodData = different_method_data.slice(0)


    pieDiff_methodData.forEach((item,index)=>{
        if(item["data"].length<maxSamplenum){
            for(let i=item["data"].length;i<maxSamplenum;i++){
                item["data"].push({"sample_name":plotData.sampleList[i],"method":item["methodkey"]})
            }
        }
    })

    pieDiff_methodData.forEach((ditem,dindex)=> { 
        const pieresult= eachPiedata(ditem,dindex,plotData.cellpageindex[1],this.data.rowcolumns)
        plotData.PieData.push(pieresult.eachBardata) 
        if(dindex==0){
            this.data.sampleData = pieresult.sampleData;
            this.data.pielegenddata = pieresult.insidelegendata; 
            this.data.celldata = pieresult.cells 
            this.data.piecolors= pieresult.colors 
            this.data.insidesampleName = pieresult.insidesampleName;
            this.data.eachSamplename = pieresult.eachSamplename;
        }
    })


    plotData.cellpageindex [0] = this.data.buttonkey
    plotData.chosenMethod.length == 0? plotData.chosenMethod = plotData.methoddata:null


    
    

    this.data.cellpageindex = plotData.cellpageindex

    this.data.valuerange = findvaluerange(plotData.valuerange)

    this.data.BarData= plotData.BarData
    this.data.BarData2 = plotData.BarData2
    this.data.PieData = plotData.PieData
    this.data.methoddata = plotData.methoddata
    this.data.rowdata = plotData.rowdata
    this.data.chosenMethod = plotData.chosenMethod;
    this.data.tempBardata = plotData.BarData;
    this.data.tempPiedata = plotData.PieData;

    let maxchosenMethodtextlength = getMaxtextwidth(this.data.chosenMethod)
    this.data.maxchosenMethodtextlength = maxchosenMethodtextlength
    let maxchosencelldatatextlength = getMaxtextwidth(this.data.celldata)
    this.data.maxchosencelldatatextlength = maxchosencelldatatextlength
    let maxsampletextlength = getMaxtextwidth(this.data.eachSamplename,"object")
    this.data.maxsampletextlength = maxsampletextlength
    this.data.maxText = Math.max(...[maxchosenMethodtextlength,maxsampletextlength,maxchosencelldatatextlength])

    this.data.gridSize = [210,92]
    
    this.data.methodFontsize = 10 
    this.data.sampleFontsize = 10 
    this.data.cellFontsize = 10 

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

export function findvaluerange(arr2){
    let maxarr = []
    let minarr = []
    arr2.forEach((item,index) => {
        minarr.push(item[0])
        maxarr.push(item[1])
    });
    return [parseFloat(Math.min(...minarr).toFixed(2))-0.01,parseFloat(Math.max(...maxarr).toFixed(2))+0.1]
}

export function chooseSamples(v:any){
    plotData.BarData=[]
    v.data.buttonkey = 1
    const choose: Set<string> = v.data.choosesample;
    v.data.filteredSamples = v.data.sampleData.filter(s => choose.has(s));
    v.data.cellpageindex[1] = Math.ceil(v.data.filteredSamples.length/10); 
    const samples = v.data.filteredSamples

    let newdata=[] 
    v.data.rowdata.forEach((item,index)=> {
        const filtered = item.data.filter(word => samples.includes(String(word["sample_name"])));
        filtered.columns = v.data.rowcolumns
        newdata.push({"methodkey":item.methodkey,"data":filtered})
    });

    let cellpageindex =[]
    cellpageindex[1]  = generalparm(newdata[0].data)
    let eachmethodcells = [];
    newdata.forEach((ditem,dindex)=> { 
        const barresult = eachBardata(ditem.data,dindex,cellpageindex[1],v.data.rowcolumns,"positive") 
        plotData.BarData.push(barresult.eachBardata)
        eachmethodcells.push({"method":ditem.methodkey,"result":barresult.cellvalues})
        plotData.valuerange.push(barresult.valuerange)
        if(dindex==0){ 
            v.data.sampleData = barresult.sampleData;
            v.data.barlegenddata = barresult.insidelegendata; 
            v.data.celldata = barresult.cells 
            v.data.barcolors= barresult.colors
        }
    })
    newdata.forEach((ditem,dindex)=> { 
        const barresult2 = eachBardata2(ditem.data,dindex,plotData.cellpageindex[1],this.data.rowcolumns) 
        plotData.BarData2.push(barresult2.eachBardata)
        plotData.valuerange.push(barresult2.valuerange)
    })


    plotData.cellpageindex [0] = v.data.buttonkey
    plotData.chosenMethod.length == 0? plotData.chosenMethod = plotData.methoddata:null

    v.data.cellpageindex = plotData.cellpageindex
    // v.data.valuerange = findBounds(plotData.valuerange)
    this.data.valuerange = findvaluerange(plotData.valuerange)
    v.data.BarData= plotData.BarData
    v.data.BarData2= plotData.BarData2
    v.data.PieData = plotData.PieData
    v.data.methoddata = plotData.methoddata
    v.data.rowdata = plotData.rowdata
    v.data.chosenMethod = plotData.chosenMethod;
    v.data.tempBardata = plotData.BarData;
    v.data.tempPiedata = plotData.PieData;

    v.data.plotType = true;
    v.data.gridSize = [210,92];

    v.forceRedraw = true;
    v.run();
} 


export function eachPiedata(ditem,dindex,number,cellarray){

    let eachBardata = [];
    let cells
    let columns = Object.keys(ditem.data[0]).slice(2,);
    let sampleData =[] 
    let insidelegendata = []  
    let insidesampleName = [];
    let eachSamplename = [];
    let colors = {};

    for(var i=0;i<number;i++){  
        
        let BarData_dindex = []
        let SampleName_dindex = []
        let eachlegendata = []
        let dddata = ditem.data.slice(10*i,10*(i+1))
        let rows = []
        dddata.forEach((k,i) => {
            rows.push(k.sample_name);
        });
        eachSamplename.push({i:rows})
        rows.forEach((colitem,colindex) => { 
            let eachcolumns = [];
            insidesampleName.push({"samplename":rows[colindex]}); 
            columns.forEach((cateitem,cateindex) => {
                let val = ditem.data.map(d => d[cateitem])
                let vals = []
                val.forEach((k,d) => {
                    k=="NA"? vals.push(null): vals.push(k)
                });
                let color = mapColor(cateitem)
                eachcolumns.push({name:cateitem,value: Number(vals[colindex+10*i]),color});
                
            });
            dddata.forEach((item,index)=> {
                plotData.categories.push({index:[item.sample_name]});
                if(dindex==0&&colindex==0){
                    sampleData.push(item.sample_name);
                }
            });
            const ecolumnsobject ={[colitem]:eachcolumns}
            BarData_dindex.push(ecolumnsobject)
        });

        columns.forEach((cell,index)=> {
            let colour = mapColor(cell)
            eachlegendata.push({fill:colour, label:cell})
        });
        
        eachBardata.push({[i]:BarData_dindex})

        if (dindex==0){
            cells = columns 
            insidelegendata.push({[i]:eachlegendata})
        }
        cells = cellarray;
    };
    return {eachBardata,cells,insidelegendata,sampleData,colors,insidesampleName,eachSamplename}

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



export function eachBardata(ditem,dindex,number,cellarray,sign){
    let eachBardata = [];
    let cells
    let columns = ditem.columns; 
    let sampleData =[] 
    let insidelegendata = [] 
    columns = cellarray
    let cellvalues=[];
    let allvalues=[];
    let colors = {};
    for(var i=0;i<number;i++){
        let BarData_dindex = [] 
        let eachlegendata = [] 
        let dddata = ditem.slice(10*i,10*(i+1)) 
        columns.forEach((colitem,colindex) => { 
            let eachcolumns = [];
            let eachcolumnvalues = {"cellname":colitem,"values":[],rank:i}
            dddata.forEach((item,index)=> {
                if(item[colitem]=="NA")
                    return null;
                if(parseFloat(item[colitem])<0){
                    eachcolumns.push([item["sample_name"],0]);
                    allvalues.push(parseFloat(item[colitem]))
                    eachcolumnvalues.values.push(item[colitem])
                }
                else{
                    if(sign == "positive"){
                            eachcolumns.push([item["sample_name"],parseFloat(item[colitem])]);
                            allvalues.push(parseFloat(item[colitem]))
                            eachcolumnvalues.values.push(item[colitem])
                    }
                }
                plotData.categories.push([item["sample_name"]]);
                const color = Oviz.color.Color.hsl((index%6)*60, 60+Math.floor((index/6))*10, 60+Math.floor((index/6))*10)
                colors[item["sample_name"]] = color.string
                if(dindex==0&&colindex==1){
                    eachlegendata.push({type: "Custom",label:item["sample_name"],fill:color.string});
                    sampleData.push(item["sample_name"]);
                }
            });
            const ecolumnsobject ={[colitem]:eachcolumns} 
            BarData_dindex.push(ecolumnsobject)
            cellvalues.push(eachcolumnvalues)
        });
        eachBardata.push({[i]:BarData_dindex})
        cells = columns
        insidelegendata.push({[i]:eachlegendata})
    };
    
    let valuerange = [Math.min(...allvalues),Math.max(...allvalues)]

    return {eachBardata,cells,insidelegendata,sampleData,colors,cellvalues,valuerange}

}

export function eachBardata2(ditem,dindex,number,cellarray){
    let eachBardata = [];
    let cells
    let columns = ditem.columns; 
    let sampleData =[] 
    let insidelegendata = [] 
    columns = cellarray
    let cellvalues=[];
    let allvalues=[];
    let colors = {};
    for(var i=0;i<number;i++){
        let BarData_dindex = [] 
        let eachlegendata = [] 
        let dddata = ditem.slice(10*i,10*(i+1)) 
        columns.forEach((colitem,colindex) => { 
            let eachcolumns = [];
            let eachcolumnvalues = {"cellname":colitem,"values":[],rank:i}
            dddata.forEach((item,index)=> {
                if(item[colitem]=="NA")
                    return null;
                if(parseFloat(item[colitem])>=0){
                    eachcolumns.push([item["sample_name"],0]);
                    allvalues.push(parseFloat(item[colitem]))
                    eachcolumnvalues.values.push(item[colitem])
                }
                else{
                    eachcolumns.push([item["sample_name"],parseFloat(item[colitem])]);
                    allvalues.push(parseFloat(item[colitem]))
                    eachcolumnvalues.values.push(item[colitem])
                }
                plotData.categories.push([item["sample_name"]]);
                const color = Oviz.color.Color.hsl((index%6)*60, 60+Math.floor((index/6))*10, 60+Math.floor((index/6))*10)
                colors[item["sample_name"]] = color.string
                if(dindex==0&&colindex==1){
                    eachlegendata.push({type: "Custom",label:item["sample_name"],fill:color.string});
                    sampleData.push(item["sample_name"]);
                }
            });
            const ecolumnsobject ={[colitem]:eachcolumns} 
            BarData_dindex.push(ecolumnsobject)
            cellvalues.push(eachcolumnvalues)
        });
        eachBardata.push({[i]:BarData_dindex})
        cells = columns
        insidelegendata.push({[i]:eachlegendata})
    };
    
    let valuerange = [Math.min(...allvalues),Math.max(...allvalues)]

    return {eachBardata,cells,insidelegendata,sampleData,colors,cellvalues,valuerange}

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


export function chooseMethod(chosenMethod,data){
    let afterdata = []
    chosenMethod.forEach((item,index) => {
        plotData.methoddata.forEach((ditem,dindex)=>{
            item == ditem? afterdata.push(data[dindex]):null
        });
    });
    return afterdata;
}

export function generalparm(item){
    const allpage = Math.ceil(item.length/10) 
    return allpage
}

export function filterMethod(v:any){
    v.data.PieData = chooseMethod(v.data.chosenMethod,v.data.tempPiedata);
    v.forceRedraw = true;
    v.run();
}









