<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>Filter samples</b-btn>
        <b-modal size="lg" ref="modal" title="Filter samples" @ok="apply" no-stacking no-fade centered>
            <div class="d-flex flex-wrap sample-container">
                <div v-for="sample in data.samples" :key="sample" class="mb-1 mr-2">
                    <b-checkbox v-model="showSamples[sample]">{{ sample }}</b-checkbox>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import draggable from "vuedraggable";

@Component
export default class FilterSample extends Vue {
    @Prop() public data: any;

    private showSamples: Record<string, boolean> = {};

    public created() {
        for (const sample of this.data.samples) {
            this.showSamples[sample] = true;
        }
    }

    private toggleModal(show: boolean) {
        (this.$refs.modal as any)[show ? "show" : "hide"]();
        this.$nextTick(() => {
            this.$forceUpdate();
        });
    }

    private apply() {
        this.data.callback(
            Object.entries(this.showSamples)
                .filter(([k, show]) => !show)
                .map(([k]) => k),
        );
    }
}
</script>

<style lang="scss" scoped>
.sample-container {
    max-height: 50vh;
    overflow: auto;
}
    
</style>
