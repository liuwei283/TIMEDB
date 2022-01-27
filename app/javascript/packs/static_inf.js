import {init} from "viz/static_method_immunePie"
var path = window.gon.file;
var id = '#viz_sample_inf';

document.addEventListener('DOMContentLoaded', init(id, path));