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

$(function () { 
    var ids = new Set();
    var invis = window.gon.invis
    //console.log($("#table_page").data('url'));
    var table = $("#table_page").DataTable({
        fixedColumns: true,
        fixedColumns: {
            leftColumns: 3,
            rightColumns: 1
        },
        processing: true,
        serverSide: true,
        ajax: $("#table_page").data('url'),
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
        {
            targets: invis,
            visible: false
        }
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
            //$('td:eq(4)', row).css('border-style', 'outset');
        },
        initComplete: function(settings, json) {
            $('#loadingSpinner').hide();
        }

    }); 

    // var table = $("#pj_table_page").DataTable({
    //     fixedColumns: true,
    //     fixedColumns: {
    //         leftColumns: 3,
    //         rightColumns: 2
    //     },
    //     processing: true,
    //     serverSide: true,
    //     ajax: $("#pj_table_page").data('url'),
    //     columnDefs: [
    //     {
    //         targets: 0,
    //         orderable: false,
    //         className: 'select-checkbox',
    //         checkboxes: {
    //             selectRow: true,
    //         },
    //     },
    //     {
    //         targets: -1,
    //         orderable: false  
    //     },
    //     {
    //         targets: -2,
    //         orderable: false  
    //     },
    //     {
    //         targets: invis,
    //         visible: false
    //     }
    //     ],
    //     searching: true,
    //     select: {
    //         style:    'multi',
    //         selector: 'td:first-child'
    //     },
    //     scrollX: true,
    // }); 


    table.on('change', function() {
        //console.log("clicking");
        // var info = table.fnSettings().aaSorting;
        // var idx = info[0][0];
        // alert(idx);
    })

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
        console.log(!downloadSelect);
        console.log(!downloadSearch);


    }


    $('.s_table_sub').on("click", function(e){
        var form = this;
        var selected_ids = Array.from(ids)
        // Iterate over all selected checkboxes
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



