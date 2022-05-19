import Oviz from "crux";
import template from "./template.bvt";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";
import { pieDataloaded } from "viz/static_method_immunePie/data";

function Dataprocessor(v, data) {
    let categories = data.columns.slice(1);
    if(data.columns[1] == "Method" || data.columns[1] == "method") {
        v.data.title = data[0]["Method"] || data[0]["method"];
        categories = categories.slice(1);
    }
    let tryit = {};
    categories.forEach(category => {
        tryit[category] = 0;
    });
    data.forEach(d => {
        categories.forEach(category => {
            if(isNaN(parseFloat(d[category]))) return;
            tryit[category] += parseFloat(d[category]);
        });
    });
    categories.forEach(category => {
        tryit[category] /= data.length;
    });
    data = tryit; //取得第一个样本
    let columns = categories; //去除后三列
    const pieData = [];
    //从去除后三列的三个样本数据得到pieData格式
    columns.forEach((d,i) => {
        //得到它的颜色
        const color = Oviz.color.Color.hsl((i%6)*60, 60+Math.floor((i/6))*10, 60+Math.floor((i/6))*10) ;
        pieData.push({value: parseFloat(data[d]), name: d, color});
    });
    return pieData
}

export function init(vid, path, eid) {

    const {visualizer} = Oviz.visualize({
        el: vid,
        template,
        data: { 
            startX: 500, 
            startY: 300, 
            width: 500, 
            height: 500, 
            titleSize: 20, 
            labelSize: 11,
            title: "Proportion",
            ylabel: "", 
            xlabel: "", 
            plotRotation: 0, 
            xRotation: 0, 
            yRotation: 0,
            groups: {
                colors: {}
            }
        },
        loadData: {
            data: {
                url: path,
                type: "csv",
                dsvHasHeader: true,
                loaded(data) {
                    this.data.pieData = Dataprocessor(this, data)
                    this.data.groups = {
                        colors: {}
                    }
                    this.data.pieData.forEach(d=>{
                        this.data.groups.colors[d.name] = d.color.string
                    })
                    console.log(this.data.groups)
                    Object.entries(this.data.groups.colors).map(d => { return {"title": d[0], "fill": d[1]}})
                },
            },
        },
        setup() { 
            console.log("immunePie")
            console.log(this);
            registerEditorConfig(editorConfig(this, eid));
        },
    });
}