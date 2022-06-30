import Oviz from "crux";
import { Component, XYPlotOption } from "crux/dist/element";

export interface SurvivalLineOption extends XYPlotOption {
    data: any;
    rawData: any; // raw data can have NA and can be unsorted
    classifications: Array<string>;

    NARshow: boolean;
    NARdata: any; // if need self make NAR table, it's should be provided
    valueRange: [number, number];
    // categoryRange: [number, number];
    plotSize: [number, number]; // [width, height]
    colorMap: any; // ColorSchemeCategory
    xlabel: string;
    ylabel: string;
    title: string;
    generateTooltip?: (d) => string;
}

// data sample
// rawData : {
//     c1: [0, 1, 2, 3, 4]
//     c2: [0, 1, 2, 3, 4]
// }
// classifications : [
//     "c1", 
//     "c2"
// ]

export class SurvivalLine extends Component<SurvivalLineOption> {

    private _colorMap;
    private _data;
    private _NARdata;
    private xMax;
    private generateTooltip: (d) => string = (d) => d.index + ": " + d.d.length + " samples";

    public render() {
        return this.t`
        XYPlot {
            height = prop.plotSize[1]
            width = prop.plotSize[0]
			valueRange = prop.valueRange
            hasPadding = false
            // categoryRange = [0, xMax]
            // margin = [ 5, 5]
			data = _data
            @props prop
            @yield background default {
                Rect {
                    width = 100%
                    height = 100%
                    stroke = "#000"
                    fill = "none"
                }
            }
            dataHandler = {
                default: {
                    values: d => d,
                    pos: d => d[0],
                    min: d => d[1],
                    value: d => d[1],
                }
            }
            Axis("bottom") {
                y = 100%;
                includeEndTicks = false
                :label(d) {
                    Text {
                        anchor = @anchor("middle", "center"); y = 10
                        fontSize = 10
						text = d.value
                    }
                    @yield tableNAR with { d, prop } default {
                        @if prop.NARshow {
                            Component {
                                @let tX = 80
                                @for (group, index) in _NARdata {
                                    @let yy = tX
                                    @expr tX += 40
                                    Component {
                                        y = yy
                                        Text {
                                            anchor = @anchor("left", "top")
                                            @let txt = _NARdata[index] == null? null: _NARdata[index].find((item, index, arr) => item[0] <= parseInt(d.value) && ((index+1)>=arr.length || isNaN(arr[index+1][0]) || arr[index+1][0] > parseInt(d.value)))
                                            text = txt == null? "NA": txt[1]
                                            @props prop.opt.NARTable
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            @yield borderNAR with prop default {
                @if prop.NARshow {
                    Component {
                        y = 100%+40
                        Text {
                            text = "Number At Risk"
                            @props prop.opt.NARTitle
                        }
                        Component {
                            @let tX = 40
                            @for (group, index) in _data {
                                @let yy = tX
                                @expr tX += 40
                                Component {
                                    y = yy
                                    x = -30
                                    Text {
                                        // fontSize = 11
                                        text = index+":"
                                        @props prop.opt.NARRow
                                    }
                                }
                            }
                        }
                    }
                }
            }
            Axis("left") {}
            @for (d, index) in _data {
                @let _d = { d, index }
                @yield miniLine with _d default {
                    @for (p, index) in d {
                        @if index%2==1 {
                            // Polyline {
                            //     stroke = _colorMap.colors[_d.index]
                            //     points = @scaled([[p[0], p[1]+0.01], [p[0],p[1]-0.01]])
                            //     @props prop.opt.miniLine
                            // }
                            Text {
                                anchor = @anchor("m", "c")
                                x = @scaled-x(p[0]); y = @scaled-y(p[1])
                                text = "+"
                                fontSize = 10
                                stroke = _colorMap.colors[_d.index]
                                @props prop.opt.miniLine
                            }
                        }
                    }
                }
                // Polyline {
                //     stroke = _colorMap.colors[index]
                //     strokeWidth = 2
                //     points = @scaled(d)
                //     @expr console.log(d)
                //     @expr console.log(index)
                //     behavior:tooltip {
                //         content = generateTooltip({d, index})
                //     }
                //     @props prop.opt.polyLine
                // }
                @for (point, i) in d {
                    @if i + 1 < d.length {
                        Line {
                            x1 = @scaled-x(d[i][0]); y1 = @scaled-y(d[i][1]); x2 = @scaled-x(d[i+1][0]); y2 = @scaled-y(d[i+1][1])
                            strokeWidth = 2
                            stroke = _colorMap.colors[index]
                            // @expr console.log(index)
                            // @expr console.log(point)
                            // @expr console.log(i)
                            // @expr console.log(Math.round(d.length * d[i+1][1]))
                            behavior:tooltip {
                                content = "Subtype: " + index + "</br>Total: " + (d.length-1)+ " samples" + "</br>NAR: " + Math.round((d.length-1) * d[i+1][1]) + " samples"
                            }
                        }
                    }
                }
            }
            Text{
                x = 50%; y = @geo(100,20)
                anchor = @anchor("middle","center")
                text = prop.xlabel
            }
            Text{
                x = 50%; y = -20
                anchor = @anchor("middle","center")
                text = prop.title
                fill = "#000"
                fontSize = 17
            }
            Component{
                x = -30; y = 50%
                rotation = @rotate(-90)
                Text{
                    text = prop.ylabel
                    fill = "#000"
                    anchor = @anchor("center","right")
                    fontSize = 14
                }
            }
        }
        `;
    }

    public willRender(): void {
        if (this._firstRender) {
            this._colorMap = this.prop.colorMap || Oviz.color.schemeCategory("light", this.prop.classifications);
            this._data = this.prop.data || {};
            this._NARdata = this.prop.NARdata || {};
            if(this.prop.generateTooltip) this.generateTooltip = this.prop.generateTooltip;
            if(this.prop.data == null && this.prop.rawData != null) {
                const temp = this.prop.rawData;
                this.prop.classifications.forEach(g => {
                    temp[g].sort((a, b) =>  {
                        if(isNaN(a) || (a-b >= 0)) return 1;
                        else return -1;
                    });
                    temp[g] = temp[g].map((d, index, arr) => [d, 1-(index+1)/arr.length]);
                    const len = temp[g].length;
                    this._NARdata[g] = [[0, len]];
                    this._data[g] = [[0, 1]];
                    if(!isNaN(temp[g][0][0])) this._data[g].push([temp[g][0][0], 1])
                    else this._data[g].push([1, 1])
                    temp[g].forEach((d, index, arr) => {
                        if( !isNaN(d[0]) && arr[index+1] != null && (index >= arr.length || d[0] != arr[index+1][0])) {
                            this._data[g].push(d);
                            this._NARdata[g].push([d[0], Math.round(len*d[1])]);
                            if(!isNaN(arr[index+1][0])) this._data[g].push([arr[index+1][0], d[1]]);
                        }
                    });
                });
            }
            this.xMax = Math.max(...Object.values(this._data).map((sample : any[]) => sample.map(d=>d[0])).flat());
        }
    }

    public defaultProp() {
        return {
            ...super.defaultProp,
            plotSize: [300, 300],
            valueRange: [0, 1],
            data: null,
            rawData: null,
            xlabel: "",
            ylabel: "",
            title: "",
            NARshow: true
        };
    }

}
// import Oviz from "crux";
// import { Component, XYPlotOption } from "crux/dist/element";

// export interface SurvivalLineOption extends XYPlotOption {
//     data: any;
//     rawData: any;
//     classifications: Array<string>;
//     NARshow: boolean;
//     NARdata: any; // if need self make NAR table, it's should be provided
//     valueRange: [number, number];
//     // categoryRange: [number, number];
//     plotSize: [number, number]; // [width, height]
//     colorMap: any; // ColorSchemeCategory
//     xlabel: string;
//     ylabel: string;
//     title: string;
//     generateTooltip?: (d) => string;
// }

// // data sample
// // rawData : {
// //     c1: [0, 1, 2, 3, 4]
// //     c2: [0, 1, 2, 3, 4]
// // }
// // classifications : [
// //     "c1", 
// //     "c2"
// // ]

// export class SurvivalLine extends Component<SurvivalLineOption> {

//     private _colorMap;
//     private _data;
//     private _NARdata;
//     private xMax;
//     private generateTooltip: (d) => string = (d) => d.index + ": " + d.d.length + " samples";

//     public render() {
//         return this.t`
//         XYPlot {
//             height = prop.plotSize[1]
//             width = prop.plotSize[0]
// 			valueRange = prop.valueRange
//             hasPadding = false
//             // categoryRange = [0, xMax]
//             // margin = [ 0.05, 0.05]
//             margin = [0.05, 0.05]
// 			data = _data
//             @props prop
//             @yield background default {
//                 Rect {
//                     width = 100%
//                     height = 100%
//                     stroke = "#000"
//                     fill = "none"
//                 }
//             }
//             dataHandler = {
//                 default: {
//                     values: d => d,
//                     pos: d => d[0],
//                     min: d => d[1],
//                     value: d => d[1],
//                 }
//             }
//             Axis("bottom") {
//                 y = 100%;
//                 includeEndTicks = false
//                 :label(d) {
//                     Text {
//                         anchor = @anchor("middle", "center"); y = 10
//                         fontSize = 10
// 						text = d.value
//                         @props prop.opt.xAxis
//                     }
//                     @yield tableNAR with { d, prop } default {
//                         @if prop.NARshow {
//                             Component {
//                                 @let tX = 80
//                                 @for (group, index) in _NARdata {
//                                     @let yy = tX
//                                     @expr tX += 40
//                                     Component {
//                                         y = yy
//                                         Text {
//                                             anchor = @anchor("left", "top")
//                                             @let txt = _NARdata[index] == null? null: _NARdata[index].find((item, index, arr) => item[0] <= parseInt(d.value) && ((index+1)>=arr.length || isNaN(arr[index+1][0]) || arr[index+1][0] > parseInt(d.value)))
//                                             text = txt == null? "NA": txt[1]
//                                             @props prop.opt.NARTable
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//             @yield borderNAR with prop default {
//                 @if prop.NARshow {
//                     Component {
//                         y = 100%+40
//                         Text {
//                             text = "Number At Risk"
//                             @props prop.opt.NARTitle
//                         }
//                         Component {
//                             @let tX = 40
//                             @for (group, index) in _data {
//                                 @let yy = tX
//                                 @expr tX += 40
//                                 Component {
//                                     y = yy
//                                     x = -30
//                                     Text {
//                                         // fontSize = 11
//                                         text = index+":"
//                                         @props prop.opt.NARRow
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//             Axis("left") {}
//             @for (d, index) in _data {
//                 @let _d = { d, index }
//                 @yield miniLine with _d default {
//                     @for (p, index) in d {
//                         @if index%2==1 {
//                             // Polyline {
//                             //     stroke = _colorMap.colors[_d.index]
//                             //     points = @scaled([[p[0], p[1]+0.01], [p[0],p[1]-0.01]])
//                             //     @props prop.opt.miniLine
//                             // }
//                             Text {
//                                 anchor = @anchor("m", "c")
//                                 x = @scaled-x(p[0]); y = @scaled-y(p[1])
//                                 text = "+"
//                                 fontSize = 11
//                                 stroke = _colorMap.colors[_d.index]
//                                 @props prop.opt.miniLine
//                             }
//                         }
//                     }
//                 }
//                 Polyline {
//                     stroke = _colorMap.colors[index]
//                     strokeWidth = 2
//                     points = @scaled(d)
//                     behavior:tooltip {
//                         content = generateTooltip({d, index})
//                     }
//                     @props prop.opt.polyLine
//                 }
//             }
//             Text {
//                 x = 50%; y = @geo(100,25)
//                 anchor = @anchor("middle","center")
//                 text = prop.xlabel
//                 @props prop.opt.xlabel
//             }
//             Text {
//                 x = 50%; y = -20
//                 anchor = @anchor("middle","center")
//                 text = prop.title
//                 fill = "#000"
//                 fontSize = 17
//                 @props prop.opt.title
//             }
//             Component{
//                 x = -35; y = 50%
//                 rotation = @rotate(-90)
//                 Text {
//                     text = prop.ylabel
//                     fill = "#000"
//                     anchor = @anchor("center","right")
//                     fontSize = 14
//                     @props prop.opt.ylabel
//                 }
//             }
//         }
//         `;
//     }

//     public willRender(): void {
//         if (this._firstRender) {
//             this._colorMap = this.prop.colorMap || Oviz.color.schemeCategory("light", this.prop.classifications);
//             this._data = this.prop.data || {};
//             this._NARdata = this.prop.NARdata || {};
//             if(this.prop.generateTooltip) this.generateTooltip = this.prop.generateTooltip;
//             if(this.prop.data == null && this.prop.rawData != null) {
//                 const temp = this.prop.rawData;
//                 this.prop.classifications.forEach(g => {
//                     temp[g].sort((a, b) =>  {
//                         if(isNaN(a) || (a-b >= 0)) return 1;
//                         else return -1;
//                     });
//                     temp[g] = temp[g].map((d, index, arr) => [d, 1-(index+1)/arr.length]);
//                     const len = temp[g].length;
//                     this._NARdata[g] = [[0, len]];
//                     this._data[g] = [[0, 1]];
//                     if(!isNaN(temp[g][0][0])) this._data[g].push([temp[g][0][0], 1])
//                     else this._data[g].push([1, 1])
//                     temp[g].forEach((d, index, arr) => {
//                         if( !isNaN(d[0]) && arr[index+1] != null && (index >= arr.length || d[0] != arr[index+1][0])) {
//                             this._data[g].push(d);
//                             this._NARdata[g].push([d[0], Math.round(len*d[1])]);
//                             if(!isNaN(arr[index+1][0])) this._data[g].push([arr[index+1][0], d[1]]);
//                         }
//                     });
//                 });
//             }
//             this.xMax = Math.max(...Object.values(this._data).map((sample : any[]) => sample.map(d=>d[0])).flat());
//         }
//     }

//     public defaultProp() {
//         return {
//             ...super.defaultProp,
//             plotSize: [300, 300],
//             valueRange: [0, 1],
//             data: null,
//             rawData: null,
//             xlabel: "",
//             ylabel: "",
//             title: "",
//             NARshow: true
//         };
//     }

// }