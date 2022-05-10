document.addEventListener('DOMContentLoaded', () => {
    all_viz();
});
catch_change();


import {init as subtypeLandscape} from "viz/static_subtype_immuneSubtype"
import {init as subtypeBoxplot} from "viz/static_subtype_immuneCell"
import {init as subtypeCurve} from "viz/static_subtype_survival"
import {init as subtypeRegulator} from "viz/static_overview_immuneRegulators"



import {init as fractionPie} from "viz/static_fraction_pie"
import {init as fractionBoxplot} from "viz/static_fraction_boxplot"
import {init as fractionGroupBoxplot} from "viz/static_fraction_grouped_boxplot"
import {init as fractionLandscape} from "viz/static_comparedPlot"






var data_path = "/public/data/";
var project_name = window.gon.project_name;
var cancer_type = window.gon.cancer_type;

var clinical_file_path = data_path + "clinical/sample/Clinical_" + project_name + ".csv";
var subtype_file_path = data_path + "subtype/c1_c6/project/" + project_name + "_c1_c6.csv";
var subtype_file_path = data_path + "subtype/c1_c6/project/" + project_name + "_c1_c6.csv";
var rna_file_path = data_path + "immuneregulator/immuReg_" + project_name + ".csv";



export function subtype_landscape_viz() {
    subtypeLandscape("#subtype-landscapeVis", subtype_file_path, clinical_file_path);
}

export function subtype_boxplot_viz() {
    var subtype_method_selector = document.getElementById("subtype-boxplot-method-selector");
    var selected_method = subtype_method_selector.value;
    var cellData_file_path = data_path + "cell_data/" + selected_method + "/" + project_name + "_" + selected_method + ".csv";
    subtypeBoxplot("#subtype-boxplotVis", subtype_file_path, cellData_file_path);//remember to change to the right plot
}

export function subtype_curve_viz() {
    subtypeCurve("#subtype-curveVis", subtype_file_path, clinical_file_path);
}

export function subtype_regulator_viz() {
    subtypeRegulator("#subtype-regulatorVis", subtype_file_path, rna_file_path);
}

export function fraction_pie_viz() {
    var selected_column = document.getElementById("fraction-pie-selector").value;
    fractionPie("#fraction-pieVis", clinical_file_path, 'c_' + selected_column);
    console.log('c_' + selected_column)
}

export function fraction_boxplot_viz() {
    var selected_method = document.getElementById("fraction-boxplot-selector").value;
    var cellData_file_path = data_path + "cell_data/" + selected_method + "/" + project_name + "_" + selected_method + ".csv";

    if (selected_method == "Consensus") {
        fractionGroupBoxplot("#fraction-boxplotVis", cellData_file_path)
    }
    else {
        fractionBoxplot("#fraction-boxplotVis", cellData_file_path);
    }
}




export function fraction_landscape_viz() {
    var type = document.getElementById("fraction-landscape-selector").value;
    var file_name = project_name + "_Consensus.csv";
    var file_path = data_path + "cell_data/Consensus/" + file_name;

    // document.getElementById("compared_data").setAttribute("download", file_name);
    // document.getElementById("compared_data").setAttribute("href", file_path);
    
    fractionLandscape("#fraction-landscapeVis", file_path, type);
}

export function all_viz() {
    //subtype overview
    subtype_landscape_viz();
    subtype_boxplot_viz();
    subtype_curve_viz();
    subtype_regulator_viz();

    //fraction overview
    fraction_pie_viz()
    fraction_boxplot_viz()
    fraction_landscape_viz();

}

export function catch_change(){

    $('#subtype-boxplot-method-selector').on('change', function() {
        subtype_boxplot_viz();
    });

    $('#fraction-landscape-selector').on('change', function() {
        fraction_landscape_viz();
    });

    $('#fraction-boxplot-selector').on('change', function() {
        fraction_boxplot_viz();
    });

    $('#fraction-pie-selector').on('change', function() {
        fraction_pie_viz();
    });



}


$('.viz_download').on('click', (e) => {
    var clicked_id = e.target.id;
    const svgContainerClone = document.getElementById(clicked_id + "Vis").cloneNode(true);
    const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = clicked_id + ".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
})

