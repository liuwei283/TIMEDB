//import "viz/world-map";
import {initPage, catch_change} from "viz/overview";
import {data} from "viz/overview/overview-data.js"

var tids = "#tT0B0";

function init(tids){
    var main_id = "main";
    //initPage(main_id, data, tids);
    //$('#othersIcon').popover({placement :'top', target: "click",});

    $('#othersIcon').popover({
        placement : 'right', //placement of the popover. also can use top, bottom, left or     right
        html: 'true', //needed to show html of course
        //content : getPopoverContent(this)// hope this should be link
    });


}


$(function () { 
    $('#othersIcon').popover({
        placement : 'right', //placement of the popover. also can use top, bottom, left or     right
        html: 'true', //needed to show html of course
        //content : getPopoverContent(this)// hope this should be link
    });
    
} );
// init state (show first table and graph)
//document.addEventListener('DOMContentLoaded', init(tids));
//catch_change(data, tids);

$(document).ready(function() {
    $('#othersIcon').popover({
        placement : 'right', //placement of the popover. also can use top, bottom, left or     right
        html: 'true', //needed to show html of course
        //content : getPopoverContent(this)// hope this should be link
    });
    
  });


$('#othersIcon').popover({
    placement : 'right', //placement of the popover. also can use top, bottom, left or     right
    html: 'true', //needed to show html of course
    //content : getPopoverContent(this)// hope this should be link
});

function getPopoverContent(this)
{
    return '<div id="popOverBox"><img src="module.jpg" width="251" height="201" /></div>'
}

