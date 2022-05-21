import Oviz from "crux";
import { findBoundsForValues } from "utils/maths";
import template from "./template.bvt";
import { EditText } from "oviz-components/edit-text";
import { GridPlot } from "oviz-components/grid-plot";
import {register} from "page/visualizers";


const boxW = 6;
const gapRatio = 0.3;
const yLabel = "Proportion"

//_data = this.data
export function plotDataloaded(_data){
    console.log("data:",_data)

    console.log("static_fraction_grouped_boxplot_______________")
    let rowdata = _data;
    let methodData = [];

    //get methoddata
    _data.forEach((item,index) => {
        methodData.includes(item.method)? null :methodData.push(item.method)
    });

    this.data.methodData = methodData //0515
    this.data.rowdata = rowdata //0515

    console.log("methodData:",methodData)
    
    //the different method data array[{methodkey: data:[]},{}...]
    let different_method_data = methodData.map(x=>new Object({"methodkey":x,"data":[]}))
    different_method_data.forEach((item,index)=>{
        _data.forEach((ditem,dindex)=> {
            if(ditem.method==item.methodkey){
                item.data.push(ditem)
            }
        });
    })
    console.log("different_method_data:",different_method_data)

    let mockData = []
    different_method_data.forEach((item,i)=>{
        mockData.push(item.data)
    })

    console.log("mockData:",mockData)

    const result = mockData.map((item,index)=> {
        const data = eachgroupdata(rowdata,item,"sample_name","method")
        return data;
    });
    
    console.log("result:",result)

    let categories; //cell catagories
    let boxData = {};
    let myScheme = ["#6b6ad2","#854a90","#89abdd","#264481","#57a79d","#ccaa5d","red","#f1b8a8","#fef167","#fe982c"]
    
    const plotSize = [1000,400]

    //0515
    let colorMap = {}
    result.forEach((item,index)=>{
        colorMap[item.method] = myScheme[index]
    })
    this.data.colorMap = colorMap;
    console.log("colorMap",colorMap)
    //0515

    this.data.chosenmedthoData = [] //0515

    result.forEach((ritem,rindex) => {
        categories= ritem.categories
        //匹配对应的方法
        ritem.boxData["color"] = colorMap[ritem.method] //颜色 //0515
        ritem.boxData["method"] = ritem.method //0515
        //boxData[`boxData${rindex}`]=ritem.boxData //批量声明变量
        boxData[ritem.method] = ritem.boxData //0515
    });
    console.log("boxData:",boxData)

    const valueRange = [0, (Math.max(...result.map(x => x.valueRange[1])))+0.1];
    
    let legend = methodData
    this.data.methodData = methodData
    this.data.legendData = legend.map((x, i) => {  //之前声明的list
        return {type: "Custom", label: x, fill: colorMap[x],method:x}; //0515
    });
    console.log("legend:",this.data.legendData)

    let labelOffsetVer = 40
    return {plotSize,data:boxData,yLabel,valueRange,discreteCategory: true,categories,boxW,gapRatio,methodData,labelOffsetVer};
    
}

export function eachgroupdata(oriData,values:number[][],samplekey:string,groupkey:string){
    const categories = oriData.columns.slice(2)
    const boxData = {values: [], outliers: [], means: [], categories}
    const cellDataarray = categories.map(x=>[x,[]])
    const cellData=Object.fromEntries(cellDataarray);
    let method;
    let allvalues=[]
    categories.forEach((cellitem,cellindex) => {
        values.forEach((item,index) => {
            let i = Number(item[cellitem])
            i+"" == "NaN" ? i = 0:null
            cellData[cellitem].push(i)
            method=item[groupkey]
            //console.log(method)
            allvalues.push(i)
        });
        const initialData = cellData[cellitem]
        const stat1 = new Oviz.algo.Statistics(initialData);
        const interQuartileRange = stat1.Q3() - stat1.Q1();
        const result = [];
        initialData.forEach(d => {
            if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                boxData.outliers.push([cellindex, d]);
            } else {
                result.push(d);
            }
        });
        const stat2 = new Oviz.algo.Statistics(result);
        boxData.values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
        boxData.means.push(stat2.mean());
    });
    const valueRange = findBoundsForValues(allvalues,2)
    const result={boxData:boxData,valueRange:valueRange,method:method,categories}
    return result;

}


export function filterMethod(v:any){
    let newmethodData = [];
    const choose: Set<string> = v.data.chosenmethodData
    console.log("choose:",choose)
    console.log("v.data.methodData:",v.data.methodData)
    //v.data.chosenMethod = []
    v.data.chosenMethod = v.data.methodData.filter(s=>choose.has(s));
    const showMethod = v.data.chosenMethod
    //const chosenMethodlist = 
    console.log("showMethod :",showMethod)

    let different_method_data = showMethod.map(x=>new Object({"methodkey":x,"data":[]}))
    different_method_data.forEach((item,index)=>{
        v.data.rowdata.forEach((ditem,dindex)=> {
            if(ditem.method==item.methodkey){
                item.data.push(ditem)
            }
        });
    })
    console.log("new different_method_data:",different_method_data)

    let mockData = []
    different_method_data.forEach((item,i)=>{
        mockData.push(item.data)
    })

    console.log("mockData:",mockData)

    const result = mockData.map((item,index)=> {
        const data = eachgroupdata(v.data.rowdata,item,"sample_name","method")
        return data;
    });
    
    console.log("result:",result)

    let categories; //cell catagories
    let boxData = {};

    let myScheme = ["#6b6ad2","#854a90","#89abdd","#264481","#57a79d","#ccaa5d","#e85c39","#f1b8a8","#fef167","#fe982c"]
    //0515
    let colorMap = {}
    result.forEach((item,index)=>{
        colorMap[item.method] = myScheme[index]
    })
    v.data.colorMap = colorMap;
    console.log("colorMap",colorMap)
    //0515

    v.data.chosenmedthoData = [] //0515

    v.data.myScheme = myScheme //新的颜色

    let plotSize = [1000,400]
    result.forEach((ritem,rindex) => {
        categories = ritem.categories
        //匹配对应的方法
        ritem.boxData["color"] = colorMap[ritem.method] //颜色 //0515
        ritem.boxData["method"] = ritem.method //0515
        //boxData[`boxData${rindex}`]=ritem.boxData //批量声明变量
        boxData[ritem.method] = ritem.boxData //0515
    });
    console.log("boxData:",boxData)

    const valueRange = [0, (Math.max(...result.map(x => x.valueRange[1])))+0.1];
    
    let legend = showMethod
    v.data.legendData = legend.map((x, i) => {  //之前声明的list
        return {type: "Custom", label: x, fill: colorMap[x],method:x}; //0515
    });
    console.log("legend:",v.data.legendData)

    console.log("categories:",categories)

    let labelOffsetVer = 40
    v.data.gridW = ((boxW + 2) * showMethod.length) / (1-gapRatio);
    let methodData = showMethod
    v.data.comparedBox = {plotSize,data:boxData,yLabel,valueRange,discreteCategory: true,categories,methodData,boxW,gapRatio,showMethod,labelOffsetVer};
    
    v.forceRedraw = true;
    v.run();
}





