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

            <div class="row vizBlock">
                <div class="col vis" id = "fraction-pieVis">
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

            <br>

            <div class="row vizBlock">
                <div class="col vis" id = "fraction-boxplotVis">
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

            <br>

            <div class="row vizBlock">
                <div class="col vis" id = "fraction-landscapeVis">
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
import {init as fractionLandscape} from "viz/static_comparedPlot"

Vue.use(OvizEditor);
Vue.use(BootstrapVue);

Vue.component("dropdown-select", DropDownSelect)
import Vue from 'vue';
export default {
    data() {
        return {
            // cancers: window.gon.cancers,
            project_name: window.gon.project_name,
            conf: {},
            data_path : "/public/data/",
            pie_selector: window.gon.selector_attrs,
            pie_selected: null,
            boxplot_selected:null,
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
            landscape_selected: null,
            landscape_selector:[
                    {value:"pie",label:"Pie Chart"},
                    {value:"bar",label:"Bar Plot"},

            ],
            }
    },
    created() {
        this.pie_selected = this.pie_selector[0];
        this.boxplot_selected="Consensus";
        this.landscape_selected="pie";

    },
    mounted() {
        this.all_viz();
    },
    methods: {
        pieViz(){

        },
        boxplotViz(){
            var cellData_file_path = this.data_path + "cell_data/" + this.boxplot_selected + "/" + this.project_name + "_" + this.boxplot_selected + ".csv";

            if (this.boxplot_selected == "Consensus") {
                fractionGroupBoxplot("#fraction-boxplotVis", cellData_file_path)
            }
            else {
                fractionBoxplot("#fraction-boxplotVis", cellData_file_path);
            }
        },
        landscapeViz(){
            var file_name = this.project_name + "_Consensus.csv";
            var file_path = this.data_path + "cell_data/Consensus/" + file_name;


            
            fractionLandscape("#fraction-landscapeVis", file_path, this.landscape_selected);
        },
        all_viz() {
            this.boxplotViz();
            this.landscapeViz();
        },

    }
}
</script>
