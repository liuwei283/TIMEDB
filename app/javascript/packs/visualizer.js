import axios from "axios"
import Oviz from "crux"
import Vue from "vue"
import Editor from "vEditor.vue"
import vApp from "viz-app.vue"

import {DiscreteHeatmap} from "viz"

import {default as SignedHeatmap} from "viz/signed-heatmap"

import {copyObject} from "utils/object"

import {testVizDataList, findFilesByDataName} from "utils/viz-class"

function init() {
    // const viz = DiscreteHeatmap.initViz();
    // const vizOpts = copyObject(viz.vizOpts);
    // vizOpts.el = "#canvas";
    // const {visualizer} = Oviz.visualize(vizOpts);
    // const editor = new Vue({
    //     el: "#v-editor-cont",
    //     render: h => h(Editor, {props: {
    //         conf: viz.editorConfig(visualizer)
    //     }}),
    // });

    const vapp = new Vue({
        el: "#vapp",
        render: h=> h(vApp)
    });
    // const viz = DiscreteHeatmap.initViz();
    // const vizOpts = copyObject(viz.vizOpts);
    // vizOpts.el = "#canvas";
    // const {visualizer} = Oviz.visualize(vizOpts);
    // const editor = new Vue({
    //     el: "#v-editor-cont",
    //     render: h => h(Editor, {props: {
    //         conf: viz.editorConfig(visualizer)
    //     }}),
    // });
}

document.addEventListener("turbolinks:load",init);