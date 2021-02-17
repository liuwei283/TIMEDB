<template>
    <div>
        <b-btn size="sm" @click="toggleModal(true)" block>Edit groups</b-btn>
        <b-modal size="lg" ref="modal" title="Groups" @ok="apply" no-stacking no-fade centered ok-only :ok-disabled="!dataValid">
            <div class="p-2 small text-danger" v-if="hasEmptyGroup">Empty groups will be deleted on applying. You can add new groups by clicking "Add group".</div>
            <draggable v-model="data.groups" class="group-list d-flex flex-wrap" handle=".handle">
                <div v-for="(g, index) in data.groups" :key="index" class="group-item-wrapper p-2">
                    <div class="group-item p-2">
                        <div class="d-flex align-content-around">
                            <b-input-group>
                                <b-input-group-prepend is-text>
                                    <i class="fa fa-align-justify handle"></i>
                                </b-input-group-prepend>
                                <b-input v-model="g.name" :state="!!g.name"></b-input>
                                <b-input-group-append>
                                    <b-btn size="sm" variant="danger" @click="$delete(data.groups, index)">Delete</b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                        <div class="mt-2 text-muted small">Values:</div>
                        <div class="tag-container p-2 mt-2">
                            <draggable v-model="g.values" class="d-flex flex-wrap" group="gp" @end="reordered">
                                <div class="item m-1 py-1 px-2" v-for="d in g.values" :key="d">{{d}}</div>
                            </draggable>
                        </div>
                    </div>
                </div>
            </draggable>
            <div class="remaining p-2 m-2">
                <div class="small text-muted m-2">Available values</div>
                <draggable v-model="remaining" class="d-flex flex-wrap p-1" group="gp">
                    <div class="item m-1 py-1 px-2" v-for="d in remaining" :key="d">{{d}}</div>
                </draggable>
            </div>
            <b-btn variant="primary" class="mt-2 ml-2" @click="addGroup">Add group</b-btn>
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
export default class GroupEdit extends Vue {
    @Prop() public data: any;

    private hasEmptyGroup = false;
    private remaining: string[] = [];

    @Watch("data")
    @Watch("data.groups")
    public updateData() {
        this.remaining = this.data.mutTypes.filter(t => !this.data.groups.some(g => g.values.indexOf(t) >= 0));
    }

    private toggleModal(show: boolean) {
        (this.$refs.modal as any)[show ? "show" : "hide"]();
        this.$forceUpdate();
        this.reordered();
    }

    private addGroup() {
        this.data.groups.push({ name: "", values: [] });
    }

    private get dataValid() {
        for (const gp of this.data.groups) {
            if (!gp.name) return false;
        }
        return true;
    }

    private reordered() {
        this.hasEmptyGroup = this.data.groups.some(g => g.values.length === 0);
    }

    private apply() {
        this.data.groups = this.data.groups.filter(g => g.values.length);
        this.data.callback(
            this.data.groups.map(g => ({
                name: g.name, values: Array.from(g.values),
            })),
        );
    }
}
</script>

<style lang="scss" scoped>
.handle {
    cursor: move;
    margin: 0;
}
.group-item-wrapper {
    width: 33%;
}   
.group-item{
    border: 1px solid #495057;
    border-radius: 4px;
}
    
.tag-container, .remaining {
    background: #495057;
    border-radius: 4px;
}
    
.item {
    background: #6c757d;
    cursor: pointer;
    border-radius: 4px;
}
    
</style>
