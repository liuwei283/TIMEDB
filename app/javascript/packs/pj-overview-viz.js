document.addEventListener('DOMContentLoaded', () => {
    landscape_viz();
});
catch_change();

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

var data_path = "/data/";

export function bar_viz() {
    var bar_selector = document.getElementById("bar-selector");
    var selected_value = bar_selector.value;
    var file_path = data_path + selected_value + "_samples.tsv";
    immunebar("#barVis", file_path);
}

export function pie_viz() {
    var pie_method_selector = document.getElementById("pie_method_selector");
    var method = pie_method_selector.value;
    var pie_project_selector = document.getElementById("pie_project_selector");
    var pname = pie_project_selector.value;

    //method name must be same as data storage folder
    var file_path = data_path + "cell_data/" + method + "/" + pname + "_" + method + ".csv";
    immunepie("#pieVis", file_path);
}

export function landscape_viz() {
    var subtype_method_selector = document.getElementById("subtype_method_selector");
    var selected_method = subtype_method_selector.value;
    if (selected_method == "TIMEDB") {
        var selected_method = document.getElementById("TIMEDB_selector").value;
    }
    else {
        document.getElementById("TIMEDB_selector").disabled = true;
    }
    var selected_cancer = document.getElemetById("landscape_cancer_selector").value;
    if (selected_cancer == "all") {
        var file_path = data_path + "subtype/" + selected_method + "/" + selected_method + "_TCGA_all.csv"; 
    }
    else {
        var file_path = data_path + "subtype/" + selected_method + "/cancer/" + selected_cancer + "_" + selected_method + ".csv";
    }
    immunelandscape("#landscapeVis");
}

export function all_viz() {
    bar_viz();
    pie_viz();
    landscape_viz();
}

export function initPage() {
    all_viz();
}

export function catch_change(){

    // $("#pie_cancer_selector']").click(function(){
    //     var url = '/get_drop_down_options?category_id=' + $(this).val()
    //     $("#group").removeOption(/./)
    //     $.get(url, function(data) {
    //       $('#group').addOption(data, false);
    //     });
    //   });

    //   $("#pie_cancer_selector").on('change', function(){
    //     var url = '/get_drop_down_projects?cancer_id=' + $(this).val()
    //     $("#pie_project_selector").removeOption(/./)
    //     $.get(url, function(data) {
    //       $('#pie_project_selector').addOption(data, false);
    //     });
    // });


    // catch changes for pie plot
    $("#pie_cancer_selector").on('change', function(){
        $.ajax({
            //url: '@(Url.Action("refreshSelector","database"))',
            url: "/database/refreshSelector",
            type: "GET",
            data: {cancer_id: $(this).val()},
            success: function(data) {
                $("#pie_project_selector").children().remove();
                var listItems = [];
                $.each(data, function(index, item) {
                    console.log(item)
                    var pname = item["name"];
                    listItems += '<option value = "' + pname + '">' + pname + '</option>'; 
                });
                $("#pie_project_selector").append(listItems);
                $("#pie_project_selector").selectedIndex = 0; //Option 10
            }
        })
    });

    $('.pie_react').on('change', function() {
        pie_viz();
    });


    // catch changes for bar plot
    $('#bar-selector').on('change', function() {
        console.log("debug");
        bar_viz();
        var file_name = document.getElementById("bar-selector").value + "_samples.tsv";
        document.getElementById("bar_download").setAttribute("download", file_name);
        document.getElementById("bar_download").setAttribute("href", "/data/sample_num/" + file_name);

    });

    // catch changes for landcape plot
    $('.landscape_selector').on('change', function() {
        landscape_viz();
    });


    // $('select').on('change', function() {
    //     //console.log(data);
    //     var struct_data = data["struct"];
    //     var relation_data = data["relation"];
    //     var content_data = data["content"];
    //     var bro = this.parentElement.parentElement.children;
    //     //console.log(bro);
    //     var outer_block = this.parentElement.parentElement.parentElement;
    //     var nbro = bro.length;
    //     //console.log(nbro);
    //     var new_k = "";
    //     for (var i=0; i<nbro; i++){
    //         if (i>0){
    //             new_k += "_";
    //         }
    //         //console.log('string' + new_k);
    //         new_k += bro[i].children[1].value;  
    //         //console.log(bro[i].children);
    //     }
    //     //console.log(new_k);
    //     var B_i = parseInt(outer_block.id[1]);
    //     //console.log(B_i);
    //     //console.log(struct_data[B_i]);
    //     var type_key = Object.keys(struct_data[B_i])[0];
    //     //console.log(type_key);
    //     var ntype = type_key.length;
    //     if(type_key[0]=="H"){
    //         ntype -= 1;
    //         type_key = type_key.substring(1);
    //     }
        
    //     //console.log(type_key);
    //     for (var i=0; i<ntype; i++){
    //         var cid = type_key[i] + i + outer_block.id;
    //         console.log(cid);
    //         fillinblock(cid, new_k, relation_data, content_data);
    //     }
    //     if (Object.keys(struct_data[B_i])[0].includes("T")){
    //         assign_tb_style(tids);
    //     }
                
    // });


}