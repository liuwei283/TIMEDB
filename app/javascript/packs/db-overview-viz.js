import {initPage, catch_change} from "viz/overview";
//import {data} from "viz/overview/overview-data.js"


function init(tids){
    var main_id = "main";
    //initPage(main_id, data, tids);
}

// init state (show first table and graph)
document.addEventListener('DOMContentLoaded', init());
catch_change(data);
