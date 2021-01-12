import * as d3Hierachy from "d3-hierarchy";
import { Component, ComponentOption } from "crux/dist/element";
import {TreeData} from "crux/dist/element/common/tree"
import { updateArrayBindingPattern } from "typescript";

export interface TaxonomyTreeOption extends ComponentOption {
    rawTree: TreeData,
    level:number,
    treeDepth: number,
}

export class TaxonomyTree extends Component<TaxonomyTreeOption> {
    private treeData: TreeData;
    render() {
        return this.t`
        Component {
            Tree {
                y = 30
                r = 400
                width = 1400
                height = 800
                data = treeData
                direction = "radical"
                link.on:mouseenter = $el.stage = "active"
                link.on:mouseleave = $el.stage = null
            }
        }`;
    }

    public willRender() {
        const h = d3Hierachy.hierarchy(this.prop.rawTree);
        h.each(d => {
            if (d.depth === this.prop.level + 1) {
                d.children = null;
                
            } 
        });

                        
        console.log(h);
        this.treeData = this.prop.rawTree;
    }
}