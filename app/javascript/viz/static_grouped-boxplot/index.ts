import Oviz from "crux"
import template from "./template.bvt"
import { groupedChartColors} from "oviz-common/palette"
import { findBoundsForValues } from "utils/maths";

const ylabel = "Relative abundance(log10)";
const classifiedIndex = 0;
const valueRange = [-9, 3];
const title = "grouped box plot"

export function init(id, path, config) {
    console.log(id);
    Oviz.visualize({
        el: id,
        template,
        data: {ylabel, title,
            config: {
                plotWidth: 1000,
                showOutliers: true,
                xLabelRotation: 70,
            },
            colors: groupedChartColors,
        },
        loadData: {
            data: {
                url: path,
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    const categories = data.columns.slice(1);
                    const classifiedKey = data.columns[classifiedIndex];
                    const classifications = data.map(d => (d[classifiedKey])).filter((item, index, self) => {
                        return self.indexOf(item) === index; });
                    const boxData = [{values: [], outliers: [], means: [], categories}, {values: [], outliers: [], means: [], categories}];
                    const colors = Object.values(Oviz.color.schemeCategory("light", classifications).colors);
                    const allValues = [];
                    categories.forEach((arr, i) => {
                        const initialData = [[], []];
                        data.forEach(d => {
                            allValues.push(parseFloat(d[arr]));
                            if (d[classifiedKey] === classifications[0]) {
                                initialData[0].push(parseFloat(d[arr]));
                            } else {
                                initialData[1].push(parseFloat(d[arr]));
                            }
                        });
                        classifications.forEach((classification, j) => {
                            const result = [];
                            const stat1 = new Oviz.algo.Statistics(initialData[j]);
                            const interQuartileRange = stat1.Q3() - stat1.Q1();
                            initialData[j].forEach(d => {
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
                    this.data.valueRange = findBoundsForValues(allValues, 2, false, 0.5);
                    this.data.boxData = boxData;
                    this.data.classifications = classifications;
                    this.data.categories = categories;
                    return null;
                },
            },
        },
    });
}