import 'bootstrap';

import TurbolinksAdapter from 'vue-turbolinks';
import Vue from 'vue';
import $ from 'jquery';
import VJstree from 'vue-jstree';
import uploader from 'vue-simple-uploader';
window.jQuery = $;
window.gon = window.gon || {};

Vue.use(TurbolinksAdapter);
Vue.use(VJstree);
Vue.use(uploader);
const ALERT_TIMEOUT = 5000;

import JobSubmit from '../job-submit.vue';
import JobQuery from '../job-query.vue';

document.addEventListener('turbolinks:load', () => {
    const vueLoadList = [
        ['#vapp-job-submit', JobSubmit],
        ['#vapp-job-query', JobQuery],
    ];

    $('[data-toggle="tooltip"]').tooltip();



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
