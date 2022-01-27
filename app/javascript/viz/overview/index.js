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
//import {init as immunepie} from "viz/static_immunepie"

var overview_path = "/data/overview/";

export function bar_viz() {
    var bar_selector = document.getElementById("bar-selector");
    var selected_value = bar_selector.value;
    var file_path = overview_path + selected_value + "_samples.tsv";
    immunebar("#barVis", file_path);
}

// export function pie_viz() {
//     var pie_method_selector = document.getElementById("pie-method-selector");
//     var method = pie_method_selector.value;
//     var pie_project_selector = document.getElementById("pie-project-selector");
//     var pname = pie_project_selector.value;

//     //method name must be same as data storage folder
//     var file_path = overview_path + "Cell data/" + method + "/" + pname + "_CIBERSORT.csv";
//     immunepie("pieVis", file_path);
// }

export function all_viz() {
    bar_viz();
    //pie_viz();
}

export function initPage() {
    //all_viz();
}

export function catch_change(){

    // $("#pie-cancer-selector").on('change', function(){
    //     $ajax({
    //         url: "refreshSelector",
    //         type: "GET",
    //         data: {cancer_type: $(this).val()},
    //         success: function(data) {
    //             $("#pie-project-selector").children().remove();
    //             var listItems = [];
    //             $.each(data, function(index, item) {
    //                 pname = item["name"];
    //                 listItems += '<option value = "' + pname + '">' + pname + '</option>'; 
    //             });
    //             $("#pie-project-selector").append(listItems);
    //             $("#pie-project-selector").selectedIndex = 0; //Option 10
    //         }
    //     })
    // });


    
    //note pie visualization refresh mush be with the change of project selector

    $('#bar-selector').on('change', function() {
        console.log("debug");
        //bar_viz();
        var file_name = document.getElementById("bar-selector").value + "_samples.tsv";
        document.getElementById("bar_download").setAttribute("download", file_name);
        document.getElementById("bar_download").setAttribute("href", "/data/overview/" + file_name);

    });


    // $('.pie-react').on('change', function() {
    //     pie_viz();
    // });

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