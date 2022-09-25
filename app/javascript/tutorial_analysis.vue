<template>
    <div>
            <div class="row">
                <nav id="sidebar" class="active">
                    <div class="sidebar-content">
                        <div>
                            <a href="/tutorial">
                            <p>
                            <i class="fa fa-arrow-left"></i>Back to TIMEDB
                            </p>
                            </a>
                        </div>
                        <div class="sidebar-tutorial-toggle">
                            <a href="#">
                            <p style="color: #35478E">Database &nbsp<i class="fa fa-angle-down" id="arrow"></i>
                            </p>
                            </a>
                            <ul id="side-tutorial-bar" class="">
                                <a href="/tutorial/database/1" ><li style="color: #35478E">Database Introduction</li></a>
                                <a href="/tutorial/database/2" ><li style="color: #35478E">How to View Database Information</li></a>
                                <!-- <a href="/tutorial/database/3"><li style="color: #35478E">How to Add Data to Your Workspace</li></a> -->
                                <a href="/tutorial/database/4"><li style="color: #35478E">How to Download Database Data</li></a>
                                <!-- <a href="/tutorial/database/5"><li style="color: #35478E">How to View the Visualizations</li></a> -->
                                <a href="/tutorial/database/6"><li style="color: #35478E">Visualizations in the Database</li></a>
                            </ul>
                        </div>
                        <div class="sidebar-tutorial-toggle-1">
                            <a href="#">
                            <p style="color: #cc4f78">Analysis &nbsp<i class="fa fa-angle-down" id="arrow-1"></i>
                            </p>
                            </a>
                            <ul id="side-tutorial-bar-1" class="">
                                <a href="/tutorial/analysis/1"><li style="color: #cc4f78">Analysis Introduction</li></a>
                                <a href="/tutorial/analysis/2" ><li style="color: #cc4f78">How to Complete an Analysis</li></a>
                                <a href="/tutorial/analysis/3"><li style="color: #cc4f78" class="active1">What Analysis We Have</li></a>
                            </ul>
                        </div>
                        <div class="">
                            <a href="/tutorial/analysis/4">
                            <p>Help
                            </p>
                            </a>
                        </div>
                    </div>
                </nav>


                <div class="col-md-8 offset-1">
                                <br><br>

                    <div >

                        <h1 class ="title">
                            <a href="/tutorial"><i class="fa fa-backward" ></i></a> What Analysis We Have
                        </h1><br>
                        <div class="page">
                            <h1>
                                Please choose the helper:
                            </h1>
                            <!-- <b-dropdown class="tool-bar-el px-0 mb-1 select btn-1 sl-dropdown" data-style="btn-secondary" data-live-search="true" v-model="analysis">
                                <b-dropdown-item  v-for="(option, index) in test" :key="index" :value="option.value">
                                    {{option.text}}
                                </b-dropdown-item >
                            </b-dropdown> -->
                            <dropdown-select
                                left
                                v-model="analysis"
                                :options="test"
                                class="tool-bar-el px-0 mb-1 select"/>
                            <br>
                            <br>
                            <div>
                                <div v-html="content" class="doc"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
<script lang = 'ts'>
import Vue from 'vue';
import DropDownSelect from "page/builtin/dropdown-select.vue";
Vue.component("dropdown-select", DropDownSelect);
import * as $ from "jquery";


export default {
    data() {
        return {
            // cancers: window.gon.cancers,
            now: null,
            test: window.gon.text,
            content: "",
            analysis: window.gon.first.value,
        }
    },
    created() {
        // this.analysis=this.test[0].value;
        this.content = this.analysis.rendered_doc;
        $('.doc').find('img').css('width','100%');

    },
    mounted() {
    },
    computed: {

    },
    watch:{
        analysis:function(){
            this.content = this.analysis.rendered_doc;
        }
    },
    methods: {
        // helperchange(){
        //     this.now = this.analysis.name;
        //     this.content = this.analysis.rendered_doc;
        // }
    },
    updated(){
        $('.doc').find('img').css('width','100%');
    }
}

</script>
<style scoped lang = "scss">

.select{
    width: 248px;
}

</style>