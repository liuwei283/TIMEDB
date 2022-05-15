import Oviz from "crux";
import { editorConfig, editorRef } from "./editor";
import template from "./template.bvt";

//import { groupedChartColors} from "oviz-common/palette";
import { ComplexBoxplot, processBoxData } from "oviz-components/complex-boxplot";
import { GridPlot } from "oviz-components/grid-plot";
import { EditText } from "oviz-components/edit-text";
import {register} from "page/visualizers";
import { rankDict, sortByRankKey } from "utils/bio-info";
import { registerEditorConfig } from "utils/editor";
import * as TextSize from "crux/dist/utils/text-size";


const title = "Clinical Data"

export function extractWord(word){
  let newword =  word.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  return newword.match(/\b(\w)/g).join('.')
}

// var matches = word2.match(/\b(\w)/g);    // ['J','S','O','N'] 
// var acronym = matches.join('.');     // JSON 
// console.log(acronym)

export function plotDataloaded(_data){

  console.log("data:",_data); //79行样本数据

  let cellList = _data.columns.slice(2) //免疫细胞种类
  //判断并删除p值
  if(cellList.indexOf("P-value") != -1){
    cellList.splice(cellList.indexOf("P-value"),1)
  }

  let sampleList = []
  for(let i = 0;i < _data.length;i++){
    sampleList.push(_data[i][_data.columns[0]])
  }

  //获取坐标 免疫细胞种类
  let columns = cellList; 
  this.data.cellList = cellList;
  //获取样本名称
  const sampleNames = sampleList;
  this.data.sampleList = sampleList; 
  const changeNames = sampleList;
  //console.log("changeNames:",changeNames); //去除了后缀的样本名 79*

  //get changeData = {cell:[value,,,*79]}   23*79
  const changeData = [] //全数组矩阵
  columns.forEach((arr) =>{
    let temp1 = []
    _data.forEach((d) =>{
      d[arr]+"" == "NA"? d[arr]=0:null
      temp1.push(parseFloat(d[arr]))
    });
    changeData.push(temp1)
  });
  console.log("changeData:",changeData); //{cell:[value,,,*79]}   17*79 

  

  let maxxx = MAXforArr(changeData)
  this.data.maxxx = maxxx //中间heatmap的最大值

  //将data处理成可画图数据 for middle heatmap
  const useData = [] 
  for(let i = 0;i < changeData.length;i++){
    for(let j = 0;j < _data.length;j++){
      const elem = {name:null,data: 0,pValue:0,row: 0,col: 0}
      elem.name = columns[i] //免疫细胞种类
      elem.data = changeData[i][j] //对应的value
      //elem.pValue = changeData[22][j] //Pvalue值
      elem.row = i + 1 //坐标
      elem.col = j + 1 //坐标
      useData.push(elem)
    }
  }
  console.log("useData:",useData) //1343 = 17*79
  
  //boxplot plot
  //设置绘图大小
  this.data.plotSize = [250,500];
  //设置字体大小
  this.data.labelFontSize = 12;
  this.data.tickFontSize = 14;
  
  //把method摘出去
  let newArr = _data;
  newArr.map(function(arr){return delete arr.method})
  //console.log("newArr:",newArr)


  let newData =  dataHandler(newArr) //处理成box格式的数据
  console.log("newArr:",newArr)
  let testrange0 = MINforArr(newData.result)
  let testrange1 = MAXforArr(newData.result)
  
  console.log("boxdata:",newData)
  console.log("range:",testrange1)
  console.log("range:",testrange0)

  let cout1 = getfixed(testrange0) //<0 //需要保留的位数
  let cout2 = getfixed(testrange1) //>0 //需要保留的位数

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




  const colors = ["#FCE4EC"]; //boxplot的颜色
  let valueRange = [range0.toFixed(cout1),range1.toFixed(cout2)]; //boxplot value range

  this.data.columns = newData.columns; //cellList
  this.data.colors = colors; //颜色
  this.data.valueRange = valueRange; //boxplot value range
  console.log("boxplot:",valueRange)


  //stackedbar change
  // 获取横坐标的键
  const categoryKey = _data.columns[0]; //获取样本的列名
  // 得到纵，作为分类
  const categories = sampleList
  // 得到纵坐标作为图例
  const classifications = cellList
  //配置颜色
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
    for ([key, value] of Object.entries(row).slice(1)) { //这里的sclice和数据格式有关
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
      result[classification].push([d[categoryKey], Math.abs(parseFloat(d[classification]))/sumMap[d[categoryKey]]]); //这里除以和
    });
  });
  console.log("result:",result);
  this.data.gridPlotWidth = 10;
  this.data.gridPlotheight = 16;
  this.data.stackedWidth = sampleList.length*this.data.gridPlotWidth
  return {_data,sampleNames,columns,useData,changeNames,boxdata:{ values: newData.result,means: newData.means,outliers:[], categories: newData.columns },result, categories, classifications, colorMap, stackescolors}

}


export function clinicalDataloaded(_data){

  //sample names
  //console.log("!!!",this.data.sampleList)
  const addNames = this.data.sampleList
  console.log("names:",addNames) //sample names
  this.data.addNames = addNames
  
  //展示的各项指标的名字
  //这里需要改成和clinical data对应的  
  //hardcode
  console.log("clinical data:",_data)

  let tempResult = mapCNlist(_data[0])
  let c_indexList = tempResult["c_"]
  let n_indexList = tempResult["n_"]
  let clinicalIndexes = aryJoinAry(c_indexList, n_indexList) //混合之后的临床指标

  console.log("after mixed index:",clinicalIndexes)
  // let hardindex = ["c_ajcc_pathologic_t","n_cigarettes_per_day","c_tumor_grade",
  // "n_years_smoked","c_ajcc_pathologic_n","n_alcohol_intensity","c_primary_diagnosis",
  // "n_weight","c_synchronous_malignancy","n_height",
  // "c_alcohol_history","n_bmi","c_race","n_age","c_gender","c_tumor_type"]

  // clinicalIndexes = hardindex

  



  //console.log("??:",Math.min(...[c_indexList.length,n_indexList.length])) 得到数组的最小值

  //console.log("itemAry数组==",test);// ["A", 1, "B", 2, "C", 3, "D", 4, 5, 6]
  //console.log("itemAry数组==",itemArys);// ["A", 1, "B", 2, "C", 3, "D", 4, 5, 6]

  //let addName = ["c_tumor_stage","c_ajcc_pathologic_t","c_ajcc_pathologic_n","c_gender","os_status","n_age"]
  let addName = clinicalIndexes
  //加个判断的第一个c_

  //let sortaddName = ["tumor stage","ajcc pathologic t","ajcc pathologic n","os status","gender","age"]
  let sortaddName = clinicalIndexes
  this.data.sortaddName = sortaddName

  let cindexes = []

  addName.forEach((item,index)=>{
    _data[0].forEach((ditem,dindex) => {
      ditem == item? (cindexes.push(dindex)):null
    });
  })
  console.log("cindexes:",cindexes) //这个是按照指标排的顺序

  //根据对应的指标生成对应的数据
  //注意和顺序有关
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

  //clinical samplelist
  let clinicalSamples = _data.map(k=>k[0])

  //筛选data2和data中的对应数据 
  //根据样本名字匹配
  let addData = []
  for(let i = 0;i < addNames.length;i++){
    let index = clinicalSamples.indexOf(addNames[i]) //对应sample name
    if(index != -1){ //如果匹配上了
      addData.push(_data[index])
    }
  }
  console.log("addData:",addData)

  //在这里判断？？？？？？？奇怪的要求
  let goaddName = clinicalIndexes
  //加一个判断的 如果
  let golegendType = {} //生成图例的种类
  let gotempNum = {}
  goaddName.forEach((item,index)=>{
    golegendType[item] = []
    gotempNum[item] = []
    nMCatagory(addData.slice(0),golegendType[item],index) // 空数据集 addData的第几列 图例中的位置
    golegendType[item] = golegendType[item].slice(0).sort()
    golegendType[item].unshift("NA")
    golegendType[item] = Array.from(new Set(golegendType[item]))
  })
  console.log(golegendType)
  console.log(golegendType[clinicalIndexes[0]].length)



  
  // let sortaddName = mapClinicalIndex(_data,cindexes)[0]
  // console.log("sortaddName:",sortaddName)

  //根据对应的指标进行匹配 顺序也一致
  addData = mapClinicalIndex(addData,cindexes).slice(0)
  console.log("addData:",addData)


  
  //
  var newArr = []
  //直接通过 addData计算的格子
  for(let i = 0;i < addData.length;i++){ //矩阵数据
    for(let j = 0; j < addName.length;j++){ //hard code 想要展示的指标
      const elem = {data:null,row:0,col:0}
      elem.data = addData[i][j]
      elem.row = 23 + j //23是 中间的heatmap的长度
      elem.col = i + 1
      newArr.push(elem)
    }
  }
  console.log("计算格子的数据：",newArr) //1343个格子
  //console.log("newArr:",newArr) //不同的指标计算 行和列的位置
  
  //生成临床指标的种类
  let legendType = {} //生成图例的种类
  let tempNum = {}
  addName.forEach((item,index)=>{
    legendType[item] = []
    tempNum[item] = []
    nMCatagory(addData,legendType[item],index) // 空数据集 addData的第几列 图例中的位置
    legendType[item] = legendType[item].slice(0).sort()
    legendType[item].unshift("NA")
    legendType[item] = Array.from(new Set(legendType[item]))
  })
  console.log("legendType:",legendType)

  //得到n_的最大值
  addName.forEach((item,index)=>{
    item.substring(0,2)=="n_"? (tempNum[item] = tempNum[item].slice(1)[tempNum[item].length-1]):null
  });
  console.log("!!",tempNum)

  //生成画图的数据
  let heatmapLoc = {} 
  addName.forEach((item,index)=>{
  heatmapLoc[item] = []
    rowColumn(addData,heatmapLoc[item],index,index+23,item,legendType) // 空数据集 addData的第几列 heatmap中的位置
  })
  console.log("heatmapLoc:",heatmapLoc)
  
  this.data.heatmapLoc = heatmapLoc
                  

  let legendLoc = {}
  addName.forEach((item,index)=>{
    legendLoc[item] = []
    showLegend(legendType[item],legendLoc[item],index,item.substring(0,2),NAlen(addName,legendType))
  })
  console.log("legendLoc:",legendLoc) 

  this.data.legendLoc = legendLoc


  //配置颜色
  //测量text的长度
  let x = TextSize.measuredTextSize("test", 8).width;
  console.log(x)
  //debugger;


  //计算中间heatmap的左边的boxplot的legend范围
  
  let ppp = getfixed(this.data.maxxx)
  console.log("pp:",ppp)
  let textmaxxx = this.data.maxxx + 5/(10 ** (ppp+1))
  console.log("小数：",textmaxxx.toFixed(ppp))
  this.data.textmaxxx = textmaxxx.toFixed(ppp)

  //age的颜色
  
  
  //"#FF003C" "#EFDAFF" "#EFDAFF" "#004DBE"
  let bgendColor = "#00479a" //heatmap legend的颜色 <0
  let bgstartColor =  "#dbdbdb"; //heatmap legend的颜色 中间的颜色
  let gbstartColor = "#dbdbdb" // heatmap legend的颜色 中间的颜色
  let gbendColor = "#FF0000"//heatmap legend的颜色 >0

  let ageStartColor = "#ee807f";
  let ageEndColor = "#ee2422";
  
  //fill = d.data<0? gbcolorScheme.get(d.data/-maxxx):colorScheme.get(d.data/maxxx)
  let colorScheme =  Oviz.color.schemeGradient(bgendColor,bgstartColor)
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

                    

  //计算几张图的位置

  let NAlength = NAlen(addName,legendType)
  this.data.NAlength = NAlength
  console.log("NAlength:",NAlength)

  //计算最后一层的位置
  let thirdLen = this.data.cellList.length * this.data.gridPlotheight + this.data.cellList.length *15 + 150
  this.data.thirdLen = thirdLen
  

  //计算age的legend的位置-行数
  console.log("_data:",_data[0])
  let agestr = "n_age"
  let row = _data[0].indexOf(agestr)
  console.log("row:",row)
  let ageData = []
  _data.forEach((item,index) => {
    index!=0? ageData.push(item[row]*1):null
  });
  console.log("ageData:",ageData)

  //计算age的最大值和最小值
  let ageMax = Math.max(...ageData)
  let ageMin = Math.min(...ageData)
  console.log(ageMin)

  let ageRow = clinicalIndexes.indexOf(agestr)
  console.log("ageRow:",ageRow)

  this.data.ageMax = ageMax;
  this.data.ageMin = ageMin;
  this.data.ageRow = ageRow;


  return {sortaddName,newArr,addData,addName}

}

export function getfixed(num){
  let textnum = num+""
  console.log("",textnum)
  console.log("",textnum.split(".")[0])
  let final
  let rep=/[\.]/; //判断是否有小数点
  rep.test(textnum)? (final = textnum.split(".")[1].lastIndexOf("0")+2):final = 2
  return final
}

//寻找二维数组最大值
export function MAXforArr(arr){
  let result = []
  let result2 = []
  arr.forEach((item,index)=>{
    result[index] = Math.max(...item)
    result2[index] = Math.min(...item)
  })
  let final
  Math.abs(Math.max(...result))>Math.abs(Math.min(...result))? final = Math.abs(Math.max(...result)) : final = Math.abs(Math.min(...result))
  return final
}

//寻找二维数组最小值
export function MINforArr(arr){
  let result2 = []
  arr.forEach((item,index)=>{
    result2[index] = Math.min(...item)
  })
  let final = Math.min(...result2)
  return final
}

//配置heatmap的颜色
export function heatmapColormap(item,cate,legendType,newColors = {}){
  //item: c_ n_
  //cate: 种类
  let elemcolor = []
  //console.log("cate:",cate)
  newColors[item] = []
  if(item.substring(0,2)=="c_"){ //这里只配置c_de颜色
    //legendType[item]
    let colors = colorMap(legendType[item])
    legendType[item].forEach((d,n) => {
      newColors[item].push({type:d,color:colors[n]})
    });
    //console.log(newColors)
    newColors[item].forEach((k,m) => {
      //console.log("k:",k.type)
      if(cate == k.type){
        elemcolor.push(k.color)
        //console.log(elemcolor)
      }
    });
  }
  // else if(item.substring(0,2)=="n_"){
  //   legendType[item].forEach((d,n) => {
  //     d == "NA"? elemcolor.push("#C0C0C0"):null
  //   })
  // }
  return elemcolor

}
//配置legend颜色
export function colorMap(arr){
  let color1 = ["#C0C0C0"]
  let color2 = ["#C0C0C0","#7d9fee"]
  //let color3 = ["#C0C0C0","#7d9fee","#ee7db5"] //yuanlai
  let color3 = ["#C0C0C0","#cc4f7b","#314893"]
  //let color32 = ["#C0C0C0","#ee937d","#a67dee"]
  let color4 = ["#C0C0C0","#ee937d","#ee7db5","#7d9fee"]
  let color5 = ["#C0C0C0","#86e5e9","#ee7e7d","#cc4f7b","#314893"] //
  let color6 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee"]
  let color7 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#7deea4"]
  let color13 = ["#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#C0C0C0","#eed97d","#ee937d","#ee7db5","#a67dee","#7d9fee","#7deea4"]
  arr.length>7? console.log("超出颜色配置范围!!",arr.length):null
  switch(arr.length){
    case 1: return color1; break;
    case 2: return color2; break;
    case 3: return color3; break;
    case 4: return color4; break;
    case 5: return color5; break;
    case 6: return color6; break;
    case 7: return color7; break;
    case 13: return color13; break;
  }
  
}

export function NAlen(addName,legendType){
  //寻找c_的最大值
  let len = []
  addName.forEach((item,index)=>{
    item.substring(0,2) == "c_"? len.push(legendType[item].length):null
  })
  //console.log("",len)
  let length = 180 / Math.max(...len)
  return length
}

//生成图例的格子
export function showLegend(arr1,arr2,n,sign,base){
  //arr1是该指标的种类
  //生成的用于画图的lengd数据
  //n是在图例的多少行
  //sign判断c_还是n_
  if(sign == "c_"){
    for(let i = 0;i < arr1.length;i++){
      const elem = {data:null,row:0,col:0,colors:null,num:0,x:0,textx:0}
      let colors = []
      let color
      arr1.length > 20? color = "blue":(colors = colorMap(arr1),color = colors[i]) //这里在限制年龄
      elem.data = arr1[i]
      elem.row = n
      elem.col = i + 1
      elem.colors = color //配置颜色
      elem.num = arr1.length
      i == 0? elem.textx = base/2 :((arr1.length==2&&i == 1)? elem.textx = base + 1 + (180-base)/(arr1.length-1)*(i)*1/4:elem.textx=18)
      i == 0? elem.x = 0:elem.x = base + (180-base)/(arr1.length-1)*(i-1) +1
      arr2.push(elem)
    }
  }
  else if(sign == "n_"){
    let tempArr = ["NA",""]
    for(let i = 0;i < tempArr.length;i++){
      const elem = {data:null,row:0,col:0,colors:null,num:0,x:0,textx:0}
      elem.data = tempArr[i]
      elem.row = n
      elem.col = i + 1
      tempArr[i]== "NA"? elem.colors = "#C0C0C0":null //配置颜色
      elem.num = tempArr.length
      i == 0? elem.textx = base/2 :elem.textx = base + 1 + (180-base)/(tempArr.length-1)*1/2*1/2
      i == 0? elem.x = 0:elem.x = base + (180-base)/(tempArr.length-1)*(i-1) + 1
      arr2.push(elem)
    }
  }
    
}

//
export function rowColumn (addData,arr,n,r,item,legendType){ //算左边的图例
  //addData的第几列 索引 r第几行
  let colorhp = []
  for(let i = 0; i < addData.length;i++){
    const elem = {data:null,row:0,col:0,color:null}
    
    elem.data = addData[i][n]
    elem.row = r
    elem.col = i + 1
    elem.color = heatmapColormap(item,addData[i][n],legendType)[0]
    //console.log(elem.color)
    arr.push(elem)
  }
}


//获得临床指标对应的数据对应的种类 主要和legend有关
export function nMCatagory(addData,arr2,n){
    let arr1 = []
    arr2.push("NA") //强制在数据列表内增加NA
    for(let i = 0;i < addData.length;i++){
      arr1.push(addData[i][n])
      if(arr1[i] != "NA"){
        if(arr2.indexOf(arr1[i]) == -1){
          arr2.push(arr1[i])
        }
      }
    }
    arr2 = Array.from(new Set(arr2)) //去重+重排序
}


//混合两个数组 c_ n_ c_ ^
export function aryJoinAry(ary,ary2){
  let minLength;
  let itemAry=[];
  let itemArys=[];
  //先拿到两个数组中长度较短的那个数组的长度
  if(ary.length>ary2.length){
    minLength=ary2.length;
  }
  else{
    minLength=ary.length;
  }
  //将两个数组中较长的数组记录下来
  let longAry=arguments[0].length>arguments[1].length?arguments[0]:arguments[1];
  //循环范围为较短的那个数组的长度
  for (let i = 0; i < minLength; i++) {
    //将数组放入临时数组中
    itemAry.push(ary[i]);
    itemAry.push(ary2[i])
  }
  itemArys.push(itemAry.concat(longAry.slice(minLength)))

  //itemAry和多余的新数组拼接起来并返回。
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
      //"mv Endothelial cells":"#b698cd",
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


//选择方法
export function chooseMethod(chosenMethod,data){
  let afterdata = []
  console.log("chosenMethod:",chosenMethod);
  console.log("Data.Bardata:",data);
  chosenMethod.forEach((item,index) => {
      if(item != ""){
          afterdata.push(data[index]);
          // data.forEach((ditem,dindex) => {
          //     //添加对应的方法
          //     afterdata.push(ditem[index]);
          // });
      }

  });
  return afterdata;
}

//store the top methods
export function viewMethod(methoddata){
  let tmpMethod = []
  tmpMethod.push
}

export function dataHandler(data){
  //获取横坐标
  let columns = data.columns.slice(2);
  console.log("dataHandler columns:",columns)
  if(columns.indexOf("P-value") != -1){
    columns.splice(columns.indexOf("P-value"),1)
  }

  //存放每个box中的所有特征值
  const result = [];
  //存放所有中位数
  const means = [];
  columns.forEach((arr) => {
    const temp1 = [];
    //获取每个column对应的所有值
    data.forEach((d) => {
      temp1.push(parseFloat(d[arr]));
    });
    //通过内置函数得出每组值的下边缘、下四分位数、中位数、上四分位数、上边缘并存入result数组
    const stat = new Oviz.algo.Statistics(temp1);
    result.push([
      stat.min(),
      stat.Q1(),
      stat.median(),
      stat.Q3(),
      stat.max(),
    ]);
    //中位数存入数组
    means.push(stat.mean());
  });
  return { result: result, means, columns: columns }
}