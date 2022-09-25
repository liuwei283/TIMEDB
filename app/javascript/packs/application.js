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
import DemoQuery from '../demo-query.vue';

import JobSubmitPipeline from "../job-submit-pipeline.vue";
import databaseOverview from "../vapp-database.vue";
import projectFraction from "../pj-show-fraction";
import projectSubtype from "../pj-show-subtype";
import tutorial from '../tutorial.vue';
import tutorial_analysis from '../tutorial_analysis.vue';

import VApp from "page/vapp.vue";

// import EditText from "oviz-components/edit-text-vue.vue";
import FilterSamplesBind from "oviz-components/filter-samples-bind.vue";
import FilterSamples from "oviz-components/filter-samples.vue";

import ColorPicker from "page/builtin/color-picker.vue";
import SectionFiles from "page/builtin/section-files.vue";



import { registerDefaultEditorConfig } from "utils/editor";

Vue.component("filter-samples", FilterSamples);
Vue.component("filter-samples-bind", FilterSamplesBind);
Vue.component("color-picker", ColorPicker);
Vue.component("section-files", SectionFiles);



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
        ['#vapp-database', databaseOverview],
        ['#pj_subtype', projectSubtype],
        ['#pj_fraction', projectFraction],
        ['#tutorial',tutorial],
        ['#vapp-demo-query', DemoQuery],
        ['#tutorial_analysis',tutorial_analysis],

        

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

    $('.sidebar-toggle').on('click', () => {
        $(document.getElementById("sidebar")).toggleClass('active');

    });
    $('.sidebar-tutorial-toggle').on('click', () => {
        $("#side-tutorial-bar").toggleClass('active');
        $("#arrow").toggleClass('fa-angle-up fa-angle-down');

    });
    $('.sidebar-tutorial-toggle-1').on('click', () => {
        $("#side-tutorial-bar-1").toggleClass('active');
        $("#arrow-1").toggleClass('fa-angle-up fa-angle-down');

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

    if($('#dark').length){
        //all
        $('#topbar').toggleClass('dark bg-light navbar-light dark-head        ');
        $('#state_now').toggleClass('fa-sun fa-moon');
        $('.container').toggleClass('text-light');
        $('#wrapper').css('background-color','#333');
        $('section').toggleClass('dark text-light');
        $(':header').css('color',"#86E5E9");
        $(".col-md-2 h4 ").css('color',"#fff");
        $('.footer.page-footer').css('background','#86E5E9');

        //home
        $('.heading').css("background-image","url('assets/welcomeBGImagedark.png')");
        $('i.fa.fa-chevron-down').css('color',"#86E5E9");
        $('span.em').css('color',"#86E5E9");
        $('h5.text-left').css('color',"#86E5E9");
        $('h5.text-right').css('color',"#cc4f78");
        //work space
        $('#dataset_list').css('background-color','#333');
        $('#job-query').css('background-color','#333');
        $('.query-card').css('background-color','#333');
        // //Analysis visualization
        $('#sidebar').css('background-color','#333');
        $('#run-app').css('background-color','#333');

        // //admin/analysis_categories
        // $('.card').css('background-color','#343a40');
        // $('.sortable-list > .list-group-item').css('background-color','#3b3b3b');
        $('.ov-number').css('color',"#86E5E9");
        $('#collapseButton').css('background-color',"#86E5E9");
        $('#collapseButton').css("box-shadow","none");
        $('.popup').css('background-color',"#333");

        $('.card').css('background-color',"#343a40");
        $('.list-group-item').css('background-color',"#6c757d");
        $('#pj_table').toggleClass('dark-table');
        $('#ct_table').toggleClass('dark-table');
        $('#tk_table').toggleClass('dark-table');

    };
    $('.cookies-eu-button').on('click', () => {
        $('#cookies-eu-banner').css("display", "None")
    })

});



