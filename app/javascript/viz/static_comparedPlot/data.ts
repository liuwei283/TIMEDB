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
}

//_data = this.data
export function plotDataloaded(_data){

    this.data.rowcolumns = _data.columns.slice(2,)
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

    let eachmethodcells =[]
    plotData.cellpageindex [1] = generalparm(different_method_data[0].data)

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
    this.data.valuerange = findBounds(plotData.valuerange)
    this.data.BarData= plotData.BarData
    this.data.PieData = plotData.PieData
    this.data.methoddata = plotData.methoddata
    this.data.rowdata = plotData.rowdata
    this.data.chosenMethod = plotData.chosenMethod;
    this.data.tempBardata = plotData.BarData;
    this.data.tempPiedata = plotData.PieData;

    this.data.plotType = true;
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
        "B cells":"#60C17F",
        "B naive cells":"#90C1DB",
        "B memory cells":"#90C1F9",
        "Basophils":"#7344C4",
        "Cytotoxic cells":"#FD754B", 
        "DC cells":"#FD754B", 
        "pDC cells":"#FD754B", 
        "aDC cells":"#FD754B", 
        "mDC cells":"#FD754B", 
        "Endothelials":"#FD754B", 
        "Eosinophils":"#DC3C84",
        "Fibroblasts":"#FD754B", 
        "Macrophages M0":"#FDD7FF",
        "Macrophages M1":"#FDD7E6",
        "Macrophages M2":"#FDD7CB",
        "Mast cells":"#F94A59",
        "MAIT cells":"#FD754B",
        "Monocytes":"#FD754B", 
        "Neutrophils":"#FD754B",
        "NK cells":"#519DA0",
        "NKT cells":"#FD754B",
        "NK cells resting":"#FD754B",
        "NK cells activated":"#FD754B",
        "Plasma cells":"#FD754B",
        "T CD8 cells":"#427AA4",
        "T CD8 naive cells":"#698BA4",
        "T CD4 cells":"#427AC2",
        "T CD4 memory cells":"#9BB1E0",
        "T CD4 naive cells":"#9BCFE0",
        "Th1 cells":"#FD754B",
        "Th2 cells":"#FD754B",
        "Tregs":"yellow",
        "Tfh cells":"#FD754B",
        "Tgd cells":"#FD754B",
    }
    for (const [key, value] of Object.entries(colorMap)) {
        console.log(`${key}: ${value}`);
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









