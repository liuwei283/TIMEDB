import {init} from "viz/static_method_immunePie"
var path = window.gon.file;
var id = '#viz_sample_inf';

console.log("jhdhwbdkwjbdkw");
document.addEventListener('DOMContentLoaded', init(id, path));

$('#download_chart').on('click', (e) => {
    var clicked_id = "viz_sample_inf"
    const svgContainerClone = document.getElementById(clicked_id).cloneNode(true);
    const svgBlob = new Blob([svgContainerClone.innerHTML], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = clicked_id + ".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
})