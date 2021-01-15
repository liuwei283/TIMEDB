
export function assign_tb_style(tids){
    $(tids).DataTable({
        columnDefs: [{
            targets: [0, -1],
            orderable: false,
        }],
        searching: false,
        lengthChange: false,
        // scrollX: true
    }); 

}

