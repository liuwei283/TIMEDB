import { Component, XYPlotOption } from "crux/dist/element";

export interface GridPlotOption extends XYPlotOption {
    xLabel: string;
    yLabel: string;
    plotSize: [number, number]; // [width, height]
    legend: any;
    discreteCategory: boolean;
    yAxisRotated: boolean;
    xAxisRotated: boolean;
    labelOffsetVer: number;
    labelOffsetHor: number;
    labelFontSize: number;
    tickFontSize: number;
}

export class GridPlot extends Component<GridPlotOption> {

    protected xAxisRotation = 45;
    public render() {
        return this.t`
        XYPlot{
            @props prop
            height = 30 + prop.plotSize[1]
            width = 35 + prop.plotSize[0]
            padding-l = 35; padding-b = 30
            @yield background
            @yield content with prop.data
            Rect.full {
                stroke = @color("line"); fill = "none"
            }
            @yield leftAxis default {
            @if prop.yAxisRotated {
                Axis("left") {
                    :label(tick) {
                        Text(tick.value) {
                            x = -5; anchor = @anchor("c", "b")
                            rotation = @rotate(-90)
                            fontSize = prop.tickFontSize
                        }
                    }
                }
            } @else {
                Axis("left") {label.fontSize = prop.tickFontSize}
            }
            }
            @yield bottomAxis default {
            @if prop.xAxisRotated {
                Axis("bottom") {
                    y = 100%
                    :label(tick) {
                        Text(tick.value) {
                            @let tickX = @scaled-x(tick.value)
                            @let tickY = 5
                            behavior:drag {
                                direction = "polar"
                                origin = [tickX, tickY]
                                onDrag = @bind(adjustLabel)
                            }
                            y = 5; anchor = @anchor("r", "m")
                            rotation = @rotate(-xAxisRotation)
                            fontSize = prop.tickFontSize
                        }
                    }
                }
            } @else {
                Axis("bottom") {
                    y = 100%; label.fontSize = prop.tickFontSize
                }
            }
            }
            Text {
                text = prop.flip ? prop.xLabel : prop.yLabel
                x = -prop.labelOffsetVer; y = 50%; rotation = @rotate(-90)
                fontSize = prop.labelFontSize
                anchor = @anchor("m", "c")
            }
            Text {
                text = prop.flip ? prop.yLabel : prop.xLabel
                x = 50%; y = @geo(100,prop.labelOffsetHor)
                fontSize = prop.labelFontSize
                anchor = @anchor("t", "c")
            }
        }`;
    }

    protected adjustLabel(ev, el, delta, cuur) {
        this.xAxisRotation = cuur[0] * 180 / Math.PI;
        // console.log(this.xAxisRotation);
        this.redraw();
    }

    public defaultProp() {
        return {
            ...super.defaultProp(),
            xLabel: "",
            yLabel: "",
            labelFontSize: 12,
            tickFontSize: 10,
            labelOffsetVer: 25,
            labelOffsetHor: 15,
            xAxisRotated: true,
        };
    }
}
