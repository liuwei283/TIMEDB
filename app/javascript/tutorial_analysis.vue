<template>
    <div>
            <div class="row">
                <nav id="sidebar" class="active">
                    <div class="sidebar-content">
                        <div>
                            <a href="/tutorial">
                            <p>
                            <i class="fa fa-arrow-left"></i>Back
                            </p>
                            </a>
                        </div>
                        <div>
                            <a href="/tutorial/analysis/1">
                            <p>Introduction
                            </p>
                            </a>
                        </div>
                        <div class="sidebar-tutorial-toggle">
                            <a href="#">
                            <p>Usage &nbsp<i class="fa fa-angle-down" id="arrow"></i>
                            </p>
                            </a>
                            <ul id="side-tutorial-bar" class="active">
                                <a href="/tutorial/analysis/2"><li>How to Complete Analysis</li></a>
                                <a href="/tutorial/analysis/3"><li class="active1">What Analysis We Have</li></a>
                            </ul>
                        </div>
                        <div class="">
                            <a href="/tutorial/database/1">
                            <p>Database documentation
                            </p>
                            </a>
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
                            <!-- <select @change="helperchange" v-model="now">
                                <option v-for="(option, index) in analysis_list" :key="index" :value="option.value" >
                                    {{option.label}}
                                </option>
                            </select> -->
                            <!-- <select @change="helperchange" v-model="analysis">
                                <option v-for="(option, index) in list" :key="index" :value="option" >
                                    {{option.name}}
                                </option>
                            </select> -->

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
            list: window.gon.all_analysis,
            test: window.gon.text,
            content: "",
            analysis: 0,
        }
    },
    created() {
        this.content = this.test[this.analysis].ana.rendered_doc;
    },
    mounted() {

    },
    computed: {

    },
    watch:{
        analysis:function(){
            this.content = this.test[this.analysis].ana.rendered_doc;

        }
    },
    methods: {
        helperchange(){
            this.now = this.analysis.name;
            this.content = this.analysis.rendered_doc;
        }
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