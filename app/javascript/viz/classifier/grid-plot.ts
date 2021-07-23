import { Component, XYPlotOption } from "crux/dist/element";

interface GridPlotOption extends XYPlotOption {
    xLabel: string;
    yLabel: string;
    plotSize: [number, number]; // [width, height]
    legend: any;
    discreteCategory: boolean;
}

export class GridPlot extends Component<GridPlotOption> {

    public render() {
        return this.t`
        XYPlot{
            @props prop
            height = 30 + prop.plotSize[0]
            width = 35 + prop.plotSize[1]
            padding-l = 35; padding-b = 30
            @yield background
            @yield content with prop.data
            Rect.full {
                stroke = @color("line"); fill = "none"
            }
            @yield leftAxis default {
                Axis("left") {
                    :label(tick) {
                        Text(tick.value) {
                            x = -5; anchor = @anchor("c", "b")
                            rotation = @rotate(-90)
                            fontSize = 10;
                        }
                    }
                }
            }
            @yield bottomAxis default {
                Axis("bottom") {
                    y = 100%
                }
            }
            Text {
                text = prop.flip ? prop.xLabel : prop.yLabel
                x = -25; y = 50%; rotation = @rotate(-90)
                fontSize = 12
                anchor = @anchor("m", "c")
            }
            Text {
                text = prop.flip ? prop.yLabel : prop.xLabel
                x = 50%; y = @geo(100,15)
                fontSize = 12
                anchor = @anchor("t", "c")
            }
        }`;
    }

    public defaultProp() {
        return {
            ...super.defaultProp(),
            xLabel: "",
            yLabel: "",
        };
    }
}
