document.addEventListener('DOMContentLoaded', () => {
    all_viz();
});
catch_change();

import { data } from "jquery";
// export function selector(sid, slt_data, selector_name) {
//     var slt = document.createElement("select");
//     slt.className = "form-select col";
//     slt.id = sid;
//     if (selector_name != null) {
//         slt.name = selector_name;
//     }
    
// }


// export function construct_block(Bid, block_data) {
//     var block_div = document.createElement("div");
//     block_div.className = "container Block";
//     block_div.id = Bid;

//     var keys = Object.keys(block_data);
//     var contentsType = keys[0];
//     var selects = block_data[key];
//     var num_of_contents = key.length;
//     var i = 0;

//     // create text description/header
//     if (key[0] == "H") {
//         var cid = "H" + Bid;
//         var head_block = document.createElement("div");
//         head_block.id = cid;
//         head_block.className = "row description";
//         block_div.appendChild(head_block);
//         key = key.substring(1);
//         num_of_content -= 1;
//     }

//     // first create selector row - a div block
//     var slt_row = document.createElement("div");
//     slt_row.className = "select_bar form_inline row";
//     var num_of_selectors = selects.length;

//     //create selector elements
//     for (var j = 0; j < num_of_selectors; j++) {
//         var sblock = document.createElement("div");
//         var stitle = document.createElement("div");
//         var selectbox = selects[j]['select']
//         sblock.className = "sdiv col";
//         stitle.className = "select_title"
//         stitle.innerHTML = selects[j]['title'];
//         var sid = 'S' + j + Bid;
//         var selector_name = null;
//         if (selects[j].hasOwnProperty('name')) {
//             selector_name = selects[j]['name'];
//         }
//         var slt = selector(sid, selectbox, selector_name);//make the jth select box


//     }



// }





// export function makeHTMLframe(body) {
//     var nBlock = struct_data.length;
//     for (var i = 0; i < nBlock; i++) {
//         var id = "B" + i;
//         var B = construct_block(id, struct_data[i]);
//         body.appendChild(B);
//     }
// }


import {init as immunelandscape} from "viz/static_ProjectImmuneSubtype"
import {init as immunebar} from "viz/static_ImmuneCell"
import {init as immuneline} from "viz/static_SurvivalLine"
import {init as immuneRegulator} from "viz/static_immuneRegulators"



var data_path = "/public/data/";
var project_name = window.gon.project_name
var cancer_type = window.gon.cancer_type

export function landscape_viz() {
    //var subtype_method_selector = document.getElementById("landscape_method_selector");
    //var selected_method = subtype_method_selector.value;
    var clinical_file_path = data_path + "Clinical/sample/Clinical_" + project_name + ".csv";
    var subtype_file_path = data_path + "subtype/c1_c6/project/" + project_name + "_c1_c6.csv";
    //var clinical_file_path = data_path + "Clinical/ClinicalDataTest.csv"
    //var subtype_file_path = data_path + "subtype/projectSubtypeSurvival.csv"
    immunelandscape("#landscapeVis", subtype_file_path, clinical_file_path);
}

export function bar_viz() {
    var subtype_method_selector = document.getElementById("bar_method_selector");
    var selected_method = subtype_method_selector.value;
    var cellData_file_path = data_path + "cell_data/" + selected_method + "/" + project_name + "_" + selected_method + ".csv";
    var subtype_file_path = data_path + "subtype/c1_c6/project/" + project_name + "_c1_c6.csv";
    //var cellData_file_path = data_path + "cell_data/CellData.csv";
    //var subtype_file_path = data_path + "subtype/immuneCell.csv";
    immunebar("#barVis", subtype_file_path, cellData_file_path);//remember to change to the right plot

}

export function line_viz() {
    var clinical_file_path = data_path + "Clinical/sample/Clinical_" + project_name + ".csv"
    var subtype_file_path = data_path + "subtype/c1_c6/project/" + project_name + "_c1_c6.csv";
    //var clinical_file_path = data_path + "Clinical/ClinicalDataTest.csv"
    //var subtype_file_path = data_path + "subtype/projectSubtypeSurvival.csv"
    immuneline("#lineVis", subtype_file_path, clinical_file_path);
}

export function regulator_viz() {
    var subtype_file_path = data_path + "subtype/c1_c6/project/" + project_name + "_c1_c6.csv";
    var rna_file_path = data_path + "immuneregulator/immuReg_" + project_name + ".csv";

    //var rna_file_path = "/public/data/RNA/regulator_RNAdata.csv"
    //var subtype_file_path = "/public/data/subtype/regulator_subtype.csv"

    immuneRegulator("#regulatorVis", subtype_file_path, rna_file_path);
    
}

export function all_viz() {
    landscape_viz();
    bar_viz();
    line_viz();
    regulator_viz();
}

export function catch_change(){
    $('#landscape_method_selector').on('change', function() {
        landscape_viz();
    });

    $('#bar_method_selector').on('change', function() {
        landscape_viz();//remember to change to the right plot
    });

}