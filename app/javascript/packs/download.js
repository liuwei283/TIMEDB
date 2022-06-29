import JSZip from 'jszip'
import FileSaver, { saveAs } from 'file-saver'

$(document).ready(function() {
    var oTable1 = $("#table1").DataTable({
      columnDefs: [
        {
          targets: 0,
        }
      ],
      "order": [[0,"desc"]],
    });
    var oTable2 = $("#table2").DataTable({
      columnDefs: [
        {
          targets: 0,

        }
      ],
      "order": [[0,"desc"]],

      scrollX: true,
    });
    var oTable3 = $("#table3").DataTable({
      columnDefs: [
        {
          targets: 0,

        }
      ],
      "order": [[0,"desc"]],

    });
    var oTable4 = $("#table4").DataTable({
      columnDefs: [
        {
          targets: 0,

        }
      ],
      "order": [[0,"desc"]],

    });

    var oTable5 = $("#table5").DataTable({
      columnDefs: [
        {
          targets: 0,

        }
      ],
      "order": [[0,"desc"]],
      scrollX: true,

    });
    
});