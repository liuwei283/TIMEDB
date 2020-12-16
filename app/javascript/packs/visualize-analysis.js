import Vue from "vue"
import VApp from "page/vapp.vue"
import ColorPicker from "page/builtin/color-picker.vue";
import SectionFiles from "page/builtin/section-files.vue";
import { call } from "page/visualizers";
import { event } from "crux/dist/utils";

Vue.component("color-picker", ColorPicker);
Vue.component("section-files", SectionFiles);

//useVue({vapp: VApp})
let vizLoaded = false;
let canvasMounted = false;
let packLoaded = false;
let currViz = null;
function initVApp() { 
    if(document.getElementById("vapp")) {
        const vapp = new Vue({
            el: document.getElementById("vapp"),
            render: h=> h(VApp)
        });
    }
}
function checkRecource() {
    const moduleName = window.gon.module_name;
    if (window.__BVD3_visualizers[moduleName]) {
        packLoaded = true;
    }
    if (document.getElementById("canvas")) {
        canvasMounted = true;
    }
    if (packLoaded && canvasMounted && !vizLoaded) {
        vizLoaded = true;
        const v = call(moduleName);
        // lightTheme = "light";
        // darkTheme = "dark";
        if (Array.isArray(v)) {
            const [v_, opt] = v;
            currViz = v_;
            // if (opt.theme) {
            //     lightTheme = opt.theme.light || "light";
            //     darkTheme = opt.theme.dark || "dark";
            // }
        } else {
            if (v) currViz = v;
        }
    }
}

event.on(event.CANVAS_READY, () => { canvasMounted = true; checkRecource(); });
event.on("bvd3-resource-loaded", () => { packLoaded = true; checkRecource(); });

document.addEventListener("turbolinks:before-cache", () => {
    const canvas = document.getElementById("canvas");
    if (!canvas) { return; }
    const svgElm = canvas.getElementsByTagName("svg");
    if (svgElm.length) svgElm[0].remove();
    const canvasElm = canvas.getElementsByTagName("canvas");
    if (canvasElm.length) canvasElm[0].remove();
    packLoaded = false;
    canvasMounted = false;
    vizLoaded = false;
});

document.addEventListener("turbolinks:load",initVApp);
document.addEventListener("DOMContentLoaded", initVApp);
