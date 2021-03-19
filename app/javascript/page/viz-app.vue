<template>
    <div v-if="submitted">
        <b-card id="result-card" class="result-vizs"> 
            <b-tabs pills card vertical id="result-container">
                <div class="col-md-12" v-for="(output, index) in data.outputs" :key="output.id">
                    <b-tab no-body @click="showViz(index)" :title="output.name" class="text-center">
                    </b-tab>
                </div>
                <div> 
                    <VApp/>
                </div>
            </b-tabs>
        </b-card>
    </div>
    <div v-else>
        <b-button @click="queryTask()">Dummy Test</b-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import BootstrapVue from 'bootstrap-vue';
    import OvizEditor from "oviz-editor";
    import VApp from "./vapp.vue";
    import objectToFormData from 'object-to-formdata';
    import { event } from "crux/dist/utils";
    
    Vue.component("VApp", VApp);
    Vue.use(OvizEditor);
    Vue.use(BootstrapVue);

    export default {
        data(){
            return {
                job_id: '',
                currentTab: 0,
                valid_name: null,
                willLoad: true,
                firstRender: true,
                submitted: false,
                code: false,
                conf: {},
                viz: null,
                showEditor: true,
                data: {
                    outputs: [
                        {
                            id: 210,
                            name: "Drug Used",
                            files: [
                                {
                                    name: "T1_sample.csv",
                                    path: "/discrete-heatmap/",
                                }
                            ],
                        },
                        {
                            id: 211,
                            name: "Pathway Enrichment",
                            viz: "signed-heatmap",
                            files: [
                                {
                                    name: "corr.csv",
                                    dataType: "heatmapData", // mapped in local
                                    type: "tsv",                                    
                                    path: "/data/signed-heatmap/",
                                },
                                {
                                    name: "pvalue.csv",
                                    dataType: "heatmapDataP",
                                    type: "tsv",
                                    path: "/data/signed-heatmap/",
                                },
                                {
                                    name: "group.csv",
                                    dataType: "groupData",
                                    type: "tsv",
                                    path: "/data/signed-heatmap/",
                                },
                                {
                                    name: "rowtree.newick",
                                    dataType: "rowTreeData",
                                    type: "newick",
                                    path: "/data/signed-heatmap/",
                                },
                            ],
                        }, 
                    ]
                },
            };
        },
        methods: {
            showViz(outputIndex) {
                if (this.currentTab !== outputIndex) {
                    window.gon.module_name = this.data.outputs[outputIndex].module_name
                }
            },
            queryTask() {
                axios.post(
                    `/query-app-task-dummy/`,
                    objectToFormData({'job_id': '1234355'}),
                    {  
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    this.data.outputs = response.data;
                    this.updateGon(this.data.outputs[0]);
                    this.submitted = true;
                }).catch((reason) => {
                    console.log(`Error! query task failed with ${reason}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                });
            },
            updateGon(output) {
                window.gon.module_name = output.module_name;
                window.gon.required_data = output.required_data;
                if (!window.gon.urls) window.gon.urls = {};
                window.gon.urls.chosen_file_paths = `/api/analysis/${output.analysis_id}/chosen_file_paths`
            }
        },
        mounted(){
            window.gon.viz_mode = "task-output"
            
            // document.addEventListener("turbolinks:load", () => {
            //     if ( this.willLoad ) {
            //         const viz = SignedHeatmap.initVizWithDeepomics(this.data.outputs[0].files); 
            //         this.willLoad = false;
            //     }
                
            // })
        },
        updated(){
            if(this.submitted) {
                event.emit("GMT:query-finished", this);
            }
        }
    }
</script>

<style scoped>
    button {
        height:30px;
        background: skyblue;
        color: white;
        border: none;
        text-align:center;
    }
    #result-card {
        width: 1400px;
        height: 1000px;
    }
    #result-container {
        width: 1300px;
        height: 1000px;
    }
    #tool-bar {
        height:30px;
        background:lightgrey; 
        position: relative;
    }
    #editor-conf {
        position: absolute;
        right: 0;
    }
    #canvas {
        height: 950px;
        width: 1100px;
        overflow: scroll;
    }
    .col-md-12 {
        width: 80px;
    }
    #viz-container {
        position: relative;
    }
    .v-editor {
        position: absolute;
        top: 0;
        right: 0;
        z-index:20;
        transition: all 0.3s
    }
</style>