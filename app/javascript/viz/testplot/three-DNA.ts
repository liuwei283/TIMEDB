import { Component, ComponentOption } from "crux/dist/element";
import { Listener } from "crux/dist/utils/event";

export interface ThreeDNAOption extends ComponentOption {
    data:any;
    plotSize:number;
    mainDict:number;
    colorMap:any;
    labelFontSize:string;
    legendData:any;
    tickFontSize:number;
    title:string;
    yLabel:string;
    xLabel:string;
}

export class ThreeDNA extends Component<ThreeDNAOption> {

    render() {
        return this.t`
        Component {
            XYPlot {
                height = prop.plotSize[0]; width = prop.plotSize[1]
                //width = 11*result.length
                data = prop.data
                discreteCategory = true
                valueRange = prop.mainDict
                gap = 0
                Rect{
                    width = 100%
                    height = 100%
                    stroke = "#000"
                    fill = "none"
                }
                Bars {
                    :children (d) {
                        Rect.full {
                            fill = prop.colorMap[d.data.mut]
                            stroke = "#666"
                        }
                    }
                }
                Text{
                    x = 50%; y = @geo(100,40)
                    anchor = @anchor("middle","center")
                    text = prop.xLabel
                    fill = "#000"
                    fontSize = prop.labelFontSize
                }
                Text{
                    x = 50%; y = 20
                    anchor = @anchor("middle","center")
                    text = prop.title
                    fill = "#000"
                    fontSize = prop.tickFontSize
                }
                Component{
                    x = -30; y = 50%
                    rotation = @rotate(-90)
                    Text{
                        text = prop.yLabel
                        fill = "#000"
                        anchor = @anchor("middle","center")
                        fontSize = prop.labelFontSize
                    }
                }
                Axis("bottom") { 
                    y = 100%
                    :label(d) {
                        Text {
                            fontSize = 10
                            y = 5
                            text = d.value.split(":")[1]
                            rotation = @rotate(-90)
                            anchor = @anchor("r", "m")
                        }
                    }
                }
                Axis("left");
                
            }
            Legend {
                x = 50; y = 20
                padding = 8
                data = prop.legendData
                lineHeight = 15
                legendWidth = 20
            }

        }`;
    }
}
