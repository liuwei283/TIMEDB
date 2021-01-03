<template>
     <div id = "vapp"> 
        <div id="tool-bar">
            <div v-if= "isAnalysis">
                <b-button @click="downloadSVG" class="tool-bar-el"><i class="fa fa-download"></i>Download Chart</b-button>
                
                <!--<b-button @click="useDemoFiles">Demo Files</b-button>-->
                
                <dropdown-select
                    right
                    v-model="chosenOutput"
                    :options="taskOutputs"
                    :variant="outline"
                    class="tool-bar-el"/>
                
                <b-button id="editor-conf" @click="toggleEditor">Editor</b-button>
            </div>
            <div v-else>
                <b-button @click="downloadSVG">Download</b-button>
                <b-button id="editor-conf" @click="toggleEditor">Editor</b-button>
            </div>
        </div>
        <div id="viz-container"> 
            <div id="canvas"/>
            <div id="v-editor" v-show="showEditor">
                <OvizEditor :config = "conf" :editorWidth = "280"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import BootstrapVue from 'bootstrap-vue';
    import OvizEditor from "oviz-editor";

    import axios from "axios";
    import {EditorDef, ItemDef} from "utils/editor-def"
    import Oviz from "crux"
    import {copyObject} from "utils/object"
    import {DiscreteHeatmap} from "viz"
    import {default as SignedHeatmap} from "viz/signed-heatmap"
    import objectToFormData from 'object-to-formdata';
    import { getVizByTaskOutput } from "viz"
    import { event } from "crux/dist/utils";
    import {viz_mode} from "page/visualizers";

    import ColorPicker from "page/builtin/color-picker.vue";
    import SectionFiles from "page/builtin/section-files.vue";
    import DropDownSelect from "page/builtin/dropdown-select";

    Vue.use(OvizEditor);
    Vue.use(BootstrapVue);

    Vue.component("section-files", SectionFiles)
    Vue.component("color-picker", ColorPicker)
    Vue.component("dropdown-select", DropDownSelect)
    // @Component({
    //     name: "vapp",
    //     components: { ColorPicker, SectionFiles },
    // });

    export default {
        data() {
            return {
                conf: {},
                isAnalysis: true,
                showEditor: true,
                outline: "secondary",
                chosenOutput: 0,
                chosenOutputOld: 0,
                taskOutputs: [{value: 0, text: "Demo Files", secondaryText: ""}],
            }
        },
        methods: {
            downloadSVG() {
                const svgContainerClone = document.getElementById("canvas").cloneNode(true) as HTMLElement;
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
                const svgUrl = URL.createObjectURL(svgBlob);
                const downloadLink = document.createElement("a");
                downloadLink.href = svgUrl;
                downloadLink.download = `${window.gon.analysis_name || 'demo'}.svg`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            useDemoFiles() {
                axios.get(window.gon.urls.use_demo)
                    .then(response => {
                        const result = response.data;
                        if (result.code)
                            location.reload();
                    })
            },
            toggleEditor() {
                this.showEditor=!this.showEditor;
            },
            // allTaskOutputs() {
            //     const result = [...this.defaultOutput]
            //     return result;
            // }
        },        
        created() {
            event.rpcRegisterReceiver("getVue", () => this);
            this.isAnalysis = window.gon.viz_mode === viz_mode.ANALYSIS ? true : false
            
            if (this.isAnalysis) {
                this.chosenOutput = window.gon.chosen_output || 0
                this.chosenOutputOld = window.gon.chosen_output || 0
                axios.get(window.gon.urls.all_task_outputs)
                    .then(response => {
                        const outputs = response.data;
                        outputs.forEach(d=> {
                            this.taskOutputs.push({
                                value: d.id,
                                text: `task-${d.task_id}`,
                            })
                        });
                    });
            }
        },
        mounted() {
            event.emit(event.CANVAS_READY, this);
        },
        updated() {
            if (this.isAnalysis) {
                axios.get(`${window.gon.urls.use_task_output}?task_output_id=${this.chosenOutput}`)
                    .then(response => {
                        if(response.data.code) location.reload();
                    })
            }
            
        }
    }

</script>

<style scoped>
    #vapp {
        height: 100%;
    }
    #tool-bar div >* {
        height: 100%;
        color: darkgrey;
        border-top: none;
        border-left: 1px solid darkgrey;
        border-bottom: none;
        border-right: 1px solid darkgrey;
        margin-bottom: 2px;
        text-align:center;
        background-color: white;
        border-radius: 0;
    } 
    .tool-bar-el {
        float: left;
        padding-top:0;
        height: 100%;
        text-align:center;
        border: none;
    }
    .tool-bar-el /deep/ .btn-secondary {
        border-radius: 0;
        padding-top: 0;
        margin-top: 0;
    }
    #tool-bar div{
        height:2.5em;
        background-color: white;
        position: relative;
        border: 1px solid  #ced4da;
    }
    #editor-conf {
        float: right;
    }
    #canvas {
        /*height: 100vh;*/
        height: 968px;
        width: calc(100vw - 270px);
        overflow: scroll;
    }
    .col-md-12 {
        width: 80px;
    }
    #viz-container {
        position: relative;
        height: calc(100vh - 31px);
    }
    #v-editor {
        position: absolute;
        top: 0;
        z-index:20;
        transition: all 0.3s;
        right: 10px;
    }
</style>