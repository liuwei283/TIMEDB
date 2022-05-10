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

    this.data.plotType = "pie"; //判断
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
        "Hematopoietic stem cell":"#bc0c00",
        "Common lymphoid progenitor cell":"#bc0085",
        "B cell":"#f3563f",
        "B cells":"#f3563f",
        "B cell mermory":"#f4812b",
        "B memory cells":"#f4812b",
        "B cell naive":"#f4814a",
        "B naive cells":"#f4814a",
        "B cell plasma":"#f48170",
        "Class-switched memory B cell":"#f48190",
        "Pro B cell":"#f481bd",
        "Common lymphoid progeniotr":"#fe7a02",
        "NK cell":"#bc248f",
        "NK cells":"#bc248f",
        "NK cell actived":"#bc5fa0",
        "NK cells activated":"#bc5fa0",
        "NK cells resting":"#bc5fd3",
        "NK cell resting":"#bc5fd3",
        "Plasmacytoid dendritic cell (pDC)":"#7938c0",
        "Plasma cells":"#7938c0",
        "pDC cells":"#7938c0",
        "Cytotoxic cell":"#8836b4",
        "Cytotoxic cells":"#8836b4",
        "T cell":"#dd3c67",
        "T cell CD4+":"#dd6000",
        "T CD4 cells":"#dd6000",
        "T cell CD4+ (non-regulatory)":"#dd8643",
        "T cell regulatory (Tregs)":"#dd8683",
        "Tregs":"#c8a7f0",
        "T cell CD4+ Th1":"#dd524e",
        "Th1 cells":"#dd524e",
        "T cell CD4+ Th2":"#dd7e4e",
        "Th2 cells":"#dd7e4e",
        "T cell CD4+ Th17":"#dda34e",
        "T cell CD4+ naive":"#dda29d",
        "T CD4 naive cells":"#dda29d",
        "T cell follicular helper(Tfh)":"#dda3c7",
        "Tfh cells":"#dda3c7",
        "induced Treg (iTreg)":"#dd9c6e",
        "natural Treg (nTreg)":"#dd9c99",
        "Type 1 regular T cell (Trl)":"#dd9cc8",
        "T cell CD4+ memory actived":"#ddb274",
        "T CD4 memory cells":"#ddb274",
        "T cell CD4+ memory resting":"#dda176",
        "T cell CD4+ central memory (CD4+ Tcm)":"#dda782",
        "T cell CD4+ effector memory (CD8+ Tem)":"#ddbabe",
        "T cell CD4+ effector memory (CD4+ Tem)":"#ddbabe",
        "T cell CD8+":"#dd6050",
        "T CD8 cells":"#dd6050",
        "T cell CD8+ memory":"#dd958b",
        "T cell CD8+ naive":"#dd95c7",
        "T CD8 naive cells":"#dd95c7",
        "T cell CD8+ central memory (CD8+ Tcm)":"#ddafa8",
        "T cell CD8+ effector memory (CD8+ Tem)":"#ddafd6",
        "T cell gamma delta (Tgd)":"#dd607e",
        "Tgd cells":"#be95f0",
        "T gd Vd2":"#dd8298",
        "T gd non-Vd2":"#dd82be",
        "T cell NK (NKT)":"#dd61a2",
        "NKT cells":"#dd61a2",
        "Mucosal assiociated invariant T cell (MAIT)":"#dd61c2",
        "Mucosal assiociated invariant T cell":"#dd61c2",
        "MAIT cells":"#dd61c2",
        "Memory cell":"#dd61d5",
        "Central memory":"#dd88d7",
        "Effector memory":"#dd88ff",
        "Exhausted T cell":"#dd61fd",
        "Interstitial dendritic cell(iDC)":"#0055bc",
        "Common mteloid progenitor cell (CMP)":"#4700bc",
        "Basophil":"#9660d8",
        "Basophils":"#9660d8",
        "Common myeloid progenitor":"#7160d8",
        "Granulocyte-monocyte progenitor (GMP)":"#4b60d8",
        "Eosinophil":"#4b7cd8",
        "Eosinophils":"#4b7cd8",
        "Mast cell":"#4b9dd8",
        "Mast cells":"#4b9dd8",
        "Mast cell activated":"#9cafd8",
        "Mast cell resting":"#77dfd8",
        "Megakaryocyte-erythroid progenitor cell(MEP)":"#4bbbd8",
        "Megakaryocyte":"#b6ccd8",
        "Platelets":"#9bc3d8",
        "Erythrocytes":"#73c3d8",
        "Monocytic lineage":"#4bdfd8",
        "Marophage":"#94c4db",
        "Marophages":"#94c4db",
        "Macrphoage M0":"#ced0dc",
        "Macrophages M0":"#ced0dc",
        "Macrophage M1":"#b6d0dc",
        "Macrophages M1":"#b6d0dc",
        "Macrophage M2":"#b6d0c0",
        "Macrophages M2":"#b6d0c0",
        "Monocyte":"#94dfdb",
        "Monocytes":"#e89ae0", 
        "Monocytes C":"#b2dfdd",
        "Monocytes NC+1":"#94dfdd",
        "Myeloid dendritic cell (mDC/cDC)":"#95fedc",
        "mDC cells":"#95fedc",
        "Dendritic cell activated":"#bffee9",
        "aDC cells":"#edbcd8",
        "Dendritic cell resting":"#91fee9",
        "Neutrophil":"#7886d8",
        "Neutrophils":"#7886d8",
        "T cell CD4+ memory":"#dda276",
        "Mesenchymal stem cell (MSC)":"#edbcbc",
        "Muscle cell (Myocytes)":"#ffd4d4",
        "Smooth muscle":"#edd4d4",
        "Skeletal muscle":"#cbbcbc",
        "Adipocyte":"#aabbbc",
        "Astrocytes":"#92bcbc",
        "Osteoblast":"#5ebbbc",
        "Neurons":"#cabcbc",
        "Chondrocyte":"#3b9ebc",
        "Fibroblast":"#3b90bc",
        "Fibroblasts":"#3b90bc",
        "Cancer associated fibroblasts (CAFS)":"#6ca0bc",
        "Stromal cell":"#3b72bc",
        "Dendritic cell (DC)":"#00bc04",
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









