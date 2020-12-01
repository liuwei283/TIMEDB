<template>
    <div>
        <div>
            <b-button @click="downloadSVG">Download</b-button>
        </div>
        <div v-if="hasEditor"> 
            <OvizEditor :config = "conf" :editorWidth = "280"/>
        </div>
        <div>
            <b-tabs>
                    <div class="col-md-12" v-for="(output, index) in data.outputs" :key="output.id">
                        <b-tab no-body @click="showViz(index)" :title="output.name" class="text-center">
                        </b-tab>
                    </div>
                    <div id="canvas"/>
            </b-tabs>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import BootstrapVue from 'bootstrap-vue';
    import OvizEditor from "oviz-editor";
    import {EditorDef, ItemDef} from "utils/editor-def"
    import Oviz from "crux"
    import {copyObject} from "utils/object"
    import {DiscreteHeatmap} from "viz"
    import {default as SignedHeatmap} from "viz/signed-heatmap"
    

    Vue.use(OvizEditor);
    Vue.use(BootstrapVue);

    export default {
        data(){
            return {
                job_id: '',
                currentTab: 0,
                valid_name: null,
                willLoad: true,
                submitted: false,
                code: false,
                hasEditor: false,
                conf: {},
                viz: null,
                data: {
                    outputs: [
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
                    ]
                },
            };
        },
        // props: {
        //     // Must be one of 'module' or 'pipeline'
        //     conf: {
        //         type: EditorDef,
        //         required: true,
        //     },
        // },
        methods: {
            downloadSVG() {
                const svgContainerClone = document.getElementById("canvas").cloneNode(true) as HTMLElement;
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                const svgUrl = URL.createObjectURL(svgBlob);
                const downloadLink = document.createElement("a");
                downloadLink.href = svgUrl;
                downloadLink.download = `demo.svg`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            showViz(outputIndex) {
                if (outputIndex === this.currentTab) {
                    return;
                } else {
                    this.currentTab = outputIndex;
                    if (outputIndex === 0) {
                        this.viz = SignedHeatmap.initVizWithDeepomics(this.data.outputs[0].files); 
                    } else {
                        const viz = DiscreteHeatmap.initViz();
                        const vizOpts = copyObject(viz.vizOpts);
                        vizOpts.el = "#canvas";
                        this.viz = Oviz.visualize(vizOpts).visualizer;
                    }
                }
            }
        },
        mounted(){
            console.log(this.currentTab);
            this.viz = SignedHeatmap.initVizWithDeepomics(this.data.outputs[0].files); 
    
            document.addEventListener("turbolinks:load", () => {
                if ( this.willLoad ) {
                    const viz = SignedHeatmap.initVizWithDeepomics(this.data.outputs[0].files); 
                    this.willLoad = false;
                }
                
            })
        }
        // data() {
        //  return {
        //      conf: defaultEditorConfig(null)
        //  }
        // }
    }
</script>

<style scoped>
    button {
        background: blue;
        color: white;
        padding: 1rem;
    }
</style>