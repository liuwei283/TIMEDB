<template>
    <div>
        <div id = "barPlot" class = "container Block">
            <div class="row description">
                <h4>Some description for bar plot</h4>
            </div>
            <div class="select-bar form-inline row">
                <div class="sdiv col">
                    <div class="select-title">
                        Please choose project or cancer type:
                    </div>
                    <select @change='barViz' class="selectpicker" data-style="btn-secondary" data-live-search="true" v-model="bar_selected">
                        <option v-for="(option, index) in bar_selector" :key="index" :value="option.value" :disabled="option.disabled">
                            {{option.label}}
                        </option>
                    </select>

                </div>
            </div>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="bar_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dwonload
                </button>
                <div class="dropdown-menu" aria-labelledby="bar_download_dropdwon">
                    <a class="dropdown-item" id = "bar_download" :download="`${bar_selected}_samples.tsv`" :href="`${data_path}/sample_num/${bar_selected}_samples.tsv`" >Download sample number table</a> 
                    <a class="dropdown-item viz_download" id = "bar">Download bar chart</a>
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
            <select @change='pieViz' class="form-select col selectpicker" data-style="btn-secondary" data-live-search="true" v-model="pieMethodSelected">
                <option selected="selected" value = "ABIS">ABIS</option>
                <option value = "CIBERSORTX">CIBERSORTX</option>
                <option value = "ConsensusTME">ConsensusTME</option>
                <option value="EPIC">EPIC</option>
                <option value="ImmuCellAI">ImmuCellAI</option>
                <option value="MCPcounter">MCPcounter</option>
                <option value="quanTIseq">quanTIseq</option>
                <option value="TIMER">TIMER</option>
                <option value="xCell">xCell</option>
            </select>
            <p>{{pieMethodSelected}}</p>

        </div>
        <div class="sdiv col">
            <div class="select-title">
                Please choose the cancer type:
            </div>
            <select @change='updateProjects' class="form-select col selectpicker" data-style="btn-secondary" data-live-search="true" v-model="pieCancerSelected">
                <option v-for="(option, index) in cancers" :key="index" :value="option">
                    {{option}}
                </option>
            </select>
            <p>{{pieCancerSelected}}</p>
        </div>

        <div class="sdiv col">
            <div class="select-title">
                Please choose the project:
            </div>
            <select class="form-select col selectpicker" data-style="btn-secondary" data-live-search="true" v-model="pieProjectSelected">
                <option v-for="(option, index) in pie_projects" :key="index" :value="option">
                    {{option}}
                </option>
            </select>
            <p>{{pie_projects}}</p>

        </div>
    </div>
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="pie_download_dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dwonload
        </button>
        <div class="dropdown-menu" aria-labelledby="pie_download_dropdown">
            <a class="dropdown-item" id = "pie_download" download href="/public/data/cell_data/ABIS/TCGA_ACC_ABIS.csv">Download cell data</a> 
            <a class="dropdown-item viz_download" id = "pie">Download pie chart</a>
        </div>
    </div>

    <div class="row vizBlock">
        <div class="col" id = "pieVis">
        </div>
    </div>
</div>

<hr>
<br>
        

        <!-- <div>
            <div id = "test_editor_viz" class = "row">
                <div id = "canvas" class = "md-col-9">
                </div>
                <div id="v-editor" class = "md-col-3">
                    <OvizEditor :config = "conf" :editorWidth = "280"/>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script lang = 'ts'>
import BootstrapVue from 'bootstrap-vue';
import OvizEditor from "oviz-editor";

import axios from "axios";
import { event } from "crux/dist/utils";
import {viz_mode} from "page/visualizers";

import DropDownSelect from "page/builtin/dropdown-select.vue";

//import visualization file
import {init as immunebar} from "./viz/static_immunebar";
import {init as immunepie} from "./viz/static_immunePie";
import {init as immunelandscape} from "./viz/static_immuneSubtypeLandscape";
import {init as immuneRegulator} from "./viz/static_immuneRegulators";

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
            conf: {},
            data_path : "/public/data",
            bar_selector: [
                {value: "project", label: "Project"},
                {value: "cancer", label: "Cancer type"},
            ],
            bar_selected : null,
            pieMethodSelected : null,
            pieProjectSelected : null,
            pieCancerSelected: null
            }
    },
    created() {
        this.bar_selected = "project";
    },
    mounted() {
        //event.rpcRegisterReceiver("getVue", () => this);
        this.all_viz();
    },
    methods: {
        barViz() {
            immunebar("#barVis", this.data_path + "/sample_num/" + this.bar_selected + "_samples.tsv");
        },
        all_viz() {
            this.barViz();
        },
        updateProjects() {
            //console.log (this.projects[this.pieCancerSelected])
            this.pie_projects = this.projects[this.pieCancerSelected];
            console.log(this.pie_projects);
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
