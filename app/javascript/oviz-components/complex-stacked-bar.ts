import Oviz from "crux";
import { ComponentOption, } from "crux/dist/element/component-options";
import { Component, XYPlotOption } from "crux/dist/element";

export interface ComplexStackedBarOption extends XYPlotOption {
    plotSize: [number, number]; // [width, height]
    valueRange: [number, number];
    data: any;
    classifications: Array<string>
    colorMap: any; // ColorSchemeCategory
    widMap: any;
    baseWidth: number;
    xlabel: string;
    ylabel: string;
    generateTooltip?: (d) => string;
}

export class ComplexStackedBar extends Component<ComplexStackedBarOption> {

    public barMax;
    private _colorMap;
    private generateTooltip: (d) => string = (d) => d.data.pos.split("__").join(": ").split("_").join(" ") +  " : "  + this.prop.widMap[d.data.pos] + "<br>" + d.key + " : " + (100 * d.data.value).toFixed(2) + "%";

    public render() {
        return this.t`
        XYPlot {
            height = prop.plotSize[1]
            width = prop.plotSize[0]
			discreteCategory = true
			valueRange = prop.valueRange
			data = prop.data
            @props prop
			stackedData = {
				stacked: prop.classifications
			}
			StackedBars {
				data = "stacked"		  
				:children(d){
					Rect.full {
                        @expr console.log(d)
						fill = _colorMap.colors[d.key]
						stroke = "white"
						strokeOpacity = 0.5
						strokeWidth = 1
						width = prop.widMap == null? prop.baseWidth: 1 + prop.baseWidth * Math.log2(prop.widMap[d.data.pos])/Math.log2(barMax)
						x = 50%
						anchor = @anchor("top","center")
						behavior:tooltip {
                            content = generateTooltip(d)
                        }
                        @props prop.opt.rect
					}
				}
			}
            @yield xAxis default {
                Text{
                    x = 50%; y = @geo(100,20)
                    anchor = @anchor("middle","center")
                    text = prop.xlabel
                    fill = "#000"
                    fontSize = 14
                    @props prop.opt.xlabel
                }
                Axis("top") {
                    line.stroke = "none"
                    tick.stroke = "none"
                    @props prop.opt.xAxis
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
            if(this.prop.generateTooltip) this.generateTooltip = this.prop.generateTooltip;
            if(this.prop.widMap != null)
            // this.barMax = Object.values(this.prop.widMap).reduce((pre:number, cur:number) =>  pre + cur, 0)
            this.barMax = Math.max(... Object.values(this.prop.widMap))
            this._colorMap = this.prop.colorMap || Oviz.color.schemeCategory("light", this.prop.classifications);
        }
    }

    public defaultProp() {
        return {
            ...super.defaultProp,
            plotSize: [800, 400],
            xlabel: "",
            ylabel: "",
            baseWidth: 40,
            valueRange: [0, 1]
        };
    }

}