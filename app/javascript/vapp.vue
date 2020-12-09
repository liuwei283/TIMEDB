<template>
     <div> 
        <div id="tool-bar">
            <b-button @click="downloadSVG">Download</b-button>
            <b-button id="editor-conf" @click="toggleEditor">Editor</b-button>
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

    import {EditorDef, ItemDef} from "utils/editor-def"
    import Oviz from "crux"
    import {copyObject} from "utils/object"
    import {DiscreteHeatmap} from "viz"
    import {default as SignedHeatmap} from "viz/signed-heatmap"
    import objectToFormData from 'object-to-formdata';
    import { getVizByTaskOutput } from "viz"
    import { event } from "crux/dist/utils";

    Vue.use(OvizEditor);
    Vue.use(BootstrapVue)
    export default {
        data() {
            return {
                conf: {},
                showEditor: true,
            }
        },
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
            toggleEditor() {
                this.showEditor=!this.showEditor;
            },
        },
        created() {
            console.log("created");
            event.rpcRegisterReceiver("getVue", () => this);
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
        height: calc(100vh - 31px);
        width: calc(100vw - 270px);
        overflow: scroll;
    }
    .col-md-12 {
        width: 80px;
    }
    #viz-container {
        position: relative;
    }
    #v-editor {
        position: absolute;
        top: 0;
        z-index:20;
        transition: all 0.3s;
        right: 10px;
    }
</style>