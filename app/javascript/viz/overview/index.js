import init from "viz/histogram"

export function table(tid, tb_data){
    //create table
    var tb = document.createElement("table");
    tb.className = "display";
    tb.id = tid;
    //class = "display"

    //create th
    var thead = document.createElement("thead");
    var tr  = document.createElement("tr");
    var th_content = tb_data["head"];
    var ncol = th_content.length;
    for (var i=0; i<ncol; i++){
        var th = document.createElement("th");
        th.innerHTML = th_content[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);


    //create tbody
    var tbody = document.createElement("tbody");
    var tb_contents = tb_data["body"];
    var nrow = tb_contents.length;
    for(var i=0; i<nrow; i++){
        var tr  = document.createElement("tr");
        for (var j=0; j<ncol; j++){
            var td = document.createElement("td");
            td.innerHTML = tb_contents[i][j];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    // embedded
    tb.appendChild(thead);
    tb.appendChild(tbody);
    return tb
}

export function selector(sid, slt_data){
    var slt = document.createElement("select");
    slt.className = "form-select col";
    slt.id = sid;
    var keys = Object.keys(slt_data);
    var key = keys[0];
    var options = slt_data[key];
    slt.name = key;
    var noption = options.length;
    // create options
    for(var i=0; i<noption; i++){
        var op = document.createElement("option");
        if (i==0){
            op.selected = true;
        }
        op.innerHTML = options[i];
        op.value = options[i];
        slt.appendChild(op);
    }
    return slt;
}

export function text(pid, str){
    var p = document.createElement("p");
    p.id = pid;
    p.innerHTML = str;
    return p;
}

export function construct_block(Bid, block_data){
    var block_div = document.createElement("div");
    block_div.className = "container";
    block_div.id = Bid;

    var keys = Object.keys(block_data);
    var key = keys[0];
    var selects = block_data[key];

    // first create selects row
    var slt_row = document.createElement("div");
    slt_row.className = "select_bar form-inline";
    var nslt = selects.length;

    // create select element
    for(var i=0; i<nslt; i++){
        var sid = Bid+'s'+i;
        var slt = selector(sid, selects[i]);
        slt_row.appendChild(slt);
    }
    block_div.appendChild(slt_row);

    // then create content
    var block = document.createElement("div");
    block.className = "row";
    var ncontent = key.length;
    
    for(var i=0; i<ncontent; i++){
        var type = key[i];
        var cid = Bid+type+i
        var content_block = document.createElement("div");
        content_block.id = cid;
        content_block.className = "col";
        block.appendChild(content_block);
    }
    block_div.appendChild(block);
    return block_div
}

// by this function, all containers are made
export function makeHTMLframe(body, struct_data){
    var nBlock = struct_data.length;
    for(var i=0; i<nBlock; i++){
        var id = "B"+i;
        var B = construct_block(id, struct_data[i]);
        body.appendChild(B);
    }
}

// fill in the block with data, (table, text, viz for default value)
export function fillinblock(cid, content_key, relation_data, table_data){
    // have graph
    if(cid.indexOf('v') != -1){
        var path = relation_data["v"]["dir"] + relation_data["v"][content_key];
        var vid = "#" + cid;
        //different graph add batch here
        // TODO
        init(vid, path);
    }
    // have table
    if(cid.indexOf('t') != -1){
        var tb_k = relation_data["t"][content_key];
        var content = table_data[tb_k]
        var container = document.getElementById(cid);
        var tid = "T"+cid;
        container.innerHTML = '';
        var tb = table(tid, content);
        container.appendChild(tb);
        
    }
    
    // have text
    if(cid.indexOf('x') != -1){
        var content = relation_data["x"][content_key];
        var container = document.getElementById(cid);
        var xid = "X"+cid;
        container.innerHTML = '';
        var text = text(xid, content);
        container.appendChild(text);

    }
    
}

export function initPage(main_id, struct_data, relation_data, init_data, table_data){
    var body = document.getElementById(main_id);
    makeHTMLframe(body, struct_data);
    for (var key in init_data){
        fillinblock(key, init_data[key], relation_data, table_data);
    }
}


//
export function catch_change(struct_data, relation_data, table_data){
    $('select').on('change', function() {
        var bro = this.parentElement.children;
        var outer_block = this.parentElement.parentElement;
        var nbro = bro.length;
        var new_k = "";
        for (var i=0; i<nbro; i++){
            if (i>0){
                new_k += "_";
            }
            new_k += bro[i].value;  
        }
        var B_i = parseInt(outer_block.id[1]);
        var type_key = Object.keys(struct_data[B_i])[0];
        var ntype = type_key.length;
        for (var i=0; i<ntype; i++){
            var con_id = outer_block.id + type_key[i] + i;
            fillinblock(con_id, new_k, relation_data, table_data);
        }

        $('#TB0t0').DataTable({
            columnDefs: [{
                targets: [0, -1],
                orderable: false,
            }],
            searching: false,
            lengthChange: false,
            // scrollX: true
        }); 
    });
}