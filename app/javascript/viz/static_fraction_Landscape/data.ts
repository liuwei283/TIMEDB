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
import {generateDiverConfig} from"./editor";

//设置数据格式
export let plotData = {
    barPlotdata: [],
    piePlotdata: [],
    BarData: [],
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

//_data = this.data
export function plotDataloaded(_data){

    this.data.rowcolumns = _data.columns.slice(2,)
    let temp = _data
    plotData.sampleList = _data.map(d => d["sample_name"])
    plotData.sampleList = Array.from(new Set(plotData.sampleList))
    console.log("sampleList:",plotData.sampleList)

    //get methodData = method name
    _data.forEach((item,index) => {
        plotData.methoddata.includes(item.method)? null :plotData.methoddata.push(item.method)
    });
    
    //the different method data array[{methodkey: data:[]},{}...]
    const different_method_data = plotData.methoddata.map(x=>new Object({"methodkey":x,"data":[]}))
    different_method_data.forEach((item,index)=>{
        _data.forEach((ditem,dindex)=> {
            if(ditem.method==item.methodkey){
                item.data.push(ditem)
            }
        });
    })
    plotData.rowdata = different_method_data
    console.log("different_method_data:",different_method_data)

    let eachmethodcells =[]
    plotData.cellpageindex [1] = generalparm(plotData.sampleList)

    //bardata
    different_method_data.forEach((ditem,dindex)=> { 
            const barresult= eachBardata(ditem.data,dindex,plotData.cellpageindex[1],this.data.rowcolumns) 
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
    console.log("this.data.barlegenddata:",this.data.barlegenddata)
    
    //piedata
    different_method_data.forEach((ditem,dindex)=> { 
        const pieresult= eachPiedata(ditem,dindex,plotData.cellpageindex [1],this.data.rowcolumns)
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

    //edit demo show data
    plotData.cellpageindex [0] = this.data.buttonkey
    plotData.chosenMethod.length == 0? plotData.chosenMethod = plotData.methoddata:null
    
    //post
    this.data.cellpageindex = plotData.cellpageindex
    console.log("plotData.cellpageindex:",plotData.cellpageindex);
    
    this.data.valuerange = findBounds(plotData.valuerange)
    this.data.BarData= plotData.BarData
    this.data.PieData = plotData.PieData
    this.data.methoddata = plotData.methoddata
    this.data.rowdata = plotData.rowdata
    this.data.chosenMethod = plotData.chosenMethod;
    this.data.tempBardata = plotData.BarData;
    this.data.tempPiedata = plotData.PieData;

    this.data.plotType = false;
    this.data.gridSize = [210,92]

    console.log("_data:",_data)
    
}


//选择样本
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
        filtered.columns = v.data.rowcolumns//v.data.filteredSample.includes(word[""]));
        newdata.push({"methodkey":item.methodkey,"data":filtered})
    });

    let cellpageindex =[]
    cellpageindex[1]  = generalparm(newdata[0].data)
    let eachmethodcells = [];
    newdata.forEach((ditem,dindex)=> { 
        console.log("ditem:",ditem)
        const barresult = eachBardata(ditem.data,dindex,cellpageindex[1],v.data.rowcolumns) 
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

    plotData.cellpageindex [0] = v.data.buttonkey
    plotData.chosenMethod.length == 0? plotData.chosenMethod = plotData.methoddata:null

    v.data.cellpageindex = plotData.cellpageindex
    v.data.valuerange = findBounds(plotData.valuerange)
    v.data.BarData= plotData.BarData
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

//生成pie的数据
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
                //let color = Oviz.color.Color.hsl((cateindex%6)*60, 60+Math.floor((cateindex/6))*10, 60+Math.floor((cateindex/6))*10)
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
            //let colour = Oviz.color.Color.hsl((index%6)*60, 60+Math.floor((index/6))*10, 60+Math.floor((index/6))*10)
            let colour = mapColor(cell)
            //colors[cell] = colour.string
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
        "Hematopoietic stem cell":"#e83b39",
        "Common lymphoid progenitor cell":"#e85655",
        "B cell":"#e87675",
        "B cells":"#e87675",
        "B cell mermory":"#e89897",
        "B memory cells":"#e89897",
        "B cell naive":"#e898ab",
        "B naive cells":"#e898ab",
        "B cell plasma":"#e898be",
        "Class-switched memory B cell":"#e898d2",
        "Pro B cell":"#e898e6",
        "Common lymphoid progeniotr":"#e8768c",
        "NK cell":"#e876a5",
        "NK cells":"#e876a5",
        "NK cell actived":"#e898b9",
        "NK cells activated":"#e898b9",
        "NK cells resting":"#e898d7",
        "NK cell resting":"#e898d7",
        "Plasmacytoid dendritic cell (pDC)":"#e876be",
        "Plasma cells":"#e876be",
        "pDC cells":"#e876be",
        "Cytotoxic cell":"#e876d7",
        "Cytotoxic cells":"#e876d7",
        "T cell":"#e876f0",
        "T cell CD4+":"#ea95f0",
        "T CD4 cells":"#ea95f0",
        "T cell CD4+ (non-regulatory)":"#eba7f0",
        "T cell regulatory (Tregs)":"#c8a7f0",
        "Tregs":"#c8a7f0",
        "T cell CD4+ Th1":"#ecc0f0",
        "Th1 cells":"#ecc0f0",
        "T cell CD4+ Th2":"#cfc0f0",
        "Th2 cells":"#cfc0f0",
        "T cell CD4+ Th17":"#b0c0f0",
        "T cell CD4+ naive":"#75c0f0",
        "T CD4 naive cells":"#75c0f0",
        "T cell follicular helper(Tfh)":"#58c0f0",
        "Tfh cells":"#58c0f0",
        "induced Treg (iTreg)":"#d9c6f0",
        "natural Treg (nTreg)":"#bbc6f0",
        "Type 1 regular T cell (Trl)":"#9fc6f0",
        "T cell CD4+ memory actived":"#ead2f0",
        "T CD4 memory cells":"#ead2f0",
        "T cell CD4+ memory resting":"#d2d2f0",
        "T cell CD4+ central memory (CD4+ Tcm)":"#b5d2f0",
        "T cell CD4+ effector memory (CD8+ Tem)":"#96d2f0",
        "T cell CD4+ effector memory (CD4+ Tem)":"#96d2f0",
        "T cell CD8+":"#d295f0",
        "T CD8 cells":"#d295f0",
        "T cell CD8+ memory":"#dcb3f0",
        "T cell CD8+ naive":"#c7b4f0",
        "T CD8 naive cells":"#c7b4f0",
        "T cell CD8+ central memory (CD8+ Tcm)":"#e4ccf0",
        "T cell CD8+ effector memory (CD8+ Tem)":"#d0cdf0",
        "T cell gamma delta (Tgd)":"#be95f0",
        "Tgd cells":"#be95f0",
        "T gd Vd2":"#d5bff0",
        "T gd non-Vd2":"#b3bff0",
        "T cell NK (NKT)":"#aa95f0",
        "NKT cells":"#aa95f0",
        "Mucosal assiociated invariant T cell (MAIT)":"#9795f0",
        "Mucosal assiociated invariant T cell":"#9795f0",
        "MAIT cells":"#9795f0",
        "Memory cell":"#8395f0",
        "Central memory":"#a8b3f0",
        "Effector memory":"#8cb3f0",
        "Exhausted T cell":"#7195f0",
        "Interstitial dendritic cell(iDC)":"#e85673",
        "Common mteloid progenitor cell (CMP)":"#e85691",
        "Basophil":"#e87149",
        "Basophils":"#e87149",
        "Common myeloid progenitor":"#e8715c",
        "Granulocyte-monocyte progenitor (GMP)":"#e87170",
        "Eosinophil":"#e87183",
        "Eosinophils":"#e87183",
        "Mast cell":"#e871a1",
        "Mast cells":"#e871a1",
        "Mast cell activated":"#e891b4",
        "Mast cell resting":"#e891d2",
        "Megakaryocyte-erythroid progenitor cell(MEP)":"#e871c0",
        "Megakaryocyte":"#e899cd",
        "Platelets":"#e8bbd8",
        "Erythrocytes":"#e899e1",
        "Monocytic lineage":"#e871dd",
        "Marophage":"#e89ac2",
        "Marophages":"#e89ac2",
        "Macrphoage M0":"#e8b5b4",
        "Macrophages M0":"#e8b5b4",
        "Macrophage M1":"#e8b5cf",
        "Macrophages M1":"#e8b5cf",
        "Macrophage M2":"#e8b6e4",
        "Macrophages M2":"#e8b6e4",
        "Monocyte":"#e89ae0",
        "Monocytes":"#e89ae0", 
        "Monocytes C":"#e8b9cf",
        "Monocytes NC+1":"#e8b9e3",
        "Myeloid dendritic cell (mDC/cDC)":"#e89af5",
        "mDC cells":"#e89af5",
        "Dendritic cell activated":"#edbcd8",
        "aDC cells":"#edbcd8",
        "Dendritic cell resting":"#edbcf6",
        "Neutrophil":"#e89292",
        "Neutrophils":"#e89292",
        "T cell CD4+ memory":"#92c0f0",
        "Mesenchymal stem cell (MSC)":"#e83b57",
        "Muscle cell (Myocytes)":"#e86d66",
        "Smooth muscle":"#e89c97",
        "Skeletal muscle":"#e89cb5",
        "Adipocyte":"#e86d82",
        "Astrocytes":"#e86e95",
        "Osteoblast":"#e86eaa",
        "Neurons":"#e86ebd",
        "Chondrocyte":"#e86ec9",
        "Fibroblast":"#e86edd",
        "Fibroblasts":"#e86edd",
        "Cancer associated fibroblasts (CAFS)":"#e893e0",
        "Stromal cell":"#e86ef1",
        "Dendritic cell (DC)":"#e83b76",
        "DC cells":"#e83b76",
        "Multipotential Progenitor (MPP)":"#e8e512",
        "Other cell":"#35478e",
        "Cancer cell":"#293856",
        "Melanoma cell":"#56618e",
        "Ovarian carcinoma cell":"#a9618e",
        "Preadipocytes":"#293857",
        "Pericytes":"#9ce27e",
        "mv Endothelial cells":"#b698cd",
        "ly Endothelial cells":"#b698ac",
        "Endothelial cell":"#a977cd",
        "Endothelials":"#a977cd", 
        "Sebocytes":"#df8380",
        "Epithelial cell":"#dfa3a1",
        "Mesangial cells":"#bd577a",
        "Uncharacterized cell (other)":"#df80d2",
        "Melanocytes":"#dfa280",
        "Keratinocytes":"#dfa29e",
        "Hepatocytes":"#dfa2bd",
    }
    for (const [key, value] of Object.entries(colorMap)) {
        //console.log(`${key}: ${value}`);
        key == cell? colour = value:null
    }
    return colour
    
}


//生成bar的数据
export function eachBardata(ditem,dindex,number,cellarray){
    console.log("dindex:",dindex)
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
            //console.log("colindex:",colindex)
            let eachcolumns = [];
            let eachcolumnvalues = {"cellname":colitem,"values":[],rank:i}
            dddata.forEach((item,index)=> {
                //correct "" to ID
                if(item[colitem]=="NA")
                    return null;
                else{
                    eachcolumns.push([item["sample_name"],parseFloat(item[colitem])]);
                    allvalues.push(parseFloat(item[colitem]))
                    eachcolumnvalues.values.push(item[colitem])
                }
                plotData.categories.push([item["sample_name"]]);
                const color = Oviz.color.Color.hsl((index%6)*60, 60+Math.floor((index/6))*10, 60+Math.floor((index/6))*10)
                colors[item["sample_name"]] = color.string
                //console.log("item:",item)
                if(dindex==0&&colindex==1){
                    console.log("yes")
                    eachlegendata.push({type: "Custom",label:item["sample_name"],fill:color.string});
                    sampleData.push(item["sample_name"]);
                }
                //console.log("eachlegendata",eachlegendata)
                //console.log("sampleData",sampleData)
            });
            const ecolumnsobject ={[colitem]:eachcolumns} 
            BarData_dindex.push(ecolumnsobject)
            cellvalues.push(eachcolumnvalues)
        });
        eachBardata.push({[i]:BarData_dindex})
        cells = columns
        insidelegendata.push({[i]:eachlegendata})
    };
    
    const valuerange = findBoundsForValues(allvalues,2)

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

//选择方法的函数
export function chooseMethod(chosenMethod,data){
    let afterdata = []
    chosenMethod.forEach((item,index) => {
        plotData.methoddata.forEach((ditem,dindex)=>{
            item == ditem? afterdata.push(data[dindex]):null
        });
    });
    console.log("afterdata:",afterdata)
    return afterdata;
}

//得到页数
export function generalparm(item){
    const allpage = Math.ceil(item.length/10) 
    return allpage
}

//过滤方法
export function filterMethod(v:any){
    v.data.PieData = chooseMethod(v.data.chosenMethod,v.data.tempPiedata);
    console.log("editor:",v.data.chosenMethod,v.data.tempPiedata)
    v.forceRedraw = true;
    v.run();
}









