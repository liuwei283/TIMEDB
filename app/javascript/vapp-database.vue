<template>
    <div>
        <div id = "barPlot" class = "container Block">
            <div id="barDescription" class="row description">
                <h4>Some description for bar plot</h4>
            </div>
            <div class="select-bar form-inline row">

                <div class="sdiv col">
                    <div class="select-title">
                        Please choose project or cancer type:
                    </div>
                    <select @change='barViz' class="selectpicker form-select col" data-style="btn-secondary" data-live-search="true" v-model="bar_selected">
                        <option v-for="(option, index) in bar_selector" :key="index" :value="option.value" >
                            {{option.label}}
                        </option>
                    </select>
                    
                </div>

                    <div v-if= "bar_selected == 'project' " class ="sdiv col">
                        <div class="select-title">
                        Please choose the cancer type of the projects:
                        </div>
                        <select @change="barViz" class="form-select col selectpicker" data-style="btn-secondary" data-live-search="true" v-model="bar_project_selected">
                            <option v-for="(option, index) in cancers" :key="index" :value="option">
                                {{option}}
                            </option> 
                        </select>
                    </div>

            </div>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="bar_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Download
                </button>
                <div class="dropdown-menu" aria-labelledby="bar_download_dropdwon">
                    <a class="dropdown-item" @click="download_bar" id = "bar_download">Download sample number table</a> 
                    <a class="dropdown-item viz_download" id = "bar" @click="down_graph($event)">Download bar chart</a>
                </div>
            </div>
            <div class="row vizBlock">
                <div class="col" id = "barVis">
                </div>
            </div>
        </div>
        <hr>
        <br>


        <div id = "piePlot" class = "container Block">
            <div id="pieDescription" class="row description">
                <h4>Some description for pie plot</h4>
            </div>

        <div class="select-bar form-inline row">

            <div class="sdiv col">
                <div class="select-title">
                    Please choose the cell division method:
                </div>
                <select @change='pieViz' class="form-select col selectpicker pie_react" data-style="btn-secondary" data-live-search="true" v-model="pieMethodSelected">
                     <option v-for="(option, index) in pieMethodSelector" :key="index" :value="option.value" >
                        {{option.label}}
                    </option>
                </select>
            </div>

            <div class="sdiv col">
                <div class="select-title">
                    Please choose the cancer type:
                </div>
                <select @change='updateProjects(); pieViz()' class="form-select col selectpicker pie_react" data-style="btn-secondary" data-live-search="true" v-model="pieCancerSelected">
                    <option v-for="(option, index) in cancers" :key="index" :value="option">
                        {{option}}
                    </option>
                </select>
           </div>

            <div class="sdiv col">
                <div class="select-title">
                    Please choose the project:
                </div>
                <select @change='pieViz' class="form-select col selectpicker pie_react" data-style="btn-secondary" data-live-search="true" v-model="pieProjectSelected">
                    <option v-for="(option, index) in pie_projects" :key="index" :value="option">
                        {{option}}
                    </option>
                </select>

            </div>
        </div>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="pie_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Download
            </button>
            <div class="dropdown-menu" aria-labelledby="pie_download_dropdown">
                <a class="dropdown-item" id = "pie_download" @click="download_pie">Download cell data</a> 
                <a class="dropdown-item viz_download" id = "pie" @click="down_graph($event)">Download pie chart</a>
            </div>
        </div>

        <div class="row vizBlock">
            <div class="col" id = "pieVis">
            </div>
        </div>
</div>

    <hr>
    <br>
        <div id = "landscape" class = "container Block">
            <div id="landscapeDescription" class="row description">
                <h4>Some description for Immune Subtype Landscape</h4>
            </div>
            <div class="select-bar form-inline row">
                <div class="sdiv col">
                    <div class="select-title">
                        Please choose the cancer name:
                    </div>
                    <select @change='landscapeViz' class="selectpicker form-select col landscape_selector" data-style="btn-secondary" data-live-search="true" v-model="landscape_selected">
                        <option value = "all">All cancers</option>
                        <option v-for="(option, index) in cancers" :key="index" :value="option">
                            {{option}}
                        </option>
                    </select>

                </div>
            </div>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="landscape_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Download
                </button>
                <div class="dropdown-menu" aria-labelledby="bar_download_dropdwon">
                    <a class="dropdown-item" id = "landscape_download" @click="download_landscape" >Download sample number table</a> 
                    <a class="dropdown-item viz_download" id = "landscape" @click="down_graph($event)">Download landscape chart </a>
                </div>
            </div>
            <div class="row vizBlock">
                <div class="col" id = "landscapeVis">
                </div>
            </div>
        </div>

            <hr>
        <br>
        <div id = "regulatorPlot" class = "container Block">
            <div id="regulatorDescription" class="row description">
                <h4>Some description for immuneregulator plot</h4>
            </div>
            <div class="select-bar form-inline row">
                <div class="sdiv col">
                    <div class="select-title">
                        Please choose the cancer name:
                    </div>
                    <select @change='updateProjects_regulator' class="selectpicker form-select col" data-style="btn-secondary" data-live-search="true" v-model="regulatorCancerSelected">
                        <option v-for="(option, index) in cancers" :key="index" :value="option">
                            {{option}}
                        </option>
                    </select>

                </div>

                <div class="sdiv col">
                    <div class="select-title">
                    Please choose the project:
                    </div>
                    <select @change='regulatorViz' class="selectpicker form-select col " data-style="btn-secondary" data-live-search="true" v-model="regulatorProjectSelected">
                        <option v-for="(option, index) in regulatorProjects" :key="index" :value="option">
                            {{option}}
                        </option>
                    </select>

                </div>
            </div>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="regulator_download" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown regulator related data
                </button>
            <div class="dropdown-menu" aria-labelledby="regulator_download">
                <a class="dropdown-item" id = "regulator_subtype" @click="download_regulator_subtype">Download subtype data</a> 
                <a class="dropdown-item" id = "regulator_rna" @click="download_regulator_rna">Download RNA data</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item viz_download" id = "regulator" @click="down_graph($event)">Download regulator chart</a>

            </div>
            </div>
            <div class="row vizBlock">
                <div class="col" id = "regulatorVis">
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

    import {init as immunebar} from "./viz/static_overview_immuneBar";
    import {init as immunepie} from "./viz/static_overview_immunePie";
    import {init as immunelandscape} from "./viz/static_overview_immuneSubtypeLandscape";
    import {init as immuneRegulator} from "./viz/static_overview_immuneRegulators";

Vue.use(OvizEditor);
Vue.use(BootstrapVue);

Vue.component("dropdown-select", DropDownSelect)
import Vue from 'vue';
export default {
    data() {
        return {
            cancers: window.gon.cancers,
            projects: window.gon.projects,
            pie_projects : null,
            regulatorProjects: null,
            conf: {},
            data_path : "/public/data",
            bar_selector: [
                {value: "project", label: "Project"},
                {value: "cancer", label: "Cancer type"},
            ],
            bar_selected : null,
            pieMethodSelector : [
                {value:"ABIS",label:"ABIS"},
                {value:"CIBERSORTX",label:"CIBERSORTX"},
                {value:"CIBERSORT",label:"CIBERSORT"},
                {value:"ConsensusTME",label:"ConsensusTME"},
                {value:"EPIC",label:"EPIC"},
                {value:"ImmuCellAI",label:"ImmuCellAI"},
                {value:"MCPcounter",label:"MCPcounter"},
                {value:"quanTIseq",label:"quanTIseq"},
                {value:"TIMER",label:"TIMER"},
                {value:"xCell",label:"xCell"},
            ],
            bar_project_selected: null,
            pieMethodSelected : null,
            pieProjectSelected : null,
            pieCancerSelected: null,
            landscape_selected : null,
            regulatorProjectSelected : null,
            regulatorCancerSelected : null,
            }
    },
    created() {
        this.bar_selected = "project";
        this.pieMethodSelected = "ABIS";
        this.pieCancerSelected = this.cancers[0];
        this.bar_project_selected = "ACC";
        this.pie_projects = this.projects[this.pieCancerSelected];
        this.pieProjectSelected = this.pie_projects[0];
        this.landscape_selected = "all";
        this.regulatorCancerSelected = "ACC";
        this.regulatorProjects = this.projects[this.regulatorCancerSelected];
        this.regulatorProjectSelected = this.regulatorProjects[0];
    },
    mounted() {
        //event.rpcRegisterReceiver("getVue", () => this);
        this.all_viz();
    },
    methods: {
        barViz() {
            // alert(this.bar_selected)
            if( this.bar_selected == "project" ){

            immunebar("#barVis", this.data_path + "/sample_num/" + this.bar_selected + "_samples.tsv");

              }else{

            immunebar("#barVis", this.data_path + "/sample_num/" + this.bar_selected + "_samples.tsv");

             }
        },
        pieViz(){
            // alert(this.data_path + "/cell_data/" + this.pieMethodSelected+ "/" +this.pieProjectSelected+"_"+this.pieMethodSelected+".csv")
            // immunepie("#pieVis", this.data_path + "/cell_data/" + this.pieMethodSelected+ "/" +this.pieProjectSelected+"_"+this.pieMethodSelected+".csv");

            //method name must be same as data storage folder
            var file_name = this.pieProjectSelected + "_" + this.pieMethodSelected + ".csv";
            var file_path = this.data_path + "/cell_data/" + this.pieMethodSelected + "/" + file_name;
            immunepie("#pieVis", file_path);
        },
        landscapeViz(){
            //immunelandscape("#landscapeVis", this.data_path + "/sample_num/" + this.bar_selected + "_samples.tsv");
            if (this.landscape_selected == "all") {
                var file_name = "c1_c6_TCGA_all.csv"
                var file_path =this.data_path+ "/subtype/c1_c6/" + "c1_c6_TCGA_all.csv"; 
            }
            else {
                var file_name = this.landscape_selected + "_c1_c6.csv"
                var file_path = this.data_path + "/subtype/c1_c6/cancer/" + file_name;
            }
            immunelandscape("#landscapeVis", file_path);
            
        },
        regulatorViz(){
                var subtype_fname = this.regulatorProjectSelected + "_c1_c6.csv";
                var rna_fname = "immuReg_" + this.regulatorProjectSelected + ".csv";
                
                var subtype_file_path = this.data_path + "/subtype/c1_c6/project/" + subtype_fname;
                var rna_file_path = this.data_path + "/immuneregulator/" + rna_fname;

                immuneRegulator("#regulatorVis", subtype_file_path, rna_file_path);
        },
        all_viz() {
            this.barViz();
            this.pieViz();
            this.landscapeViz();
            this.regulatorViz();
        },
        updateProjects() {
            this.pie_projects = this.projects[this.pieCancerSelected];
            console.log(this.pie_projects);
            this.pieProjectSelected = this.pie_projects[0];

        },
        updateProjects_regulator(){
            this.regulatorProjects=this.projects[this.regulatorCancerSelected];
            console.log(this.regulatorProjects);
            this.regulatorProjectSelected = this.regulatorProjects[0];
        } ,
        download_bar(){

            window.location.href = this.data_path+"/sample_num/" + this.bar_selected + "_samples.tsv";


            
        },
        download_pie(){
            window.location.href = this.data_path+"/sample_num/" + this.bar_selected + "_samples.tsv";
            var file_name = this.pieProjectSelected + "_" + this.pieMethodSelected + ".csv";
            var file_path = this.data_path + "/cell_data/" + this.pieMethodSelected + "/" + file_name;
            window.location.href = file_path;
        },
        download_landscape(){
            if (this.landscape_selected == "all") {
                var file_name = "c1_c6_TCGA_all.csv"
                var file_path =this.data_path+ "/subtype/c1_c6/" + "c1_c6_TCGA_all.csv"; 
            }
            else {
                var file_name = this.landscape_selected + "_c1_c6.csv"
                var file_path = this.data_path + "/subtype/c1_c6/cancer/" + file_name;
            }
            window.location.href = file_path;
        },
        download_regulator_subtype(){
            var subtype_fname = this.regulatorProjectSelected + "_c1_c6.csv";    
            var subtype_file_path = this.data_path + "/subtype/c1_c6/project/" + subtype_fname;
            window.location.href = subtype_file_path;
        },
        download_regulator_rna(){
                var rna_fname = "immuReg_" + this.regulatorProjectSelected + ".csv";
                var rna_file_path = this.data_path + "/immuneregulator/" + rna_fname;
                window.location.href = rna_file_path;
        },
        down_graph(e){
                var clicked_id = e.target.id;
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
.viz {
    padding: 50px;
    position: relative;
    box-shadow: 0 0 64px darken(#dee2e6, 5%)
}
#v-editor {
    position: absolute;
    top: 30px;
    z-index:20;
    transition: all 0.3s;
    right: 15px;
}
</style>