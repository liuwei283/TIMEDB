import Vue from "vue";

import VApp from "page/vapp.vue";

import ColorPicker from "page/builtin/color-picker.vue";
import SectionFiles from "page/builtin/section-files.vue";
import FilterSpecies from "viz/fmt-overview/filter-species.vue";
import ReorderSpecies from "viz/fmt-overview/reorder-species.vue";
// import CommentEdit from "viz/meta-overview/comment-edit.vue";
import FilterSample from "viz/meta-overview/filter-sample.vue";
import MetaInfo from "viz/meta-overview/meta-info.vue";
import ReorderSample from "viz/meta-overview/reorder-sample.vue";
import Reorder from "viz/meta-overview/reorder.vue";

Vue.component("reorder", Reorder);
Vue.component("filter-species", FilterSpecies);
// Vue.component("comment-edit", CommentEdit);
Vue.component("reorder-sample", ReorderSample);
Vue.component("filter-sample", FilterSample);
Vue.component("color-picker", ColorPicker);
Vue.component("section-files", SectionFiles);
Vue.component("reorder-species", ReorderSpecies);
Vue.component("meta-info", MetaInfo);

function initVApp() {
    if (document.getElementById("vapp")) {
        const vapp = new Vue({
            el: document.getElementById("vapp"),
            render: h => h(VApp),
        });
    }
}

document.addEventListener("turbolinks:load", initVApp);
document.addEventListener("DOMContentLoaded", initVApp);
