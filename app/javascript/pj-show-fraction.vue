<template>
    <div>
        <div class="db-tool-nav">

        <button class="btn btn-outline-dark" @click="downall()">Download all charts</button>
        </div><br>

        <div id = "fraction-pie" class = "container Block">
            <div class="row description">
              <h4>Project Clinical Feature Piechart</h4>
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
                    <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="fraction_pie_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fraction_pie_download_dropdwon">
                        <a class="dropdown-item" :href="clinical_file_path"  id = "fraction_pie_clincial_download">Download clinical file</a>
                        <a class="dropdown-item viz_download" id = "fraction-pie_viz_download" @click="down_graph($event)">Download fraction pie chart</a>
                    </div> -->
                    <div id="db-toolbar-pie" class="mb-5">
                        <div class="db-tool-nav">
                            <div class="btn btn-outline-dark" data-toggle="collapse" data-target="#download_box-pie" aria-expanded="true" aria-controls="download_box-pie">
                                Download<i class="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <div id="download_box-pie" class="db-toolbox collapse" data-parent="#db-toolbar-pie">
                                <div class="form-group p-2">
                                    <a :href="clinical_file_path">
                                        <button class = "d-btn btn btn-secondary download" >
                                            <i class='fas fa-download'></i> Download clinical file
                                        </button>
                                    </a>

                                    <button class = "d-btn btn btn-pink download" id = "fraction-pie_viz_download" @click="down_graph($event)">
                                        <i class='fas fa-download'></i> Download fraction pie chart
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="md-col-9" id = "fraction-pieVis">
                    </div>
                    <div id="fraction-pie-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="fraction_conf_pie" :editorWidth = "280"/>
                    </div>
                </div>
            </div>

            <div v-if="!getpieFexists" class = "text-center row justify-content-center">
                <h2>No data available</h2>
            </div>

        </div>


        <div id = "fraction-boxplot" class = "container Block">
            <div class="row description">
              <h4>Project TIME Estimation Cell Fraction Boxplot</h4>
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
                    <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="fraction_boxplot_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fraction_boxplot_download_dropdwon">
                        <a class="dropdown-item" @click="download_fraction_boxplot_cellData" id = "fraction_boxplot_rna_download">Download cell data file</a>
                        <a class="dropdown-item viz_download" id = "fraction-boxplot_viz_download" @click="down_graph($event)">Download fraction boxplot chart</a>
                    </div> -->
                    <div id="db-toolbar-boxplot" class="mb-5">
                        <div class="db-tool-nav">
                            <div class="btn btn-outline-dark" data-toggle="collapse" data-target="#download_box-boxplot" aria-expanded="true" aria-controls="download_box-boxplot">
                                Download<i class="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <div id="download_box-boxplot" class="db-toolbox collapse" data-parent="#db-toolbar-boxplot">
                                <div class="form-group p-2">
                                    <button class = "d-btn btn btn-secondary download" @click="download_fraction_boxplot_cellData">
                                        <i class='fas fa-download'></i> Download cell data file
                                    </button>

                                    <button class = "d-btn btn btn-pink download" id = "fraction-boxplot_viz_download" @click="down_graph($event)">
                                        <i class='fas fa-download'></i> Download fraction boxplot chart
                                    </button>
                                </div>
                        </div>
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

            <div v-if="!getboxplotFexists" class = "text-center row justify-content-center">
                <h2>No data available <br><span v-if="msg[project_name+boxplot_selected]">{{msg[project_name+boxplot_selected]['reason']}}</span></h2>
            </div>

        </div>

        <div id = "fraction-heatmap" class = "container Block">
            <div class="row description">
              <h4>Project Immunce Cell Fraction Landscape</h4>
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
                    <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="fraction_heatmap_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fraction_heatmap_download_dropdwon">
                        <a class="dropdown-item" :href="clinical_file_path"  id = "fraction_pie_clincial_download">Download clinical file</a>

                        <a class="dropdown-item" @click="download_fraction_heatmap_cellData" id = "fraction_heatmap_rna_download">Download cell data file</a>

                        <a class="dropdown-item viz_download" id = "fraction-heatmap_viz_download" @click="down_graph($event)">Download fraction heatmap chart</a>
                    </div> -->
                    <div id="db-toolbar-heatmap" class="mb-5">
                        <div class="db-tool-nav">
                            <div class="btn btn-outline-dark" data-toggle="collapse" data-target="#download_box-heatmap" aria-expanded="true" aria-controls="download_box-heatmap">
                                Download<i class="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <div id="download_box-heatmap" class="db-toolbox collapse" data-parent="#db-toolbar-heatmap">
                                <div class="form-group p-2">
                                    <button class = "d-btn btn btn-secondary download" @click="download_fraction_heatmap_cellData">
                                        <i class='fas fa-download'></i> Download cell data file
                                    </button>

                                    <a :href="clinical_file_path">
                                        <button class = "d-btn btn btn-theme download">
                                            <i class='fas fa-download'></i> Download clinical file
                                        </button>
                                    </a>

                                    <button class = "d-btn btn btn-pink download" id = "fraction-heatmap_viz_download" @click="down_graph($event)">
                                        <i class='fas fa-download'></i> Download fraction heatmap chart
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="need-upload w-100 text-center container" v-if="heatMapisLoading">
                        <img v-bind:src="require('../assets/images/loading_icon.gif')" style="width:50%;">
                    </div>
                    <div class="md-col-9 vis vizBlock" id = "fraction-heatmapVis">
                    </div>
                    <div id="fraction-heatmap-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="fraction_conf_heatmap" :editorWidth = "280"/>
                    </div>
                </div>
            </div>

            <div v-if="!getheatmapFexists" class = "text-center row justify-content-center">
                <h2>No data available <br><span v-if="msg[project_name+boxplot_selected]">{{msg[project_name+boxplot_selected]['reason']}}</span></h2>
            </div>
        </div>

        <div id = "fraction-landscape" class = "container Block">
            <div class="row description">
              <h4>Project Consensus TIME Estimation Cell Fraction Landscape</h4>
            </div>

            <!-- <div class="select-bar form-inline row">
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
            </div> -->

            <div id = "fraction_landscapeBlock">
                <div class="dropdown mb-5 mt-5">
                    <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="fraction_landscape_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="fraction_landscape_download_dropdwon">
                        <a class="dropdown-item" @click="download_fraction_landscape_cellData" id = "fraction_landscape_rna_download">Download cell data file</a>

                        <a class="dropdown-item viz_download" id = "fraction-landscape_viz_download" @click="down_graph($event)">Download fraction landscape chart</a>
                    </div> -->
                    <div id="db-toolbar-landscape" class="mb-5">
                        <div class="db-tool-nav">
                            <div class="btn btn-outline-dark" data-toggle="collapse" data-target="#download_box-landscape" aria-expanded="true" aria-controls="download_box-landscape">
                                Download<i class="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <div id="download_box-landscape" class="db-toolbox collapse" data-parent="#db-toolbar-landscape">
                                <div class="form-group p-2">
                                    <button class = "d-btn btn btn-secondary download" @click="download_fraction_landscape_cellData">
                                        <i class='fas fa-download'></i> Download cell data file
                                    </button>

                                    <button class = "d-btn btn btn-pink download" id = "fraction-landscape_viz_download" @click="down_graph($event)">
                                        <i class='fas fa-download'></i> Download fraction landscape chart
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="need-upload w-100 text-center container" v-if="landscapeisLoading">
                        <img v-bind:src="require('../assets/images/loading_icon.gif')" style="width:50%;">
                    </div>
                    <div class="md-col-9 vis vizBlock" id = "fraction-landscapeVis">
                    </div>
                    <div id="fraction-landscape-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="fraction_conf_landscape" :editorWidth = "280"/>
                    </div>
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
import JSZip from 'jszip'
import FileSaver from 'file-saver'

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
            file_exist: window.gon.files,
            msg: window.gon.msg,
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
                    {value:"quanTIseq",label:"quanTIseq"},
                    {value:"Consensus",label:"Consensus"},
                    {value:"Disable",label:"──────────"},
                    {value:"ABIS",label:"ABIS"},
                    {value:"CIBERSORT",label:"CIBERSORT"},
                    {value:"CIBERSORTX",label:"CIBERSORTX"},
                    {value:"ConsensusTME",label:"ConsensusTME"},
                    {value:"EPIC",label:"EPIC"},
                    {value:"ImmuCellAI",label:"ImmuCellAI"},
                    {value:"MCPcounter",label:"MCPcounter"},
                    {value:"TIMER",label:"TIMER"},
                    {value:"xCell",label:"xCell"},
            ],
            heatmap_selector:[
                    {value:"quanTIseq",label:"quanTIseq"},
                    {value:"ABIS",label:"ABIS"},
                    {value:"CIBERSORT",label:"CIBERSORT"},
                    {value:"CIBERSORTX",label:"CIBERSORTX"},
                    {value:"ConsensusTME",label:"ConsensusTME"},
                    {value:"EPIC",label:"EPIC"},
                    {value:"ImmuCellAI",label:"ImmuCellAI"},
                    {value:"MCPcounter",label:"MCPcounter"},
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
            clinical_file_path: "",
            heatMapisLoading: false,
            landscapeisLoding: false,
        }
    },
    //设置默认值
    created() {
        this.pie_selected = this.pie_selector[0];
        this.boxplot_selected="quanTIseq";
        this.heatmap_selected="quanTIseq";
        this.landscape_selected="pie";
        this.clinical_fexists = this.file_exist['clinical'];

        event.on(
            event.DATA_LOADING_FINISHED,
            () => {
                if(this.heatMapisLoading == true) {
                    this.heatMapisLoading = false;
                }
                if(this.landscapeisLoading == true) {
                    this.landscapeisLoading = false;
                }
                this.$root.$emit("data-loaded");
            },
            "vapp-load-finished",
        );

        event.on(
            event.DATA_LOADING_STARTED,
            () => {
                // this.isLoading = true;
            },
            "vapp-load-started",
        );
    },
    mounted() {
        event.rpcRegisterReceiver(this.vue_name, () => this);
        this.all_viz();
    },
    methods: {
        pieViz(){
            this.clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";

            if(this.clinical_fexists == 'true'){
                document.getElementById("fraction_pieBlock").style.display = "block";
                fractionPie("#fraction-pieVis", this.clinical_file_path, this.pie_selected, "#fraction-pie-editor", "fraction_pie_viz", this.vue_name);

            }else{
                document.getElementById("fraction_pieBlock").style.display = "none";
            }

            
        },
        boxplotViz(){
            var cellData_file_path = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";
            this.boxplot_fexiests = this.file_exist[this.boxplot_selected];
            if(this.boxplot_fexiests == 'true'){
                document.getElementById("fraction_boxplotBlock").style.display = "block";

                if (this.boxplot_selected == "Consensus") {
                    fractionGroupBoxplot("#fraction-boxplotVis", cellData_file_path, "#fraction-boxplot-editor", "fraction_boxplot_viz", this.vue_name);
                }
                else {
                    fractionBoxplot("#fraction-boxplotVis", cellData_file_path, "#fraction-boxplot-editor", "fraction_boxplot_viz", this.vue_name);
                }
            }else{
                document.getElementById("fraction_boxplotBlock").style.display = "none";
            }

        },
        landscapeViz(){
            this.landscapeisLoading = true;
            var cellData_file_path = this.data_path + "cell_data/Consensus/" + this.project_name + "_Consensus.csv";
            this.landscape_cell_fexists = this.file_exist['Consensus'];
            
            if (this.landscape_cell_fexists == 'true') {
                document.getElementById("fraction_landscapeBlock").style.display = "block";
                fractionLandscape("#fraction-landscapeVis", cellData_file_path, this.landscape_selected, "#fraction-landscape-editor", "fraction_landscape_viz", this.vue_name);
            }
            else {
                document.getElementById("fraction_landscapeBlock").style.display = "none";
            }
        },

        heatmapViz() {
            this.heatMapisLoading = true;
            if (this.heatmap_selected == "EPIC" || this.heatmap_selected == "quanTIseq")
            {
                var cellData_file_path = this.data_path + "cell_data/" + this.heatmap_selected + "/" + this.project_name + "_" + this.heatmap_selected + ".csv";
                this.heatmap_fexists = this.file_exist[this.heatmap_selected];
            }   
            else
            {
                var cellData_file_path = this.data_path + "cell_data/" + this.heatmap_selected + "/" + this.project_name + "_" + this.heatmap_selected + "_full.csv";
                this.heatmap_fexists = this.file_exist[this.heatmap_selected + "_full"];
            }
            if(this.clinical_fexists=="true" && this.heatmap_fexists=='true'){
                document.getElementById("fraction_heatmapBlock").style.display = "block";
                fractionHeatmap("#fraction-heatmapVis", this.clinical_file_path, cellData_file_path, "#fraction-heatmap-editor", "fraction_heatmap_viz", this.vue_name);
            }else{
                document.getElementById("fraction_heatmapBlock").style.display = "none";
            }
        },

        all_viz() {
            this.boxplotViz();
            this.landscapeViz();
            this.pieViz();
            this.heatmapViz();
        },
        download_fraction_boxplot_cellData(){
            window.location.href = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";
        },
        download_fraction_landscape_cellData(){
            window.location.href = this.data_path + "cell_data/Consensus/" + this.project_name + "_Consensus.csv";

        },
        download_fraction_heatmap_cellData(){
            window.location.href = this.data_path + "cell_data/" + this.heatmap_selected + "/" + this.project_name + "_" + this.heatmap_selected + ".csv";

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
        },
        downall(){
            let zip = new JSZip();
            if(this.getpieFexists){
                const svgContainerClone = document.getElementById('fraction-pieVis').cloneNode(true);
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                zip.file("fraction-pieVis.svg",svgBlob);

            }
            if(this.getheatmapFexists){
                const svgContainerClone = document.getElementById('fraction-heatmapVis').cloneNode(true);
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                zip.file("fraction-heatmapVis.svg",svgBlob);

            }
            if(this.getboxplotFexists){
                const svgContainerClone = document.getElementById('fraction-boxplotVis').cloneNode(true);
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                zip.file("fraction-boxplotVis.svg",svgBlob);

            }
            if(this.getlandscapeFexists){
                const svgContainerClone = document.getElementById('fraction-landscapeVis').cloneNode(true);
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                zip.file("fraction-landscapeVis.svg",svgBlob);

            }            

            zip.generateAsync({
                type: 'blob',// 压缩类型
                compression: "DEFLATE", // STORE：默认不压缩 DEFLATE：需要压缩
                compressionOptions: {
                    level: 9
                }
            }).then(function(content) {
                // 下载的文件名
                var filename = 'charts.zip';
                // 创建隐藏的可下载链接
                var eleLink = document.createElement('a');
                eleLink.download = filename;
                eleLink.style.display = 'none';
                // 下载内容转变成blob地址
                eleLink.href = URL.createObjectURL(content);
                // 触发点击
                document.body.appendChild(eleLink);
                eleLink.click();
                // 然后移除
                document.body.removeChild(eleLink);
            });
        }
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
        },
        
    }
}
</script>

<style scoped lang = "scss">
/* .viz {
    padding: 50px;
    position: relative;
    box-shadow: 0 0 64px darken(#dee2e6, 5%)
} */
.d-btn{
    width: 20em;
}
.veBlock {
    position: relative !important;
    box-shadow: 0 0 64px darken(#dee2e6, 5%)
}

.vizBlock {
        /* overflow-y: scroll; */
        overflow-x: scroll;
        padding: 2em;
        margin-top: 5%;
        margin-bottom: 0px !important;
        padding-bottom: 0px;
}

#fraction-heatmapVis {
    height: 1000px;
    overflow-y: scroll;
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
