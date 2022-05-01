import Oviz from "crux";
import { ComponentOption } from "crux/dist/element/component-options";
import { Component } from "crux/dist/element";
import { EditText } from "./edit-text";

export interface DraggableContainerOption extends ComponentOption {
    BarWidth: number,
    refresh: boolean
}

export class DraggableContainer extends Component<DraggableContainerOption> {

    public isBarShow: boolean = true;
    public isClosed: boolean = false;

    public ix: number = 0;
    public iy: number = 0;

    public rot: number = 0;
    public refresh: boolean;

    public render() {
        return this.t`
        Component {
            Container {
                rotation = @rotate(rot%360)
                x = ix
                y = iy
                on:mouseenter = showBar()
                on:mouseleave = closeBar()
                @if isClosed == false {
                    Container {
                        // main plot
                        Container {
                            @let pos = [ix, iy]
                            @yield children with pos default {
                                Rect {
                                    height = 10
                                    width = prop.BarWidth
                                    fill = "white"
                                    stroke = "black"
                                    strokeWidth = 1
                                    strokeOpacity = 0.2
                                    @props prop.opt.default
                                }
                            }
                        }
                        // tool bar
                        Container.detached {
                            y = -10
                            height = 10
                            width = prop.BarWidth
                            Rect.full {
                                cursor = "move"
                                fill = "grey"
                                style:fill-opacity = isBarShow? 1: 0
                                style:stroke-opacity = isBarShow? 1: 0
                                behavior:drag {
                                    onDrag = @bind(handlePos)
                                }
                                on:dblclick = closeBar()
                                @props prop.opt.bar
                            }
                            Text {
                                y = 50%-1
                                anchor = @anchor("m", "l")
                                cursor = "pointer"
                                text = "×"
                                fill = "white"
                                fontSize = 18
                                style:font-weight = "bold"
                                style:fill-opacity = isBarShow? 1: 0
                                on:click = handleClick()
                            }
                            // EditText {
                            //     cursor = "pointer"
                            //     x = 20
                            //     fontSize = 11
                            //     text = "R"
                            //     fill = "white"
                            //     style:font-weight = "bold"
                            //     anchor = @anchor("t", "c")
                            // }
                        }
                    }
                }
            }
        }
        `;
    }

    public willRender(): void {
        this.isClosed = this.isClosed && !this.prop.refresh
    }

    public closeBar() {
        this.isBarShow = false
        this.redraw();
    }

    public showBar() {
        this.isBarShow = true
        this.redraw();
    }

    protected handleClick() {
        this.isClosed = confirm("You want to close it?")
        this.redraw();
    }
    
    protected handlePos(_, el, deltaPos: [number, number]) {
        this.ix = this.ix + deltaPos[0],
        this.iy = this.iy + deltaPos[1]
        this.redraw();
    }

    public defaultProp() {
        return {
            ...super.defaultProp,
            MainHeight : 10,
            BarWidth : 50,
            refresh: false
        };
    }

}