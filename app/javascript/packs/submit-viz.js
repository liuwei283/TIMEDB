import "viz/signed-heatmap";
import "viz/discrete-heatmap";
import Vue from "vue"
import VizApp from "page/viz-app.vue"

function initVizApp() { 
    if(document.getElementById("vizApp")) {
        const vapp = new Vue({
            el: document.getElementById("vizApp"),
            render: h=> h(VizApp)
        });
    }
}


document.addEventListener("turbolinks:load",initVizApp);
document.addEventListener("DOMContentLoaded", initVizApp);
