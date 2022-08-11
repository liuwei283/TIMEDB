<template>
     <div id = "vapp" :class= "{'ana': isAnalysis, 'task': !isAnalysis}"> 
        <div id="tool-bar">
            <div v-if= "isAnalysis">
                <b-button class="tool-bar-el" type="button" id="downloadChartDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" variant="outline-secondary"><i class="far fa-file-archive"></i>Download Chart</b-button>
                <div class="dropdown-menu" aria-labelledby="downloadChartDropdown">
                    <a class="dropdown-item" href="#" @click="downloadSVG">SVG</a>
                    <a class="dropdown-item" href="#" @click="downloadPNG">PNG</a>
                </div>
                <b-button @click="useDemoFiles" class="tool-bar-el">Use Demo</b-button>
                <dropdown-select
                    right
                    v-model="chosenOutput"
                    :options="taskOutputs"
                    :variant="outline"
                    class="tool-bar-el"/>
                <b-button @click="downloadDemoFiles" class="tool-bar-el" variant="outline-secondary"><i class="far fa-file-archive"></i>Download Data</b-button>
                <b-button id="editor-conf" @click="toggleEditor" variant="outline-secondary">Editor</b-button>
            </div>
            <div v-else>
                <b-button class="tool-bar-el btn-5 dropdown-toggle" type="button" id="downloadChartDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-download"/>Download Chart</b-button>
                <div class="dropdown-menu" aria-labelledby="downloadChartDropdown">
                    <a class="dropdown-item" href="#" @click="downloadSVG">SVG</a>
                    <a class="dropdown-item" href="#" @click="downloadPNG">PNG</a>
                </div>
                <b-button @click="downloadDemoFiles" class="tool-bar-el btn-5"><i class="far fa-file-archive"></i>Download Data</b-button>
                <b-button id="editor-conf" class = btn-5 @click="toggleEditor">Editor</b-button>
            </div>
        </div>
        <div id="viz-container">
            <div class="need-upload w-100" v-if="isLoading">
                <i class="fas fa-circle-notch fa-spin fa-5x m-0"></i>
                <h4 class="mt-4">Loading data……</h4>
            </div>
            <div class="need-upload w-100" v-if="error">
                <i class="fas fa-exclamation-triangle fa-5x m-0"></i>
                <h4 class="mt-4">An error occurred when loading data. Please check the format of your input file.</h4>
                <p>{{error}}</p>
            </div>
            <div id="canvas"/>
            <div id="v-editor" v-show="showEditor">
                <OvizEditor :config = "conf" :editorWidth = "280"/>
                <b-modal id="msg-box-modal" ref="msgBox" :title="msgBoxTitle">
                    <p v-if="msgBoxUseHTML" class="my-2" v-html="msgBoxContent"></p>
                    <p v-else class="my-2">
                        <pre>{{msgBoxContent}}</pre>
                    </p>
                </b-modal>
            </div>
        </div>
        <EditText/>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import BootstrapVue from 'bootstrap-vue';
    import OvizEditor from "oviz-editor";

    import axios from "axios";
    import { event } from "crux/dist/utils";
    import {viz_mode} from "page/visualizers";

    import DropDownSelect from "page/builtin/dropdown-select.vue";

    Vue.use(OvizEditor);
    Vue.use(BootstrapVue);

    Vue.component("dropdown-select", DropDownSelect)

    export default {
        data() {
            return {
                conf: {},
                isLoading: true,
                isAnalysis: true,
                showEditor: true,
                error: null,
                outline: "secondary",
                chosenOutput: 0,
                chosenOutputOld: 0,
                msgBoxTitle: "",
                msgBoxContent: "",
                msgBoxUseHTML: false,
                taskOutputs: [{value: 0, text: "Demo Files", secondaryText: ""}],
            }
        },
        methods: {
            downloadPNG() {
                const canvas = document.createElement("canvas");
                const svg = document.querySelector('svg');
                const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
                const w = parseInt(svg.getAttribute('width'));
                const h = parseInt(svg.getAttribute('height'));
                const img_to_download = document.createElement('img');
                img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
                console.log(w, h);
                img_to_download.onload = function () {
                    console.log('img loaded');
                    canvas.setAttribute('width', w);
                    canvas.setAttribute('height', h);
                    const context = canvas.getContext("2d");
                    //context.clearRect(0, 0, w, h);
                    context.drawImage(img_to_download,0,0,w,h);
                    const dataURL = canvas.toDataURL('image/png');
                    if (window.navigator.msSaveBlob) {
                        window.navigator.msSaveBlob(canvas.msToBlob(), `${window.gon.analysis_name || 'demo'}.svg`);
                        //e.preventDefault();
                    } else {
                        const a = document.createElement('a');
                        const my_evt = new MouseEvent('click');
                        a.download = 'download.png';
                        a.href = dataURL;
                        a.dispatchEvent(my_evt);
                    }
                    //canvas.parentNode.removeChild(canvas);
                }  
            },
            downloadSVG() {
                const svgContainerClone = document.getElementById("canvas").cloneNode(true) as HTMLElement;
                const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg;charset=utf-8" });
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
            downloadDemoFiles() {
                // window.open(`${window.gon.urls.download_demo_file}`);
                window.open(window.gon.urls.download_demo_file);
            }
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
            event.on(
                event.DATA_LOADING_FINISHED,
                () => {
                    this.isLoading = false;
                    this.error = null;
                    this.$root.$emit("data-loaded");
                },
                "vapp-load-finished",
            );
            event.on(
                "show-msgbox",
                (_, { title, content, html }) => {
                    this.msgBoxTitle = title;
                    this.msgBoxContent = content;
                    this.msgBoxUseHTML = html;
                    (this.$refs.msgBox as any).show();
                },
                "vapp-show-msg-box",
            );
            event.on(
                event.DATA_LOADING_FAILED,
                (_, error) => {
                    this.isLoading = false;
                    this.pendingForData = true;
                    this.error = error;
                },
                "vapp-load-failed",
            );

            event.on(
                event.DATA_LOADING_STARTED,
                () => {
                    this.isLoading = true;
                    this.error = null;
                },
                "vapp-load-started",
            );
            
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

<style scoped lang="scss">
    #vapp {
        width: 100%;
        //min-height: 25rem;
        position: relative;
        background-color: #f8f9fa;
        border: none !important;
    }
    #tool-bar {
        height:auto;
        padding: 5px;
        // background-color: #f8f9fa;
        background-color: #f8f9fa;
        margin-bottom: 1%;
        border-bottom: 1px solid #ced4da;
        .btn {
            border-radius: 0;
            border: 1px solid #ced4da;
        }
        .btn-group /deep/ .btn {
            border-radius: 0;
        }
    } 
    // #tool-bar div >* {
    //     height: 100%;
    //     color: darkgrey;
    //     border-top: none;
    //     border-left: 1px solid darkgrey;
    //     border-bottom: none;
    //     border-right: 1px solid darkgrey;
    //     margin-bottom: 2px;
    //     text-align:center;
    //     background-color: white;
    //     border-radius: 0;
    // } 
    // .tool-bar-el {
    //     float: left;
    //     padding-top:0;
    //     height: 100%;
    //     text-align:center;
    //     border: none;
    // }
    // .tool-bar-el /deep/ .btn-secondary {
    //     border-radius: 0;
    //     padding-top: 0;
    //     margin-top: 0;
    // }
    // #tool-bar div{
    //     height:2.5em;
    //     background-color: white;
    //     position: relative;
    //     border: 1px solid  #ced4da;
    // }
    #editor-conf {
        float: right;
    }
    #canvas {
        // min-height: calc(500px - 2.5em);
        // width: calc(100vw - 250px);
        // overflow: scroll;
    }
    .col-md-12 {
        width: 80px;
    }
    #viz-container {
        // position: relative;
        // height:  calc(100% - 2.5em);
        // height: 100%;
        //min-height: calc(500px - 2.5em);
        position: relative;
    }
    #v-editor {
        position: absolute;
        top: 0;
        z-index:20;
        transition: all 0.3s;
        right: 10px;
    }
    .need-upload {
        margin: 0 1px;
        padding: 8rem 4rem;
        text-align: center;
        color: #999;
        position: absolute;
    }
</style>