var struct_data = [
    {"HTV": [{
        "BMI": "BMI_pie",
        "host age": "age_pie",
        "sex": "sex_pie",
        "country": "country_pie" 
        }]
    },
    {"HV": [{
        "CRC": "CRC"
        },
        {
        "species": "species"
        }]
    },
    {"HV": []

    }
];

var head_relation = {
    "pie": "pie",
    "boxplot": "boxplot",
    "tree": "tree"
};

var table_relation = {
    "BMI_pie": "pie1",
    "age_pie": "pie2",
    "sex_pie": "pie3",
    "country_pie": "pie4"
};

var viz_relation = {
    "BMI_pie": "dn1",
    "age_pie": "dn2",
    "sex_pie": "dn3",
    "country_pie": "dn4",
    "CRC_species": "bp1",
    "tree1": "tr1"
};

var text_relation = {

};

var des_data = {
    "pie": "<p> this is the description for this pie chart</p>",
    "boxplot": "<p> this is the description for this boxplot</p>",
    "tree": "<p> this is the description for this tree </p>",

};

var viz_data = {
    "dn1" : {
        "type": "donghnut",
        "file": ["/data/static_viz_data/BMI.stat.csv"],
        "config": {"title": "BMI distribution"}
    },
    "dn2": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/host_age.stat.csv"],
        "config": {"title": "age distribution"}
    },
    "dn3": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/sex.stat.csv"],
        "config": {"title": "sex distribution"}
    },
    "dn4": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/country.stat.csv"],
        "config": {"title": "samples in different country", "xlabel": "country", "ylabel": "number"}
    },
    "bp1": {
        "type": "boxplot",
        "file": ["/data/static_viz_data/species.profile.tsv"],
        "config": {}
    },
    "tr1": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/YuJ_2015.anno.tsv", "matrix":"/data/static_viz_data/YuJ_2015.CRC-HC.wilcox.test.tsv", "tree":"/data/static_viz_data/YuJ_2015.tsv"},
        "config": {}
    }
};

var text_data = {

};

var table_data = window.gon.table_data;


var init_data = {
    "T0B0": "BMI_pie",
    "V1B0": "BMI_pie",
    "V0B1": "CRC_species",
    "V0B2": "tree1",
    "HB0": "pie",
    "HB1": "boxplot",
    "HB2": "tree"
};

var relation_data = {
    "v": viz_relation,
    "t": table_relation,
    "x": text_relation,
    "h": head_relation
};

var content_data = {
    "v": viz_data,
    "t": table_data,
    "x": text_data,
    "h": des_data
}

export var data = {
    "struct": struct_data,
    "init": init_data,
    "relation": relation_data,
    "content": content_data
}
