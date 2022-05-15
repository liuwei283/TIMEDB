import Oviz from "crux";
import { ComponentOption, } from "crux/dist/element/component-options";
import { Component, XYPlotOption } from "crux/dist/element";

export interface ComplexGroupedBarplotOption extends XYPlotOption {
    stat: any;
    classifications: Array<string>;

    plotSize: [number, number]; // [width, height]
    valueRange: [number, number];
    colorMap: any; // ColorSchemeCategory
    xlabel: string;
    ylabel: string;
    generateTooltip?: (d) => string;
}

export class ComplexGroupedBars extends Component<ComplexGroupedBarplotOption> {

    private result = {};
    private _colorMap;

    public render() {
        return this.t`
        XYPlot {
            height = prop.plotSize[1]
            width = prop.plotSize[0]
			discreteCategory = true
			valueRange = prop.valueRange
			data = result
            @props prop.opt.xyplot
            @yield background default {
                Rect {
                    width = 100%
                    height = 100%
                    stroke = "#000"
                    fill = "none"
                }
            }
			GroupedBars {
				data = prop.classifications
				:children(d) {
                    @yield bar with d default {
                        Rect.full{
                            fill = _colorMap.colors[d.key]
                            @props prop.opt.bar
                            behavior:tooltip {
                                content = prop.generateTooltip(d)
                            }
                        }
                    }
					Component.full {
						y = 100%
						yScale = @scaleLinear(0, d.data.value)
                        @yield box with d default {
                            Component.full {
                                @let q1 = -@scaled-y(prop.stat[d.key][d.data.pos][1])
                                @let q3 = -@scaled-y(prop.stat[d.key][d.data.pos][3])
                                Rect.full  {
                                    fill = _colorMap.colors[d.key]
                                    stroke = "#003366"
                                    x = 33%
                                    y = q3
                                    width = 33%
                                    height = q1-q3
                                    @props prop.opt.box
                                }
                            }
                        }
                        @yield whiskle with d default {
                            Component.full {
                                @let min = -@scaled-y(prop.stat[d.key][d.data.pos][0])
                                @let max = -@scaled-y(prop.stat[d.key][d.data.pos][4])
                                Line { x1 = 41.25%-1; x2 = 57.75%+1; y = min; stroke = "#000" }
                                Line { x1 = 41.25%-1; x2 = 57.75%+1; y = max; stroke = "#000" }
                                Line { x = 50%; y1 = min; y2 = max; stroke = "#000"; dashArray = "3, 2" }
                            }
                        }
                        @yield median with d default {
                            Component.full {
                                @let median = -@scaled-y(prop.stat[d.key][d.data.pos][2])
                                Line {x1 = 33%; x2 = 66%; y = median; stroke = "#800080"; dashArray = "2, 2"}
                            }
                        }
                        @expr console.log(prop.stat[d.key][d.data.pos])
                        behavior:tooltip {
                            content = prop.generateTooltip(d)
                        }
					}
                    @yield mean with d default {
					    Line {x1 = 33%; x2 = 66%; stroke = "#ed2939"}
                    }
				}
			}
            @yield xAxis default {
                Text {
                    x = 50%; y = @geo(100,20)
                    anchor = @anchor("middle","center")
                    text = prop.xlabel
                    fill = "#000"
                    fontSize = 14
                    @props prop.opt.xlabel
                }
                Axis("bottom") {
                    y = 100%
                    @props prop.opt.xAxis
                    tick.rotation = prop.opt.xAxisRo || 0
                }
            }
            @yield yAxis default {
                Component{
                    x = -40; y = 50%
                    rotation = @rotate(-90)
                    Text{
                        text = prop.ylabel
                        fill = "#000"
                        anchor = @anchor("middle","center")
                        fontSize = 14
                        @props prop.opt.ylabel
                    }
                }
                Axis("left") {
                    @props prop.opt.yAxis
                }
            }
            @yield children
		}
        `;
    }

    public willRender(): void {
        if (this._firstRender) {
            Object.entries(this.prop.stat).forEach(([key, value]) => {
                this.result[key] = Object.entries(value).map(d=>[d[0], d[1][5]])
            })
            console.log(this.result)
            console.log(this.prop.stat)
            this._colorMap = this.prop.colorMap || Oviz.color.schemeCategory("light", this.prop.classifications);
        }
    }

    public defaultProp() {
        return {
            ...super.defaultProp,
            plotSize: [800, 400],
            xlabel: "",
            ylabel: "",
            generateTooltip: (d) => "no content"
        };
    }

}