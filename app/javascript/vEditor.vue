<template>
    <div>
        <div>
            <b-button @click="downloadSVG">Download</b-button>
        </div>
        <div> 
            <OvizEditor :config = "conf" :editorWidth = "280"/>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import BootstrapVue from 'bootstrap-vue';
    import OvizEditor from "oviz-editor";
    import { defaultEditorConfig } from "./Editor";
    import {EditorDef, ItemDef} from "utils/editor-def"

    Vue.use(OvizEditor);
    Vue.use(BootstrapVue)
    export default {
        props: {
            // Must be one of 'module' or 'pipeline'
            conf: {
                type: EditorDef,
                required: true,
            },
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
            }
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