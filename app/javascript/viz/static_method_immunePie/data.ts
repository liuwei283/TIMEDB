import template from "./template.bvt";

import Oviz from "crux";

export class Revolution extends Oviz.Component {

    public legendPos: {x: 800, y: 0};
    public buttonkey:0;

    public render(){
        return this.t`${template}`;
    }
    public willRender() {
        this.legendPos = {x: 800, y: 0};
    }

    protected state = {
        legendPos:null
    }

    protected updateLegendPos(ev, el, deltaPos: [number, number]) {
        this.legendPos.x += deltaPos[0];
        this.legendPos.y += deltaPos[1];
        this.redraw();
    }

    protected buttonclick(d){
        this.buttonkey = d;
        console.log("buttonkey:",this.buttonkey);
        this.redraw();
    }
}

export function pieDataloaded(_data){
    let pieR = 120;
    let plotSize = [1200,800];
    const title = "Proportion of Immune Cells for Each Sample";
    const tickFontSize = 20;

    let cancer = new String(_data.columns[0])
    let sample = new String(_data.columns[1])

    let methoddata = [];
    _data.forEach((item,index) => {
        methoddata.includes(item.method)? null :methoddata.push(item[cancer].split("|")[1])
    });
    methoddata = Array.from(new Set(methoddata));
    
    const different_method_data = methoddata.map(x=>new Object({"methodkey":x,"data":[]}))
    different_method_data.forEach((item,index)=>{
        _data.forEach((ditem,dindex)=> {
            if(ditem[cancer].split("|")[1] == item.methodkey){
                ditem[sample] == "NA"? ditem[sample] =  "0":null
                item.data.push({"name":ditem.TCGA_ACC.split("|")[0],"value":1*ditem[sample]})
            }
        });
    })
    let piesData = {}
    let legendsData = {}
    methoddata.forEach((item,index)=>{
        piesData[item] = []
        legendsData[item] = []
        different_method_data.forEach((ditem,dindex)=>{
            if(ditem.methodkey == item){
                ditem.data.forEach((e,n) => {
                    let color = mapColor(e.name)
                    piesData[item].push({name:e.name,value:e.value,color:color})
                    legendsData[item].push({fill:color,label:e.name})
                });
            }
        })
    })
    let pieData,legend
    pieData = piesData["ABIS"];
    legend = legendsData["ABIS"];
    
    
    this.data.pieData = pieData;
    this.data.piesData = piesData;
    this.data.pieR = pieR;
    this.data.methodList = methoddata;
    this.data.legend = legend;
    this.data.legendsData = legendsData;
    this.data.title = title;
    this.data.tickFontSize = tickFontSize;
    this.data.plotSize = plotSize;
}

export function mapColor(cell){
    let colour
    let colorMap = {
        "B cells":"#60C17F",
        "B naive cells":"#90C1DB",
        "B Naive":"#90C1DB",
        "B memory cells":"#90C1F9",
        "B Memory":"#90C1F9",
        "Basophils":"#7344C4",
        "Cytotoxic cells":"#FD754B", 
        "DC cells":"#FD754B", 
        "pDC cells":"#FD754B", 
        "pDCs":"#FD754B", 
        "aDC cells":"#FD754B", 
        "mDC cells":"#FD754B", 
        "mDCs":"#FD754B", 
        "Endothelials":"#FD754B", 
        "Eosinophils":"#DC3C84",
        "Fibroblasts":"#FD754B", 
        "Macrophages M0":"#FDD7FF",
        "Macrophages M1":"#FDD7E6",
        "Macrophages M2":"#FDD7CB",
        "Mast cells":"#F94A59",
        "MAIT cells":"#FD754B",
        "MAIT":"#FD754B",
        "Monocytes":"#FD754B", 
        "Monocytes C":"#FD754B",
        "Neutrophils":"#FD754B",
        "Neutrophils LD":"#FD754B",
        "NK cells":"#519DA0",
        "NK":"#519DA0",
        "NKT cells":"#FD754B",
        "NK cells resting":"#FD754B",
        "NK cells activated":"#FD754B",
        "Plasma cells":"#FD754B",
        "Plasmablasts":"#FD754B",
        "T CD8 cells":"#427AA4",
        "T CD8 naive cells":"#698BA4",
        "T CD8 Naive":"#698BA4",
        "T CD4 cells":"#427AC2",
        "T CD4 memory cells":"#9BB1E0",
        "T CD4 Memory":"#9BB1E0",
        "T CD8 Memory":"#9BB1E0",
        "T CD4 naive cells":"#9BCFE0",
        "T CD4 Naive":"#9BCFE0",
        "Th1 cells":"#FD754B",
        "Th2 cells":"#FD754B",
        "Tregs":"yellow",
        "Tfh cells":"#FD754B",
        "Tgd cells":"#FD754B",
    }
    for (const [key, value] of Object.entries(colorMap)) {
        //console.log(`${key}: ${value}`);
        key == cell? colour = value:null
    }
    return colour
      
}