<template>
    <div v-if="submitted">
        <b-card id="result-card" class="result-vizs"> 
            <b-tabs pills card vertical id="result-container">
                <div class="col-md-12" v-for="(output, index) in data.outputs" :key="output.id">
                    <b-tab no-body @click="showViz(index)" :title="output.name" class="text-center">
                    </b-tab>
                </div>
                <div> 
                    <div id="tool-bar">
                        <b-button @click="downloadSVG">Download</b-button>
                        <b-button id="editor-conf" @click="toggleEditor()">Editor</b-button>
                    </div>
                    <div id="viz-container"> 
                        <div id="canvas"/>
                        <OvizEditor :config = "conf" :is-shown="showEditor" :editorWidth = "280"/>
                    </div>
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
    import {EditorDef, ItemDef} from "utils/editor-def"
    import Oviz from "crux"
    import {copyObject} from "utils/object"
    import {DiscreteHeatmap} from "viz"
    import {default as SignedHeatmap} from "viz/signed-heatmap"
    import objectToFormData from 'object-to-formdata';
    import { getVizByTaskOutput } from "viz"
    

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
            downloadSVG() {
                const svgContainerClone = document.getElementById("canvas").cloneNode(true) as HTMLElement;
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                const svgUrl = URL.createObjectURL(svgBlob);
                const downloadLink = document.createElement("a");
                downloadLink.href = svgUrl;
                downloadLink.download = `${this.data.outputs[this.currentTab].name}.svg`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            toggleEditor() {
                this.showEditor=!this.showEditor
            },
            showViz(outputIndex) {
                if (this.currentTab !== outputIndex) {
                    this.currentTab = outputIndex;
                    const {visualizer, editorConf} = getVizByTaskOutput(this.data.outputs[outputIndex]);
                    this.viz = visualizer;
                    this.conf = editorConf;
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
                    console.log(response.data.data);
                    this.data.outputs = response.data.data;
                    this.submitted = true;
                    // window.gon.urls = [];
                    // window.gon.urls.chosen_file_paths = "dummytest";
                    showViz(0);
                }).catch((reason) => {
                    console.log(`Error! query task failed with ${reason}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                });
            }
        },
        mounted(){
            if(this.submitted)
                this.viz = SignedHeatmap.initVizWithDeepomics(this.data.outputs[0].files);
            // document.addEventListener("turbolinks:load", () => {
            //     if ( this.willLoad ) {
            //         const viz = SignedHeatmap.initVizWithDeepomics(this.data.outputs[0].files); 
            //         this.willLoad = false;
            //     }
                
            // })
        },
        updated(){
            if (this.firstRender) {
                this.firstRender = false;
                const {visualizer, editorConf} = getVizByTaskOutput(this.data.outputs[0]);
                this.viz = visualizer;
                this.conf = editorConf;
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