
import { Color } from "crux/dist/color";
import { Component, ComponentOption } from "crux/dist/element";
import * as d3 from "d3";
import { scalePow, scaleSqrt } from "d3-scale";

export enum Gravity {
    Top = 0, Right, Bottom, Left,
}

interface DiagramLink {
    source: string;
    target: string;
    correlation: number;
    sourceNode?: any;
    targetNode?: any;
    _strokeWidth?: number;
}

export interface NetworkDiagramOption<Data extends T[], T= any> extends ComponentOption {
    _gravity?: Gravity;
    // // the gravity or direction of the graph
    // _raidus?: number | ((d: T, i: number) => number);
    // // the radius of each dot
    // _maxX?: number;
    // // the maxv alue of x that users provide
    // _minX?: number;
    // // the min value of x that users provide
    // _maxY?: number;
    // // the maxv alue of y that users provide
    // _minY?: number;
    // // The value of the y-coordinate (belongs to the vertical axis)
    // _yFunc?: (d: T, i?: number) => number;
    // // The value of the x-coordinate (belongs to the horizontal axis)
    // _xFunc?: (d: T, i?: number) => number;
    // // The class of circles
    // _classFunc?: (d: T, i?: number) => string;
    // // Whether to display labels of circles
    // _labelFunc?: (d: T, i?: number) => string;
    _links?: DiagramLink[]  ;
    _nodes?: any[] ;
    _phylums?: any;
    colorMap: any;
    showNodeNames: boolean;
    groups: string[];
    groupWidth: number;
    maxR: number; // the maximum radius of a node
}

export class NetworkDiagram extends Component<NetworkDiagramOption<any[], any>> {

    private nodeSizeScale;

    public resetLayout = false;

    protected edgeColor: {group1:string, group2:string };

    protected draggingNode: null;

    protected _height;
    protected _nodes: any[];
    protected _links: DiagramLink[];
    protected _updateNode: {nid, newX, newY};
    protected _scaleX;
    protected _scaleY;
    protected _edgeScale;
    // the nodes groups are hardcoded as
    // group 1: Control enrichment
    // group 2: Gout enrichment
    protected group1LinkedX = 0;
    protected group2LinkedX = 700;
    protected group1LinkedY = 100;
    protected group2LinkedY = 100;
    protected group1LinkedRow = 0;
    protected group1LinkedCol = 0;
    protected group2LinkedRow = 0;
    protected group2LinkedCol = 0;
    protected group1LinkedColumnCount = 0;
    protected group2LinkedColumnCount = 0;
    protected group1NonLinkX = 0;
    protected group2NonLinkX = 700;
    protected group1NonLinkY = 600;
    protected group2NonLinkY = 600;
    protected group1NonLinkColumnCount = 0;
    protected group2NonLinkColumnCount = 0;
    protected layoutConfig = {
        nodeInterval: 70,
        groupWidth: 600,
        offset: 20,
        maxCol: 8,
        nodeStartPos() {
            return this.groupWidth + this.nodeInterval;
        }
    };

    
    render() {
        return this.t`
        Component{
            id = "network"
            width = 1500; height = _height
            Line {
                x1 = layoutConfig.groupWidth; x2 = layoutConfig.groupWidth
                y1 = 0; y2 = @geo(100, -40)
                strokeWidth = 2
                stroke = "grey"
                dashArray = "4 2"
            }
            EditText.centered {
                text = prop.groups[0]
                x = layoutConfig.groupWidth/2; y = 20
                fontSize = 20
            }
            EditText.centered {
                text = prop.groups[1]
                x = layoutConfig.groupWidth * 1.5; y = 20
                fontSize = 20
            }
            @for (l, i) in _links {
                Line {
                    key = "link" + i
                    x1 = l.sourceNode._x; x2 = l.targetNode._x; y1 = l.sourceNode._y; y2 = l.targetNode._y
                    // strokeWidth = l.correlation < 0.5 ? 0.5 : _edgeScale(l.correlation)
                    strokeWidth = Math.abs(l.correlation) < 0.5 ? 0.5 : _edgeScale(Math.abs(l.correlation))
                    stroke = l.correlation < 0 ? edgeColor.group1 : edgeColor.group2
                    behavior:tooltip {
                        content = [edgeDetail, l]
                    }
                }
            }

            @for d in _nodes {
                Component {
                    key = d.NodeName
                    x = d._x
                    y = d._y
                    behavior:drag {
                        onDragStart = @bind(dragStart)
                        onDrag = @bind(dragNode)
                        onDragEnd = @bind(dragEnd)
                    }
                    behavior:tooltip {
                        content = [nodeDetail, d]
                    }
                    
                    Circle.centered{
                        // r =  Math.sqrt(d.NodeSize) * 3.14
                        r = nodeSizeScale(d.NodeSize)
                        fill = getFillByPhylumAndGenus(d)
                        stroke = "#666"
                        @props prop.opt.node
                    }
                    @if prop.showNodeNames {
                        Text.centered {
                            html = parseText(d.NodeName)
                            fill = "black"
                            style:font-weight = "bold"
                            style:user-select = "none"
                        }
                    }
                }
            }
        }`;
    }

    willRender() {
        if (this.resetLayout) {
            this.layoutConfig.nodeInterval = 2 * this.prop.maxR + 5;
            this.nodeSizeScale.range([0,this.prop.maxR]);
            this.resetDefaultLayout();
            this.setupCoord();

            this._nodes.forEach(d => {
                const temp_x = this.setUpXCoordinates(d);
                const temp_y = this.setUpYCoordinates(d);
                d._x = temp_x;
                d._y = temp_y;
            });

            this._height = this.group2NonLinkY + this.layoutConfig.nodeInterval + this.layoutConfig.offset;
            this.$v.size.height = this._height + 400;

            this.resetLayout = false;
        }
    }

    resetDefaultLayout() {
        this.group1LinkedX = 0;
        this.group2LinkedX = 700;
        this.group1LinkedY = 100;
        this.group2LinkedY = 100;
        this.group1LinkedRow = 0;
        this.group1LinkedCol = 0;
        this.group2LinkedRow = 0;
        this.group2LinkedCol = 0;
        this.group1LinkedColumnCount = 0;
        this.group2LinkedColumnCount = 0;
        this.group1NonLinkX = 0;
        this.group2NonLinkX = 700;
        this.group1NonLinkY = 600;
        this.group2NonLinkY = 600;
        this.group1NonLinkColumnCount = 0;
        this.group2NonLinkColumnCount = 0;
    }
    parseText(str: string): string {
        if (str.length > 10 ) {
            const strs = str.split(" ");
            let parsedStr: string = "";
            strs.forEach( (s, i) => {
                parsedStr = parsedStr.concat(`<tspan x = ${s.length / 4 * -1}em dy = ${i}em>${s}</tspan>`);
            });
            return parsedStr;
        }
        return str;
    }

    nodeDetail(d) {
        let details = `Node ID: ${d.NodeName}<br>Size: ${d.NodeSize}`;
        details += `<br>Phylum: ${d.NodePhylum}<br>Genus: ${d.NodeGenus}`;
        return details;
    }
    edgeDetail(l) {
        let details = `Source ID: ${l.source}<br>Target ID: ${l.target}`;
        details += `<br>Correlation: ${parseFloat(l.correlation).toFixed(3)}`;
        return details;
    }
    private setupCoord() {
        this.group2LinkedX = this.prop.groupWidth;
        this.group2NonLinkX = this.prop.groupWidth;
        this.layoutConfig.groupWidth = this.prop.groupWidth - 70;
        this.layoutConfig.maxCol = Math.floor(this.layoutConfig.groupWidth / this.layoutConfig.nodeInterval);
        this.group1NonLinkY = 600;
        this.group2NonLinkY = 600;
    }

    protected dragNode( _, __, deltaPos) {
        this.draggingNode._x += deltaPos[0];
        this.draggingNode._y += deltaPos[1];
        this.redraw();
    }

    protected dragEnd() {
        this.draggingNode = null;
    }

    protected dragStart(_, el) {
        const node = this._nodes.find(x => x.NodeName === el.id);
        this.draggingNode = node;
    }

    didCreate() {
        this.edgeColor = {
            group1: Color.literal("red").desaturate(30).string,
            group2: Color.literal("blue").desaturate(30).lighten(20).string,
        }
        this.layoutConfig.nodeInterval = 2 * this.prop.maxR + 5;
        this._nodes = this.prop._nodes;
        const rs = this._nodes.map(x => x.NodeSize);
        const max = Math.max(...rs);
        this.nodeSizeScale = d3.scaleSqrt().domain([0, max]).range([0,this.prop.maxR]);

        this.setupCoord();

        this._nodes.forEach(d => {
            this.prop._links.forEach(e => {
                if (d.NodeName === e.source) {
                    d.linked = true;
                    e.sourceNode = d;
                }
                if (d.NodeName === e.target) {
                    d.linked = true;
                    e.targetNode = d;
                }
            });
        });
        this._nodes.sort((a, b) => !a.linked ? 1 : -1);
        this._nodes.forEach(d => {
            const temp_x = this.setUpXCoordinates(d);
            const temp_y = this.setUpYCoordinates(d);
            d._x = temp_x;
            d._y = temp_y;
        });
        
        // const linkedNodes = [];
        // const unlinkedNodes = [];
        // for (const node of this.prop._nodes) {
        //     if (this.prop._links.find(e => (e.source === node["NodeName"] 
        //         || e.target === node["NodeName"]))){
        //             node.linked = true;
        //             linkedNodes.push(node);
        //     }
        //     else {
        //         node.linked = false;
        //         unlinkedNodes.push(node);
        //     }
        // }


        // this._nodes =  [...linkedNodes, ...unlinkedNodes].map(d => {
        //     const temp_x = this.setUpXCoordinates(d);
        //     const temp_y = this.setUpYCoordinates(d);
        //     this.prop._links.forEach(e => {
        //         if (d.NodeName === e.source) {
        //             e.source_x = temp_x;
        //             e.source_y = temp_y;
        //         }
        //         if (d.NodeName === e.target) {
        //             e.target_x = temp_x;
        //             e.target_y = temp_y;
        //         }
        //     });
        //     d._x = temp_x;
        //     d._y = temp_y;
        //     return d;
        // });
        
        let maxCor = 0;
        this.prop._links.forEach(d => {
            if (maxCor < d.correlation) maxCor = d.correlation;
        });
        this._links = this.prop._links;
        this._edgeScale = d3.scaleQuantize()
                            .domain([0.5, maxCor])
                            .range([1, 1.5, 2]);
        
    
        // setup
        this._height = this.group2NonLinkY + this.layoutConfig.nodeInterval + this.layoutConfig.offset;
        this.$v.size.height = this._height + 400;


    }

    // willRender() {
    //     if (this._updateNode) {
    //         this._nodes.forEach( node => {
    //             if (node.NodeName === this._updateNode.nid) {
    //                 node._x = this._updateNode.newX;
    //                 node._y = this._updateNode.newY;
    //             }
    //         });
    //         this._links.forEach( link => {
    //             if ( link.source === this._updateNode.nid) {
    //                 link.source_x = this._updateNode.newX;
    //                 link.source_y = this._updateNode.newY;
    //             } else if ( link.target === this._updateNode.nid) {
    //                 link.target_x = this._updateNode.newX;
    //                 link.target_y = this._updateNode.newY;
    //             }
    //         });
    //     }
    // }

    protected getParsedNodes() {
        return this.prop._nodes.map(d => {
            const temp_x = this.setUpXCoordinates(d);
            const temp_y = this.setUpYCoordinates(d);
            this.prop._links.forEach(e => {
                if (d.id === e.source) {
                    e.source_x = temp_x;
                    e.source_y = temp_y;
                }
                if (d.id === e.target) {
                    e.target_x = temp_x;
                    e.target_y = temp_y;
                }
            });
            d._x = temp_x;
            d._y = temp_y;
            return d;
        });
    }

    protected getFillByPhylumAndGenus(d) {
        // if (d.NodeName.startsWith(d.NodeGroup)) return this.prop.colorMap.Other.Unclassified;
        // return this.prop.colorMap[d.NodePhylum][d.NodeGenus];
        // if (d.NodeName.startsWith(d.NodeGroup)) return this.prop.colorMap["Other|Unclassified"];
        return this.prop.colorMap[`${d.NodePhylum}|${d.NodeGenus}`] || this.prop.colorMap["Other|Unclassified"];
    }

    protected setUpXCoordinates(d) {
        let returnX = 0;
        if (d.NodeGroup === this.prop.groups[0]) {
            if (d.linked) {
                returnX = this.group1LinkedX;
                this.group1LinkedX += this.layoutConfig.nodeInterval;
            } else {
                returnX = this.group1NonLinkX;
                this.group1NonLinkX += this.layoutConfig.nodeInterval;
            }
        } else if (d.NodeGroup === this.prop.groups[1]) {
            if (d.linked) {
                returnX = this.group2LinkedX;
                this.group2LinkedX += this.layoutConfig.nodeInterval;
            } else {
                returnX = this.group2NonLinkX;
                this.group2NonLinkX += this.layoutConfig.nodeInterval;
            }
        }
        return returnX;
    }

    protected setUpYCoordinates(d) {
        let returnY = 0;

        // Group 1 Y
        if (d.NodeGroup === this.prop.groups[0]) {
            if (d.linked) {
                returnY = this.group1LinkedCol % 2 === 1 ? this.group1LinkedY + this.layoutConfig.offset
                    : this.group1LinkedY;
                // this.group1LinkedColumnCount ++;
                this.group1LinkedCol ++;
                if (this.group1LinkedCol === this.layoutConfig.maxCol) {
                    this.group1LinkedCol = 0;
                    this.group1LinkedRow ++;
                    this.group1LinkedX = this.group1LinkedRow % 2 === 1 ? this.layoutConfig.offset : 0;
                    this.group1LinkedY += this.layoutConfig.nodeInterval;
                    this.group1LinkedColumnCount = 0;
                }
                this.group1NonLinkY = returnY + this.layoutConfig.nodeInterval;
            } else {
                returnY = this.group1NonLinkY;
                this.group1NonLinkColumnCount ++;
                if (this.group1NonLinkColumnCount === this.layoutConfig.maxCol) {
                    this.group1NonLinkX = 0;
                    this.group1NonLinkY += this.layoutConfig.nodeInterval;
                    this.group1NonLinkColumnCount = 0;
                }
            }
        } else if (d.NodeGroup === this.prop.groups[1]) {
            if (d.linked) {
                returnY = this.group2LinkedCol % 2 === 1 ? this.group2LinkedY + this.layoutConfig.offset
                    : this.group2LinkedY;
                this.group2LinkedCol ++;
                if (this.group2LinkedCol === this.layoutConfig.maxCol) {
                    this.group2LinkedCol = 0;
                    this.group2LinkedRow ++;
                    this.group2LinkedX = this.group2LinkedRow % 2 === 1 ? this.layoutConfig.nodeStartPos() + this.layoutConfig.offset : this.layoutConfig.nodeStartPos();
                    this.group2LinkedY += this.layoutConfig.nodeInterval;
                    this.group2LinkedColumnCount = 0;
                }
                this.group2NonLinkY = returnY + this.layoutConfig.nodeInterval;
            } else {
                returnY = this.group2NonLinkY;
                this.group2NonLinkColumnCount ++;
                if (this.group2NonLinkColumnCount === this.layoutConfig.maxCol) {
                    this.group2NonLinkX = this.layoutConfig.nodeStartPos();
                    this.group2NonLinkY += this.layoutConfig.nodeInterval;
                    this.group2NonLinkColumnCount = 0;
                }
            }
        }
        return returnY;
    }

}
