<template>
    <div>
            <br><br>
            <div class="row">
                <div class="sidebar">
                        <ul class="nav flex-column sidebar-nav">
                            <a href="/tutorial">
                                <li class="nav-item" >
                                    <p class="nav-link" >Back to Tutorial Home Page</p>
                                </li>
                            </a>
                            <br>
                            <a href="/tutorial/analysis/1">
                                <li class="nav-item" >
                                    <p class="nav-link" >Introduction</p>
                                </li>
                            </a>
                            <br>
                            <a href="/tutorial/analysis/2">
                                <li class="nav-item" >
                                    <p class="nav-link ">How to Complete an Analysis</p>
                                </li>
                            </a>
                            <br>
                            <a href="/tutorial/analysis/3">
                                <li class="nav-item" >
                                    <p class="nav-link" >What Analysis We Have</p>
                                </li>
                            </a>
                            <br>
                            <a href="/tutorial/analysis/4">
                                <li class="nav-item" >
                                    <p class="nav-link">How to Ask Us for Help</p>
                                </li>
                            </a>
                            <br>
                            <a href="/tutorial/database/1">
                                <li class="nav-item" >
                                    <p class="nav-link" >Database Tutorial</p>
                                </li>
                            </a>
                            <br>
                        </ul>
                        <br>
                </div>

                <div class="col-md-8 offset-1">
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