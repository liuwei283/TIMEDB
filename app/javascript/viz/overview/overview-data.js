var struct_data = [
    {"HTV": [{
        "BMI": "BMI_pie",
        "age": "age_pie",
        "sex": "sex_pie",
        "country": "country_pie",
        "phenotype": "phenotype_pie"

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
    "BMI_pie": "BMI",
    "age_pie": "age",
    "sex_pie": "sex",
    "country_pie": "country",
    "phenotype_pie": "phenotype"
};

var viz_relation = {
    "BMI_pie": "dn1",
    "age_pie": "dn2",
    "sex_pie": "dn3",
    "country_pie": "dn4",
    "phenotype_pie": "dn5",
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
        "file": ["/data/static_viz_data/pie_HMGDB_bmi_class.tsv"],
        "config": {"title": "BMI distribution", "xlabel": "BMI", "ylabel": "number"}
    },
    "dn2": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_HMGDB_age_class.tsv"],
        "config": {"title": "age distribution", "xlabel": "age", "ylabel": "number"}
    },
    "dn3": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_GMREPO_sex.tsv"],
        "config": {"title": "sex distribution", "xlabel": "sex", "ylabel": "number"}
    },
    "dn4": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_GMREPO_country.tsv"],
        "config": {"title": "samples in different country", "xlabel": "country", "ylabel": "number"}
    },
    "dn5": {
        "type": "donghnut",
        "file": ["/data/static_viz_data/pie_GMREPO_phenotype_v.tsv"],
        "config": {"title": "phenotype distribution", "xlabel": "phenotype", "ylabel": "number"}
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
