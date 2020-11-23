import Oviz from "crux"
import {Demo} from "viz"
import {copyObject} from "utils/object"


function init() {
    // get the visualization options of Demo
    const viz = Demo.initViz();
    console.log("hello packs")
    const vizOpts = copyObject(viz.vizOpts);

    // set the canvas container
    vizOpts.el = "#canvas";

    // init the oviz visualizer, draw the chart
    const {visualizer} = Oviz.visualize(vizOpts);
}

document.addEventListener("turbolinks:load",init);