import Oviz from "crux"
import template from "./template.bvt"
import {register} from "page/visualizers";

import {groupBy} from "utils/array"

import { registerEditorConfig } from "utils/editor";
import { editorConfig } from "./editor";
import { groupedChartColors} from "oviz-common/palette"
const ylabel = "Relative abundance(log10)";
const classifiedIndex = 0;
const valueRange = [-8, 2];
const title = "grouped box plot"
//please change the displayed value range in the template by the prop: valueRange.
const MODULE_NAME = 'grouped-boxplot'

interface BoxplotData {
    values: any[], 
    outliers: any[], 
    means: number[],
}

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        data: {ylabel, valueRange, title,
            config: {
                plotWidth: 1000,
                showOutliers: true,
                xLabelRotation: 45,
            },
            colors: groupedChartColors,
        },
        loadData: {
            boxplotDataGrouped: {
                fileKey: "boxplotDataGrouped",
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    const categories = data.columns.slice(1);
                    const classifiedKey = data.columns[classifiedIndex];
                    const classifications = data.map(d => (d[classifiedKey])).filter((item, index, self) => {
                        return self.indexOf(item) === index; });
                    const boxData = [{values: [], outliers: [], means: [], categories}, {values: [], outliers: [], means: [], categories}];
                    const colors = Object.values(Oviz.color.schemeCategory("light", classifications).colors);
                    categories.forEach((arr, i) => {
                        const initialData = [[], []];
                        data.forEach(d => {
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
                    this.data.boxData = boxData;
                    this.data.classifications = classifications;
                    this.data.categories = categories;
                    return null;
                },
            },
        },
        setup() {            
            this.data.plotWidth = 1000;
            registerEditorConfig(editorConfig(this));
        },
    });
    
    return visualizer;
}

register(MODULE_NAME, init);