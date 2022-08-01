$(window).unload(function() {
    $.rails.enableFormElements($($.rails.formSubmitSelector));
  });

$.fn.dataTable.ext.errMode = 'throw';

function union(setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function difference(setA, setB) {
    let _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

function intersection(setA, setB){
    var intersection = new Set();
    for (var elem of setB) {
        if (setA.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;

}

function modify_set(option, id_set, new_ids){
    var new_ids = Array.from(new_ids);
    var new_ids = new Set(new_ids)
    if (option > 0) {
        // add new ids
        return union(id_set, new_ids);
    }
    else{
        return difference(id_set, new Set(new_ids));
    }
}

$.fn.dataTable.ext.search.push(
    function( settings, searchData, index, rowData, counter ) {
        if (settings.nTable.id !== 'filter_table'){
            return true;
        }
        // if (settings.nTable.id !== 'table_meta' && settings.nTable.id !== 'table_data'){
        //     return true;
        // }
        //console.log(searchData);
        var col_ranges = window.gon.col_ranges;
        var range_mins = [];
        var range_maxs = [];
        var range_values = [];

        for (var k = 0; k < col_ranges.length; k++ ) {
            range_mins.push($( "#slider-range_" + col_ranges[k].n).slider( "values", 0));
            range_maxs.push($( "#slider-range_" + col_ranges[k].n).slider( "values", 1));
            range_values.push(parseFloat(searchData[parseInt(col_ranges[k].n) + 1] ) || 0);
            //console.log(parseFloat(searchData[parseInt(col_ranges[k].n)]));
        }

        for (var k = 0; k < col_ranges.length; k++ ) {
            if (!(range_mins[k] <= range_values[k] && range_values[k] <= range_maxs[k])) return false;
        }
        return true;

    }
);



// function prepareData() {
//     let data_data = $('#tbody_data tr').get().map(function(row) {
//         return $(row).find('td').get().map(function(cell) {
//             return $(cell).html();
//         });
//     });

//     let data_meta = $('#tbody_meta tr').get().map(function(row) {
//         return $(row).find('td').get().map(function(cell) {
//             return $(cell).html();
//         });
//     });

//     $("#ddt").val(JSON.stringify(data_data));
//     $("#dmt").val(JSON.stringify(data_meta));

//     $("#dname").val($("#dname").val().trim());
// }




$(function () { 
    $(".rangeselect .slider-range").each(function(index) {
        let num = $(this).attr("id").split("_")[1];
        let minv = Number($( "#min_" + num ).val());
        let maxv = Number($( "#max_" + num ).val());
        
        $(this).slider({
            range: true,
            min: minv,
            max: maxv,
            values: [ minv, maxv ],
            slide: function( event, ui ) {
                $( "#value_" + num ).val( " " + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            },
            change: function( event, ui ) {
                table.draw();
            }
        });
        
        $( "#value_" + num ).val( " " + $(this).slider( "values", 0 ) +
            " - " + $(this).slider( "values", 1 ) );
    });
    
    $(".umin").each(function() {
        $(this).on('input', function() {
            if ($(this).val() > 0) {
                let num = $(this).attr("id").split("_")[1];
                let slider = $("#slider-range_" + num);
                slider.slider('values', 0, Number($(this).val()));
                $( "#value_" + num ).val( " " + slider.slider('values', 0) + " - " + slider.slider('values', 1) );
            }
        });
    });
    
    $(".umax").each(function() {
        $(this).on('input', function() {
            if ($(this).val() > 0) {
                let num = $(this).attr("id").split("_")[1];
                let slider = $("#slider-range_" + num);
                slider.slider('values', 1, Number($(this).val()));
                $( "#value_" + num ).val( " " + slider.slider('values', 0) + " - " + slider.slider('values', 1) );
            }
        });
    });
    
    $(".reset-r").on('click', function() {
        console.log("fdgfdgfdg");
        let num = $(this).attr("id").split("_")[1];
        let minv = $("#min_" + num).val();
        let maxv = $("#max_" + num).val();
        let slider = $("#slider-range_" + num);
        slider.slider('values', 0, Number(minv));
        slider.slider('values', 1, Number(maxv));
        $( "#value_" + num ).val( " " + slider.slider('values', 0) + " - " + slider.slider('values', 1) );
    });
    

    
   
    

    
    var ids = new Set();
    //var invis = window.gon.invis
    console.log($("#table_page").data('url'));
    if (document.getElementById('table_page')) {
        var table = $("#table_page").DataTable({
            fixedColumns: true,
            fixedColumns: {
                leftColumns: 3,
                rightColumns: 1
            },
            processing: true,
            serverSide: true,
            ajax: $("#table_page").data(),
            dom: 'Plfrtip',
            searchPanes: {
                cascadePanes: true,
                layout: 'columns-4'
            },
            columnDefs: [
            {
                targets: 0,
                orderable: false,
                className: 'select-checkbox',
                checkboxes: {
                    selectRow: true,
                },
            },
            {
                targets: -1,
                orderable: false,
                className: "tableLastColumn",
            },
            // {
            //     targets: invis,
            //     visible: false
            // }
            ],
            searching: true,
            select: {
                style:    'multi',
                selector: 'td:first-child'
            },
            scrollX: true,
            rowCallback: function(row, data) {
                $('td:eq(2)', row).css('background-color', '#e9ecef');
                $('td:eq(3)', row).css('background-color', '#e9ecef');
            },
            initComplete: function(settings, json) {
                $('#loadingSpinner').hide();
            }
        }); 
    }

    if (document.getElementById('filter_table')) {
        var table = $("#filter_table").DataTable({
            fixedColumns: true,
            fixedColumns: {
                leftColumns: 3,
                rightColumns: 1
            },
            //processing: true,
            //serverSide: true,
            //ajax: $("#table_page").data(),
            dom: '<"#pane"P>lfrtip',
            searchPanes: {
                cascadePanes: true,
                layout: 'columns-4',
            },
            columnDefs: [
            {
                searchPanes: {
                    show: true,
                    dtOpts: {
                        select: {
                            style: 'multi'
                        },
                        dom: "tp",
                        searching: true,
                    }
                },
                targets: window.gon.sp_col_index
            },
            {
                targets: 0,
                orderable: false,
                className: 'select-checkbox',
                checkboxes: {
                    selectRow: true,
                },
            },
            {
                targets: -1,
                orderable: false,
                className: "tableLastColumn",
            },
            // {
            //     targets: invis,
            //     visible: false
            // }
            ],
            searching: true,
            select: {
                style:    'multi',
                selector: 'td:first-child'
            },
            scrollX: true,
            rowCallback: function(row, data) {
                // $('td:eq(2)', row).css('background-color', '#e9ecef');
                // $('td:eq(3)', row).css('background-color', '#e9ecef');
            },
            initComplete: function(settings, json) {
                $('#loadingSpinner').hide();

            }
        });

        $("#pane").attr("title", "Filter Column Data")
    
        $("#pane").dialog({
            autoOpen: false,
            show: {
                effect: "blind",
                duration: 250
            },
            hide: {
                effect: "blind",
                duration: 250
            }
        });

        $(".rangeselect").each(function(index) {
            $(this).dialog({
                autoOpen: false,
                show: {
                    effect: "blind",
                    duration: 250
                },
                hide: {
                    effect: "blind",
                    duration: 250
                }
            });
        });
    
        $(".dtsp-searchPane").each(function(index) {
            $(this).hide();
        });

        $(".dtsp-titleRow").hide();

    
        // $(".filter").each(function(index) {
        //     $(this).wrap("<div class='dropdown-menu form-group p-2 h-50 d-none' aria-labelledby='t-"+ String(index) +"'/>");
        // });
        
        $(".dropdown-menu").click(function(e){
            e.stopPropagation();
        });
        
        
        $(".ftitle").each(function(index){
            if (window.gon.sp_col_index.includes(index + 1)) {
                $(this).on("click", function(){
                    // console.log("index is", index)
                    // $(".dtsp-searchPane").each(function(index) {
                    //     $(this).hide();
                    // });

                    $("#pane .dtsp-searchPane").hide();
                    if ($("#rangeselect_" + String(index)).length > 0) {
                        $(".rangeselect").each(function(index) {
                            $(this).dialog("close");
                        });
                        $("#pane").dialog("close");

                        $("#rangeselect_" + String(index)).dialog("open");
                    }
                    else {
                        $("#pane").dialog("open");
                        $(".rangeselect").each(function(index) {
                            $(this).dialog("close");
                        });
                    }
                    $("#pane .dtsp-searchPane:nth-of-type(" + String(index + 2) + ")").show();
                });
            }
        });

    
        $(".clearButton").attr("title", "Clear filters");
        $(".dtsp-nameButton").attr("title", "Sort by name");
        $(".dtsp-countButton").attr("title", "Sort by count");
        $(".dtsp-collapseButton").attr("title", "Collapse/Show");

        $(".dtsp-search").each(function() {
            $(this).attr("placeholder", "Search data");
        });

        $('#loadingOverlay').fadeOut();

    }

    $("th.select-checkbox").on('click',function(e) {
        if ($(".selectAll").is( ":checked" )) {
            table.rows(  ).select(); 
        } else {
            table.rows(  ).deselect(); 
        }
    });

    table.on("select", function(e) {
        var rows_selected = table.rows( { selected: true } ).data();//.column(0).data();
        var selected_ids = rows_selected.map(function(value,index) { 
            return value[1];
        });
        ids = modify_set(1, ids, selected_ids);
        disableFuncButtons();
    });

    table.on("deselect", function(e) {
        var rows_deselected = table.rows( { selected: false } ).data();//.column(0).data();
        var deselected_ids = rows_deselected.map(function(value,index) { 
            return value[1];
        });
        ids = modify_set(-1, ids, deselected_ids);
        //console.log(ids);
        disableFuncButtons();
    });

    table.on("draw", function(e) {
        //console.log("predraw");
        var all_rows = table.rows().data();
        var all_select = true;
        if(all_rows.length==0){
            all_select = false;
        }
        all_rows.map(function(row, index){
            var id = row[0];
            if (ids.has(id)){
                table.row(index).select();
            }
            else{
                all_select = false;
            }
        });
        if(all_select){
            $(".selectAll").prop('checked', true);
        }
        else{
            $(".selectAll").prop('checked', false);
        }
        
    });

    function disableFuncButtons() { // check button able for download/export
        let downloadSelect = false;
        let downloadSearch = false;
        const words = table.search();
        const searchedRows = table.rows( {search: words} ).count();

        const urlStrs = window.location.href.split("/");
        if (urlStrs[urlStrs.length -2] === "datasets") {
            if (ids.size > 0) { // has selected records
                downloadSelect = true;
            }
            $(".btn-search").attr('disabled', !downloadSelect);
            return;
        }
        
        if (ids.size > 0 && ids.size <= 1500) { // has selected records
            downloadSelect = true;
        }
        if (searchedRows > 0 && searchedRows <= 1500) {
            downloadSearch = true;
        }
        if (hasEport2DB) {
            let exportSelect = false;
            let exportSearch = false;
            const selectedDataset = document.getElementById("select_box").value;
            if (!!selectedDataset && selectedDataset !== "") {
                exportSelect = downloadSelect && true;
                exportSearch = downloadSearch && true;
            }
            $(".export-db.btn-select").attr('disabled', !exportSelect);
            $(".export-db.btn-search").attr('disabled', !exportSearch);
        }
        $(".download.btn-select").attr('disabled', !downloadSelect);
        $(".download.btn-search").attr('disabled', !downloadSearch);
    }

    $('.s_table_sub').on("click", function(e){
        var form = this;
        var selected_ids = Array.from(ids)
        // Iterate over all selected checkboxes
        $(form).find('input').remove();
        $.each(selected_ids, function(index, id){
           // Create a hidden element
           $(form).append(
                $('<input>')
                .attr('type', 'hidden')
                .attr('name', 'selected_ids[]')
                .val(id)
            );
        });
        $(form).append(
            $('<input>')
                .attr('type', 'hidden')
                .attr('name', 'search_value')
                .val(table.search())
        );
        //console.log('submitting');
    });

    $('button.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
        $(this).toggleClass('btn-outline-secondary');
        $(this).toggleClass('btn-secondary');
        // Get the column API object
        var column = table.column( $(this).attr('data-column') );
        // Toggle the visibility
        column.visible( ! column.visible() );
    } );
    hasEport2DB = !!document.getElementById("select_box");
    if (hasEport2DB) $("#select_box").change(disableFuncButtons);
    table.on( 'search.dt', function () {
        disableFuncButtons();
    } );





    
} );
