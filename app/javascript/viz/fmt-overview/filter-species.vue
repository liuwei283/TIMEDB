<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>{{title}}</b-btn>
        <b-modal size="lg" ref="modal" :title="title" @ok="apply" no-stacking no-fade centered>
            <div class="d-flex flex-wrap species-container">
                <div v-for="s in data.species" :key="s" class="mb-1 mr-2">
                    <b-checkbox v-model="showSpecies[s]">{{ s }}</b-checkbox>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class FilterSpecies extends Vue {
    @Prop() public data: any;

    private showSpecies: Record<string, boolean> = {};
    private title: string;

    public created() {
        this.title = this.data.title;
        for (const s of this.data.species) {
            this.showSpecies[s] = this.data.defaultValue;
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
            Object.entries(this.showSpecies)
                .filter(([k, show]) => show)
                .map(([k]) => k),
            Object.entries(this.showSpecies)
                .filter(([k, show]) => !show)
                .map(([k]) => k),
        );
    }
}
</script>

<style lang="scss" scoped>
.species-container {
    max-height: 50vh;
    overflow: auto;
}
    
</style>
