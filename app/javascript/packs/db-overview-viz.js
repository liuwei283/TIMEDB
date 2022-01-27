import {initPage, catch_change} from "viz/overview";
//import {data} from "viz/overview/overview-data.js"


function init(){
    initPage();
}

// init state (show first table and graph)
document.addEventListener('DOMContentLoaded', init());
catch_change();
