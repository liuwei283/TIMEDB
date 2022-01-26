var strut_data = [
    {
        "HV": [
            {
                "title": "title for selector of plot 2",
                "select": 
                {
                    "All cancers": "cancer_sample",
                    "All projects": "project_sample"
                }
            }
        ]
    },

    {
        "HV": [
            {
                "title": "title for selector of plot 3: cell division method",
                "select":
                {
                    "analysis1": "analysis1",
                    "analysis2": "analysis2",
                    "analysis3": "analysis3",
                    "analysis4": "analysis4",
                    "analysis5": "analysis5",
                    "analysis6": "analysis6"
                }
            },
            {
                "title": "choose cancer or project based sample information",
                "name": "plot3-cancers"
                
            },
            {
                "title": "Choose the cancer type:",
                "type": {
                    "multiple": true,
                   
                }
            }
        ]
    }
]


var init_data = {
    
    "T0B0": "BMI_pie",
    "V1B0": "BMI_pie",
    "V0B1": "D000236",
    "V0B2": "D000236_p",
    "HB0": "pie",
    "HB1": "tree",
    "HB2": "boxplot"
};
//need another data block indicating the files type for each plot
//and file storage absolute path for every plot
//or we can set it to be some configuration_data

//relationship of parent selector and children selector should be also 
//put into the relations

export var viz_data = {
    "barVis": "bar",
    "pieVis": "pie",
    

}