import {initPage, catch_change} from "viz/overview";
import {data} from "viz/overview/overview-data.js"


function init(tids){
    initPage(data);
}

// init state (show first table and graph)
document.addEventListener('DOMContentLoaded', init());
catch_change(data);
