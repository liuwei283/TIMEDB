import Vue from "vue"
import vApp from "page/viz-app.vue"

import ColorPicker from "page/builtin/color-picker.vue";
import SectionFiles from "page/builtin/section-files.vue";

Vue.component("color-picker", ColorPicker);
Vue.component("section-files", SectionFiles);

function init() {
    const vapp = new Vue({
        el: "#vapp",
        render: h=> h(vApp)
    });
}

document.addEventListener("turbolinks:load",init);