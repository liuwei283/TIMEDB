import {initPage, catch_change} from "viz/overview";

var struct_data = [
    {"tv": [
        {"gtype":["histo", "histo"]}, 
        {"dtype":["test1","test2"]} 
    ]},
    {"v": [
        {"g1type":["histo", "histo"]}, 
        {"d1type":["test1","test2"]} 
    ]}
];

var table_data = window.gon.table_data;
var viz_relation = {
    "dir": "/data/static_viz_data/",
    "histo_test1": "histo_test1.csv",
    "histo_test2": "histo_test2.csv"
};

var table_relation = {
    "histo_test1": "histo_test1",
    "histo_test2": "histo_test2"
};

var relation_data = {
    "v": viz_relation,
    "t": table_relation
}


var init_data = {
    "B0t0": "histo_test1",
    "B0v1": "histo_test1",
    "B1v0": "histo_test1"
};


var main_id = "main";


// init state (show first table and graph)
document.addEventListener('DOMContentLoaded',initPage(main_id, struct_data, relation_data, init_data, table_data));
catch_change(struct_data, relation_data, table_data);