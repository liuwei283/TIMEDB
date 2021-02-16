import Oviz from "crux"
import template from "./template.bvt"
import {register} from "page/visualizers";
import {getGroups} from "utils/array"
import {rankDict, sortByRank} from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import { findBoundsForValues, computeLog } from "utils/maths";
// import { editorConfig } from "./editor";
import { groupedChartColors} from "oviz-common/palette";
import {editorConfig} from "./editor";
import * as _ from "lodash";

//please change the displayed value range in the template by the prop: valueRange.
const MODULE_NAME = 'boxplot-single'

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
        data: {
            config: {
                plotWidth: 1000,
                showOutliers: true,
                xLabelRotation: 45,
            },
            colors: groupedChartColors,
            ylabel: "Alpha diversity",
        },
        loadData: {
            boxSingleMain: {
                fileKey: "boxSingleMain",
                type: "tsv",
                dependsOn: ["boxSingleGroup"],
                dsvHasHeader: true,
                loaded(data) {
                    console.log(data);
                    const samples = data.columns.slice(1);
                    const rankKey = data.columns[0];
                    
                    this.data.ranks = [];
                    this.data.mainDict = {};
                    data.forEach(d => {
                        const rankLabel = rankDict[d[rankKey]];
                        this.data.ranks.push(rankLabel);
                        const allValues = [];
                        const initialData = [[], []];
                        samples.forEach(s => {
                            const v = parseFloat(d[s]);
                            allValues.push(v);
                            console.log(this.data.groupDict[s]);
                            if (this.data.groupDict[s] === this.data.groups[0])
                                initialData[0].push(v);
                            else 
                                initialData[1].push(v);
                        });
                        const boxData = { categories: [...this.data.groups],
                            valueRange: findBoundsForValues(allValues, 2, false, 0.5),
                            values: [], outliers: [], means: [], max: Math.max(...allValues)};
                        console.log(initialData);
                        this.data.groups.forEach((group, i) => {
                            const result = [];
                            const stat1 = new Oviz.algo.Statistics(initialData[i]);
                            const interQuartileRange = stat1.Q3() - stat1.Q1();
                            initialData[i].forEach(x => {
                                if ((x < stat1.Q3() - 1.5 * interQuartileRange) || (x > stat1.Q3() + 1.5 * interQuartileRange))  {
                                    boxData.outliers.push([i, x]);
                                } else {
                                    result.push(x);
                                }
                            });
                            const stat2 = new Oviz.algo.Statistics(result);
                            boxData.values.push([stat2.min(), stat2.Q1(), stat2.median(), stat2.Q3(), stat2.max()]);
                            boxData.means.push(stat2.mean());
                        });
                        this.data.mainDict[rankLabel] = {...boxData};
                    });
                    this.data.ranks = this.data.ranks.sort((a, b) => sortByRank(a,b));
                    this.data.boxData = this.data.mainDict[this.data.ranks[3]];
                    return null;
                },
            },
            boxSingleGroup: {
                fileKey: "boxSingleGroup",
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    this.data.groupDict = {};
                    this.data.groups = getGroups(data, data.columns[1]);
                    data.forEach(d => {
                        this.data.groupDict[d[data.columns[0]]] = d[data.columns[1]];
                    });
                    return null;
                },
            },
            boxSingleP: {
                fileKey: "boxSingleP",
                type: "tsv",
                dsvHasHeader: true,
                loaded(data) {
                    console.log(data);
                }
            }
        },
        setup() {            
            this.data.plotWidth = 1000;
            console.log(this["_data"]);
            registerEditorConfig(editorConfig(this));
        },
    });
    
    return visualizer;
}

register(MODULE_NAME, init);