var struct_data = [
    {"TV": [{
        "BMI": "BMI_hist",
        "host age": "age_hist",
        "sex": "sex_hist",
        "country": "country_hist" 
        }]
    },
    {"V": [{
        "CRC": "CRC"
        },
        {
        "species": "species"
        }]
    },
    {"V": []

    }
];

var table_relation = {
    "BMI_hist": "hist1",
    "age_hist": "hist2",
    "sex_hist": "hist3",
    "country_hist": "hist4"
};

var viz_relation = {
    "BMI_hist": "dn1",
    "age_hist": "dn2",
    "sex_hist": "dn3",
    "country_hist": "dn4",
    "CRC_species": "bp1",
    "tree1": "tr1"
};

var text_relation = {

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
    "T0B0": "BMI_hist",
    "V1B0": "BMI_hist",
    "V0B1": "CRC_species",
    "V0B2": "tree1"
};

var relation_data = {
    "v": viz_relation,
    "t": table_relation,
    "x": text_relation
};

var content_data = {
    "v": viz_data,
    "t": table_data,
    "x": text_data
}

export var data = {
    "struct": struct_data,
    "init": init_data,
    "relation": relation_data,
    "content": content_data
}
