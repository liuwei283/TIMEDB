<template>
    <div>
        <div class="db-tool-nav">

        <button class="btn btn-outline-dark" @click="downall()">Download all charts</button>
        </div><br>

        <div id = "subtype-landscape" class = "container Block">
            <div id="landscapeDescription" class="row description">
                <h4>Dataset C1-C6 Landscape</h4>
            </div>
            <div id = "subtype-landscapeBlock">
                <div class="dropdown mb-5 mt-5">
                    <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="subtype_landscape_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="subtype_landscape_download_dropdwon">
                        <a class="dropdown-item" :href="clinical_file_path"  id = "subtype_landscape_clincial_download">Download clinical file</a>
                        <a class="dropdown-item" :href="rna_file_path" id = "subtype_landscape_rna_download">Download RNA file</a>
                        <a class="dropdown-item viz_download" id = "subtype-landscape_viz_download" @click="down_graph($event)">Download subtype landscape chart</a>
                    </div> -->

                    <div id="db-toolbar-landscape" class="mb-5">
                        <div class="db-tool-nav">
                            <div class="btn btn-outline-dark" data-toggle="collapse" data-target="#download_box-landscape" aria-expanded="true" aria-controls="download_box-landscape">
                                Download<i class="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <div id="download_box-landscape" class="db-toolbox collapse" data-parent="#db-toolbar-landscape">
                                <div class="form-group p-2">
                                    <a :href="clinical_file_path">
                                        <button class = "d-btn btn btn-secondary download" >
                                            <i class='fas fa-download'></i> Download clinical file
                                        </button>
                                    </a>

                                    <a :href="rna_file_path">
                                        <button class = "d-btn btn btn-theme download" >
                                            <i class='fas fa-download'></i> Download RNA file
                                        </button>
                                    </a>

                                    <button class = "d-btn btn btn-pink download" id = "subtype-landscape_viz_download" @click="down_graph($event)">
                                        <i class='fas fa-download'></i> Download subtype landscape chart
                                    </button>
                                    
                                </div>
                        </div>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="md-col-9 vis vizBlock" id = "subtype-landscapeVis">
                    </div>
                    <div id="subtype-landscape-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="subtype_conf_landscape" :editorWidth = "280"/>
                    </div>
                </div>
            </div>

            <div v-if="!getlandscapeFexists" class = "text-center row justify-content-center">
                <h2>No data available</h2>
            </div>
        </div>

        <hr />

        <div id = "subtype-boxplot" class = "container Block">

            <div id="boxplotDescription" class="row description">
                <h4>Dataset C1-C6 Immune Cell Fraction Boxplot</h4>
            </div>
                
            <div class="select-bar form-inline row">
                <div class="sdiv col">
                    <div class="select-title">
                        Please choose the cell division method:
                    </div>
                    <select @change='boxplotViz' class="form-select col" id="subtype-boxplot-method-selector" data-style="btn-secondary" data-live-search="true" v-model="boxplot_selected">
                        <option v-for="(option, index) in boxplot_selector" :key="index" :value="option.value" >
                            {{option.label}}
                        </option>
                    </select>

                </div>
            </div>
            <div id = "subtype-boxplotBlock">
                <div class="dropdown mb-5 mt-3">
                    <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="subtype_boxplot_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="subtype_boxplot_download_dropdwon">
                        <a class="dropdown-item" :href="subtype_file_path"  id = "subtype_boxplot_subtype_download">Download subtype file</a>
                        <a class="dropdown-item" @click="download_subtype_boxplot_cellData" id = "subtype_landscape_rna_download">Download cell data file</a>
                        <a class="dropdown-item viz_download" id = "subtype-boxplot_viz_download" @click="down_graph($event)">Download subtype boxplot chart</a>
                    </div> -->

                    <div id="db-toolbar-boxplot" class="mb-5">
                        <div class="db-tool-nav">
                            <div class="btn btn-outline-dark" data-toggle="collapse" data-target="#download_box-boxplot" aria-expanded="true" aria-controls="download_box-boxplot">
                                Download<i class="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <div id="download_box-boxplot" class="db-toolbox collapse" data-parent="#db-toolbar-boxplot">
                                <div class="form-group p-2">
                                    <a :href="subtype_file_path">
                                        <button class = "d-btn btn btn-secondary download" >
                                            <i class='fas fa-download'></i> Download subtype file
                                        </button>
                                    </a>

                                    <button class = "d-btn btn btn-theme download" @click="download_subtype_boxplot_cellData" >
                                        <i class='fas fa-download'></i> Download cell data file
                                    </button>

                                    <button class = "d-btn btn btn-pink download" id = "subtype-boxplot_viz_download" @click="down_graph($event)">
                                        <i class='fas fa-download'></i> Download subtype boxplot chart
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
                <div  class="row veBlock">
                    <div class="md-col-9 vis vizBlock" id = "subtype-boxplotVis">
                    </div>
                    <div id="subtype-boxplot-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="subtype_conf_boxplot" :editorWidth = "280"/>
                    </div>
                </div>
            </div>
            <div v-if="!getboxplotFexists" class = "text-center row justify-content-center">
                <h2>No data available <br><span v-if="msg[project_name+boxplot_selected]">{{msg[project_name+boxplot_selected]['reason']}}</span></h2>
            </div>
            
        </div>

        <hr />

        <div id = "subtype-curve" class = "container Block">
            <div id="curveDescription" class="row description">
                <h4>Dataset C1-C6 KM Curve</h4>
            </div>
            <div id = "subtype-curveBlock" >
                <div class="dropdown mb-5 mt-3">
                    <div id="db-toolbar-curve" class="mb-5">
                        <div class="db-tool-nav">
                            <div class="btn btn-outline-dark" data-toggle="collapse" data-target="#download_box-curve" aria-expanded="true" aria-controls="download_box-curve">
                                Download<i class="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <div id="download_box-curve" class="db-toolbox collapse" data-parent="#db-toolbar-curve">
                                <div class="form-group p-2">
                                    <a :href="clinical_file_path">
                                        <button class = "d-btn btn btn-secondary download" >
                                            <i class='fas fa-download'></i> Download clinical file
                                        </button>
                                    </a>

                                    <a :href="subtype_file_path">
                                        <button class = "d-btn btn btn-theme download">
                                            <i class='fas fa-download'></i> Download subtype file
                                        </button>
                                    </a>

                                    <button class = "d-btn btn btn-pink download" id = "subtype-curve_viz_download" @click="down_graph($event)">
                                        <i class='fas fa-download'></i> Download subtype curve chart
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="md-col-9 vizBlock" id = "subtype-curveVis">
                    </div>
                    <div id="subtype-curve-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="subtype_conf_curve" :editorWidth = "280"/>
                    </div>
                </div>
            </div>

            <div v-if="!getcurveFexists" class = "text-center row justify-content-center">
                <h2>No data available</h2>
            </div>
        </div>

        <hr />
        <br />

        <div id = "subtype-regulator" class = "container Block">
            <div id="regulatorDescription" class="row description">
            <h4>Dataset C1-C6 Immunoregulator Expression</h4>
            </div>

            <div id = "subtype-regulatorBlock" >
                <div class="dropdown mb-5 mt-3">
                    <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="subtype_regulator_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Download
                    </button>
                    <div class="dropdown-menu" aria-labelledby="subtype_regulator_download_dropdwon">
                        <a class="dropdown-item" :href="clinical_file_path"  id = "subtype_regulator_clincial_download">Download clinical file</a>
                        <a class="dropdown-item" :href="rna_file_path" id = "subtype_regulator_rna_download">Download RNA file</a>
                        <a class="dropdown-item viz_download" id = "subtype-regulator_viz_download" @click="down_graph($event)">Download subtype regulator chart</a>
                    </div> -->
                    <div id="db-toolbar-regulator" class="mb-5">
                        <div class="db-tool-nav">
                            <div class="btn btn-outline-dark" data-toggle="collapse" data-target="#download_box-regulator" aria-expanded="true" aria-controls="download_box-regulator">
                                Download<i class="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <div id="download_box-regulator" class="db-toolbox collapse" data-parent="#db-toolbar-regulator">
                                <div class="form-group p-2">
                                    <a :href="clinical_file_path">
                                        <button class = "d-btn btn btn-secondary download" >
                                            <i class='fas fa-download'></i> Download clinical file
                                        </button>
                                    </a>

                                    <a :href="rna_file_path">
                                        <button class = "d-btn btn btn-theme download">
                                            <i class='fas fa-download'></i> Download RNA file
                                        </button>
                                    </a>

                                    <button class = "d-btn btn btn-pink download" id = "subtype-regulator_viz_download" @click="down_graph($event)">
                                        <i class='fas fa-download'></i> Download subtype regulator chart
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="row veBlock">
                    <div class="md-col-9 vis vizBlock" id = "subtype-regulatorVis">
                    </div>
                    <div id="subtype-regulator-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="subtype_conf_regulator" :editorWidth = "280"/>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!getregulatorFexists" class = "text-center row justify-content-center">
            <h2>No data available</h2>
        </div>
    </div>
</template>

<script lang = 'ts'>
import BootstrapVue from 'bootstrap-vue';
import OvizEditor from "oviz-editor";
import JSZip from 'jszip'
import FileSaver from 'file-saver'

import axios from "axios";
import { event } from "crux/dist/utils";
import {viz_mode} from "page/visualizers";

import DropDownSelect from "page/builtin/dropdown-select.vue";

import {init as subtypeLandscape} from "viz/static_subtype_immuneSubtype"
import {init as subtypeBoxplot} from "viz/static_subtype_immuneCell"
import {init as subtypeCurve} from "viz/static_subtype_survival"
import {init as subtypeRegulator} from "viz/static_overview_immuneRegulators"

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
            msg: window.gon.msg,
            subtype_conf_landscape: {},
            subtype_conf_boxplot: {},
            subtype_conf_curve: {},
            subtype_conf_regulator: {},

            data_path : "/public/data/",
            boxplot_selected : null,
            boxplot_selector : [
                {value:"quanTIseq",label:"quanTIseq"},
                {value:"ABIS",label:"ABIS"},
                {value:"CIBERSORTX",label:"CIBERSORTX"},
                {value:"CIBERSORT",label:"CIBERSORT"},
                {value:"ConsensusTME",label:"ConsensusTME"},
                {value:"EPIC",label:"EPIC"},
                {value:"ImmuCellAI",label:"ImmuCellAI"},
                {value:"MCPcounter",label:"MCPcounter"},
                {value:"TIMER",label:"TIMER"},
                {value:"xCell",label:"xCell"},
            ],
            vue_name: "subtype_vue",
            clinical_file_path: "",
            subtype_file_path: "",
            rna_file_path: "",

            clinical_fexists: true,
            subtype_fexists: true,
            rna_fexists: true,
            cell_fexists: true,
        }
    },
    created() {
        this.boxplot_selected = "quanTIseq";
        // var method;
        // for (var i = 0; i < 10; i ++ ) {
        //     method = this.boxplot_selector[i]["value"];
        //     console.log(method);
        //     var cfpath = this.data_path + "cell_data/" + method + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";
        // }
        this.clinical_file_path = "/public/data/clinical/sample/Clinical_" + this.project_name + ".csv";
        this.subtype_file_path = "/public/data/subtype/c1_c6/project/" + this.project_name + "_c1_c6.csv";
        this.rna_file_path = "/public/data/immuneregulator/immuReg_" + this.project_name + ".csv";
        this.clinical_fexists = this.file_exist['clinical']
        this.subtype_fexists = this.file_exist['subtype']
        this.rna_fexists = this.file_exist['rna_immu']
    },
    mounted() {
        event.rpcRegisterReceiver(this.vue_name, () => this);
        this.all_viz();
    },
    computed: {
        getlandscapeFexists() {
            return this.subtype_fexists == 'true' && this.clinical_fexists == 'true';
        },
        getcurveFexists() {
            return this.subtype_fexists == 'true' && this.clinical_fexists == 'true';
        },
        getregulatorFexists() {
            return this.subtype_fexists == 'true' && this.rna_fexists == 'true';
        },
        getboxplotFexists() {
            return this.subtype_fexists == 'true' && this.cell_fexists =='true';
        }
    },
    methods: {
        downall(){
            let zip = new JSZip();
            if(this.getlandscapeFexists){
                const svgContainerClone = document.getElementById('subtype-landscapeVis').cloneNode(true);
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                zip.file("subtype-landscapeVis.svg",svgBlob);

            }
            if(this.getcurveFexists){
                const svgContainerClone = document.getElementById('subtype-curveVis').cloneNode(true);
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                zip.file("subtype-curveVis.svg",svgBlob);

            }
            if(this.getregulatorFexists){
                const svgContainerClone = document.getElementById('subtype-regulatorVis').cloneNode(true);
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                zip.file("subtype-regulatorVis.svg",svgBlob);

            }
            if(this.getboxplotFexists){
                const svgContainerClone = document.getElementById('subtype-boxplotVis').cloneNode(true);
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                zip.file("subtype-boxplotVis.svg",svgBlob);

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
        },    
        
        landscapeViz(){
            // var clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";
            // var subtype_file_path = this.data_path + "subtype/c1_c6/project/" + this.project_name + "_c1_c6.csv";

            if(this.clinical_fexists == 'true' && this.subtype_fexists == 'true' ) {
                document.getElementById("subtype-landscapeBlock").style.display = "block";
                subtypeLandscape("#subtype-landscapeVis", this.subtype_file_path, this.clinical_file_path, "#subtype-landscape-editor", "subtype_landscape_viz", this.vue_name);
            }
            else {
                document.getElementById("subtype-landscapeBlock").style.display = "none";
            }

        },
        boxplotViz(){
            var cellData_file_path = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";
            this.cell_fexists = this.file_exist[this.boxplot_selected];
            if (this.cell_fexists == 'true' && this.subtype_fexists == 'true') {
                    document.getElementById("subtype-boxplotBlock").style.display = "block";
                    subtypeBoxplot("#subtype-boxplotVis", this.subtype_file_path, cellData_file_path, "#subtype-boxplot-editor", "subtype_boxplot_viz", this.vue_name);//remember to change to the right plot
            }
            else {
                document.getElementById("subtype-boxplotBlock").style.display = "none";
            }
        },
        curveViz(){
            
            if(this.clinical_fexists == 'true' && this.subtype_fexists == 'true') {
                subtypeCurve("#subtype-curveVis", this.subtype_file_path, this.clinical_file_path, "#subtype-curve-editor", "subtype_curve_viz", this.vue_name);
            }
            else {
                document.getElementById("subtype-curveBlock").style.display = "none";
            }

        },
        regulatorViz(){

            if(this.rna_fexists == 'true' && this.subtype_fexists == 'true') {
                subtypeRegulator("#subtype-regulatorVis", this.subtype_file_path, this.rna_file_path, "#subtype-regulator-editor", "subtype_regulator_viz", this.vue_name);
            }
            else {
                document.getElementById("subtype-regulatorBlock").style.display = "none";
            }

        },
        all_viz() {
            this.landscapeViz();
            this.boxplotViz();
            this.curveViz();
            this.regulatorViz();
        },

        download_subtype_boxplot_cellData() {
            window.location.href = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";
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
.d-btn{
    width: 20em;
}
.veBlock {
    position: relative !important;
    box-shadow: 0 0 64px darken(#dee2e6, 5%);
}

.vizBlock {
        /* overflow-y: scroll; */
        overflow-x: scroll;
        padding: 2em;
        margin-top: 5%;
        margin-bottom: 0px !important;
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
.dropdown-menu{
    width: auto;
}
</style>
