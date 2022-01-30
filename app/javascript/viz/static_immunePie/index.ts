import Oviz from "crux";
import template from "./template.bvt";

const plotSize = [500,1200];

const MODULE_NAME = "immunePie";

function dataprocessor(data) {
    let categories = data.columns.slice(1);
    if(data.columns[1] == "Method") {
        categories = categories.slice(1);
    }
    let tryit: Map<string, number> = data[1];
    categories.forEach(category => {
        tryit[category] = 0;
    });
    data.forEach(d => {
        categories.forEach(category => {
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
    // if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: id,
        template,
        loadData: {
            data: {
                url: path,
                type: "csv",
                dsvHasHeader: true,
                loaded(data) {
                    this.data.pieData = dataprocessor(data)
                },
            },
        },
        setup() { 
            this.data.plotSize = plotSize;
            console.log(this["_data"]);
        },
    });
}