import Oviz from "crux";
import { Color } from "crux/dist/color";
import { Component, ComponentOption } from "crux/dist/element";
import * as d3 from "d3";
import { findBoundsForValues } from "utils/maths";

export interface ComplexScatterplotOption extends ComponentOption{
    // figure attr
    plotSize: {w:number, h:number},
    colors: string[],
    valueRange: Array<number>,
    categoryRange: Array<number>,
    scatterData: any[],
    scatterColumns: string[],
    vectorData: any[],
    vectorLabel?: string,
    clusters: string[],
    groups: string[],
    xAxisIndex: number,
    yAxisIndex: number,
    showErrorEllipse: boolean,
}
export interface ErrorEllipseDatum {
    dx: number,
    dy: number,
    ellipsePath: string,
    xAxisPath: string,
    yAxisPath: string,
}
export interface ScatterClusterDatum {
    center: {x,y},
    ellipseData: ErrorEllipseDatum 
}
export class ComplexScatterplot extends Component<ComplexScatterplotOption> {
    private scatterColumns: any[];
    private scatterData: any[];
    private vectorData: any[];
    private clusterData: Record<string, ScatterClusterDatum>;
    private xLabel;
    private categoryRange;
    private yLabel;
    private valueRange;

    private plotWidth;
    private plotHeight;

    private shapeMap:Map<string, string>;
    private colorMap:Map<string|number, string>;
    render() {
        return this.t`	Component 
        {
            XYPlot {
                height = plotHeight; width = plotWidth;
                x = 50; y = 50
                valueRange = valueRange
                categoryRange = categoryRange
                hasPadding = false
                data = scatterData
                dataHandler = {
                    default: {
                        values: d => d,
                        pos: d => d[xLabel],
                        value: d => d[yLabel],
                    }
                }
                Rect { fill = "none"; stroke = "#000" }
        
                AxisBackground {
                    dashArray = "1, 2"
                }
                AxisBackground {
                    orientation = "vertical"
                    dashArray = "1, 2"
                }
    
                @for (scatter, i) in scatterData {
                    @if (!scatter.cluster) {
                        Component {
                           
                            Circle.centered{ 
                                key = "scatter" + i; x = @scaled-x(scatter[xLabel]); y = @scaled-y(scatter[yLabel]); r = 4
                                fill = colorMap.get(scatter.group)
                                behavior:tooltip {
                                    content = generateScatterContent(scatter)
                                }
                            }
                        }
                    } @else {
                        @let shape = shapeMap.get(scatter.group)
                        Component(shape) {
                            key = "scatter"+i
                            x = @scaled-x(scatter[xLabel]); y = @scaled-y(scatter[yLabel]); fill = colorMap.get(scatter.cluster)
                            width = 8; height = 8
                            anchor = @anchor("m", "c")
                            behavior:tooltip {
                                content = generateScatterContent(scatter)
                            }
                        }
                        Line {
                            x1 = @scaled-x(clusterData[scatter.cluster].center.x); y1 = @scaled-y(clusterData[scatter.cluster].center.y)
                            x2 = @scaled-x(scatter[xLabel]); y2 = @scaled-y(scatter[yLabel])
                            stroke = colorMap.get(scatter.cluster); strokeWidth = 1
                        }
                    }
                    
                }
    
                @if !!vectorData {
                    @for (vector, i) in vectorData {
                        Component {
                            Arrow {
                                key ="vector"+i
                                x = @scaled-x(0); y = @scaled-y(0)
                                x2 = @scaled-x(vector[xLabel]); y2= @scaled-y(vector[yLabel])
                            }
                        }
                        Component {
                            x = @scaled-x(vector[xLabel] * 1.1) 
                            y = @scaled-y(vector[yLabel] * 1.1 ) 
                        
                            @if (vector[xLabel] > 0) {
                                Text {
                                    text = vector[prop.vectorLabel]
                                    anchor = @anchor("l","m")
                                }
                            } @else {
                                Text {
                                    text = vector[prop.vectorLabel]
                                    anchor = @anchor("r","m")
                                }
                            }
                            
                        }
                    }
                }
    
                @if !!clusterData {
                    @for (k, i) in Object.keys(clusterData) {
                        Component {
                            x = @scaled-x(clusterData[k].center.x) - clusterData[k].ellipseData.dx
                            y = @scaled-y(clusterData[k].center.y) - clusterData[k].ellipseData.dy
                            Path {
                                d = clusterData[k].ellipseData.ellipsePath
                                strokeWidth = 2
                                fill = "none"
                                 stroke = colorMap.get(k)
                            }
                            Path {
                                d = clusterData[k].ellipseData.xAxisPath; dashArray = "1, 2"
                                stroke = colorMap.get(k)
                            }
                            Path {
                                d = clusterData[k].ellipseData.yAxisPath; dashArray = "1, 2"
                                stroke = colorMap.get(k)
                            }
                        }
                    }
                }
                
                Axis("bottom") { y = 100% }
                Axis("left") {}
    
                Component {
                    y = 50% 
                    Text(yLabel) {
                        x = -15
                        rotation = @rotate(-90)
                        anchor = @anchor("m", "c")
                        fontSize = 15
                    }    
                }
    
                Component {
                    x = 50%; y = 100% 
                    Text(xLabel) {
                        y = 15
                        anchor = @anchor("m", "c")
                        fontSize = 15
                    }    
                }
                
                // Component {
                //     x = 20; y = 20
                //     height = 50; width = 70
                //     Rect.full {
                //         stroke = @color("line")
                //         fill = "white"
                //     }
                //     Rows {
                //         @for (group, i) in prop.groups {
                //             Component {
                //                 height = 25
                //                 @if scatterClusterData {
                //                    @if i === 0 {
                //                         Circle.centered{
                //                             x = 8; y = 12.5; r = 4; fill = prop.colors[0]
                //                         }
                //                    } @else {
                //                        Rect.centered {
                //                            x = 8; y = 12.5; height = 8; width = 8; fill = prop.colors[0]
                //                        }
                //                    }
                //                 } @else {
                //                     Circle.centered{
                //                             x = 8; y = 12.5; r = 4; fill = prop.colors[i]
                //                     }
                //                 }
                //                 Text(group) {
                //                     x = 15; y = 12.5; anchor = @anchor("l","m")
                //                 }
                //             }
                //         }
                //     }  
                // }
    
                // @if scatterClusterData {
                //     Component {
                //         x = 20; y = 80
                //         height = 50; width = 70
                //         Rect.full {
                //             stroke = @color("line")
                //             fill = "white"
                //         }
                //         Rows {
                //             @for (cluster, i) in clusters {
                //                 Component {
                //                     height = 25
    
                //                     Circle.centered{
                //                             x = 8; y = 12.5; r = 4; fill = prop.colors[i]
                //                     }
                                    
                //                     Text(cluster) {
                //                         x = 15; y = 12.5; anchor = @anchor("l","m")
                //                     }
                //                 }
                //             }
                //         }
                        
                //     }
                // }
            }
        }`;
    }

    didCreate() {
        this.vectorData = this.prop.vectorData;
        this.scatterColumns = this.prop.scatterColumns;
        const shapes = ["Circle", "Rect", "Triangle"];
        if (this.prop.clusters) {
            this.colorMap = this.getMap(this.prop.clusters, this.prop.colors);
            if (this.prop.groups) {                
                this.shapeMap = this.getMap(this.prop.groups, shapes);
            }
        } else if (this.prop.groups) {
            this.colorMap = this.getMap(this.prop.groups, this.prop.colors);
        }
        
    }

    willRender() {
        this.xLabel = this.scatterColumns[this.prop.xAxisIndex];
        this.yLabel = this.scatterColumns[this.prop.yAxisIndex];
        this.scatterData = this.prop.scatterData.map(d => {
            const datum = {sampleId: d.sampleId, group: d.group, cluster: d.cluster};
            datum[this.xLabel] = d[this.xLabel];
            datum[this.yLabel] = d[this.yLabel];
            return datum;
        });
        this.plotWidth = this.prop.plotSize.w;
        this.plotHeight = this.prop.plotSize.h;

        this.categoryRange = this.rangeIsValid(this.prop.categoryRange) ?  this.prop.categoryRange
            : findBoundsForValues(this.scatterData.map(d => d[this.xLabel]), 1);
        this.valueRange = this.rangeIsValid(this.prop.valueRange) ? this.prop.valueRange
            : findBoundsForValues(this.scatterData.map(d => d[this.yLabel]), 1);;

        const svgRatioX = this.plotWidth / (this.categoryRange[1] - this.categoryRange[0]);
        const svgRatioY = this.plotHeight / (this.valueRange[1] - this.valueRange[0]);

        if (this.prop.clusters) {
            const clusterData = {};
            this.prop.clusters.forEach(key => {
                const initialData = this.scatterData.filter(d => d.cluster === key);
                const clusterDatum = this.computeErrorEllipse(initialData, this.xLabel, this.yLabel,
                    svgRatioX, svgRatioY);
                clusterData[key] = clusterDatum;
            })
            this.clusterData = clusterData;
        }
    }

    protected rangeIsValid(range:Array<Number>) :boolean {
        if (!!range && !!range[0] && !!range[1]) return true;
        return false;
    }

    protected computeErrorEllipse(samples, xIndex, yIndex, svgRatioX, svgRatioY): ScatterClusterDatum {
        const ellipseData = {cx:0, cy:0, rx:0, ry:0, rotationAngle:0};
        const s = 5.991;
        const statX = new Oviz.algo.Statistics(samples.map(x => x[xIndex]));
        const statY = new Oviz.algo.Statistics(samples.map(y => y[yIndex]));
    
        ellipseData.cx =  statX.mean();
        ellipseData.cy = statY.mean();
        
        let varX = 0, varY = 0, cov = 0;
        samples.forEach(d => {
            varX += Math.pow( (d[xIndex] - statX.mean()) * svgRatioX, 2) / (samples.length-1);
            varY += Math.pow( (d[yIndex] - statY.mean()) * svgRatioY, 2) / (samples.length-1);
            cov += (d[xIndex] - statX.mean()) * svgRatioX * (d[yIndex] - statY.mean()) * svgRatioY / (samples.length-1);
        })

        const eParams = {a: 1, b: -(varX+varY), c: varX*varY - Math.pow(cov, 2)};
        const eigenValue1 = (-eParams.b + Math.sqrt(Math.pow(eParams.b,2) - 4*eParams.a*eParams.c))/(2*eParams.a);
        const eigenValue2 = (-eParams.b - Math.sqrt(Math.pow(eParams.b,2) - 4*eParams.a*eParams.c))/(2*eParams.a);
        ellipseData.rx = Math.sqrt(s * Math.abs(eigenValue1));
        ellipseData.ry = Math.sqrt(s * Math.abs(eigenValue2));
        
        const rotationRad = Math.atan((varX -eigenValue1)/cov);
        ellipseData.rotationAngle  = rotationRad*180/Math.PI;
        const triFunctions = {
            sin(r) {return r * Math.sin(rotationRad)}, 
            cos(r) {return r * Math.cos(rotationRad)}
        };
        const dx = triFunctions.cos(ellipseData.rx);
        const dy = triFunctions.sin(ellipseData.rx);
        const ellipsePath = `M 0 0 
                    A ${ellipseData.rx} ${ellipseData.ry} ${ellipseData.rotationAngle} 0 1 ${2*dx} ${2*dy}
                    A ${ellipseData.rx} ${ellipseData.ry} ${ellipseData.rotationAngle} 0 1 0 0 Z`;
        const center = {x:statX.mean(), y:statY.mean()};
        const ellipseDatum = {
            dx,
            dy,
            ellipsePath,
            xAxisPath: `M 0 0 L ${2*dx} ${2*dy}`,
            yAxisPath: `M ${dx - triFunctions.sin(ellipseData.ry)} ${dy + triFunctions.cos(ellipseData.ry)} L ${dx + triFunctions.sin(ellipseData.ry)} ${dy - triFunctions.cos(ellipseData.ry)}`,
        }
        return {center, ellipseData: ellipseDatum};
    }


    protected generateScatterContent(scatter){
        return Object.keys(scatter).reduce(((acc, cur) => acc + `${cur}: ${scatter[cur]}<br>` ), "");
    }

    protected getMap(keyArray, valueArray) {
        const map = new Map();
        keyArray.forEach((key,i) => {
            map.set(key, valueArray[i]);
        });
        return map;
    }
}