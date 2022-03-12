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


import {init as immunebar} from "viz/static_immunebar"
import {init as immunepie} from "viz/static_immunePie"
import {init as immunelandscape} from "viz/static_immuneSubtypeLandscape"
import {init as immuneRegulator} from "viz/static_immuneRegulators"

var data_path = "/public/data/";

export function bar_viz() {
    // var bar_selector = document.getElementById("bar-selector");
    // var selected_value = bar_selector.value;
    // var file_path = data_path + selected_value + "_samples.tsv";
    // immunebar("#barVis", file_path);
}

export function pie_viz() {
    // var pie_method_selector = document.getElementById("pie_method_selector");
    // var method = pie_method_selector.value;
    // var pie_project_selector = document.getElementById("pie_project_selector");
    // var pname = pie_project_selector.value;

    // //method name must be same as data storage folder
    // var file_path = data_path + "cell_data/" + method + "/" + pname + "_" + method + ".csv";
    // immunepie("#pieVis", file_path);
}

export function landscape_viz() {
    // var selected_cancer = document.getElemetById("landscape_cancer_selector").value;
    // if (selected_cancer == "all") {
    //     var file_path = data_path + "subtype/" + "C1-C6_TCGA_all.csv"; 
    // }
    // else {
    //     var file_path = data_path + "subtype/cancer/" + selected_cancer + "_C1-C6.csv";
    // }
    var file_path = "/public/data/subtype/c1_xcell.csv"
    immunelandscape("#landscapeVis", file_path);
}

export function regulator_viz() {
    var regulator_project_selector = document.getElementById("regulator_project_selector");
    var pname = regulator_project_selector.value;

    //var subtype_file_path = data_path + "subtype/C1-C6/" + pname + "_C1-C6.csv";
    //var rna_file_path = data_path + "RNA/visualization/" + pname + ".csv";
    var rna_file_path = "/public/data/RNA/regulator_RNAdata.csv"
    var subtype_file_path = "/public/data/subtype/regulator_subtype.csv"
    
    immuneRegulator("#regulatorVis", subtype_file_path, rna_file_path);
}

export function all_viz() {
    //bar_viz();
    //pie_viz();
    //landscape_viz();
    regulator_viz();
}

export function initPage() {
    all_viz();
}

export function catch_change(){

    // $("#pie_cancer_selector").on('change', function(){
    //     $.ajax({
    //         //url: '@(Url.Action("refreshSelector","database"))',
    //         url: "/database/refreshSelector",
    //         type: "GET",
    //         data: {cancer_id: $(this).val()},
    //         success: function(data) {
    //             $("#pie_project_selector").children().remove();
    //             var listItems = [];
    //             $.each(data, function(index, item) {
    //                 console.log(item)
    //                 var pname = item["name"];
    //                 listItems += '<option value = "' + pname + '">' + pname + '</option>'; 
    //             });
    //             $("#pie_project_selector").append(listItems);
    //             $("#pie_project_selector").selectedIndex = 0; //Option 10
    //         }
    //     })
    // });

    // $('.pie_react').on('change', function() {
    //     pie_viz();
    // });


    // // catch changes for bar plot
    // $('#bar-selector').on('change', function() {
    //     console.log("debug");
    //     bar_viz();
    //     var file_name = document.getElementById("bar-selector").value + "_samples.tsv";
    //     document.getElementById("bar_download").setAttribute("download", file_name);
    //     document.getElementById("bar_download").setAttribute("href", "/data/sample_num/" + file_name);

    // });

    
    $('#regulator_project_selector').on('change', function() {
        regulator_viz();
    });




    $("#regulator_cancer_selector").on('change', function(){
        $.ajax({
            //url: '@(Url.Action("refreshSelector","database"))',
            url: "/database/refreshSelector",
            type: "GET",
            data: {cancer_id: $(this).val()},
            success: function(data) {
                $("#regulator_project_selector").children().remove();
                var listItems = [];
                $.each(data, function(index, item) {
                    console.log(item)
                    var pname = item["name"];
                    listItems += '<option value = "' + pname + '">' + pname + '</option>'; 
                });
                $("#regulator_project_selector").append(listItems);
                $("#regulator_project_selector").selectedIndex = 0; //Option 10
            }
        })
    });

    // catch changes for landcape plot
    // $('.landscape_selector').on('change', function() {
    //     landscape_viz();
    // });

}