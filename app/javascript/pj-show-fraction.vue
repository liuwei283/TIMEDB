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

            <br>

            <div id="fraction-pieBlock" class="row vizBlock">
                <div class="col vis" id = "fraction-pieVis">
                </div>
                <div id="fraction-pie-editor" class = "md-col-3 v-editor">
                    <OvizEditor :config="fraction_conf_pie" :editorWidth = "280"/>
                </div>
            </div>

            <div v-if="!getpieFexists" class = "text-center row justify-content-center">
                <h2>No data available</h2>
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

            <br>

            <div id="fraction-boxplotBlock" class="row vizBlock">
                <div class="col vis" id = "fraction-boxplotVis">
                </div>
                <div id="fraction-boxplot-editor" class = "md-col-3 v-editor">
                    <OvizEditor :config="fraction_conf_boxplot" :editorWidth = "280"/>
                </div>
            </div>

            <div v-if="!getboxplotFexists" class = "text-center row justify-content-center">
                <h2>No data available</h2>
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

            <br>

            <div id="fraction-heatmapBlock" class="row vizBlock">
                <div class="col vis" id = "fraction-heatmapVis">
                </div>
                <div id="fraction-heatmap-editor" class = "md-col-3 v-editor">
                    <OvizEditor :config="fraction_conf_heatmap" :editorWidth = "280"/>
                </div>
            </div>

            <div v-if="!getheatmapFexists" class = "text-center row justify-content-center">
                <h2>No data available</h2>
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

            <br>

            <div id="fraction-landscapeBlock" class="row vizBlock">
                <div class="col vis" id = "fraction-landscapeVis">
                </div>
                <div id="fraction-landscape-editor" class = "md-col-3 v-editor">
                    <OvizEditor :config="fraction_conf_landscape" :editorWidth = "280"/>
                </div>
            </div>

            <div v-if="!getlandscapeFexists" class = "text-center row justify-content-center">
                <h2>No data available</h2>
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
import {init as fractionHeatmap} from "viz/static_fraction_heatmap"
import {init as fractionPie} from "viz/static_fraction_Pie"

Vue.use(OvizEditor);
Vue.use(BootstrapVue);

Vue.component("dropdown-select", DropDownSelect)
import Vue from 'vue';
export default {
    data() {
        return {
            // cancers: window.gon.cancers,
            project_name: window.gon.project_name,
            file_exist: window.gon.files,
            fraction_conf_pie: {},
            fraction_conf_boxplot: {},
            fraction_conf_heatmap: {},
            fraction_conf_landscape: {},
            data_path : "/public/data/",
            pie_selector: window.gon.selector_attrs,
            pie_selected: null,
            boxplot_selected:null,
            heatmap_selected: null,
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
            boxplot_fexiests: null,
            clinical_fexists: true,
            landscape_cell_fexists: true,
            heatmap_fexists: null,

        }
    },
    created() {
        this.pie_selected = this.pie_selector[0];
        this.boxplot_selected="Consensus";
        this.heatmap_selected="ABIS";
        this.landscape_selected="pie";
        this.clinical_fexists = this.file_exist['clinical'];

    },
    mounted() {
        event.rpcRegisterReceiver("getVue", () => this);
        this.all_viz();
    },
    methods: {
        pieViz(){
            var clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";
            if(this.clinical_fexists == 'true'){
                document.getElementById("fraction-pieBlock").style.display = "block";

                fractionPie("#fraction-pieVis", clinical_file_path, this.pie_selected, "#fraction-pie-editor", "fraction_pie_viz");

            }else{
                document.getElementById("fraction-pieBlock").style.display = "none";
            }

            
        },
        boxplotViz(){
            var cellData_file_path = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";
            this.boxplot_fexiests = this.file_exist[this.boxplot_selected];
            if(this.boxplot_fexiests == 'true'){
                document.getElementById("fraction-boxplotBlock").style.display = "block";

                if (this.boxplot_selected == "Consensus") {
                    fractionGroupBoxplot("#fraction-boxplotVis", cellData_file_path, "#fraction-boxplot-editor", "fraction_boxplot_viz");
                }
                else {
                    fractionBoxplot("#fraction-boxplotVis", cellData_file_path, "#fraction-boxplot-editor", "fraction_boxplot_viz");
                }
            }else{
                document.getElementById("fraction-boxplotBlock").style.display = "none";
            }

        },
        landscapeViz(){
            var cellData_file_path = this.data_path + "cell_data/Consensus/" + this.project_name + "_Consensus.csv";
            this.landscape_cell_fexists = this.file_exist['Consensus'];
            
            if (this.landscape_cell_fexists == 'true') {
                document.getElementById("fraction-landscapeBlock").style.display = "block";
                fractionLandscape("#fraction-landscapeVis", cellData_file_path, this.landscape_selected, "#fraction-landscape-editor", "fraction_landscape_viz");
            }
            else {
                document.getElementById("fraction-landscapeBlock").style.display = "none";
            }
        },

        heatmapViz() {
            var clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";
            var cellData_file_path = this.data_path + "cell_data/" + this.heatmap_selected + "/" + this.project_name + "_" + this.heatmap_selected + ".csv";
            this.heatmap_fexists = this.file_exist[this.heatmap_selected];
            if(this.clinical_fexists=="true" && this.heatmap_fexists=='true'){
                document.getElementById("fraction-heatmapBlock").style.display = "block";
                fractionHeatmap("#fraction-heatmapVis", clinical_file_path, cellData_file_path, "#fraction-heatmap-editor", "fraction_heatmap_viz");
            }else{
                document.getElementById("fraction-heatmapBlock").style.display = "none";

            }
        },

        all_viz() {
            this.boxplotViz();
            this.landscapeViz();
            this.pieViz();
            this.heatmapViz();
        },

    },
    computed:{
        getpieFexists() {
            return this.clinical_fexists == 'true'
        },
        getboxplotFexists() {
            return this.boxplot_fexiests == 'true';
        },
        getlandscapeFexists() {
            return this.landscape_cell_fexists == 'true';
        },
        getheatmapFexists() {
            return this.clinical_fexists=="true" && this.heatmap_fexists=='true'
        }
    }
}
</script>

<style scoped lang = "scss">
.viz {
    padding: 50px;
    position: relative;
    box-shadow: 0 0 64px darken(#dee2e6, 5%)
}

.vizBlock {
    position: relative !important;
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
