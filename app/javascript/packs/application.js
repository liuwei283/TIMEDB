import 'bootstrap';
import Vue from 'vue';
import $ from 'jquery';
import VJstree from 'vue-jstree';
import uploader from 'vue-simple-uploader';

window.jQuery = $;
window.gon = window.gon || {};

Vue.use(VJstree);
Vue.use(uploader);
const ALERT_TIMEOUT = 5000;

import JobSubmit from '../job-submit.vue';
import JobQuery from '../job-query.vue';
import JobSubmitPipeline from "../job-submit-pipeline.vue";
//import editorTest from "../vapp-database.vue";

import VApp from "page/vapp.vue";

// import EditText from "oviz-components/edit-text-vue.vue";
import FilterSamplesBind from "oviz-components/filter-samples-bind.vue";

import ColorPicker from "page/builtin/color-picker.vue";
import SectionFiles from "page/builtin/section-files.vue";
import FilterSamples from "viz/fmt-overview/filter-samples.vue";
import ReorderSpecies from "viz/fmt-overview/reorder-species.vue";
import MetaInfo from "viz/meta-overview/meta-info.vue";
import ReorderSample from "viz/meta-overview/reorder-sample.vue";
import Reorder from "viz/meta-overview/reorder.vue";
import { registerDefaultEditorConfig } from "utils/editor";

Vue.component("reorder", Reorder);
Vue.component("filter-samples", FilterSamples);
Vue.component("filter-samples-bind", FilterSamplesBind);
Vue.component("reorder-sample", ReorderSample);
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
        registerDefaultEditorConfig();
    }
}

document.addEventListener("turbolinks:load", initVApp);
document.addEventListener("DOMContentLoaded", initVApp);

document.addEventListener('DOMContentLoaded', (event) =>  {
    const vueLoadList = [
        ['#vapp-job-submit', JobSubmit],
        ['#vapp-job-query', JobQuery],
        ['#vapp-job-submit-pipeline', JobSubmitPipeline],
        //['#vapp-database', editorTest],
    ];

    $('[data-toggle="tooltip"]').tooltip({
        html:true,
        container: 'body',

    });
    $('[data-toggle="popover"]').popover({
        html:true,
        container: 'body',
    });
    //$('.selectpicker').selectpicker();
    $('.carousel').carousel();


    $('#alerts .alert-group').each((i, el) => {
        const alertGroup = $(el);
        const bar = alertGroup.find('.progress-bar');

        alertGroup.find('.close').on('click', () => {
            alertGroup.slideUp(300);
        });

        bar.css('width', '100%');
        setTimeout(() => {
            alertGroup.slideUp(300);
        }, ALERT_TIMEOUT);
    });

    vueLoadList.forEach(([selector, component, props = {}]) => {
        const el = document.querySelector(selector);
        if (!el) return;
        const _ = new Vue({
            el,
            render: h => h(component, { props }),
        });
    });

    $('#alerts .alert-group').each((i, el) => {
        const alertGroup = $(el);
        const bar = alertGroup.find('.progress-bar');

        alertGroup.find('.close').on('click', () => {
            alertGroup.slideUp(300);
        });

        bar.css('width', '100%');
        setTimeout(() => {
            alertGroup.slideUp(300);
        }, ALERT_TIMEOUT);
    });

});


