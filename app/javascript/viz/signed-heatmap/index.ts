import Oviz from "crux";
import template from "./template.bvt"
import { processTreeData } from "./data";
import { editorConfig } from "./editor";
import { SignedHeatMap } from "./signed-heatmap";
import { BinaryTree, Gravity } from "./binary-tree";
import {savedTheme} from "oviz-common/mem-theme"

import {copyObject} from "utils/object"
import { event } from "crux/dist/utils";
import {register} from "page/visualizers";

// reigister default color theme
Oviz.use.theme("mh-dark", {
    extends: "dark",
    colors: {
        primary: "#5aae61",
        path: "white",
    },
    schemes: {
        discreteDataScheme: ["white", "grey", "red"],
    },
});

Oviz.use.theme("mh-light", {
    extends: "light",
    colors: {
        primary: "#5aae61",
        path: "black",
    },
    schemes: {
        discreteDataScheme: ["white", "grey", "red"],
    },
});

const MODULE_NAME = 'signed-heatmap'

const SignedHeatmap = {
    initViz,
    initVizWithDeepomics,
}

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const vizOpts = generateDefaultVizOpts();
    const {visualizer} = Oviz.visualize(vizOpts);
    // return visualizer;
}


function initVizWithDeepomics(fileDefs :any){
    const vizOpts = copyObject(generateDefaultVizOpts());
    Object.keys(vizOpts.loadData).forEach( dataType => {
        console.log(dataType);
        if (vizOpts.loadData[dataType].fileKey) vizOpts.loadData[dataType].fileKey = null;
        if (fileDefs[dataType])
            vizOpts.loadData[dataType].url =  `/api/public?path=${btoa(fileDefs[dataType].path)}`
        else {
            delete vizOpts.loadData[dataType];
            vizOpts.data[dataType] = null;
        }
    })
    Object.keys(vizOpts.loadData).forEach( dataType => {console.log(vizOpts.loadData[dataType])})
    const {visualizer} = Oviz.visualize(vizOpts);
    return {visualizer, editorConf: editorConfig(visualizer)};

}

function initViz() {
    const vizOpts = copyObject(generateDefaultVizOpts());
    const {visualizer} = Oviz.visualize(vizOpts);
    return visualizer;
}


function registerEditorConfig(editorConf) {
    const vue = event.rpc("getVue");
    if (vue) {
        vue.conf = editorConf;
        vue.$root.$data.editorRef = {};
    }
}
function generateDefaultVizOpts() {
    const vizOpts = {
        el: "#canvas",
        template,
        theme: savedTheme("mh", "mh-light"),
        components: {SignedHeatMap, BinaryTree},
        data: {
            config: {
                showPAnno: true,
                rangeMin: 0,
                rangeMax: 0,
                isSym: true,
                gridH: 15,
                rowTree: {
                    treeHeight: 200,
                    depthUnit: 0,
                    gravity: Gravity.Right,
                },
                colTree: {
                    treeHeight: 100,
                    depthUnit: 0,
                    gravity: Gravity.Bottom,
                },
            },
            colors: {
                "origin": "white",
                "positive range": "red",
                "negative range": "green",
                "group1": "#EC7063",
                "group2": "#58D68D",
            },
            heatmapDataP: null,
            groupData: null,
            rowTreeData: null,
            colTreeData: null,
        },
        loadData: generateDefaultDataSources(),
        setup() {
            setUpRange(this);
            registerEditorConfig(editorConfig(this));
            if (this.data.rowTreeData) setUpRowTree(this);
            if (this.data.colTreeData) setUpColTree(this);
            if (this.data.heatmapData.rows.length > 100) this.data.config.gridH = 10;
            else if (this.data.heatmapData.rows.length > 60) this.data.config.gridH = 12;
        }
    };
    return vizOpts; 
}

function generateDefaultDataSources() {
    const defaultDataSources = {
        heatmapData: {
            type: "tsv",
            fileKey: "heatmapData",
            loaded(d) {
                if (!d) return;
                const rows = [];
                const data = {};
                let [min, max] = [0, 0];
                d.forEach(line => {
                    const rowData = {};
                    const rowAttr = line[""];
                    rows.push(rowAttr);
                    d.columns.forEach(col => {
                        if (col === "") return;
                        const h = {};
                        h["r"] = line[col];
                        if (parseFloat(line[col]) > max) max = line[col];
                        if (parseFloat(line[col]) < min) min = line[col];
                        rowData[col] = h;
                    });
                    data[rowAttr] = rowData;
                });
                return {rows, columns: d.columns.splice(1, d.columns.length), data,
                    range: {min, max}};
            },
        },
        heatmapDataP: {
            type: "tsv",
            fileKey: "heatmapDataP",
            dependsOn: ["heatmapData"],
            optional: true,
            loaded(d) {
                if (!d) return;
                this.data.heatmapData.rows.forEach(r => {
                    d.forEach(line => {
                        if (line[""] === r) {
                            this.data.heatmapData.columns.forEach(c => {
                                this.data.heatmapData.data[r][c]["p"] = line[c];
                            });
                            return;
                        }
                    });
                });
                return null;
            },
        },
        groupData: {
            type: "tsv",
            fileKey: "groupData",
            loaded: function l(d) {
                if (!d) return;
                const data = {};
                const phylums = {};
                this.data.heatmapData.rows.forEach(r => {
                    d.forEach(line => {
                        if (line.Species === r) {
                            data[r] = {...line};
                        }
                    });
                });
                d.forEach( s => {
                    if (!phylums[s.Phylum])
                        phylums[s.Phylum] = [s.Genus];
                    else if (!phylums[s.Phylum].includes(s.Genus))
                            phylums[s.Phylum].push(s.Genus);
                });
                // name Unknown to Other [phylum]
                Object.keys(phylums).forEach( k => {
                    phylums[k] = phylums[k].sort();
                    if (phylums[k].indexOf("Unknown") > 0) {
                        phylums[k].splice(phylums[k].indexOf("Unknown"), 1);
                        phylums[k].push("Other " + k);
                    }
                });
                phylums["Other"] = ["Unclassified"];
                this.data.phylums = phylums;
                this.data.familyColorMap = initializeFamilyColors(phylums);
                return data;
            },
        },
        rowTreeData: {
            type: "newick",
            fileKey: "rowTreeData",
            dependsOn: ['heatmapData'],
            optional: true,
            loaded(d) {
                if (!d) return;
                d.depth = 0;
                const {rootNode, nodeList} = processTreeData(d);
                this.data.heatmapData.rows = sortByTreeNodes(nodeList, this.data.heatmapData.rows);
                return rootNode;
            },
        },
        colTreeData: {
            type: "newick",
            fileKey: "colTreeData",
            dependsOn: ['heatmapData'],
            optional: true,
            loaded(d) {
                if (!d) return;
                d.depth = 0;
                const {rootNode, nodeList} = processTreeData(d);
                this.data.heatmapData.columns = sortByTreeNodes(nodeList, this.data.heatmapData.columns);
                return rootNode;
            },
        },
    }
    if (window.gon && window.gon.required_data ) {
        const dataSources = {}
        window.gon.required_data.forEach(dt => {
            dataSources[dt] = defaultDataSources[dt];
        })
        return dataSources;
    } else 
        return defaultDataSources;
}

/*
* Control group species have negative correlation
* Gout group species have positive correlation
*/
// let nodeSeq = 0;
// let treeHeight = 0;

function initializeFamilyColors(phylums): any {
    const colorMap = {};
    let j = 200;
    const Color = Oviz.color.Color;
    Object.keys(phylums).forEach(k => {
        colorMap[k] = {};
        const initColor = Color.hsl(j, 75, 80);
        const hueInterval = 20;
        if (phylums[k].length <= 5) {
            phylums[k].forEach((genus, i) => {
                colorMap[k][genus] = initColor.darken(10 * (i % 5)).string;
            });
            j = j + Math.ceil(phylums[k].length / 5) * hueInterval;
        } else {
            phylums[k].forEach((genus, i) => {
                colorMap[k][genus] = initColor.shiftHue(Math.ceil(i / 5) * hueInterval)
                                            .darken(10 * (i % 5)).string;
            });
            j = j + Math.ceil(phylums[k].length / 5) * hueInterval;
        }
    });
    const unknown = {Unclassified: Color.rgb(200, 200, 200).string};
    colorMap["Other"] = unknown;
    return colorMap;
}

function setUpRowTree(v) {
    v.data.config.rowTree.depthUnit = v.data.config.rowTree.treeHeight / v.data.rowTreeData.height;
}

function setUpColTree(v) {
    v.data.config.colTree.depthUnit = v.data.config.rowTree.treeHeight / v.data.colTreeData.height;
}

function setUpRange(v) {
    v.data.config.rangeMin = v.data.heatmapData.range.min;
    v.data.config.rangeMax = v.data.heatmapData.range.max;
}

export default SignedHeatmap;

register(MODULE_NAME, init);


function sortByTreeNodes(treeArr, heatmapArr ):string[] {
    const sortedArr = [];
    treeArr.forEach(node => {
        heatmapArr.forEach((d, i) => {
            const sortedD = d;
            if (node.replace(/[^a-z]/ig,'') === d.replace(/[^a-z]/ig,'')){
                sortedArr.push(sortedD);
                heatmapArr.splice(i, 1);
            }
        })
    })
    return sortedArr;
}