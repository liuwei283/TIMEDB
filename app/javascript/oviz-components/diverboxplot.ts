import Oviz from "crux";
import template from "./diverboxplot.bvt";
// import template from "./temp.bvt";

import {minmax} from "crux/dist/utils/math";

import { GridPlotOption } from "oviz-components/grid-plot";
import { groupBy, getGroups } from "utils/array";
import { computeLog } from "utils/maths";

import { Color } from "crux/dist/color";
import { Component, XYPlotOption } from "crux/dist/element";



interface DiverBoxPlotOption extends GridPlotOption {
    gridW: number,
    boxW: number,
    colors: string[],
    gapRatio:number,
    drawViolin:boolean,
    drawBox:boolean,
    needlog:boolean,
    drawP:boolean,
    pData:any,
    pposition:any,
    drawOutlier: boolean,
    isSpecial: boolean; // continuos axis drawn as discrete
}

export class DiverBoxPlot extends Component<DiverBoxPlotOption>{
    
    protected discreteCategory;
    protected yLabel;
    protected boxMax:number;
    
    protected colors = [""];
    public render() {
        return this.t`${template}`;
    };
    public willRender() {
        this.yLabel = `this is my own ${this.prop.yLabel}`;
    }
    public defaultProp() {
        return {
            ...super.defaultProp(),
            gapRatio: 0.2,
            drawOutlier: true,
            isSpecial: false,
            // getColor: (pos: number) => "green",
            // getScatterColor: (pos: number) => "#aaa",
        };
    }
}
export  function  processData (arr, valueKey, clsKey, ctgKey, useLog = false){
    
    const categories=getGroups(arr,ctgKey);
    const groupedData = groupBy(arr,clsKey);
    const classifications = getGroups(arr,clsKey).sort();

    //boxdata
    const boxData = classifications.map(_ => ({values: [], outliers: [], means: [], categories}));
    
    const valueRange = [null, null];
    const stat1Maxes = categories.map(_ =>[]);
    const stat2Maxes = categories.map(_ =>[])
    classifications.forEach((cls, j) => {
        const temp = groupBy(groupedData[cls], ctgKey);
        categories.forEach((ctg, i) => {
            const initialData = temp[ctg].map(x => {
                const foo = Number(x[valueKey]);
                if (useLog) return computeLog(foo+1);
                else return foo;
            });
            const range = minmax(initialData);
            
            if (!valueRange[0] || valueRange[0] > range[0]) valueRange[0] = range[0];
            if (!valueRange[1] || valueRange[1] < range[1]) valueRange[1] = range[1];

            const result = [];
            const stat1 = new Oviz.algo.Statistics(initialData);
            const interQuartileRange = stat1.Q3() - stat1.Q1();
            initialData.forEach(d => {
                if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                    boxData[j].outliers.push([i, d]);
                } else {
                    result.push(d);
                }
            });
            const stat2 = new Oviz.algo.Statistics(result);
            boxData[j].values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
            boxData[j].means.push(stat2.mean());
            stat1Maxes[i].push(range[1]);
            stat2Maxes[i].push(stat2.max());
        });
    });
    const result = {
        classifications,
        categories,
        boxData,
        valueRange,
        stat1Maxes: stat1Maxes.map(arr => Math.max(...arr)),
        stat2Maxes: stat2Maxes.map(arr => Math.max(...arr)),
    };
    return result;
    
}
export  function  diverplotDataProcess(value,valuekey,methodkey,classkey){
    
    
    
    //console.log(classkey)
        const groupedData = groupBy(value,methodkey);
        const parsedData = {}; 
        const list_cat=getGroups(value,classkey);
        //categories
        const allcat= list_cat.map(x=>{
            const num=parseFloat(x);
            if (isNaN(num)){
                return x;
            }
            else{
                return num;
            }
        });
    //judge categories is number?
        function isnumber(value){
            if(isNaN(value)){
                return false;
            }
            else {
                return true;
            }
        };
        const Cattype= allcat.every(isnumber);
        let categories:any;
        if(Cattype){
            categories = allcat.sort((a,b)=> parseInt(a) - parseInt(b)).map(i => ` ${i} `);
            // categories.forEach((item,index)=>{
            //     // item=String(item);
            //     item = ` ${item} `;
            //     categories[index]=item
            // });
        }
        else{
            categories = getGroups(value,classkey).sort();
        };
        //from number to string.


    //classifications
        const classifications =  Object.keys(groupedData).sort();
        //console.log(classifications)
        classifications.forEach(cls => {
            const cData = groupedData[cls].map(d => {
                d[valuekey] = parseFloat(d[valuekey]);
                return d;
            });
            parsedData[cls] = groupBy(cData,classkey);
        });
    //violinData
        const violinData= {values: [], violins: [], categories};
        let min,max;
        // categories.forEach((_, i) => {
        //     const values=value[i]
        //     console.log(values[valuekey])
        //     const stat1 = new Oviz.algo.Statistics(Float(values[valuekey]));
        //     if (i === 0) {
        //         min = stat1.min();
        //         max = stat1.max();
        //     } else if (stat1.min() < min) min = stat1.min();
        //     else if (stat1.max() > max) max = stat1.max();
        // });
        const boxData = classifications.map(_ => ({values: [], outliers: [], means: [], categories}));
        // const groupedVioData = groupBy(value,classkey);
        // const temp=[];
        // categories.forEach(cls => {
        //     const vData = groupedVioData[cls].map(d => {
        //         d[valuekey] = parseFloat(d[valuekey]);
        //         return d;
        //     });
        //     temp.push([]);
        //     violinData.violins.push([]);
        //     parsedVioData[cls] = groupBy(vData,methodkey);
        // });
        // categories.forEach((ctg,i)=>{
        //     classifications.forEach((cls,j)=> {
        //         const eachvio=parsedVioData[ctg][cls];
        //         if (!parsedData[cls][ctg]) return;
        //         const initData = eachvio.map(d => d[valuekey]);
        //         console.log("eachvio",typeof(parsedVioData[ctg][cls]))
        //         const stat9 = new Oviz.algo.Statistics(initData);
        //         violinData.values.push([stat9.min(), stat9.max()]);
        //         const eachviolin =eachvio.map(d=>d[valuekey])
        //         temp[i].push(eachviolin);
        //     });
        // })

        // categories.forEach((ctg,i)=>{
        //     classifications.forEach((cls, j) => {
        //         if (temp[j].length > 0) {
        //             const stat = new Oviz.algo.Statistics(temp[j]);
        //             const bins = new Oviz.algo.Histogram(temp[j], "count").getBins();
        //             const maxY = new Oviz.algo.Histogram(temp[j], "count").getMax();
        //             violinData.violins[i].push({bins, maxY, stat});
        //         } else {
        //             violinData.violins[i].push({bins: [], maxY: null, stat: undefined});
        //         }
        //     });
        //     //const totalStat = new Oviz.algo.Statistics(totaltemp);
        //     //violinData.values.push([totalStat._min, totalStat._max]);
        // })
        


        //boxdata
        if(!Cattype){
        categories.forEach((ctg, i) => {
            classifications.forEach((cls, j) => {
                if (!parsedData[cls][ctg]) return;
                const initialData = parsedData[cls][ctg].map(d => d[valuekey]);
                const result = [];
                const stat1 = new Oviz.algo.Statistics(initialData);
                const interQuartileRange = stat1.Q3() - stat1.Q1();
                initialData.forEach(d => {
                    if ((d < stat1.Q3() - 1.5 * interQuartileRange) || (d > stat1.Q3() + 1.5 * interQuartileRange))  {
                        boxData[j].outliers.push([i, d]);
                    } else {
                        result.push(d);
                    }
                });
                const stat2 = new Oviz.algo.Statistics(result);
                boxData[j].values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
                boxData[j].means.push(stat2.mean());
                //new Object(violinData);
        
            });
        });
        }
        else{
            categories.forEach((ctg, i) => {
                classifications.forEach((cls, j) => {
                    if (!parsedData[cls][i]) return;
                    const initialData = parsedData[cls][i].map(d => d[valuekey]);
                    const result = [];
                    const stat1 = new Oviz.algo.Statistics(initialData);
                    const interQuartileRange = stat1.Q3() - stat1.Q1();
                    initialData.forEach(d => {
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
        }
        const result = {
            classifications,
            categories,
            boxData,
            violinData,
        };
        return result;
    
    }

export function datalogprocess(data,valuekey,logn){

    if(logn>0&&logn!=1){
        data.forEach(x => {
            x[valuekey]=computeLog(parseInt(x[valuekey]), logn)
            return x;
            });
    }
    else{
        return; 
    }
    return data;
}
    
