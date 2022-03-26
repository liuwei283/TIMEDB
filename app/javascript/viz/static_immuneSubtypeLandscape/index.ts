import Oviz from "crux";
import template from "./template.bvt";
import { ComplexStackedBar } from "oviz-components/complex-stacked-bar";

const xlabel = "project type";
const ylabel = "proportion";

export function init(id, path, config) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        components: { ComplexStackedBar },
        data: {
            xlabel, ylabel,
            tickprop : {
                opt: {
                    line: {
                        stroke: "none"
                    },
                    tick: {
                        stroke: "none"
                    }
                }
            }
        },
        loadData: {
            data: {
                url: path,
                type: "csv" ,
                dsvHasHeader: false,
                loaded(data) {
                    return staticDataProcessor(data)
                },
            },
        },
    });
    return visualizer;
}

function staticDataProcessor(data) {
    const projects = {};
    let categories = new Set<string>();
    let counter = 0;
    let curr;
    const widMap = {}
    let pro = []
    data.slice(1).forEach((d, index)=>{
        if(d[0].slice(-4) == ".csv") {
            curr = d[0].slice(0, -4);
            projects[curr] = [];
            pro.push(curr);
        }
        if(d[1] != null) categories.add(d[1]);
        if(index == data.slice(1).length-1) {
            if(d[1] != null) categories.add(d[1]);
        }
    })
    let cat = Array.from(categories);
    let temp = {};
    let result = {}
    cat.forEach(c=>{
        temp[c] = 0;
        result[c] = {}
        pro.forEach(p => result[c][p] = 0)
    })
    data.slice(1).forEach((d, index)=>{
        if(d[0].slice(-4) == ".csv") {
            widMap[curr] = counter;
            projects[curr] = Object.entries(temp).map((d: any)=>[d[0], d[1]/counter]);
            cat.forEach(c=>{
                temp[c] = 0;
            })
            counter = 0;
            curr = d[0].slice(0, -4);
        } else {
            if(d[1]!= null) {
                result[d[1]][curr]++;
                temp[d[1]]++;
                counter++;
            }
        }
        if(index == data.slice(1).length-1) {
            console.log(index)
            console.log(curr)
            console.log(result)
            widMap[curr] = counter;
            projects[curr] = Object.entries(temp).map((d: any)=>[d[0], d[1]/counter]);
            cat.forEach(c=>{
                temp[c] = 0;
            })
        }
    })
    let ret = {};
    cat.forEach(c => {
        // let sum = Object.entries(result[c]).reduce((pre, cur) =>  pre + parseFloat(cur[1]), 0);
        ret[c] = Object.entries(result[c]).map((d: [string, number]) => [d[0], d[1]/widMap[d[0]]]);
    })
    let classifications = cat;
    const colorMap = Oviz.color.schemeCategory("dark", cat);
    const colors = Object.values(colorMap);
    let barMax = Object.values(widMap).reduce((pre:number, cur:number) =>  pre + cur, 0)
    console.log({data: ret, classifications, widMap})
    return {data: ret, classifications, widMap}
}
