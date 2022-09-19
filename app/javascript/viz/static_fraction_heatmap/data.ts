import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { GridPlot } from "oviz-components/grid-plot";
import { EditText } from "oviz-components/edit-text";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import * as TextSize from "crux/dist/utils/text-size";
import { isNullishCoalesce } from "typescript";


const title = "Clinical Data"


//celList => columns this.data.cellList => classifications
//sampleList => sampleNames => changNames => categories

//filter other index

export function filterother(cellList,oricelllist){

  cellList.indexOf("P-value") != -1? (cellList.splice(cellList.indexOf("P-value"),1),oricelllist.splice(oricelllist.indexOf("P-value"),1)):null
  cellList.indexOf("Correlation") != -1? (cellList.splice(cellList.indexOf("Correlation"),1),oricelllist.splice(oricelllist.indexOf("Correlation"),1)):null
  cellList.indexOf("RMSE") != -1? (cellList.splice(cellList.indexOf("RMSE"),1),oricelllist.splice(oricelllist.indexOf("RMSE"),1)):null
  cellList.indexOf("Absolute score (sig.score)") != -1? (cellList.splice(cellList.indexOf("Absolute score (sig.score)"),1),oricelllist.splice(oricelllist.indexOf("Absolute score (sig.score)"),1)):null

}

export function plotDataloaded(_data){

  this.data.oridata = _data
  let cellList = _data.columns.slice(2) 
  this.data.oricelllist = _data.columns.slice(2)
  cellList = cellList.slice(0,22)

  // if(cellList.indexOf("P-value") != -1){
  //   cellList.splice(cellList.indexOf("P-value"),1)
  // }
  filterother(cellList,this.data.oricelllist)

  let sampleList = _data.map(x=>x["sample_name"]) 

  let columns = cellList; 
  this.data.cellList = cellList; 
  const sampleNames = sampleList;
  this.data.sampleList = sampleList; 
  const changeNames = sampleList;

  let useData = [] 
  
  let testmatrix = []
  let testmaxxx = null 
  let testmaxarr = []
  let testsignabove = "" 
  let testsignbelow = "" 
  cellList.forEach((cell,index) => {
    _data.forEach((row,rindex) => {
      const elem = {name:null,data:0,pValue:0,row:0,col:0}
      elem.name = cell
      row[cell]+"" == "NA"? elem.data = 0 : elem.data = row[cell]
      elem.row = index + 1
      elem.col = rindex + 1
      testmatrix.push(elem)
      testmaxarr.push(Math.abs(elem.data))
      testsignabove == "" ? (elem.data>0? testsignabove = "active" :null):null
      testsignbelow == "" ? (elem.data<0? testsignbelow = "active" :null):null
    });
  });
  testmaxxx = Math.max(...testmaxarr)
  this.data.maxxx = testmaxxx

  useData = testmatrix  

  testsignabove == "active" && testsignbelow == "active" ? 
    this.data.midheatlegend = "all":(testsignabove == "active" && testsignbelow != "active" ?
    this.data.midheatlegend = "above":(testsignabove != "active"&&testsignbelow == "active"? this.data.midheatlegend = "below":null))

  this.data.plotSize = [250,500]; 
  this.data.labelFontSize = 12;
  this.data.tickFontSize = 14;
  
  let newArr = _data; 
  // newArr.map(function(arr){return delete arr.method})
  newArr.map(function(arr){
    delete arr.method 
    delete arr["P-value"]
    delete arr["Correlation"]
    delete arr["RMSE"]
    delete arr["Absolute score (sig.score)"]
    return arr
  })
  filterother(newArr.columns,[])
  console.log("newArr:",newArr)
  let newData =  dataHandler(newArr)

  let testrange0 = MINforArr(newData.result)
  let testrange1 = MAXforArr(newData.result)

  let meanslow = Math.min(...newData.means)
  let meanshigh = Math.max(...newData.means)
  testrange0 > meanslow? testrange0 = meanslow:null
  testrange1 < meanshigh? testrange1 = meanshigh:null

  newData.columns = newData.columns.slice(0,22)
  newData.result = newData.result.slice(0,22)
  newData.means = newData.means.slice(0,22)
  

  let range0 = parseFloat(testrange0.toFixed(1))
  let range1 = parseFloat(testrange1.toFixed(1))
  let colors = ["#FCE4EC"];
  let valueRange = [(range0-0.1).toFixed(1),(range1+0.1).toFixed(1)];

  this.data.columns = newData.columns;
  this.data.colors = colors;
  this.data.valueRange = valueRange;

  //statcked plot
  const categoryKey = _data.columns[0]; 
  const categories = sampleList 
  const classifications = cellList
  const result = {};
  let colorMap = {}

  classifications.forEach((item,i)=>{
    colorMap[item] = mapColor(item)
  })
  
  const stackescolors = Object.values(colorMap);

  let sumMap = new Map()
  const sum = [];
  let fil_stacked = newArr.map(function(arr){
    delete arr.method 
    delete arr["P-value"]
    delete arr["Correlation"]
    delete arr["RMSE"]
    delete arr["Absolute score (sig.score)"]
    return arr
  })
  console.log("fil_stacked:",fil_stacked)

  _data.forEach(row => {
    let count = 0,key,value;
    for ([key, value] of Object.entries(row).slice(1)) {
      value == "NA"? value = 0:null
      if(key != categoryKey) {
        count += Math.abs(parseFloat(value)); 
      }
    }
    sumMap[row[categoryKey]] = count;
    sum.push(count)
  });

  classifications.forEach((classification, i) => {
    result[classification] = [];
  });

  //
  _data.forEach(d => {
    classifications.forEach((classification,k) => {
      d[classification]=="NA"? d[classification]=0:null 
      result[classification].push([d[categoryKey], Math.abs(parseFloat(d[classification]))/sumMap[d[categoryKey]]]); 
    });
  });

  this.data.stackedWidth = sampleList.length*this.data.gridPlotWidth 

  this.data.gridPlotWidth = 12;
  this.data.gridPlotheight = 12;
  
  let sampleslength = []
  sampleList.forEach((item,index) => {
    sampleslength.push(TextSize.measuredTextSize(item,10).width)
  });
  this.data.propsamplelength = Math.max(...sampleslength)

  return {_data,sampleNames,columns,useData,changeNames,boxdata:{ values: newData.result,means: newData.means,outliers:[], categories: newData.columns },result, categories, classifications, colorMap, stackescolors}

}

export function showAll(_data,key){
  let newConfig = {}
  let cellList = []
  if(key==-1){
    cellList = _data.columns.slice(2)
  }else if(key==1){
    cellList = _data.columns.slice(2,22)
  }

  // if(cellList.indexOf("P-value") != -1){
  //   cellList.splice(cellList.indexOf("P-value"),1)
  // }
  filterother(cellList,[])

  let sampleList = []
  for(let i = 0;i < _data.length;i++){
    sampleList.push(_data[i][_data.columns[0]])
  }

  let columns = cellList; 
  newConfig["cellList"] = cellList;
  const sampleNames = sampleList;
  newConfig["sampleList"] = sampleList
  const changeNames = sampleList;
  const changeData = []
  columns.forEach((arr) =>{
    let temp1 = []
    _data.forEach((d) =>{
      d[arr]+"" == "NA"? d[arr]=0:null
      temp1.push(parseFloat(d[arr]))
    });
    changeData.push(temp1)
  });

  let maxxx = MAXforArr(changeData)
  newConfig["maxxx"] =  maxxx

  const useData = [] 
  for(let i = 0;i < changeData.length;i++){
    for(let j = 0;j < _data.length;j++){
      const elem = {name:null,data: 0,pValue:0,row: 0,col: 0}
      elem.name = columns[i]
      elem.data = changeData[i][j]
      elem.row = i + 1 
      elem.col = j + 1 
      useData.push(elem)
    }
  }

  let plotSize = [250,500];
  newConfig["plotSize"] = plotSize
  newConfig["labelFontSize"] = 12
  newConfig["tickFontSize"] = 14
  let newArr = _data;
  // newArr.map(function(arr){return delete arr.method})
  newArr.map(function(arr){
    delete arr.method 
    delete arr["P-value"]
    delete arr["Correlation"]
    delete arr["RMSE"]
    delete arr["Absolute score (sig.score)"]
    return arr
  })
  filterother(newArr.columns,[])
  let newData =  dataHandler(newArr)
  if(key==1){
    newData.columns = newData.columns.slice(0,22)
    newData.result = newData.result.slice(0,22)
    newData.means = newData.means.slice(0,22)
  }
  
  let testrange0 = MINforArr(newData.result)
  let testrange1 = MAXforArr(newData.result)
  let meanslow = Math.min(...newData.means)
  let meanshigh = Math.max(...newData.means)
  testrange0 > meanslow? testrange0 = meanslow:null
  testrange1 < meanshigh? testrange1 = meanshigh:null

  let range0 = parseFloat(testrange0.toFixed(1))
  let range1 = parseFloat(testrange1.toFixed(1))

  const colors = ["#FCE4EC"];
  let valueRange = [range0.toFixed(1),(range1+0.1).toFixed(1)];

  newConfig["columns"] = newData.columns
  newConfig["colors"] = colors
  newConfig["valueRange"] = valueRange 

  const categoryKey = _data.columns[0]; 
  const categories = sampleList
  const classifications = cellList

  const result = {};
  let colorMap = {}
  classifications.forEach((item,i)=>{
    colorMap[item] = []
  })
  classifications.forEach((item,i)=>{
    colorMap[item] = mapColor(item)
  })
                    
  const stackescolors = Object.values(colorMap);
  classifications.forEach((classification, i) => {
    result[classification] = [];
  });
  
  let sumMap = new Map()
  const sum = [];
  _data.forEach(row => {
    let count = 0,key,value;
    for ([key, value] of Object.entries(row).slice(1)) { 
      value == "NA"? value = 0:null
      if(key != categoryKey) {
        count += Math.abs(parseFloat(value)); 
      }
    }
    sumMap[row[categoryKey]] = count;
    sum.push(count)
  });

  _data.forEach(d => {
    classifications.forEach((classification,k) => {
      d[classification]=="NA"? d[classification]=0:null
      result[classification].push([d[categoryKey], Math.abs(parseFloat(d[classification]))/sumMap[d[categoryKey]]]); 
    });
  });

  newConfig["gridPlotWidth"] = 12
  newConfig["gridPlotheight"] = 12
  newConfig["stackedWidth"] = sampleList.length*newConfig["gridPlotheight"]
  newConfig["_data"] = _data
  newConfig["result"] = {}
  newConfig["result"]["sampleNames"] = sampleNames
  newConfig["result"]["columns"] = columns
  newConfig["result"]["useData"] = useData
  newConfig["result"]["changeNames"] = changeNames
  newConfig["result"]["boxdata"] = {values: newData.result,means: newData.means,outliers:[], categories: newData.columns }
  newConfig["result"]["result"] = result
  newConfig["result"]["categories"] = categories
  newConfig["result"]["classifications"] = classifications
  newConfig["result"]["colorMap"] = colorMap
  newConfig["result"]["stackescolors"] = stackescolors

  return newConfig

}



export function clinicalDataloaded(_data){ 

  if(_data === null){ //查看临床数据是否为空
    console.log("Clinical data is null! Please recheck!")
    this.data.clinicalDatashow = false

    let bgendColor = "#00479a" 
    let bgstartColor = 	"#dbdbdb"; 
    let gbstartColor = "#dbdbdb" 
    let gbendColor = "#FF0000"
  
    let ageStartColor = "#ee807f";
    let ageEndColor = "#ee2422";
    
    let colorScheme =  Oviz.color.schemeGradient(bgstartColor,bgendColor)
    let gbcolorScheme =  Oviz.color.schemeGradient(gbstartColor,gbendColor)
    let ageColorScheme = Oviz.color.ColorSchemeGradient.create(ageStartColor, ageEndColor);
    
    this.data.bgstartColor = bgstartColor
    this.data.bgendColor = bgendColor
    this.data.gbstartColor = gbstartColor
    this.data.gbendColor = gbendColor
    this.data.ageStartColor = ageStartColor
    this.data.ageEndColor = ageEndColor
    this.data.gbcolorScheme = gbcolorScheme
  
    this.data.colorScheme = colorScheme
    this.data.ageColorScheme = ageColorScheme

    const addNames = this.data.sampleList
    this.data.addNames = addNames

    let ppp = getfixed(this.data.maxxx)
    let textmaxxx = this.data.maxxx + 5/(10 ** (ppp+1))
    this.data.textmaxxx = textmaxxx.toFixed(1)


  }else{

  
  const addNames = this.data.sampleList 
  this.data.addNames = addNames 

  let tempResult = mapCNlist(_data[0])
  let c_indexList = tempResult["c_"]
  let n_indexList = tempResult["n_"]
  let clinicalIndexes = aryJoinAry(c_indexList, n_indexList) 

  let addName = clinicalIndexes 
  let sortaddName = clinicalIndexes
  this.data.sortaddName = sortaddName 

  let cindexes = []

  addName.forEach((item,index)=>{
    _data[0].forEach((ditem,dindex) => {
      ditem == item? (cindexes.push(dindex)):null
    });
  })


  function mapClinicalIndex(arr,cindexes){
    let newArr = []
    arr.forEach((item,index)=>{
      let newitem = []
        cindexes.forEach(k => {
          newitem.push(item[k])
        });
      newArr.push(newitem)
    })
    return newArr
  }

  let tg = _data[0].indexOf("sample_name")
  let clinicalSamples = _data.map(k=>k[tg])

  let addData = []
  let newlist = []

  for(let i = 0;i < addNames.length;i++){
    let index = clinicalSamples.indexOf(addNames[i])
    if(index != -1){ 
      addData.push(_data[index])
      newlist.push(this.data.sampleList[i])
    }
  }
  this.data.newlist = newlist 

  addData = mapClinicalIndex(addData,cindexes).slice(0)

  var newArr = []

  for(let i = 0;i < addData.length;i++){ 
    for(let j = 0; j < addName.length;j++){ 
      const elem = {data:null,row:0,col:0}
      elem.data = addData[i][j]
      elem.row = 23 + j 
      elem.col = i + 1
      newArr.push(elem)
    }
  }

  let legendType = {}
  let tempNum = {}
  addName.forEach((item,index)=>{
    legendType[item] = []
    tempNum[item] = []
    nMCatagory(addData,legendType[item],index)
    legendType[item] = legendType[item].slice(0).sort() 
    legendType[item].unshift("NA")
    legendType[item] = Array.from(new Set(legendType[item]))
  })
  this.data.legendType = legendType

  addName.forEach((item,index)=>{
    item.substring(0,2)=="n_"? (tempNum[item] = tempNum[item].slice(1)[tempNum[item].length-1]):null
    legendType[item].length>7 && item.substring(0,2) == "c_"? delete legendType[item]:null 
  });

  addName = Object.keys(legendType) 
  sortaddName = addName 
  this.data.sortaddName = sortaddName
  let legendLoc = {}
  addName.forEach((item,index)=>{
    legendLoc[item] = []
    showLegend(legendType[item],legendLoc[item],index,item.substring(0,2),NAlen(addName,legendType))
  })

  this.data.legendLoc = legendLoc

  let newcindexes = []
  addName.forEach((item,index)=>{
    _data[0].forEach((ditem,dindex) => {
      ditem == item? (newcindexes.push(dindex)):null
    });
  })

  let filteraddData = []
  for(let i = 0;i < addNames.length;i++){
    let index = clinicalSamples.indexOf(addNames[i])
    if(index != -1){
      filteraddData.push(_data[index])
    }
  }

  addData = mapClinicalIndex(filteraddData,newcindexes).slice(0)

  let filtern_indexList = []
  filtern_indexList = addName.filter(k=>{if(k.substring(0,2)=="n_"){return k}})

  n_indexList = filtern_indexList

  let heatmapLoc = {} 
  addName.forEach((item,index)=>{
  heatmapLoc[item] = []
    rowColumn(addData,heatmapLoc[item],index,index+23,item,legendType)
  })

  this.data.heatmapLoc = heatmapLoc

  addName.forEach((item,index)=>{
    this.data.heatmapLoc[item].forEach((ditem,dindex) => {
      this.data.legendLoc[item].forEach((d,k) => {
        ditem.data == d.data? (d.sampleSize+=1) :null
      });
    });
  });

  
  let ppp = getfixed(this.data.maxxx)
  let textmaxxx = this.data.maxxx + 5/(10 ** (ppp+1))
  this.data.textmaxxx = textmaxxx.toFixed(1)

  let bgendColor = "#00479a" 
  let bgstartColor = 	"#dbdbdb"; 
  let gbstartColor = "#dbdbdb" 
  let gbendColor = "#FF0000"

  let ageStartColor = "#ee807f";
  let ageEndColor = "#ee2422";
  
  let colorScheme =  Oviz.color.schemeGradient(bgstartColor,bgendColor)
  let gbcolorScheme =  Oviz.color.schemeGradient(gbstartColor,gbendColor)
  let ageColorScheme = Oviz.color.ColorSchemeGradient.create(ageStartColor, ageEndColor);
  
  this.data.bgstartColor = bgstartColor
  this.data.bgendColor = bgendColor
  this.data.gbstartColor = gbstartColor
  this.data.gbendColor = gbendColor
  this.data.ageStartColor = ageStartColor
  this.data.ageEndColor = ageEndColor
  this.data.gbcolorScheme = gbcolorScheme

  this.data.colorScheme = colorScheme
  this.data.ageColorScheme = ageColorScheme

  let NAlength = NAlen(addName,legendType)
  this.data.NAlength = NAlength

  let thirdLen = this.data.cellList.length * this.data.gridPlotheight + this.data.cellList.length *15 + 150
  this.data.thirdLen = thirdLen

  n_indexList
  let n_row = []
  let n_data = {}
  n_indexList.forEach((item,index)=>{
    n_row.push(_data[0].indexOf(item))
  })

  n_row.forEach((item,index)=>{
    n_data[n_indexList[index]] = []
    _data.forEach((ditem,dindex) => {
      dindex!=0? (isNaN(ditem[item]*1)? n_data[n_indexList[index]].push(0):n_data[n_indexList[index]].push(ditem[item]*1)):null
    });
  })

  let n_crow = []
  n_indexList.forEach((item,index)=>{
    n_crow.push(addName.indexOf(item))
  })

  let n_legendData = []
  let n_legendtextlength = []
  n_indexList.forEach((item,index)=>{
    let min = Math.min(...n_data[item]).toFixed(1) + ""
    let max = Math.max(...n_data[item]).toFixed(1) + ""
    n_legendtextlength.push(TextSize.measuredTextSize(max,8).width)
    min == max? (max=="0.0"? (min = " ",max = " "):null):null
    n_legendData.push({label:item,row:n_crow[index],min: min,max: max})
  })
  let n_color = {}
  console.log("n_legendData:",n_legendData)
  n_legendData.forEach((item,index)=>{
    if(item.min!=" "&&item.max!=" "){
      n_color[item.label] = {min:item.min,max:item.max}
    }
  })
  
  this.data.n_legendmaxlength = Math.max(...n_legendtextlength).toFixed(0)

  this.data.n_color = n_color
  
  this.data.n_legendData = n_legendData
  this.data.legendStyle = "false"
  this.data.oriClidata = _data
  this.data.clinicalSamples = clinicalSamples

  let temptips = []
  sortaddName.forEach((item,index)=>{
    legendLoc[item].forEach((d,i) => {
      let tlen = (180-NAlength) / (d.num-1)
      this.data.tlen = tlen
      if(TextSize.measuredTextSize(d.data, 8).width>tlen*6/7){
        temptips.push(d.data)
      }
    });
  })
  let tipsrow = temptips.length
  this.data.tipsrow = tipsrow

  if(this.data.sampleList.length!=this.data.newlist.length){
    let config = recheck(this.data.oridata,this.data.newlist,this.data.sampleList)
    this.data.RNAData.stackescolors = config["result"].stackescolors
    this.data.cellList = config["cellList"]
    this.data.RNAData.useData = config["result"].useData
    this.data.sampleList = config["sampleList"]
    this.data.gridPlotWidth = config["gridPlotWidth"]
    this.data.RNAData.result = config["result"].result
    this.data.RNAData.classifications =  config["result"].classifications
    this.data.RNAData.colorMap = config["result"].colorMap
    this.data.RNAData.columns = config["result"].columns
    this.data.RNAData.boxdata = config["result"].boxdata
  }

  return {sortaddName,newArr,addData,addName}

}

}


export function recheck(_data,newlist,newsampleList){

  let recheckData = []

  for(let i = 0;i < newsampleList.length;i++){
    let index = newlist.indexOf(newsampleList[i])
    if(index != -1){
      recheckData.push(_data[index])
    }
  }

  let tempcols = _data.columns
  _data = recheckData
  _data.columns = tempcols 

  let newConfig = {}
  let cellList = []
  let key = 1
  if(key==-1){
    cellList = _data.columns.slice(2)
  }else if(key==1){
    cellList = _data.columns.slice(2,22)
  }
  // if(cellList.indexOf("P-value") != -1){
  //   cellList.splice(cellList.indexOf("P-value"),1)
  // }
  filterother(cellList,[])

  let sampleList = []
  for(let i = 0;i < _data.length;i++){
    sampleList.push(_data[i][_data.columns[0]])
  }

  let columns = cellList; 
  newConfig["cellList"] = cellList;
  const sampleNames = sampleList;
  newConfig["sampleList"] = sampleList
  const changeNames = sampleList;
  const changeData = []
  columns.forEach((arr) =>{
    let temp1 = []
    _data.forEach((d) =>{
      d[arr]+"" == "NA"? d[arr]=0:null
      temp1.push(parseFloat(d[arr]))
    });
    changeData.push(temp1)
  });

  let maxxx = MAXforArr(changeData)
  newConfig["maxxx"] =  maxxx

  const useData = [] 
  for(let i = 0;i < changeData.length;i++){
    for(let j = 0;j < _data.length;j++){
      const elem = {name:null,data: 0,pValue:0,row: 0,col: 0}
      elem.name = columns[i]
      elem.data = changeData[i][j]
      elem.row = i + 1 
      elem.col = j + 1 
      useData.push(elem)
    }
  }
  

  let plotSize = [250,500];
  newConfig["plotSize"] = plotSize
  newConfig["labelFontSize"] = 12
  newConfig["tickFontSize"] = 14
  let newArr = _data;
  // newArr.map(function(arr){return delete arr.method})
  newArr.map(function(arr){
    delete arr.method 
    delete arr["P-value"]
    delete arr["Correlation"]
    delete arr["RMSE"]
    delete arr["Absolute score (sig.score)"]
    return arr
  })
  filterother(newArr.columns,[])
  let newData =  dataHandler(newArr)
  if(key==1){
    newData.columns = newData.columns.slice(0,22)
    newData.result = newData.result.slice(0,22)
    newData.means = newData.means.slice(0,22)
  }
  
  let testrange0 = MINforArr(newData.result)
  let testrange1 = MAXforArr(newData.result)

  let cout1 = getfixed(testrange0) 
  let cout2 = getfixed(testrange1) 

  if(testrange0<0){
    let range0 = -(Math.abs(testrange0) + 5/(10 ** (cout1+1)))
    if(testrange1<0){
      let range1 = -(Math.abs(testrange1) + 5/(10 ** (cout2+1)))
    }
  }
  
  let range0 = testrange0 - 5/(10 ** (cout1+1))
  testrange0 == 0? range0 = 0:null
  let range1 = testrange1 + 5/(10 ** (cout2+1))
  testrange0<0 ? (range0 = -(Math.abs(testrange0) + 5/(10 ** (cout1+1)))):null
  testrange1<0 ? (range1 = -(Math.abs(testrange1) + 15/(10 ** (cout2+1)))):null




  const colors = ["#FCE4EC"]; 
  let valueRange = [(range0-0.1).toFixed(1),(range1+0.1).toFixed(1)];

  newConfig["columns"] = newData.columns
  newConfig["colors"] = colors
  newConfig["valueRange"] = valueRange 



  const categoryKey = _data.columns[0]; 
  const categories = sampleList
  const classifications = cellList

  const result = {};
  let colorMap = {}
  classifications.forEach((item,i)=>{
    colorMap[item] = []
  })
  classifications.forEach((item,i)=>{
    colorMap[item] = mapColor(item)
  })
                    

  const stackescolors = Object.values(colorMap);
  classifications.forEach((classification, i) => {
    result[classification] = [];
  });
  
  let sumMap = new Map()
  const sum = [];
  _data.forEach(row => {
    let count = 0,key,value;
    for ([key, value] of Object.entries(row).slice(1)) { 
      value == "NA"? value = 0:null
      if(key != categoryKey) {
        count += Math.abs(parseFloat(value)); 
      }
    }
    sumMap[row[categoryKey]] = count;
    sum.push(count)
  });


  _data.forEach(d => {
    classifications.forEach((classification,k) => {
      d[classification]=="NA"? d[classification]=0:null
      result[classification].push([d[categoryKey], Math.abs(parseFloat(d[classification]))/sumMap[d[categoryKey]]]);
    });
  });

  newConfig["gridPlotWidth"] = 12
  newConfig["gridPlotheight"] = 12
  newConfig["stackedWidth"] = sampleList.length*newConfig["gridPlotheight"]
  newConfig["_data"] = _data
  newConfig["result"] = {}
  newConfig["result"]["sampleNames"] = sampleNames
  newConfig["result"]["columns"] = columns
  newConfig["result"]["useData"] = useData
  newConfig["result"]["changeNames"] = changeNames
  newConfig["result"]["boxdata"] = {values: newData.result,means: newData.means,outliers:[], categories: newData.columns }
  newConfig["result"]["result"] = result
  newConfig["result"]["categories"] = categories
  newConfig["result"]["classifications"] = classifications
  newConfig["result"]["colorMap"] = colorMap
  newConfig["result"]["stackescolors"] = stackescolors

  return newConfig


}


export function switchStyle(v){

  if(v.data.legendStyle){
    let newsortaddName = []
    let add =-1
    v.data.sortaddName.forEach((item,index)=>{
      add = add + 1
      v.data.legendLoc[item].forEach((ditem,dindex) => {
        v.data.legendType[item].length==1? add = add -1:(ditem["newrow"] = add,newsortaddName.push(item))
      });
    })
    newsortaddName = Array.from(new Set(newsortaddName))

    let newcindexes = []
    newsortaddName.forEach((item,index)=>{
      v.data.oriClidata[0].forEach((ditem,dindex) => {
        ditem == item? (newcindexes.push(dindex)):null
      });
    })
  
    function mapClinicalIndex(arr,cindexes){
      let newArr = []
      arr.forEach((item,index)=>{
        let newitem = []
          cindexes.forEach(k => {
            newitem.push(item[k])
          });
        newArr.push(newitem)
      })
      return newArr
    }

    let newaddData = []
    for(let i = 0;i < v.data.sampleList.length;i++){
      let index = v.data.clinicalSamples.indexOf(v.data.sampleList[i])
      if(index != -1){
        newaddData.push(v.data.oriClidata[index])
      }
    }
    newaddData = mapClinicalIndex(newaddData,newcindexes).slice(0)
    var newnewArr = []
    for(let i = 0;i < newaddData.length;i++){ 
      for(let j = 0; j < newsortaddName.length;j++){ 
        const elem = {data:null,row:0,col:0}
        elem.data = newaddData[i][j]
        elem.row = 23 + j 
        elem.col = i + 1
        newnewArr.push(elem)
      }
    }
  
    let newlegendType = {}
    let newtempNum = {}
    newsortaddName.forEach((item,index)=>{
      newlegendType[item] = []
      newtempNum[item] = []
      nMCatagory(newaddData,newlegendType[item],index) 
      newlegendType[item] = newlegendType[item].slice(0).sort()
      newlegendType[item].unshift("NA")
      newlegendType[item] = Array.from(new Set(newlegendType[item]))
    })

    newsortaddName.forEach((item,index)=>{
      item.substring(0,2)=="n_"? (newtempNum[item] = newtempNum[item].slice(1)[newtempNum[item].length-1]):null
    });
  
    let newheatmapLoc = {} 
    newsortaddName.forEach((item,index)=>{
    newheatmapLoc[item] = []
        rowColumn(newaddData,newheatmapLoc[item],index,index+23,item,newlegendType)
    })
  
    let newlegendLoc = {}
    newsortaddName.forEach((item,index)=>{
      newlegendLoc[item] = []
      showLegend(newlegendType[item],newlegendLoc[item],index,item.substring(0,2),NAlen(newsortaddName,newlegendType))
    })

    let newNAlength = NAlen(newsortaddName,newlegendType)
    let newtempResult = mapCNlist(newsortaddName)
    let newc_indexList = newtempResult["c_"]
    let newn_indexList = newtempResult["n_"]
  
    let newn_row = []
    let newn_data = {}
    newn_indexList.forEach((item,index)=>{
      newn_row.push(v.data.oriClidata[0].indexOf(item))
    })
  
    newn_row.forEach((item,index)=>{
      newn_data[newn_indexList[index]] = []
      v.data.oriClidata.forEach((ditem,dindex) => {
        dindex!=0? (isNaN(ditem[item]*1)? newn_data[newn_indexList[index]].push(0):newn_data[newn_indexList[index]].push(ditem[item]*1)):null
      });
    })
  
    let newn_crow = []
    newn_indexList.forEach((item,index)=>{
      newn_crow.push(newsortaddName.indexOf(item))
    })
  
    let newn_legendData = []
    newn_indexList.forEach((item,index)=>{
      let min = Math.min(...newn_data[item]).toFixed(1) + ""
      let max = Math.max(...newn_data[item]).toFixed(1) + ""
      min == max? (max=="0.0"? (min = " ",max = " "):null):null
      newn_legendData.push({label:item,row:newn_crow[index],min: min,max: max})
    })

    newsortaddName.forEach((item,index)=>{
      newheatmapLoc[item].forEach((ditem,dindex) => {
        newlegendLoc[item].forEach((d,k) => {
          ditem.data == d.data? d.sampleSize += 1 :null
        });
      });
    });
    
    v.data.legendLoc = newlegendLoc
    v.data.legendType = newlegendType
    v.data.n_legendData = newn_legendData
    v.data["ClinicalData"]["sortaddName"] = newsortaddName
    v.data.heatmapLoc = newheatmapLoc

  
  }
  else{
    let newsortaddName = []
    newsortaddName = v.data.sortaddName
    newsortaddName = Array.from(new Set(newsortaddName))
    let newcindexes = []
    newsortaddName.forEach((item,index)=>{
      v.data.oriClidata[0].forEach((ditem,dindex) => {
        ditem == item? (newcindexes.push(dindex)):null
      });
    })
  
    function mapClinicalIndex(arr,cindexes){
      let newArr = []
      arr.forEach((item,index)=>{
        let newitem = []
          cindexes.forEach(k => {
            newitem.push(item[k])
          });
        newArr.push(newitem)
      })
      return newArr
    }
    
    let newaddData = []
    for(let i = 0;i < v.data.sampleList.length;i++){
      let index = v.data.clinicalSamples.indexOf(v.data.sampleList[i])
      if(index != -1){ 
        newaddData.push(v.data.oriClidata[index])
      }
    }
  
    newaddData = mapClinicalIndex(newaddData,newcindexes).slice(0)
  
    var newnewArr = []
    for(let i = 0;i < newaddData.length;i++){
      for(let j = 0; j < newsortaddName.length;j++){ 
        const elem = {data:null,row:0,col:0}
        elem.data = newaddData[i][j]
        elem.row = 23 + j 
        elem.col = i + 1
        newnewArr.push(elem)
      }
    }
  
    let newlegendType = {} 
    let newtempNum = {}
    newsortaddName.forEach((item,index)=>{
      newlegendType[item] = []
      newtempNum[item] = []
      nMCatagory(newaddData,newlegendType[item],index) 
      newlegendType[item] = newlegendType[item].slice(0).sort()
      newlegendType[item].unshift("NA")
      newlegendType[item] = Array.from(new Set(newlegendType[item]))
    })
  
    newsortaddName.forEach((item,index)=>{
      item.substring(0,2)=="n_"? (newtempNum[item] = newtempNum[item].slice(1)[newtempNum[item].length-1]):null
    });
  
    let newheatmapLoc = {} 
    newsortaddName.forEach((item,index)=>{
    newheatmapLoc[item] = []
        rowColumn(newaddData,newheatmapLoc[item],index,index+23,item,newlegendType)
    })
  
    let newlegendLoc = {}
    newsortaddName.forEach((item,index)=>{
      newlegendLoc[item] = []
      showLegend(newlegendType[item],newlegendLoc[item],index,item.substring(0,2),NAlen(newsortaddName,newlegendType))
    })
  
    let newNAlength = NAlen(newsortaddName,newlegendType)
  
    let newtempResult = mapCNlist(newsortaddName)
    let newc_indexList = newtempResult["c_"]
    let newn_indexList = newtempResult["n_"]
  
    let newn_row = []
    let newn_data = {}
    newn_indexList.forEach((item,index)=>{
      newn_row.push(v.data.oriClidata[0].indexOf(item))
    })
  
    newn_row.forEach((item,index)=>{
      newn_data[newn_indexList[index]] = []
      v.data.oriClidata.forEach((ditem,dindex) => {
        dindex!=0? (isNaN(ditem[item]*1)? newn_data[newn_indexList[index]].push(0):newn_data[newn_indexList[index]].push(ditem[item]*1)):null
      });
    })
  
    let newn_crow = []
    newn_indexList.forEach((item,index)=>{
      newn_crow.push(newsortaddName.indexOf(item))
    })
  
    let newn_legendData = []
    newn_indexList.forEach((item,index)=>{
      let min = Math.min(...newn_data[item]).toFixed(1) + ""
      let max = Math.max(...newn_data[item]).toFixed(1) + ""
      min == max? (max=="0.0"? (min = " ",max = " "):null):null
      newn_legendData.push({label:item,row:newn_crow[index],min: min,max: max})
    })

    v.data.legendLoc = newlegendLoc
    v.data.legendType = newlegendType
    v.data.n_legendData = newn_legendData
    v.data["ClinicalData"]["sortaddName"] = newsortaddName
    v.data.heatmapLoc = newheatmapLoc
  }

}

export function getfixed(num){
  let textnum = num+""
  let final
  let rep=/[\.]/;
  rep.test(textnum)? (final = textnum.split(".")[1].lastIndexOf("0")+2):final = 2
  return final
}

export function MAXforArr(arr){
  let result = []
  let result2 = []
  arr.forEach((item,index)=>{
    result[index] = Math.max(...item)
    result2[index] = Math.min(...item)
  })
  let final
  Math.abs(Math.max(...result))>Math.abs(Math.min(...result2))? final = Math.abs(Math.max(...result)) : final = Math.abs(Math.min(...result2))
  return final
}

export function MINforArr(arr){
  let result2 = []
  arr.forEach((item,index)=>{
    result2[index] = Math.min(...item)
  })
  let final = Math.min(...result2)
  return final
}

export function heatmapColormap(item,cate,legendType,newColors = {}){

  let elemcolor = []
  newColors[item] = []
  if(item.substring(0,2)=="c_"){ 
    let colors = colorMap(legendType[item])
    legendType[item].forEach((d,n) => {
      newColors[item].push({type:d,color:colors[n]})
    });
    newColors[item].forEach((k,m) => {
      if(cate == k.type){
        elemcolor.push(k.color)
      }
    });
  }
  return elemcolor

}

export function colorMap(arr){
  let color1 = ["#C0C0C0"]
  let color2 = ["#C0C0C0","#7d9fee"]
  let color3 = ["#C0C0C0","#cc4f7b","#314893"]
  let color4 = ["#C0C0C0","#ee937d","#ee7db5","#7d9fee"]
  let color5 = ["#C0C0C0","#86e5e9","#ee7e7d","#cc4f7b","#314893"] 
  let color6 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee"]
  let color7 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#7deea4"]
  let color8 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#C0C0C0","#eed97d"]
  let color9 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#C0C0C0","#eed97d","#ee937d"]
  let color10 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#C0C0C0","#eed97d","#ee937d","#ee7db5"]
  let color11 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee",]
  let color12 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee"]
  let color13 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#7deea4"]
  if(arr.length<13){
    switch(arr.length){
      case 1: return color1; break;
      case 2: return color2; break;
      case 3: return color3; break;
      case 4: return color4; break;
      case 5: return color5; break;
      case 6: return color6; break;
      case 7: return color7; break;
      case 8: return color8; break;
      case 9: return color9; break;
      case 10: return color10; break;
      case 11: return color11; break;
      case 12: return color12; break;
      case 13: return color13; break;
    }
  }
  else{
    const colorMap = Oviz.color.schemeCategory("light", arr).colors;
    const colors = Object.values(colorMap);
    return colors
  }
  
}

export function NAlen(addName,legendType){
  let len = []
  addName.forEach((item,index)=>{
    item.substring(0,2) == "c_"? len.push(legendType[item].length):null
  })
  let length = 180 / Math.max(...len)
  return length
}

export function showLegend(arr1,arr2,n,sign,base){
  if(sign == "c_"){
    for(let i = 0;i < arr1.length;i++){
      const elem = {data:null,row:0,col:0,colors:null,num:0,x:0,textx:0,sampleSize:0}
      let colors = []
      let color
      arr1.length > 20? color = "blue":(colors = colorMap(arr1),color = colors[i])
      elem.data = arr1[i]
      elem.row = n
      elem.col = i + 1
      elem.colors = color 
      elem.num = arr1.length
      //elem.sampleSize = 
      i == 0? elem.textx = base/2 :((arr1.length==2&&i == 1)? elem.textx = base + 1 + (180-base)/(arr1.length-1)*(i)*1/4:elem.textx=18)
      i == 0? elem.x = 0:elem.x = base + (180-base)/(arr1.length-1)*(i-1) +1
      arr2.push(elem)
    }
  }
  else if(sign == "n_"){
    let tempArr = ["NA",""]
    for(let i = 0;i < tempArr.length;i++){
      const elem = {data:null,row:0,col:0,colors:null,num:0,x:0,textx:0,sampleSize:null}
      elem.data = tempArr[i]
      elem.row = n
      elem.col = i + 1
      tempArr[i]== "NA"? elem.colors = "#C0C0C0":null
      elem.num = tempArr.length
      i == 0? elem.textx = base/2 :elem.textx = base + 1 + (180-base)/(tempArr.length-1)*1/2*1/2
      i == 0? elem.x = 0:elem.x = base + (180-base)/(tempArr.length-1)*(i-1) + 1
      arr2.push(elem)
    }
  }
    
}

export function rowColumn (addData,arr,n,r,item,legendType){
  let colorhp = []
  for(let i = 0; i < addData.length;i++){
    const elem = {data:null,row:0,col:0,color:null}
    elem.data = addData[i][n]
    elem.row = r
    elem.col = i + 1
    elem.color = heatmapColormap(item,addData[i][n],legendType)[0]
    arr.push(elem)
  }
}

export function nMCatagory(addData,arr2,n){
    let arr1 = []
    arr2.push("NA")
    for(let i = 0;i < addData.length;i++){
      arr1.push(addData[i][n])
      if(arr1[i] != "NA"){
        if(arr2.indexOf(arr1[i]) == -1){
          arr2.push(arr1[i])
        }
      }
    }
    arr2 = Array.from(new Set(arr2))
}


export function aryJoinAry(ary,ary2){
  let minLength;
  let itemAry=[];
  let itemArys=[];
  if(ary.length>ary2.length){
    minLength=ary2.length;
  }
  else{
    minLength=ary.length;
  }
  let longAry=arguments[0].length>arguments[1].length?arguments[0]:arguments[1];
  for (let i = 0; i < minLength; i++) {
    itemAry.push(ary[i]);
    itemAry.push(ary2[i])
  }
  itemArys.push(itemAry.concat(longAry.slice(minLength)))

  return itemAry.concat(longAry.slice(minLength));
}

export function mapCNlist(arr){
  let clist = []
  let nlist = []
  arr.slice(2).forEach((item,index) => {
    item.slice(0,2) == "c_"? clist.push(item):(item.slice(0,2) == "n_"? nlist.push(item):null)
  });
  return {c_:clist,n_:nlist}
}

export function mapColor(cell){
  let colour
  let colorMap = {
      "Hematopoietic stem cell":"#bc0c00",
      "HSC":"#bc0c00",
      "Common lymphoid progenitor cell":"#0055bc",
      "CLP":"#0055bc",
      "B cell":"#45a7db",
      "B cells":"#45a7db",
      "B-cells":"#45a7db",
      "Bcell":"#45a7db",
      "B_cell":"#45a7db",
      "B_cells":"#45a7db",
      "Bcells":"#45a7db",
      "B cell mermory":"#a8c1fe",
      "B memory cells":"#a8c1fe",
      "B cells memory":"#a8c1fe",
      "B memory":"#a8c1fe",
      "B Memory":"#a8c1fe",
      "B cell naive":"#a8c1db",
      "B cells naive":"#a8c1db",
      
      "B naive cells":"#a8c1db",
      "naive B-cells":"#a8c1db",
      "B Naive":"#a8c1db",
      "B cell plasma":"#90c1db",
      "Class-switched memory B cell":"#f4a640",
      "Memory B-cells":"#f4a640",
      "Class-switched memory B-cells":"#f4a640",
      "Pro B cell":"#42c1db",
      "pro B-cells":"#42c1db",
      "Common lymphoid progeniotr":"#ffcb40",
      "NK cell":"#f4a640",
      "NK":"#f4a640",
      "NK cells":"#f4a640",
      "NKcells":"#f4a640",
      "NK_cells":"#f4a640",
      "NK cell actived":"#f4bc74",
      "NK cells activated":"#f4bc74",

      "NK cells resting":"#f4b28f",
      "NK cell resting":"#f4b28f",

      "Plasmacytoid dendritic cell (pDC)":"#f48940",
      "Plasma cells":"#f48940",
      "Plasma_cells":"#f48940",
      "Plasmablasts":"#f48940",
      "pDC cells":"#f48940",
      "pDCs":"#f48940",
      "pDC":"#f48940",

      "Cytotoxic cell":"#f46e40",
      "Cytotoxic":"#f46e40",
      "Cytotoxic cells":"#f46e40",
      "Cytotoxic_cells":"#f46e40",
      "Cytotoxic lymphocytes":"#f46e40",

      "T cell":"#dd3c67",
      "T cells":"#dd3c67",

      "T cell CD4+":"#3271c2",
      "T_cell.CD4":"#3271c2",
      "CD4_Tcells":"#3271c2",
      "CD4_T":"#3271c2",
      "T cells CD4":"#3271c2",
      "T_cells_CD4":"#3271c2",
      "T CD4 cells":"#3271c2",

      "T cell CD4+ (non-regulatory)":"#6b91ec",
      "CD4+ T-cells":"#6b91ec",

      "T cell regulatory (Tregs)":"#dd8683",
      "T_regulatory_cells":"#dd8683",
      "T cells regulatory (Tregs)":"#dd8683",
      "Tregs":"#dd8683",

      "T cell CD4+ Th1":"#b1c1ff",
      "Th1 cells":"#b1c1ff",
      "Th1":"#b1c1ff",

      "T cell CD4+ Th2":"#97c1ff",
      "Th2 cells":"#97c1ff",
      "Th2":"#97c1ff",

      "T cell CD4+ Th17":"#79c1ff",
      "Th17":"#79c1ff",

      "T cell CD4+ naive":"#79c1d6",
      "CD4+ naive T-cells":"#79c1d6",
      "T CD4 Naive":"#79c1d6",
      "CD4_naive":"#79c1d6",
      "T CD4 naive cells":"#79c1d6",
      "T cells CD4 naive":"#79c1d6",
      
      "T cell follicular helper(Tfh)":"#79c1c2",
      "Tfh":"#79c1c2",
      "T cells follicular helper":"#79c1c2",
      "Tfh cells":"#79c1c2",

      "induced Treg (iTreg)":"#89a2dd",
      "iTreg":"#89a2dd",

      "natural Treg (nTreg)":"#89a2c2",
      "nTreg":"#89a2c2",

      "Type 1 regular T cell (Trl)":"#89a2b3",
      "Tr1":"#89a2b3",

      "T cell CD4+ memory actived":"#dacfe0",
      "T cells CD4 memory activated":"#dacfe0",
      "T CD4 memory cells":"#dacfe0",

      "T cell CD4+ memory resting":"#c7cfe0",
      "T cells CD4 memory resting":"#c7cfe0",
      "T CD4 Memory":"#c7cfe0",

      "T cell CD4+ central memory (CD4+ Tcm)":"#a8cfe0",
      "CD4+ Tcm":"#a8cfe0",

      "T cell CD4+ effector memory (CD8+ Tem)":"#8bcfe0",
      "CD8+ Tem":"#8bcfe0",
      "T cell CD4+ effector memory (CD4+ Tem)":"#8bcfe0",
      "CD4+ Tem":"#8bcfe0",

      "T cell CD8+":"#426586",
      "T_cell.CD8":"#426586",
      " T cells CD8":"#426586",
      "CD8 T cells":"#426586",
      "T CD8 cells":"#426586",
      "CD8_Tcells":"#426586",
      "CD8_T":"#426586",
      "T cells CD8":"#426586",
      "T_cells_CD8":"#426586",
      "CD8+ T-cells":"#426586",

      "T cell CD8+ memory":"#576f86",
      "T CD8 Memory":"#576f86",

      "T cell CD8+ naive":"#588886",
      "CD8+ naive T-cells":"#588886",
      "T CD8 Naive":"#588886",
      "CD8_naive":"#588886",
      "T CD8 naive cells":"#588886",

      "T cell CD8+ central memory (CD8+ Tcm)":"#6c7986",
      "CD8+ Tcm":"#6c7986",

      "T cell CD8+ effector memory (CD8+ Tem)":"#6d7a9a",
      
      "T cell gamma delta (Tgd)":"#427a86",
      "T_cells_gamma_delta":"#427a86",
      "T cells gamma delta":"#427a86",
      "Gamma_delta":"#427a86",

      "Tgd cells":"#557d99",
      "T gd Vd2":"#557d99",

      "T gd non-Vd2":"#557d86",

      "T cell NK (NKT)":"#3371e1",
      "NKT cells":"#3371e1",
      "NKT":"#3371e1",

      "Mucosal assiociated invariant T cell (MAIT)":"#338fe1",
      "MAIT":"#338fe1",
      "Mucosal assiociated invariant T cell":"#338fe1",
      "MAIT cells":"#338fe1",

      "Memory cell":"#33aae2",

      "Central memory":"#72bee2",
      "Central_memory":"#72bee2",

      "Effector memory":"#72bed1",
      "Effector_memory":"#72bed1",

      "Exhausted T cell":"#33aac6",
      "Exhausted":"#33aac6",

      "Interstitial dendritic cell(iDC)":"#4000bc",
      "iDC":"#4000bc",
      "Dendritic cells":"#4000bc",
      "Dendritic_cells":"#4000bc",

      "Common mteloid progenitor cell (CMP)":"#bc0085",
      "CMP":"#bc0085",

      "Basophil":"#683157",
      "Basophils":"#683157",
      "Basophils LD":"#683157",

      "Common myeloid progenitor":"#9fc157",
      "Myeloid dendritic cells":"#9fc157",
      "mDCs":"#9fc157",

      "Granulocyte-monocyte progenitor (GMP)":"#ff393a",
      "GMP":"#ff393a",

      "Eosinophil":"#ce3157",
      "Eosinophils":"#ce3157",

      "Mast cell":"#ee243e",
      "Mast cells":"#ee243e",
      "Mast_cells":"#ee243e",

      "Mast cell activated":"#ee495e",
      "Mast cells activated":"#ee495e",

      "Mast cell resting":"#ee7d7e",
      "Mast cells resting":"#ee7d7e",

      "Megakaryocyte-erythroid progenitor cell(MEP)":"#c14b71",
      "MEP":"#c14b71",

      "Megakaryocyte":"#c1748d",
      "Megakaryocytes":"#c1748d",

      "Platelets":"#c195a3",

      "Erythrocytes":"#c17470",

      "Monocytic lineage":"#fd4a70",

      "B lineage":"#579dd3",

      "Marophage":"#fd71c3",
      "Marophages":"#fd71c3",
      "Macrophages":"#fd71c3",
      "Macrophage":"#fd71c3",

      "Macrphoage M0":"#fdd7ff",
      "Macrophages M0":"#fdd7ff",

      "Macrophage M1":"#fdd7d8",
      "Macrophages M1":"#fdd7d8",
      "Macrophages_M1":"#fdd7d8",

      "Macrophage M2":"#fdd7bb",
      "Macrophages M2":"#fdd7bb",
      "Macrophages_M2":"#fdd7bb",

      "Monocyte":"#fd718f",
      "Monocytes":"#fd718f", 

      "Monocytes C":"#fd8ea6",

      "Monocytes NC+1":"#fda1a6",
      "Monocytes NC+I":"#fda1a6",

      "Myeloid dendritic cell (mDC/cDC)":"#fd7161",
      "cDC":"#fd7161",
      "mDC cells":"#fd7161",

      "Dendritic cell activated":"#fd9d92",
      "Dendritic cells activated":"#fd9d92",

      "aDC cells":"#edbcd8",
      "aDC":"#edbcd8",

      "Dendritic cell resting":"#fd9d6a",
      "Dendritic cells resting":"#fd9d6a",

      "Neutrophil":"#ff5c5d",
      "Neutrophils":"#ff5c5d",
      "Neutrophils LD":"#ff5c5d",

      "T cell CD4+ memory":"#79c1e0",
      "CD4+ memory T-cells":"#79c1e0",

      "Mesenchymal stem cell (MSC)":"#edbcbc",
      "MSC":"#edbcbc",

      "Muscle cell (Myocytes)":"#ffd4d4",
      "Myocytes":"#ffd4d4",

      "Smooth muscle":"#edd4d4",

      "Skeletal muscle":"#cbbcbc",

      "Adipocyte":"#aabbbc",

      "Astrocytes":"#92bcbc",

      "Osteoblast":"#5ebbbc",

      "Neurons":"#cabcbc",

      "Chondrocyte":"#3b9ebc",
      "Chondrocytes":"#3b9ebc",

      "Fibroblast":"#3b90bc",
      "Fibroblasts":"#3b90bc",

      "Cancer associated fibroblasts (CAFS)":"#6ca0bc",
      "CAFs":"#6ca0bc",

      "Stromal cell":"#3b72bc",

      "Dendritic cell (DC)":"#00bc04",
      "DC cells":"#00bc04",
      "DC":"#00bc04",

      "Multipotential Progenitor (MPP)":"#e8e512",
      "MPP":"#e8e512",

      "Other cell":"#35478e",
      "other":"#35478e",
      "otherCells":"#35478e",

      "Cancer cell":"#293856",
      "Melanoma cell":"#56618e",
      "Ovarian carcinoma cell":"#a9618e",

      "Preadipocytes":"#293857",
      "Adipocytes":"#293857",

      "Pericytes":"#9ce27e",
      "mv Endothelial cells":"#b698cd",
      "ly Endothelial cells":"#b698ac",

      "Endothelial cell":"#a977cd",
      "Endothelial":"#a977cd",
      "Endothelial cells":"#a977cd",
      "Endothelials":"#a977cd", 

      "Sebocytes":"#df8380",

      "Epithelial cell":"#dfa3a1",
      "Epithelial cells":"#dfa3a1",

      "Mesangial cells":"#bd577a",
      "Uncharacterized cell (other)":"#df80d2",

      "Melanocytes":"#dfa280",
      "Keratinocytes":"#dfa29e",
      "Hepatocytes":"#dfa2bd",
  }
  for (const [key, value] of Object.entries(colorMap)) {
      //console.log(`${key}: ${value}`);
      key == cell? colour = value:"black"
  }
  return colour
  
}


export function chooseMethod(chosenMethod,data){
  let afterdata = []
  chosenMethod.forEach((item,index) => {
      if(item != ""){
          afterdata.push(data[index]);
      }

  });
  return afterdata;
}

export function viewMethod(methoddata){
  let tmpMethod = []
  tmpMethod.push
}

export function dataHandler(data){
  let columns = data.columns.slice(2);
  if(columns.indexOf("P-value") != -1){
    columns.splice(columns.indexOf("P-value"),1)
  }

  const result = [];
  const means = [];
  columns.forEach((arr) => {
    const temp1 = [];
    data.forEach((d) => {
      temp1.push(parseFloat(d[arr]));
    });
    const stat = new Oviz.algo.Statistics(temp1);
    result.push([
      stat.min(),
      stat.Q1(),
      stat.median(),
      stat.Q3(),
      stat.max(),
    ]);
    means.push(stat.mean());
  });
  return {result: result, means, columns: columns}
}

export function getUpper(text,width){
  let final
  TextSize.measuredTextSize(text, 8).width>width*6/7? (final = extractWord(text,width)):final = text
  // this.tips = Array.from(this.tips)
  return final
}


export function butclick(v){
  v.buttonkey = v.buttonkey*(-1);
  let config = showAll(v.oridata,v.buttonkey)
  v.RNAData.stackescolors = config["result"].stackescolors
  v.cellList = config["cellList"]
  v.RNAData.useData = config["result"].useData
  v.sampleList = config["sampleList"]
  v.gridPlotWidth = config["gridPlotWidth"]
  v.RNAData.result = config["result"].result
  v.RNAData.classifications =  config["result"].classifications
  v.RNAData.colorMap = config["result"].colorMap
  v.RNAData.columns = config["result"].columns
  v.RNAData.boxdata = config["result"].boxdata
  if(v.clinicalDatashow){
    v.$v.size.height = v.cellList.length *12 + 170 + 
    v.cellList.length*(v.gridPlotheight) + v.gridPlotheight/2
    + (v.sortaddName.length-1) * v.gridPlotheight 
    + 30
    + v.tipsrow*7
  }else{
    v.$v.size.height = v.cellList.length *12 + 170 + 
    v.cellList.length*(v.gridPlotheight) + v.gridPlotheight/2
    // + (this.sortaddName.length-1) * this.gridPlotheight 
     + 30
    // + this.tipsrow*7
  }
  v.redraw();
}


export function getPlotsize(v){
  v.data.padding = 60
  v.size.width = v.data.RNAData.useData[v.data.sampleList.length-1].col*(v.data.gridPlotWidth-1) + 330 + getMaxlength(v)
  if(v.data.clinicalDatashow){
    v.size.height = v.data.cellList.length *12 + 170 + 
              v.data.cellList.length*(v.data.gridPlotheight) + v.data.gridPlotheight/2
              + (v.data.sortaddName.length-1) * v.data.gridPlotheight 
              + 30
              + v.data.tipsrow*7
  }else{
    v.size.height = v.data.cellList.length *12 + 170 + 
              v.data.cellList.length*(v.data.gridPlotheight) + v.data.gridPlotheight/2
              // + (this.data.sampleList.length-1) * this.data.gridPlotheight 
              + 30
              // + this.data.tipsrow*7
  }
}

export function getGradientcolor(v){
  v.defineGradient("gb", "vertical", [v.data.gbendColor, v.data.gbstartColor]);
  v.defineGradient("kg", "vertical", ["#dbdbdb", "blue"]);
  v.defineGradient("age", "horizontal", [v.data.ageStartColor, v.data.ageEndColor]);
}


export function getMaxlength(v){
  let columnsTextlength = []
  v.data.RNAData.columns.forEach((item,index) => {
    columnsTextlength.push(TextSize.measuredTextSize(item,10).width)
  });
  let maxcolumnsTextlength = Math.max(...columnsTextlength)
  let clinicalTextlength = []
  if(v.data.clinicalDatashow){
    v.data.ClinicalData.sortaddName.forEach((item,index) => {
      clinicalTextlength.push(TextSize.measuredTextSize(item,10).width)
    });
  }

  let maxclinicalTextlength = Math.max(...clinicalTextlength)
  let result = 130
  maxcolumnsTextlength>maxclinicalTextlength? result = maxcolumnsTextlength:result = maxclinicalTextlength
  return result
}

export function extractWord(word,width){
  let newword =  word.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  let result = newword.match(/\b(\w)/g).join('.')
  let words = ""
  if(TextSize.measuredTextSize(result, 8).width > width*2/3){
    let finalresult = ""
    let i = 0
      while(TextSize.measuredTextSize(finalresult, 8).width<width*2/3){
        finalresult = finalresult+ result.split("")[i]
        i += 1
      }
    words = finalresult
  }else{
    words = result
  }
  return words

}
