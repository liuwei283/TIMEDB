import 'bootstrap';

import TurbolinksAdapter from 'vue-turbolinks';
import Vue from 'vue';
import $ from 'jquery';
window.jQuery = $;
window.gon = window.gon || {};

Vue.use(TurbolinksAdapter);
const ALERT_TIMEOUT = 5000;

import TC from '../database-tc.vue';
import FC from '../database-fc.vue';
import AA from '../database-aa.vue';

document.addEventListener('turbolinks:load', () => {
    const vueLoadList = [
        ['#vapp-database-tc', TC, { type: 'module' }],
        ['#vapp-database-fc', FC, { type: 'module' }],
        ['#vapp-database-aa', AA, { type: 'module' }],
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

    if (localStorage.getItem(DOAP_COLLAPSE_SIDEBAR_KEY) === '1') {
        setSidebarCollapsed(true);
    }
});
