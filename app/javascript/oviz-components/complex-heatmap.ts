import { HeatMapOption } from "crux/dist/element";
import { Component, ComponentOption } from "crux/dist/element";
import * as d3 from "d3";
import { schemeGradient } from "crux/dist//color";
import { minmax } from "crux/dist//utils/math";
import { getPaddings } from "crux/dist/element/chart/utils/option-padding";

interface ComplexHeatMapOption extends ComponentOption {
  showUpper: boolean;
  showLower: boolean;
  rotation: number;
  squareLength: number;
  colNames: Array<string>;
  rowNames: Array<string>;
  matrix: Array<Array<number>>; // matrix里每一个数组为一列元素
  rMatrix: Array<Array<number>>; // matrix里每一个数组为一列元素
  showVal: boolean; // 在格子上显示值
  showStar: boolean;//显著性的星星
  valSize: number; // 默认8
  axisSize: number; // 默认8
  centered: boolean; // 中心放在某位置，待解决三角函数
  showCircle: boolean; // 展示中间为圆
  showBar: boolean;
  nendColor: string;
  startColor: string;
  endColor: string;
  highlightColor: string;
  chosenValue: number;
  dataRange: [number, number];
  negdataRange: [number, number];
  rRange: [number, number];
  pivot: number;
  xPadding: number;
  yPadding: number;
  generateTooltip?: (d) => string;
}

export class ComplexHeatMap extends Component<ComplexHeatMapOption> {
  public chosenIndex: Array<number> = [null, null];
  public chosenItem: Array<number> = [null, null];
  public chosenValue: number = -1;
  public radius = 5;
  public refresh = false;
  private _vScale;
  private _colorScheme;
  private _nScale;
  private _ncolorScheme;
  private _rMatrix;
  private _rScale;
  private generateTooltip : (d) => string = (d) => "value: "+d.toFixed(3);

  willRender() {
    this._rMatrix = this.prop.rMatrix || this.prop.matrix;
    const rRange = this.prop.rRange || minmax(this._rMatrix.flat());
    this._rScale = d3.scaleLinear().domain(rRange).range([0, 1]);
    const dataRange = this.prop.dataRange || minmax(this.prop.matrix.flat().map(d => Math.max(d, this.prop.pivot)));
    this._vScale = d3.scaleLinear().domain(dataRange).range([0, 1]);
    this._colorScheme = schemeGradient(this.prop.startColor, this.prop.endColor);
    const negdataRange = this.prop.negdataRange || minmax(this.prop.matrix.flat().map(d => Math.min(d, this.prop.pivot)));
    this._nScale = d3.scaleLinear().domain(negdataRange).range([1, 0]);
    this._ncolorScheme = schemeGradient(this.prop.startColor, this.prop.nendColor);
    if(this.prop.generateTooltip) this.generateTooltip = this.prop.generateTooltip
  }

  public render() {
    // matrix外维为行、内维为列，instancename实际上是选取列的
      
    return this.t` 
        Container {
            @let wd = (prop.squareLength+prop.xPadding) * prop.colNames.length
            @let ht = (prop.squareLength+prop.yPadding) * prop.rowNames.length
            width = wd
            height = ht
            rotation = @rotate(prop.rotation);
            Container {
            x = @scaled-x((prop.squareLength+prop.xPadding) * (0.5))
            y = @scaled-y((prop.squareLength+prop.yPadding) * (0.5))
            @let data1 = prop.matrix
            @let data2 = prop.rowNames
            @for (item1, index2) in data1 {
                @for (item2, index1) in item1 {
                    @if ((index1 > index2) && prop.showUpper) || ((index1 < index2) && prop.showLower) || ((index1 == index2) && prop.showLower && prop.showUpper) {
                        @let value = item2
                        Container {
                            x = @scaled-x((prop.squareLength+prop.xPadding) * (index1))
                            y = @scaled-y((prop.squareLength+prop.yPadding) * (index2))
                            @if (index1 === chosenIndex[0] || index2 === chosenIndex[1]){
                                Rect.centered {
                                    height = prop.squareLength
                                    width = prop.squareLength
                                    anchor = @anchor("middle","center")
                                    fill = prop.highlightColor
                                }
                            }
                            @if prop.showCircle {
                                Circle.centered {
                                    key = [index2, index1];
                                    @let pval = _rMatrix[index2][index1]
                                    @let valR = _rScale(pval)
                                    r = @scaled(prop.squareLength / 2* valR > 0? prop.squareLength / 2* valR: 0)
                                    stroke = "#000"
                                    // fill = "#fff"
                                    fill = value>=prop.pivot? _colorScheme.get(_vScale(value)) : _ncolorScheme.get(_nScale(value))
                                    behavior:tooltip {
                                        content = generateTooltip(value)
                                    }
                                    @props prop.opt.circle
                                }
                            }
                            @else {
                                Rect.centered {
                                    key = [index2, index1];
                                    height = prop.squareLength
                                    width = prop.squareLength
                                    stroke = "none"
                                    fill = value>=prop.pivot? _colorScheme.get(_vScale(value)) : _ncolorScheme.get(_nScale(value))
                                    behavior:tooltip {
                                        content = generateTooltip(value)
                                    }
                                    @props prop.opt.rect
                                }
                            }
                            Container {
                                rotation = @rotate(-90-prop.rotation)
                                key = [index2, index1]
                                @if value.toFixed(2) === chosenValue {
                                    Circle.centered {
                                        fill = prop.highlightColor; r = @scaled(radius + 1)
                                    }
                                }
                                @yield innerContent with {index1: index1, index2: index2, prop: prop} default {
                                    @if prop.showCircle {
                                        Arc {
                                            key = [index2, index1]
                                            x1 = 90
                                            x2 = value * 360 + 90
                                            r1 = 0
                                            @let pval = _rMatrix[index2][index1]
                                            @let valR = _rScale(pval)
                                            r2 = @scaled(radius * valR)
                                            // fill = prop.colorScheme.get(value)
                                            fill = value>=prop.pivot? _colorScheme.get(_vScale(value)) : _ncolorScheme.get(_nScale(value))
                                            @props prop.opt.arc
                                        }
                                    }
                                }
                                @if prop.showVal {
                                    Container {
                                        rotation = @rotate(90)
                                        Text {
                                            anchor = @anchor("middle", "center")
                                            // text = value.toFixed(2).toString().slice(-2)
                                            text = value
                                            fontSize = @scaled(prop.valSize)
                                            @props prop.opt.val
                                        }
                                    }
                                }
                                @if prop.showStar {
                                    Container {
                                        rotation = @rotate(90)
                                        Text {
                                            @let pval = _rMatrix[index2][index1]
                                            anchor = @anchor("middle", "center")
                                            text = pval < 0.001? "***": pval < 0.01? "**": pval < 0.05? "*": ""
                                            fontSize = @scaled(prop.valSize)
                                            @props prop.opt.val
                                        }
                                    }
                                }
                            }
                            on:mouseenter = (ev, el) => setActive([index1,index2], el)
                            on:mouseleave = (ev, el) => setActive([null, null], el)
                            on:click = (ev, el) => setCor([index1,index2], el)
                        }
                    }
                }
            }
            @for (item2, index2) in data2 {
                Container {
                    @let upper = prop.showUpper && !prop.showLower
                    x = @scaled-x(upper? (prop.squareLength+prop.yPadding)*prop.rowNames.length: - prop.squareLength)
                    y = @scaled-y(index2 * (prop.squareLength+prop.yPadding))
                    anchor = upper? @anchor("m", "l"): @anchor("middle", "right")
                    @yield rowAxis with {item: item2, key: index2, prop: prop} default {
                        Text{
                            key = index2
                            text = item2
                            fill = "#000"
                            fontSize = @scaled(11)
                            @props prop.opt.rowAxis
                        }
                    }
                }
            }
            // 列名
            Container {
                rotation = @rotate(90)
                // 为每一列的名字
                @let data2 = prop.colNames
                @for (item2, index2) in data2 {
                    Container {
                        @let upper = prop.showUpper && !prop.showLower
                        x = @scaled-x(upper? - prop.squareLength: (prop.squareLength+prop.yPadding)*prop.rowNames.length)
                        y = @scaled-y( - index2 * (prop.squareLength+prop.xPadding))
                        anchor = upper? @anchor("m", "r"): @anchor("m", "l")
                        @yield colAxis with {item: item2, key: index2, prop: prop} default {
                            Text {
                                key = index2
                                text = item2
                                fill = "#000"
                                fontSize = @scaled(11)
                                @props prop.opt.colAxis
                            }
                        }
                    }
                }
            }
            @yield children
            @yield correlation with {chosenItem: chosenItem, refresh: refresh}
        }
        }
	`;
  }

  public setActive(chosen, el) {
    this.chosenIndex = chosen;
    el.$v.root.stage = chosen[0] ? "active" : null;
  }

  public setCor(chosen, el) {
    this.refresh = chosen != this.chosenItem;
    this.chosenItem = chosen;
    this.redraw();
    this.refresh = false;
  }

  // defaultProp() {
  //     return Object.assign(Object.assign({}, super.defaultProp()), { startColor: "#fff", endColor: "#fa0", showUpper: true, showLower: true, rotation: 0 });
  // }
  public defaultProp() {
    return {
      ...super.defaultProp,
      showUpper: true,
      showLower: true,
      rotation: 0,
      squareLength: 15,
      colNames: null,
      rowNames: null,
      showVal: false, // 在格子上显示值
      showStar: false,
      valSize: 8, // 默认8
      centered: false, // 中心放在某位置，待解决三角函数
      showCircle: false, // 展示中间为圆
      showBar: false,
      nendColor: "blue",
      startColor: "white",
      endColor: "red",
      highlightColor: "yellow",
      chosenValue: -1,
      pivot: 0,
      xPadding: 0,
      yPadding: 0
    };
  }
}

export const mockConfig = {
  showUpper: false,
  showLower: true,
};

export const mockData = {
  prop: [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
  ],
  rotation: 90,
};