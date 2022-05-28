<template>
    <div>
        <div id = "subtype-landscape" class = "container Block">
                <div id="landscapeDescription" class="row description">
                    <h4>Some description for Immune Subtype Landscape in project overview</h4>
                </div>

                <div id = "subtype-landscapeBlock" class="row vizBlock">
                    <div class="col vis" id = "subtype-landscapeVis">
                    </div>
                    <div id="subtype-landscape-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="subtype_conf_landscape" :editorWidth = "280"/>
                    </div>
                </div>
                <div v-if="!getlandscapeFexists" class = "text-center row justify-content-center">
                    <h2>No data available</h2>
                </div>
        </div>

        <hr />

        <div id = "subtype-boxplot" class = "container Block">

            <div id="boxplotDescription" class="row description">
                <h4>Some description for Immune Cell Data bar in project overview</h4>
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
            <div id = "subtype-boxplotBlock" class="row vizBlock">
                <div class="col vis" id = "subtype-boxplotVis">
                </div>
                <div id="subtype-boxplot-editor" class = "md-col-3 v-editor">
                    <OvizEditor :config="subtype_conf_boxplot" :editorWidth = "280"/>
                </div>
            </div>
            <div v-if="!getboxplotFexists" class = "text-center row justify-content-center">
                <h2>No data available</h2>
            </div>
        </div>

        <hr />

        <div id = "subtype-curve" class = "container Block">
            <div id="curveDescription" class="row description">
                <h4>Some description for KM Curve in project overview</h4>
            </div>
            <div id = "subtype-curveBlock" class="row vizBlock">
                <div class="col" id = "subtype-curveVis">
                </div>
                <div id="subtype-curve-editor" class = "md-col-3 v-editor">
                    <OvizEditor :config="subtype_conf_curve" :editorWidth = "280"/>
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
                <h4>Some description for immune regulator in project overview</h4>
                </div>

                <div id = "subtype-regulatorBlock" class="row vizBlock">
                    <div class="col vis" id = "subtype-regulatorVis">
                    </div>
                    <div id="subtype-regulator-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="subtype_conf_regulator" :editorWidth = "280"/>
                    </div>
                </div>
                <div v-if="!getregulatorFexists" class = "text-center row justify-content-center">
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
            subtype_conf_landscape: {},
            subtype_conf_boxplot: {},
            subtype_conf_curve: {},
            subtype_conf_regulator: {},

            data_path : "/public/data/",
            boxplot_selected : null,
            boxplot_selector : [
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
        this.boxplot_selected = "ABIS";
        // var method;
        // for (var i = 0; i < 10; i ++ ) {
        //     method = this.boxplot_selector[i]["value"];
        //     console.log(method);
        //     var cfpath = this.data_path + "cell_data/" + method + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";
        // }
        this.clinical_file_path = "/public/data/clinical/sample/Clinical_" + this.project_name + ".csv";
        this.subtype_file_path = "/public/data/subtype/c1_c6/project/" + this.project_name + "_c1_c6.csv";
        this.rna_file_path = "/public/data/immuneregulator/immuReg_" + this.project_name + ".csv";

        axios.get('/api/public_file/check_file_exists', { params: { fpath: this.clinical_file_path}  }).then(response => {
            this.clinical_fexists = response.data["fexists"];
        });

        axios.get('/api/public_file/check_file_exists', { params: { fpath: this.subtype_file_path}  }).then(response => {
            this.subtype_fexists = response.data["fexists"];
        });
        axios.get('/api/public_file/check_file_exists', { params: { fpath: this.rna_file_path}  }).then(response => {
            this.rna_fexists = response.data["fexists"];
        });

    },
    mounted() {
        event.rpcRegisterReceiver("getVue", () => this);
        this.all_viz();
    },
    computed: {
        getlandscapeFexists() {
            return this.subtype_fexists == true && this.clinical_fexists == true;
        },
        getcurveFexists() {
            return this.subtype_fexists == true && this.clinical_fexists == true;
        },
        getregulatorFexists() {
            return this.subtype_fexists == true && this.rna_fexists == true;

        },
        getboxplotFexists() {
            return this.subtype_fexists && this.cell_fexists;
        }
    },
    methods: {
        landscapeViz(){
            // var clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";
            // var subtype_file_path = this.data_path + "subtype/c1_c6/project/" + this.project_name + "_c1_c6.csv";

            if(this.clinical_fexists == true && this.subtype_fexists == true) {
                subtypeLandscape("#subtype-landscapeVis", this.subtype_file_path, this.clinical_file_path, "#subtype-landscape-editor", "subtype_landscape_viz");
            }
            else {
                document.getElementById("subtype-landscapeBlock").style.display = "none";
            }

        },
        boxplotViz(){
            var cellData_file_path = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";

            axios.get('/api/public_file/check_file_exists', { params: { fpath: cellData_file_path}  }).then(response => {
                this.cell_fexists = response.data["fexists"];
               
                if (this.cell_fexists == true && this.subtype_fexists == true) {
                    document.getElementById("subtype-boxplotBlock").style.display = "block";
                    subtypeBoxplot("#subtype-boxplotVis", this.subtype_file_path, cellData_file_path, "#subtype-boxplot-editor", "subtype_boxplot_viz");//remember to change to the right plot
                }
                else {
                    document.getElementById("subtype-boxplotBlock").style.display = "none";
                }
            });
            
        },
        curveViz(){
            
            if(this.clinical_fexists == true && this.subtype_fexists == true) {
                subtypeCurve("#subtype-curveVis", this.subtype_file_path, this.clinical_file_path, "#subtype-curve-editor", "subtype_curve_viz");
            }
            else {
                document.getElementById("subtype-curveBlock").style.display = "none";
            }

        },
        regulatorViz(){

            if(this.rna_fexists == true && this.subtype_fexists == true) {
                subtypeRegulator("#subtype-regulatorVis", this.subtype_file_path, this.rna_file_path, "#subtype-regulator-editor", "subtype_regulator_viz");
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
