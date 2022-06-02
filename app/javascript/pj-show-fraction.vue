<template>
    <div>
        <div id = "fraction-pie" class = "container Block">
            <div class="row description">
              <h4>Some description for Project Clinical Feature Piechart in project fraction overview</h4>
            </div>

            <div class="select-bar form-inline row">
              <div class="sdiv col">
                <div class="select-title">
                    Please choose the attribute:
                </div>
                 <select @change='pieViz' class="form-select col" id="fraction-pie-selector" data-style="btn-secondary" data-live-search="true" v-model="pie_selected">
                    <option v-for="(option, index) in pie_selector" :key="index" :value="option" >
                        {{option}}
                    </option>
                </select>
              </div>
            </div>

            <div id = "fraction_pieBlock">
                <div class="dropdown mb-5 mt-5">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="fraction_pie_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fraction_pie_download_dropdwon">
                        <a class="dropdown-item viz_download" id = "fraction-pie_viz_download" @click="down_graph($event)">Download fraction pie chart</a>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="md-col-9 vis vizBlock" id = "fraction-pieVis">
                    </div>
                    <div id="fraction-pie-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="fraction_conf_pie" :editorWidth = "280"/>
                    </div>
                </div>
            </div>
        </div>


        <div id = "fraction-boxplot" class = "container Block">
            <div class="row description">
              <h4>Some description for Cell Fraction Boxplot in project fraction overview</h4>
            </div>

            <div class="select-bar form-inline row">
              <div class="sdiv col">
                <div class="select-title">
                    Please choose the method:
                </div>

                     <select @change='boxplotViz' class="form-select col" id="fraction-boxplot-selector" data-style="btn-secondary" data-live-search="true" v-model="boxplot_selected">
                        <option v-for="(option, index) in boxplot_selector" :key="index" :value="option.value" :disabled="option.label=='──────────'">
                            {{option.label}}
                        </option>
                    </select>
              </div>
            </div>

            <div id = "fraction_boxplotBlock">
                <div class="dropdown mb-5 mt-5">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="fraction_boxplot_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fraction_boxplot_download_dropdwon">
                        <a class="dropdown-item viz_download" id = "fraction-boxplot_viz_download" @click="down_graph($event)">Download fraction boxplot chart</a>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="md-col-9 vis vizBlock" id = "fraction-boxplotVis">
                    </div>
                    <div id="fraction-boxplot-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="fraction_conf_boxplot" :editorWidth = "280"/>
                    </div>
                </div>
            </div>
        </div>

        <div id = "fraction-heatmap" class = "container Block">
            <div class="row description">
              <h4>Some description for Project Immunce Cell Fraction Heatmap</h4>
            </div>

            <div class="select-bar form-inline row">
              <div class="sdiv col">
                <div class="select-title">
                    Please choose the method:
                </div>
                     <select @change='heatmapViz' class="form-select col" id="fraction-heatmap-selector" data-style="btn-secondary" data-live-search="true" v-model="heatmap_selected">
                        <option v-for="(option, index) in heatmap_selector" :key="index" :value="option.value" :disabled="option.label=='──────────'">
                            {{option.label}}
                        </option>
                    </select>
              </div>
            </div>

            <div id = "fraction_heatmapBlock">
                <div class="dropdown mb-5 mt-5">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="fraction_heatmap_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fraction_heatmap_download_dropdwon">
                        <a class="dropdown-item viz_download" id = "fraction-heatmap_viz_download" @click="down_graph($event)">Download fraction heatmap chart</a>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="md-col-9 vis vizBlock" id = "fraction-heatmapVis">
                    </div>
                    <div id="fraction-heatmap-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="fraction_conf_heatmap" :editorWidth = "280"/>
                    </div>
                </div>
            </div>
        </div>

        <div id = "fraction-landscape" class = "container Block">
            <div class="row description">
              <h4>Some description for Cell Fraction Landscape in project fraction overview</h4>
            </div>

            <div class="select-bar form-inline row">
              <div class="sdiv col">
                <div class="select-title">
                    Please choose the visualization type:
                </div>
                <select @change='landscapeViz' class="form-select col" id="fraction-landscape-selector" data-style="btn-secondary" data-live-search="true" v-model="landscape_selected">
                        <option v-for="(option, index) in landscape_selector" :key="index" :value="option.value">
                            {{option.label}}
                        </option>
                </select>
              </div>
            </div>

            <div id = "fraction_landscapeBlock">
                <div class="dropdown mb-5 mt-5">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="fraction_landscape_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fraction_landscape_download_dropdwon">
                        <a class="dropdown-item viz_download" id = "fraction-landscape_viz_download" @click="down_graph($event)">Download fraction landscape chart</a>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="md-col-9 vis vizBlock" id = "fraction-landscapeVis">
                    </div>
                    <div id="fraction-landscape-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="fraction_conf_landscape" :editorWidth = "280"/>
                    </div>
                </div>
                <div id="fraction_landscape_loading" style="display:none;">
                    <img v-bind:src="require('../assets/images/loading_icon.gif')" alt="Loading..." style="width:90%;" />
                </div>
            </div>
        </div>

    </div>
</template>
<script lang = 'ts'>
import BootstrapVue from 'bootstrap-vue';
import OvizEditor from "oviz-editor";

import axios from "axios";
import { event } from "crux/dist/utils";
import {viz_mode} from "page/visualizers";

import DropDownSelect from "page/builtin/dropdown-select.vue";

import {init as fractionBoxplot} from "viz/static_fraction_boxplot" 
import {init as fractionGroupBoxplot} from "viz/static_fraction_grouped_boxplot"
import {init as fractionLandscape} from "viz/static_fraction_comparedPlot"
import {init as fractionLandscape2} from "viz/static_fraction_comparedPlot2"
import {init as fractionHeatmap} from "viz/static_fraction_heatmap"
import {init as fractionPie} from "viz/static_fraction_Pie"

Vue.use(OvizEditor);
Vue.use(BootstrapVue);

Vue.component("dropdown-select", DropDownSelect)
import Vue from 'vue';
// selector 展示出来的数据
export default {
    data() {
        return {
            // cancers: window.gon.cancers,
            project_name: window.gon.project_name,
            fraction_conf_pie: {},
            fraction_conf_boxplot: {},
            fraction_conf_heatmap: {},
            fraction_conf_landscape: {},
            data_path : "/public/data/",
            pie_selector: window.gon.selector_attrs,
            pie_selected: null,
            boxplot_selected:null,
            heatmap_selected: null,
            vue_name: "fraction_vue",
            boxplot_selector:[
                    {value:"Consensus",label:"Consensus"},
                    {value:"Disable",label:"──────────"},
                    {value:"ABIS",label:"ABIS"},
                    {value:"CIBERSORT",label:"CIBERSORT"},
                    {value:"CIBERSORTX",label:"CIBERSORTX"},
                    {value:"ConsensusTME",label:"ConsensusTME"},
                    {value:"EPIC",label:"EPIC"},
                    {value:"ImmuCellAI",label:"ImmuCellAI"},
                    {value:"MCPcounter",label:"MCPcounter"},
                    {value:"quanTIseq",label:"quanTIseq"},
                    {value:"TIMER",label:"TIMER"},
                    {value:"xCell",label:"xCell"},
            ],
            heatmap_selector:[
                    {value:"ABIS",label:"ABIS"},
                    {value:"CIBERSORT",label:"CIBERSORT"},
                    {value:"CIBERSORTX",label:"CIBERSORTX"},
                    {value:"ConsensusTME",label:"ConsensusTME"},
                    {value:"EPIC",label:"EPIC"},
                    {value:"ImmuCellAI",label:"ImmuCellAI"},
                    {value:"MCPcounter",label:"MCPcounter"},
                    {value:"quanTIseq",label:"quanTIseq"},
                    {value:"TIMER",label:"TIMER"},
                    {value:"xCell",label:"xCell"},
            ],
            landscape_selected: null,
            landscape_selector:[
                    {value:"pie",label:"Pie Chart"},
                    {value:"bar",label:"Bar Plot"},

            ],

            }
    },
    //设置默认值
    created() {
        this.pie_selected = this.pie_selector[0];
        this.boxplot_selected="Consensus";
        this.heatmap_selected="ABIS";
        this.landscape_selected="pie";
    },
    mounted() {
        event.rpcRegisterReceiver(this.vue_name, () => this);
        this.all_viz();
    },
    methods: {
        pieViz(){
            var clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";
            fractionPie("#fraction-pieVis", clinical_file_path, this.pie_selected, "#fraction-pie-editor", "fraction_pie_viz", this.vue_name);
        },
        boxplotViz(){
            var cellData_file_path = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";

            if (this.boxplot_selected == "Consensus") {
                fractionGroupBoxplot("#fraction-boxplotVis", cellData_file_path, "#fraction-boxplot-editor", "fraction_boxplot_viz", this.vue_name);
            }
            else {
                fractionBoxplot("#fraction-boxplotVis", cellData_file_path, "#fraction-boxplot-editor", "fraction_boxplot_viz", this.vue_name);
            }
        },
        landscapeViz(){
            
            //document.getElementById("fraction_landscape_loading").style.display = "block";
            
            var file_name = this.project_name + "_Consensus.csv";
            var file_path = this.data_path + "cell_data/Consensus/" + file_name;
            if(this.landscape_selected == "pie"){
                fractionLandscape("#fraction-landscapeVis", file_path, "pie", "#fraction-landscape-editor", "fraction_landscape_viz", this.vue_name);
            }else{
                fractionLandscape2("#fraction-landscapeVis", file_path, "bar", "#fraction-landscape-editor", "fraction_landscape_viz", this.vue_name);
            }

            // setTimeout(function () {
            //     document.getElementById("fraction_landscape_loading").style.display = "none";
            // }, 3000);
            
        },

        heatmapViz() {
            var clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";
            var cellData_file_path = this.data_path + "cell_data/" + this.heatmap_selected + "/" + this.project_name + "_" + this.heatmap_selected + ".csv";
            if(this.heatmap_selected != "Consensus"){
                fractionHeatmap("#fraction-heatmapVis", clinical_file_path, cellData_file_path, "#fraction-heatmap-editor", "fraction_heatmap_viz", this.vue_name);
            }
            // fractionHeatmap("#fraction-heatmapVis", clinical_file_path, cellData_file_path, "#fraction-heatmap-editor", "fraction_heatmap_viz");
        },

        all_viz() {
            this.boxplotViz();
            this.landscapeViz();
            this.pieViz();
            this.heatmapViz();
        },

        down_graph(e){
            var clicked_id = e.target.id.replace("_viz_download", "");
            console.log(clicked_id);
            const svgContainerClone = document.getElementById(clicked_id + "Vis").cloneNode(true);
            const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
            const svgUrl = URL.createObjectURL(svgBlob);
            const downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = clicked_id + ".svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

    }
}
</script>

<style scoped lang = "scss">
/* .viz {
    padding: 50px;
    position: relative;
    box-shadow: 0 0 64px darken(#dee2e6, 5%)
} */

.veBlock {
    position: relative !important;
    box-shadow: 0 0 64px darken(#dee2e6, 5%)
}

.vizBlock {
        overflow-y: scroll;
        overflow-x: scroll;
        //padding: 2em;
        margin-top: 5%;
        margin-bottom: 5%;
}
    
/* .v-editor {
    position: fixed !important;
    top: 30px;
    right: 50px;
    z-index:20;
    transition: all 0.3s;
} */

.v-editor {
    position: absolute;
    top: 10px;
    transition: all 0.3s;
    right: 10px;
    z-index: 1 !important;
}
</style>
