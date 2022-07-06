import Oviz from "crux";
import { register } from "page/visualizers";
import template from "./template.bvt";
// import { SurvivalLine } from "oviz-components/survival-line";
import { C16Classifier, ClinicalProcessor } from "utils/general-classification";
import { registerEditorConfig } from "utils/editor";
import { editorConfig, editorRef } from "./editor";
import * as TextSize from "crux/dist/utils/text-size";
import { processconfig } from "viz/module_comparedPlot";
import { offset } from "crux/dist/defs/geometry";

let xlabel = "Time(Day)";
let ylabel = "Survival";

const MODULE_NAME = "module_KMPlot"

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;
    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        components: {},
        data: {
            OSDataPlotConfidence:false,
            PFSDataPlotConfidence:false,
            OSDataShowText:null,
            PFSDataShowText:null,
        },
        loadData: {
            OSData: {
                fileKey: "OSData",
                type: "csv" ,
                optional: true,
                loaded(data) {
                    common.offset = TextSize.measuredTextSize("OS",common.titlesize).height
                    this.data.common = common
                    main(data,OSPlotdata,"OS")
                    OSPlotdata.clinicalindex.forEach((item,index) => {
                        OSPlotdata.select.push({value:item+"",text:item+""})
                    });
                    this.data.OSPlotdata = OSPlotdata
                    let OSDotsdata = mergeDots(OSPlotdata)
                    this.data.OSDotsdata = OSDotsdata
                },
            },
            PFSData:{
                fileKey: "PFSData",
                type: "csv" ,
                optional: true,
                loaded(data) {
                    main(data,PFSPlotdata,"PFS")
                    PFSPlotdata.clinicalindex.forEach((item,index) => {
                        PFSPlotdata.select.push({value:item+"",text:item+""})
                    });
                    this.data.PFSPlotdata = PFSPlotdata
                    let PFSDotsdata = mergeDots(PFSPlotdata)
                    this.data.PFSDotsdata = PFSDotsdata

                },

            },
            
        },
        setup(){
            // registerEditorConfig(editorConfig(this), editorRef);
            registerEditorConfig(editorConfig(this), "getVue", "#task-output", editorRef);
            process(this)
        },
    });
    return visualizer;
}

export function registerModuleKMPlot() {
    register(MODULE_NAME, init);
}
register(MODULE_NAME, init);


export function process(v){
    v.data.OSPlotdata.maxlength>v.data.PFSPlotdata.maxlength? v.data.common.maxtextlength = v.data.OSPlotdata.maxlength : v.data.common.maxtextlength = v.data.PFSPlotdata.maxlength
    // v.size.height = 620 + 2*common.plotheight -400 + common.offset -10
    // v.size.width = 900 + common.plotwidth - 600 + 30 + common.maxtextlength
    v.size.height = 100 + common.plotheight + common.offset
    // v.size.width = 900 + 2*common.plotwidth - 400 + 60 + 2*common.maxtextlength
    v.size.width = 420 + 2*common.plotwidth + 2*common.maxtextlength
    v.data.OSDataShowText = (v.data.OSPlotdata.chosenClinical+"").replace(/_/g," ").slice(1)
    v.data.PFSDataShowText = (v.data.PFSPlotdata.chosenClinical+"").replace(/_/g," ").slice(1)
}


export function getDots(arr){
    let tempindex = []
    arr.forEach((item,index) => {
        if(index!=arr.length-1){
            (arr[index][0] == arr[index+1][0]&&arr[index][1]!=arr[index+1][1])? null:(tempindex.push(index))
        }
    });
    tempindex.push(arr.length-1)
    tempindex.forEach((item,index)=>{
        arr[item] = undefined
    })
    return arr.filter(Boolean)
}

export function mergeDots(OSPlotdata){
    let OSDotsdata = {}
    OSPlotdata.groupindex.forEach((item,index) => {
        OSDotsdata[item] = {key:item,values:[]}
        OSPlotdata.plotData[item].values.forEach((ditem,dindex) => {
            OSDotsdata[item]["values"].push(ditem)
        });
    });
    OSPlotdata.groupindex.forEach((item,index) => {
        OSDotsdata[item].values = getDots(OSDotsdata[item].values)
    });
    return OSDotsdata
}

export const common = {
    plotwidth:400,
    plotheight:400,
    titlesize:12,
    offset:null,
    maxtextlength:null,
}

export const OSPlotdata = {
    clinicalindex:null,
    chosenClinical:[],
    groupindex:null,
    preplotData:null,
    pre2plotdata:null,
    n_sum:null,
    streamData:{},
    colors:null,
    colormap:{},
    plotData:null,
    maxlength:null,
    select:[],
    oridata:[],
}

export const PFSPlotdata = {
    clinicalindex:null,
    chosenClinical:[],
    groupindex:null,
    preplotData:null,
    pre2plotdata:null,
    n_sum:null,
    streamData:{},
    colors:null,
    colormap:{},
    plotData:null,
    maxlength:null,
    select:[],
    oridata:[],
}

export function main(data,OSPlotdata,sign){

    OSPlotdata.oridata = data
    OSPlotdata.clinicalindex = Array.from(new Set(data.map(x=>x["Type"])))
    OSPlotdata.chosenClinical.length == 0? OSPlotdata.chosenClinical[0] = OSPlotdata.clinicalindex[0]:null
    OSPlotdata.groupindex = getgroup(data,OSPlotdata.chosenClinical)
    OSPlotdata.preplotData = getpreplotdata(data,OSPlotdata.chosenClinical)
    OSPlotdata.pre2plotdata = getplotdata(OSPlotdata.groupindex,OSPlotdata.preplotData,sign)
    OSPlotdata.n_sum  = getn(OSPlotdata.groupindex,OSPlotdata.pre2plotdata)
    OSPlotdata.streamData = getconfidence(OSPlotdata.groupindex,OSPlotdata.pre2plotdata,OSPlotdata.n_sum)
    OSPlotdata.maxlength = getMaxlength(OSPlotdata.groupindex,OSPlotdata.chosenClinical)
    OSPlotdata.colors = getcolormap(OSPlotdata.groupindex)
    OSPlotdata.plotData = OSPlotdata.pre2plotdata
    OSPlotdata.colormap = OSPlotdata.colors.colors
}

export function getMaxlength(arr1,arr2){
    let maxlength
    let textlength = arr1.map(x=>TextSize.measuredTextSize(x, 10).width)
    Math.max(...textlength)+50>TextSize.measuredTextSize(""+arr2[0], 12).width?
     maxlength = Math.max(...textlength)+50 : maxlength = TextSize.measuredTextSize(""+arr2[0], 12).width
    return maxlength
}

export function getlh(number,n,str = "95%"){
    return [number-1.96*Math.sqrt(number*(1-number)/n),number+1.96*Math.sqrt(number*(1-number)/n)]
}

export function sum(arr) {
    return eval(arr.join("+"));
};

export function getconfidence(groupindex,pre2plotdata,n_sum){
    let streamData = {}
    groupindex.forEach((item,index)=>{
        streamData[index] = {key:item,maxValues:[],values:[]}
        pre2plotdata[item].values.forEach((ditem,dindex) => {
            let range = getlh(ditem[1],n_sum)
            streamData[index].values.push([ditem[0],range[0]])
            streamData[index].maxValues.push([ditem[0],range[1]])
        });
    })
    groupindex.forEach((item,index)=>{
        pre2plotdata[item].values.forEach((ditem,dindex) => {
            let range = getlh(ditem[1],n_sum)
            streamData[index].values.unshift([ditem[0],range[1]])
        });
    })
    return streamData;
}

export function getplotdata(groupindex,preplotData,sign){
    let pre2plotdata = {}
    groupindex.forEach((item,index)=>{
        pre2plotdata[item] = {key:index,values:[]}
        let sum = 0
        let time
        if(sign=="OS"){
            preplotData.forEach((ditem,dindex)=>{
                ditem["Group"] == item? (ditem["OS_Time"]!="NA"&&ditem["OS_Survival"]!="NA" ?(pre2plotdata[item].values.push([ditem["OS_Time"]*1,ditem["OS_Survival"]*1]),sum+=1,time = ditem["OS_Time"]*1):null):null
            })
        }
        else if(sign=="PFS"){
            preplotData.forEach((ditem,dindex)=>{
                ditem["Group"] == item? (ditem["PFS_Time"]!="NA"&&ditem["PFS_Survival"]!="NA" ?(pre2plotdata[item].values.push([ditem["PFS_Time"]*1,ditem["PFS_Survival"]*1]),sum+=1,time = ditem["PFS_Time"]*1):null):null
            })
        }
        
    })
    return pre2plotdata
}

export function getn(groupindex,pre2plotdata){
    let n_group = []
    groupindex.forEach((item,index)=>{
        n_group.push(pre2plotdata[item].values.length)
    });
    return sum(n_group)
}

export function getcolormap(groupindex){
    return Oviz.color.schemeCategory("light",groupindex);
}

export function getgroup(data,chosenClinical){
    let groupindex = Array.from(new Set(data.map(x=>{
        let result
        x["Type"]==chosenClinical[0]?  result = x["Group"] :null
        return result
    })))
    return groupindex.filter(Boolean).sort()
}

export function getpreplotdata(data,chosenClinical){
    let preplotData = []
    data.forEach((item,index) => {
        item["Type"] == chosenClinical[0]? preplotData.push(item):null
    });
    return preplotData
}

