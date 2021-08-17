import Oviz from "crux";
import template from "./template.bvt";

export class FMT extends Oviz.Component {
    public gridW;
    public speciesCount;
    public mainSizeChanged = true;

    protected mainWidth;

    public render() {
        return this.t`${template}`;
    }
    public willRender() {
        if (this.mainSizeChanged) {
            this.mainWidth = this.speciesCount * this.gridW;
            this.$v.size.width = this.mainWidth + 250;
            this.mainSizeChanged = false;
        }
    }
}
