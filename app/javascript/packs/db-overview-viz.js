import init from "viz/histogram"

var db_data_dir = '/data/static_viz_data/'
var files = ['histo_test1.csv', 'histo_test2.csv']
var ids = ['#s1g', '#s2g']

for(var i=0; i< ids.length; i++){
    var path = db_data_dir + files[i];
    document.addEventListener("turbolinks:load",init(ids[i], path));//画图
}