<template>
    <div>
        <div id = "subtype-landscape" class = "container Block">
                <div id="landscapeDescription" class="row description">
                    <h4>Some description for Immune Subtype Landscape in project overview</h4>
                </div>

                <div class="row vizBlock">
                    <div class="col vis" id = "subtype-landscapeVis">
                    </div>
                    <div id="subtype-landscape-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="subtype_conf_landscape" :editorWidth = "280"/>
                    </div>
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
            <div class="row vizBlock">
                <div class="col vis" id = "subtype-boxplotVis">
                </div>
                <div id="subtype-boxplot-editor" class = "md-col-3 v-editor">
                    <OvizEditor :config="subtype_conf_boxplot" :editorWidth = "280"/>
                </div>
            </div>
        </div>

        <hr />

        <div id = "subtype-curve" class = "container Block">
            <div id="curveDescription" class="row description">
                <h4>Some description for KM Curve in project overview</h4>
            </div>
            <div class="row vizBlock">
                <div class="col" id = "subtype-curveVis">
                </div>
                <div id="subtype-curve-editor" class = "md-col-3 v-editor">
                    <OvizEditor :config="subtype_conf_curve" :editorWidth = "280"/>
                </div>
            </div>
        </div>

        <hr />
        <br />

        <div id = "subtype-regulator" class = "container Block">
                <div id="regulatorDescription" class="row description">
                <h4>Some description for immune regulator in project overview</h4>
                </div>

                <div class="row vizBlock">
                    <div class="col vis" id = "subtype-regulatorVis">
                    </div>
                    <div id="subtype-regulator-editor" class = "md-col-3 v-editor">
                        <OvizEditor :config="subtype_conf_regulator" :editorWidth = "280"/>
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
            }
    },
    created() {
        this.boxplot_selected = "ABIS";

    },
    mounted() {
        event.rpcRegisterReceiver("getVue", () => this);
        this.all_viz();
    },
    methods: {
        landscapeViz(){
            var clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";
            var subtype_file_path = this.data_path + "subtype/c1_c6/project/" + this.project_name + "_c1_c6.csv";

            subtypeLandscape("#subtype-landscapeVis", subtype_file_path, clinical_file_path, "#subtype-landscape-editor", "subtype_landscape_viz");
        },
        boxplotViz(){

            var subtype_file_path = this.data_path + "subtype/c1_c6/project/" + this.project_name + "_c1_c6.csv";
            var cellData_file_path = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";
            subtypeBoxplot("#subtype-boxplotVis", subtype_file_path, cellData_file_path, "#subtype-boxplot-editor", "subtype_boxplot_viz");//remember to change to the right plot
        },
        curveViz(){
            
            var subtype_file_path = this.data_path + "subtype/c1_c6/project/" + this.project_name + "_c1_c6.csv";
            var clinical_file_path = this.data_path + "clinical/sample/Clinical_" + this.project_name + ".csv";
            subtypeCurve("#subtype-curveVis", subtype_file_path, clinical_file_path, "#subtype-curve-editor", "subtype_curve_viz");

        },
        regulatorViz(){
            var subtype_file_path = this.data_path + "subtype/c1_c6/project/" + this.project_name + "_c1_c6.csv";  
            var rna_file_path = this.data_path + "immuneregulator/immuReg_" + this.project_name + ".csv";
            subtypeRegulator("#subtype-regulatorVis", subtype_file_path, rna_file_path, "#subtype-regulator-editor", "subtype_regulator_viz");

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
