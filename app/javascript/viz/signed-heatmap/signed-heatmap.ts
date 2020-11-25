import { ColorSchemeGradient, schemeGradient } from "crux/dist/color";
import { Component, ComponentOption } from "crux/dist/element";
import * as d3 from "d3";
import { findBound } from ".";

export interface SignedHeatMapOption extends ComponentOption {
    rows: [];
    columns: [];
    data: any;
    gridW: number;
    gridH: number;
    positiveEndColor: string;
    negativeEndColor: string;
    startColor: string;
    dataRange: [];
    symRange: boolean;
    showPAnno: boolean;
}

export class SignedHeatMap extends Component<SignedHeatMapOption> {

    private _negScale!: any;
    private _posScale!: any;
    private _negativeColorScheme!: ColorSchemeGradient;
    private _positiveColorScheme!: ColorSchemeGradient;
    private range: any;

    render() {
        return this.t`
        Component{
            Rows {
                @for (row, i) in prop.rows {
                    Columns {
                        @for (col, j) in prop.columns {
                            Component {
                                width = prop.gridW
                                height = prop.gridH
                                behavior:tooltip {
                                    content = ("correlation: " + parseFloat(prop.data[row][col]["r"]).toFixed(3)
                                            + " </br> p-value: " + parseFloat(prop.data[row][col]["p"]).toFixed(3)) }
                                Rect {
                                    // key = n
                                    height = 100%; width = 100%;
                                    fill = getColor(prop.data[row][col]["r"]);
                                }
                                @if prop.showPAnno {
                                    @if (prop.data[row][col]["p"] > 0.7) {
                                        Text.centered {
                                            text = "*"
                                            fontSize = prop.gridH
                                            fill = "black"
                                            x = prop.gridW/2; y = prop.gridH/2
                                        }
                                    }
                                }
                            }
                        }
                        Component {
                            Text {
                                text = row
                                fontSize = prop.gridH > 12 ? prop.gridH - 2 : prop.gridH
                            }
                        }
                    }
                }
                Columns {
                    @for c in prop.columns {
                        Component {
                            width = prop.gridW
                            Text {
                                text = c
                                x = prop.gridW/2
                                y = 2
                                anchor = @anchor("r","m")
                                rotation = @rotate(-90)
                            }
                        }
                    }
                }
            }

            Rows { // legend area
                x = 500; y = 20;
                Component {
                    Columns {
                        @for i in 10 {
                            Component{
                                height = 20; width = 5
                                Rect.full {
                                    fill = _negativeColorScheme.get(-(i-10)/10)
                                }
                                // Text {
                                //     text = scale
                                //     x = 22; y = 10
                                //     anchor = @anchor("l","m")
                                // }
                            }
                        }
                        @for i in 10 {
                            Component{
                                height = 20; width = 5
                                Rect.full {
                                    fill = _positiveColorScheme.get(i/10)
                                }
                                // Text {
                                //     text = scale
                                //     x = 22; y = 10
                                //     anchor = @anchor("l","m")
                                // }
                            }
                        }
                    }
                    Text.centered {
                        text = range.min
                        x = 0; y = 25
                    }
                    Text.centered {
                        text = range.max
                        x = 100; y = 25
                    }
                    Line {
                        x1 = 0; x2 = 100; y1 = 20; y2 = 20
                        stroke = @color("path")
                    }
                }
                Component {
                    @yield groupLegend
                }
            }
        }`;

    }

    public willRender() {
        this.range = this.computeRange(this.prop.dataRange[0],
            this.prop.dataRange[1], this.prop.symRange);
        this._negScale = d3.scaleLinear().domain([this.range.min, 0]).range([-1, 0]);
        this._posScale = d3.scaleLinear().domain([0, this.range.max]).range([0, 1]);
        this._negativeColorScheme = schemeGradient(this.prop.startColor, this.prop.negativeEndColor);
        this._positiveColorScheme = schemeGradient(this.prop.startColor, this.prop.positiveEndColor);
    }

    protected computeRange(min, max, isSym): any {
        if (isSym) {
            let bound = (max > -min) ? max : -min;
            bound = findBound(bound, 0, 2);
            return {min: -bound, max: bound};
        } else {
            const upperBound = findBound(max, 0, 2);
            const lowerBound = findBound(-min, 0, 2);
            return {min: -lowerBound, max: upperBound};
        }
    }

    getColor(data: number): string {
        if (data > 0) return this._positiveColorScheme.get(this._posScale(data));
        else {
            return this._negativeColorScheme.get(-this._negScale(data));
        }
    }
}
