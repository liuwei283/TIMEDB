import Oviz from "crux"
import template from "./template.bvt"

const color = "#3d8eff";
const xlabel = "Name";
const ylabel = "Age";
const title = "Our lab members' age";
const xAxisIndex  = 0;
const yAxisIndex = 1;

export default function init(id, path) {
    console.log(id);
    Oviz.visualize({
        el: id,
        template,
        data: {color, xlabel, ylabel, title, xAxisIndex, yAxisIndex},
        loadData: {
            data: {
                url: path,
                type: "csv",
                dsvHasHeader: true,
                loaded(data) {
                    const xAxisKey = data.columns[xAxisIndex];
                    const yAxisKey = data.columns[yAxisIndex];
                    const result = [];
                    data.forEach(d => {
                        result.push([d[xAxisKey], d[yAxisKey]]);
                    });
                    console.log(result);
                    return result;
                },
            },
        },
    });
}
