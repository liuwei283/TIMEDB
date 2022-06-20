import { ComponentOption } from "crux/dist/element/component-options";
import { Component } from "crux/dist/element";

export interface PaginationContainerOption extends ComponentOption {
    size: number;
    pageSize: number;
}

export class PaginationContainer extends Component<PaginationContainerOption> {

    protected elementCount: number;
    protected pageCount: number;
    protected currentPage: number;

    public render() {
        return this.t`
            Container {
                width = 100%
                Rows {
                    width = 100%
                    Columns {
                        x = 50%
                        Container {
                            padding = 6
                            Rect.full.detached {
                                fill = "none"
                                stroke = "black"
                                cursor = "pointer"
                                on:click = prevPage()
                                @props prop.opt.button
                            }
                            Text {
                                text = "prev"
                                fontSize = 14
                                cursor = "pointer"
                                on:click = prevPage()
                                @props prop.opt.text
                            }
                        }
                        Container {
                            padding = 6
                            Text {
                                text = currentPage
                                fontSize = 14
                                cursor = "pointer"
                                on:click = editPage()
                                behavior:tooltip {
                                    content = "click to edit page"
                                }
                                @props prop.opt.text
                            }
                        }
                        Container {
                            padding = 6
                            Text {
                                text = "/"
                                fontSize = 14
                                fill = "grey"
                                @props prop.opt.text
                            }
                        }
                        Container {
                            padding = 6
                            Text {
                                text = pageCount
                                fontSize = 14
                                @props prop.opt.text
                            }
                        }
                        Container {
                            padding = 6
                            Rect.full.detached {
                                fill = "none"
                                stroke = "black"
                                cursor = "pointer"
                                on:click = nextPage()
                                @props prop.opt.button
                            }
                            Text {
                                text = "next"
                                fontSize = 14
                                cursor = "pointer"
                                on:click = nextPage()
                                @props prop.opt.text
                            }
                        }
                    }
                    @let startIndex = (currentPage - 1) * prop.pageSize
                    @let endIndex = currentPage * prop.pageSize
                    Container {
                        y = 20
                        @yield children with { startIndex, endIndex, currentPage }
                    }
                }
            }
        `;
    }

    public willRender(): void {
        if(this._firstRender) {
            this.elementCount = this.prop.size
            // || this.prop.data.length
            this.pageCount = Math.ceil(this.elementCount / this.prop.pageSize);
            this.currentPage = 1;
        }
    }

    public checkVilidation(page: number) {
        return !isNaN(page) && page >= 1 && page <= this.pageCount
    }

    public editPage() {
        let inputPage = parseInt(prompt("Please input a valid page number, from 1 to"+this.pageCount, String(this.currentPage)));
        if(this.checkVilidation(inputPage)) {
            this.currentPage = inputPage;
            this.redraw();
        } else {
            alert("Page out of range, please type in a valid page number!");
        }
    }

    public nextPage() {
        let nextPage = this.currentPage+1;
        if(this.checkVilidation(nextPage)) {
            this.currentPage = nextPage;
            this.redraw();
        } else {
            alert("Page out of range, please type in a valid page number!");
        }
    }

    public prevPage() {
        let nextPage = this.currentPage-1;
        if(this.checkVilidation(nextPage)) {
            this.currentPage = nextPage;
            this.redraw();
        } else {
            alert("Page out of range, please type in a valid page number!");
        }
    }

    public defaultProp() {
        return {
            ...super.defaultProp,
            pageSize: 10
        };
    }

}