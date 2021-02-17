<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>Edit panels</b-btn>
        <b-modal size="lg" ref="modal" title="Panels" @ok="apply" no-stacking no-fade centered>
            <p>Adjust the order of panels and edit their names.</p>
            <draggable v-model="data.panels" class="group-list" handle=".handle">
                <div v-for="(g, index) in data.panels" :key="index" class="group-item-wrapper p-2">
                    <div class="group-item p-2">
                        <div class="d-flex align-content-around">
                            <b-input-group>
                                <b-input-group-prepend is-text>
                                    <i class="fa fa-align-justify handle"></i>
                                </b-input-group-prepend>
                                <b-input-group-prepend is-text>
                                    {{g}}
                                </b-input-group-prepend>
                                <b-input v-model="data.names[g]"></b-input>
                            </b-input-group>
                        </div>
                    </div>
                </div>
            </draggable>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import draggable from "vuedraggable";

@Component({
    components: { draggable },
})
export default class PanelEdit extends Vue {
    @Prop() public data: any;

    private toggleModal(show: boolean) {
        (this.$refs.modal as any)[show ? "show" : "hide"]();
        this.$forceUpdate();
    }

    private apply() {
        this.data.callback(this.data.panels, this.data.names);
    }
}
</script>

<style lang="scss" scoped>
.handle {
    cursor: move;
}
    
</style>
