import Vue from "vue"
import vApp from "viz-app.vue"

import ColorPicker from "page/builtin/color-picker.vue";
import SectionFiles from "page/builtin/section-files.vue";

Vue.component("color-picker", ColorPicker);
Vue.component("section-files", SectionFiles);

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