import Oviz from "crux";
import template from "./template.bvt";
import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";

const plotSize = [500, 800];

let title = "Proportion";

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

export function init(id, path, config) {

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        data: { 
            title,
            startX: 100, 
            startY: 0, 
            width: 1550, 
            height: 500, 
            titleSize: 11, 
            labelSize: 11, 
            ylabel: "", 
            xlabel: "", 
            plotRotation: 0, 
            xRotation: 0, 
            yRotation: 0,
            groups: {}
        },
        loadData: {
            data: {
                url: path,
                type: "csv",
                dsvHasHeader: true,
                loaded(data) {
                    this.data.pieData = Dataprocessor(this, data)
                },
            },
        },
        setup() { 
            this.data.plotSize = plotSize;
            console.log(this["_data"]);
            // registerEditorConfig(editorConfig(this));
        },
    });
}