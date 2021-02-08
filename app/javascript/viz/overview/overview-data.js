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
        }]

    },

    {"HV": [{
        "CRC": "CRC"
        },
        {
        "species": "species"
        }]
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
    "pie": "<h2> Sample metadata statistic </h2>",
    "boxplot": "<h2> Diseases related taxonomy details</h2>",
    "tree": "<h2> Diseases related taxonomy overview </h2>",

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
    "V0B1": "tree1",
    "V0B2": "CRC_species",
    "HB0": "pie",
    "HB1": "tree",
    "HB2": "boxplot"
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
