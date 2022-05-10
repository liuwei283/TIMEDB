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
    let rowdata = _data;
    let methodData = [];

    //get methoddata
    _data.forEach((item,index) => {
        methodData.includes(item.method)? null :methodData.push(item.method)
    });

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
    let myScheme = ["#191a1e","#283033","#7f9ba9","#95b6bf","#b2d4de",
                    "#8a8fa5","#9c3539","#e55668","#eadcdb","#b1a79d"]
    const plotSize = [1000,400]
    result.forEach((ritem,rindex) => {
        categories= ritem.categories
        //匹配对应的方法
        ritem.boxData["color"] = myScheme[rindex] //颜色
        boxData[`boxData${rindex}`]=ritem.boxData //批量声明变量
    });
    console.log("boxData:",boxData)

    const valueRange = [0, (Math.max(...result.map(x => x.valueRange[1])))+0.1];
    
    let legend = methodData
    this.data.legendData = legend.map((x, i) => {  //之前声明的list
        return {type: "Custom", label: x, fill: myScheme[i]};
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



