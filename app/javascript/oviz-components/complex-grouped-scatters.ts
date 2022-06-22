import Oviz from "crux";
import { ComponentOption, } from "crux/dist/element/component-options";
import { Component, XYPlotOption } from "crux/dist/element";
import { polygonHull } from "d3-polygon"
import { distributer } from "utils/distributer";

export interface ComplexGroupedScattersOption extends XYPlotOption {
    data: any;
    classifications: Array<string>;
    radius: number;
    showLabel: boolean;
    showConvexHull: boolean;

    plotSize: [number, number]; // [width, height]
    valueRange: [number, number];
    categroyRange: [number, number];
    colorMap: any; // ColorSchemeCategory
    xLabel: string;
    yLabel: string;
    generateScatterTooltip?: (d) => string;
    generateHullTooltip?: (d) => string;
}

export class ComplexGroupedScatters extends Component<ComplexGroupedScattersOption> {

    private result = {};
    private _colorMap;
    private hull;
    private scatterData;
    private colorMap;
    private labels;
    private anchors;

    public render() {
        return this.t`
        Component {
            height = prop.plotSize[1]
            width = prop.plotSize[0]
            xScale = @scale-linear(prop.categroyRange[0], prop.categroyRange[1])
            yScale = @scale-linear(prop.valueRange[1], prop.valueRange[0])
            @props prop
            @yield background default {
                Rect {
                    width = 100%
                    height = 100%
                    stroke = "#000"
                    fill = "none"
                }
            }
            @if prop.showConvexHull {
                Component {
                    @for (item, index) in hull {
                        @if item != null {
                            Polygon {
                                points = @scaled(item);
                                fill = colorMap.colors[index]
                                fillOpacity = 0.2
                                behavior:tooltip {
                                    content = prop.generateHullTooltip({item, index})
                                }
                            }
                        }
                    }
                }
            }
            Component {
                @for (item, index) in scatterData {
                    @for (point, label) in item {
                        Circle.centered {
                            x = @scaled-x(point[0])
                            y = @scaled-y(point[1])
                            r = prop.radius
                            fill = colorMap.colors[index]
                            behavior:tooltip {
                                content = prop.generateScatterTooltip({point, index, label})
                            }
                        }
                    }
                }
            }
            @if prop.showLabel {
                @for (item, index) in labels {
                    Container {
                        x = item.x
                        y = item.y
                        Rect.centered.detached {
                            width = item.width
                            height = item.height
                            fill = "DAB88B"
                            fillOpacity = 0.7
                            cornerRadius = 4
                            stroke = "black"
                        }
                        Text.centered {
                            text = item.name
                            fill = "white"
                            fontSize = 7
                        }
                    }
                }
            }
            @yield xAxis default {
                Text {
                    x = 50%; y = @geo(100,20)
                    anchor = @anchor("middle","center")
                    text = prop.xLabel
                    fill = "#000"
                    fontSize = 14
                    @props prop.opt.xLabel
                }
                Axis("bottom") {
                    y = 100%
                    @props prop.opt.xAxis
                }
            }
            @yield yAxis default {
                Component{
                    x = -40; y = 50%
                    rotation = @rotate(-90)
                    Text{
                        text = prop.yLabel
                        fill = "#000"
                        anchor = @anchor("middle","center")
                        fontSize = 14
                        @props prop.opt.yLabel
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
        console.log(this.prop)
        if (this._firstRender) {
            this.colorMap = this.prop.colorMap || Oviz.color.schemeCategory("light", this.prop.classifications);
            if(this.prop.showConvexHull) {
                const hull = {}
                Object.entries(this.prop.data).forEach(([key, value]: [string, any]) => {
                    hull[key] = polygonHull(Object.values(value))
                })
                this.hull = hull
            }
            this.scatterData = this.prop.data
        }
        if(this.prop.showLabel) {
            let labels = Object.values(this.prop.data).map(project => {
                return Object.entries(project).map(([key, value]) => {
                    return {
                        x: (value[0]-this.prop.categroyRange[0])/(this.prop.categroyRange[1] - this.prop.categroyRange[0])*this.prop.plotSize[0],
                        y: (this.prop.valueRange[1]-value[1])/(this.prop.valueRange[1] - this.prop.valueRange[0])*this.prop.plotSize[1],
                        name: key,
                        width: 4.8 * (key.length),
                        height: 14,
                        r: 2
                    }
                })
            }).flat();
            // let anchors = this.prop.data.data.map(d => {
            //     return {
            //         x: d.pos*500,
            //         y: (1-d.value)*500,
            //         r: 2
            //     }
            // });
            distributer().label(labels).anchor(labels).width(this.prop.plotSize[0]).height(this.prop.plotSize[1]).start(2000);
            this.labels = labels
            console.log(this.labels)
        }
    }

    public defaultProp() {
        return {
            ...super.defaultProp,
            plotSize: [400, 400],
            xLabel: "X",
            yLabel: "Y",
            categroyRange: [0, 1],
            valueRange: [0, 1],
            showLabel: false,
            showConvexHull: true,
            radius: 3,
            generateHullTooltip: (d) => 'Project: ' + d.index + '<br>' + 'Sample number: ' + d.item.length, 
            generateScatterTooltip: (d) => 'Project: ' + d.index + '<br>' + 'Sample name: ' + d.label + '<br>' + 'X value: ' + d.point[0].toFixed(2) + '<br>' + 'Y value: ' + d.point[1].toFixed(2), 
        };
    }

}