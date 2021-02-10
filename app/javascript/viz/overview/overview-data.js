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
        "Adenoma": "D000236",
        "Arthritis, Rheumatoid": "D001172",
        "Behcet Syndrome": "D001528",
        "Breast Neoplasms": "D001943",
        "Colitis, Ulcerative": "D003093",
        "Crohn Disease": "D003424",
        "Diabetes Mellitus, Type 1": "D003922",
        "Diabetes Mellitus, Type 2": "D003924",
        "Hypertension": "D006973",
        "Infant, Premature": "D007234",
        "Melanoma": "D008545",
        "Obesity": "D009765",
        "Prediabetic State": "D011236",
        "Short Bowel Syndrome": "D012778",
        "Spondylitis, Ankylosing": "D013167",
        "Tuberculosis": "D014376",
        "Uveomeningoencephalitic Syndrome": "D014607",
        "Colorectal Neoplasms": "D015179",
        "Inflammatory Bowel Diseases": "D015212",
        "Diabetes, Gestational": "D016640",
        "Pregnant Women": "D037841",
        "Overweight": "D050177",
        "Non-alcoholic Fatty Liver Disease": "D065626"
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
    "D000236": "D000236",
    "D001172": "D001172",
    "D001528": "D001528",
    "D001943": "D001943",
    "D003093": "D003093",
    "D003424": "D003424",
    "D003922": "D003922",
    "D003924": "D003924",
    "D006973": "D006973",
    "D007234": "D007234",
    "D008545": "D008545",
    "D009765": "D009765",
    "D011236": "D011236",
    "D012778": "D012778",
    "D013167": "D013167",
    "D014376": "D014376",
    "D014607": "D014607",
    "D015179": "D015179",
    "D015212": "D015212",
    "D016640": "D016640",
    "D037841": "D037841",
    "D050177": "D050177",
    "D065626": "D065626",
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
    "D000236": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D000236_anno.tsv", "matrix":"/data/static_viz_data/tree_D000236_test.tsv", "tree":"/data/static_viz_data/tree_D000236_abd.tsv"},
        "config": {}
    },
    "D001172": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D001172_anno.tsv", "matrix":"/data/static_viz_data/tree_D001172_test.tsv", "tree":"/data/static_viz_data/tree_D001172_abd.tsv"},
        "config": {}
    },
    "D001528": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D001528_anno.tsv", "matrix":"/data/static_viz_data/tree_D001528_test.tsv", "tree":"/data/static_viz_data/tree_D001528_abd.tsv"},
        "config": {}
    },
    "D001943": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D001943_anno.tsv", "matrix":"/data/static_viz_data/tree_D001943_test.tsv", "tree":"/data/static_viz_data/tree_D001943_abd.tsv"},
        "config": {}
    },
    "D003093": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D003093_anno.tsv", "matrix":"/data/static_viz_data/tree_D003093_test.tsv", "tree":"/data/static_viz_data/tree_D003093_abd.tsv"},
        "config": {}
    },
    "D003424": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D003424_anno.tsv", "matrix":"/data/static_viz_data/tree_D003424_test.tsv", "tree":"/data/static_viz_data/tree_D003424_abd.tsv"},
        "config": {}
    },
    "D003922": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D003922_anno.tsv", "matrix":"/data/static_viz_data/tree_D003922_test.tsv", "tree":"/data/static_viz_data/tree_D003922_abd.tsv"},
        "config": {}
    },
    "D003924": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D003924_anno.tsv", "matrix":"/data/static_viz_data/tree_D003924_test.tsv", "tree":"/data/static_viz_data/tree_D003924_abd.tsv"},
        "config": {}
    },
    "D006973": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D006973_anno.tsv", "matrix":"/data/static_viz_data/tree_D006973_test.tsv", "tree":"/data/static_viz_data/tree_D006973_abd.tsv"},
        "config": {}
    },
    "D007234": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D007234_anno.tsv", "matrix":"/data/static_viz_data/tree_D007234_test.tsv", "tree":"/data/static_viz_data/tree_D007234_abd.tsv"},
        "config": {}
    },
    "D008545": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree__anno.tsv", "matrix":"/data/static_viz_data/tree_D008545_test.tsv", "tree":"/data/static_viz_data/tree_D008545_abd.tsv"},
        "config": {}
    },
    "D009765": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D009765_anno.tsv", "matrix":"/data/static_viz_data/tree_D009765_test.tsv", "tree":"/data/static_viz_data/tree_D009765_abd.tsv"},
        "config": {}
    },
    "D011236": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D011236_anno.tsv", "matrix":"/data/static_viz_data/tree_D011236_test.tsv", "tree":"/data/static_viz_data/tree_D011236_abd.tsv"},
        "config": {}
    },
    "D012778": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D012778_anno.tsv", "matrix":"/data/static_viz_data/tree_D012778_test.tsv", "tree":"/data/static_viz_data/tree_D012778_abd.tsv"},
        "config": {}
    },
    "D013167": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D013167_anno.tsv", "matrix":"/data/static_viz_data/tree_D013167_test.tsv", "tree":"/data/static_viz_data/tree_D013167_abd.tsv"},
        "config": {}
    },
    "D014376": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D014376_anno.tsv", "matrix":"/data/static_viz_data/tree_D014376_test.tsv", "tree":"/data/static_viz_data/tree_D014376_abd.tsv"},
        "config": {}
    },
    "D014607": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D014607_anno.tsv", "matrix":"/data/static_viz_data/tree_D014607_test.tsv", "tree":"/data/static_viz_data/tree_D014607_abd.tsv"},
        "config": {}
    },
    "D015179": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D015179_anno.tsv", "matrix":"/data/static_viz_data/tree_D015179_test.tsv", "tree":"/data/static_viz_data/tree_D015179_abd.tsv"},
        "config": {}
    },
    "D015212": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D015212_anno.tsv", "matrix":"/data/static_viz_data/tree_D015212_test.tsv", "tree":"/data/static_viz_data/tree_D015212_abd.tsv"},
        "config": {}
    },
    "D016640": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D016640_anno.tsv", "matrix":"/data/static_viz_data/tree_D016640_test.tsv", "tree":"/data/static_viz_data/tree_D016640_abd.tsv"},
        "config": {}
    },
    "D037841": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D037841_anno.tsv", "matrix":"/data/static_viz_data/tree_D037841_test.tsv", "tree":"/data/static_viz_data/tree_D037841_abd.tsv"},
        "config": {}
    },
    "D050177": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D050177_anno.tsv", "matrix":"/data/static_viz_data/tree_D050177_test.tsv", "tree":"/data/static_viz_data/tree_D050177_abd.tsv"},
        "config": {}
    },
    "D065626": {
        "type": "tree",
        "file": {"anno":"/data/static_viz_data/tree_D065626_anno.tsv", "matrix":"/data/static_viz_data/tree_D065626_test.tsv", "tree":"/data/static_viz_data/tree_D065626_abd.tsv"},
        "config": {}
    },


};

var text_data = {

};

var table_data = window.gon.table_data;


var init_data = {
    "T0B0": "BMI_pie",
    "V1B0": "BMI_pie",
    "V0B1": "D000236",
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
