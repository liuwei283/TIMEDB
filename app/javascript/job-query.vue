<template>
<!-- eslint-disable max-len -->
<div id="job-query">
    <alert-center ref="alertCenter" />
    <div>
        <div v-if="!submitted">
            <b-card class="text-center query-card">
                <div class="img-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <!-- <h3>Query Task</h3> -->
                <p>Find your submitted job</p>
                <div class="col-md-6" >
                    <a v-for="task in tasks" href="javascript: void(0);" @click="token_search(task)">{{task}}</a>
                </div>
                <br/>
                <div class="row justify-content-center">
                    <b-form-input v-model="job_id"
                                    type="text"
                                    size="lg"
                                    :state="valid_name"
                                    placeholder="Search your job ID"
                                    class="col-md-4 text-center"></b-form-input>
                </div>
                <!--<p class='m-1'>Examples:
                    <a href="javascript: void(0);" @click="example-zero">Drug Used</a>;
                    <a href="javascript: void(0);" @click="example_one">Taxonomic Compositions Analysis</a>;
                    <a href="javascript: void(0);" @click="example_two">Data Mount Evaluation</a>;
                </p> -->
                <b-button variant="secondary" class="mt-4" size="lg" 
                            @click="searchJob"><i class="fas fa-search"></i> Search</b-button>
                <b-button variant="secondary" class="mt-4" size="lg" 
                            @click="dummyDemo"><i class="fas fa-search"></i> Dummy Demo</b-button>
            </b-card>
        </div>
        <div v-else>
            <b-button class="btn btn-block mt-4" @click="returnQuery"><i class="fas fa-arrow-left"></i> Back to query
            </b-button>
            <b-card
                :header="`Job ID: ${job_id}`"
                header-tag="header"
                class="result-card"
            >
                <div v-if="code">
                    <b-tabs>
                        <div class="col-md-12" v-for="output in data.outputs" :key="output.id">
                            <b-tab no-body :title="output.name" class="text-center">
                                <div v-for="file in output['files']" :key="file.name">
                                    <b-embed bottom :src="`/data${file.path}/${file.name}`" :alt="file.name" class="result-image"></b-embed>
                                </div>
                            </b-tab>
                        </div>
                        <!-- <b-tab title="Job Information">
                            <b-card-title>This tab does not have the <code>no-body</code> prop set</b-card-title>
                            <b-card-text>
                            Quis magna Lorem anim amet ipsum do mollit sit cillum voluptate ex nulla tempor. Laborum
                            consequat non elit enim exercitation cillum aliqua consequat id aliqua. Esse ex
                            consectetur mollit voluptate est in duis laboris ad sit ipsum anim Lorem. Incididunt
                            veniam velit elit elit veniam Lorem aliqua quis ullamco deserunt sit enim elit aliqua
                            esse irure.
                            </b-card-text>
                        </b-tab> -->
                    </b-tabs>
                    <!-- </div> -->
                </div>
                <div v-else>
                    <b-card-text class="error-info">
                        {{data}}
                    </b-card-text>
                </div>
            </b-card>
        </div>
    </div>
</div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import axios from 'axios';
import objectToFormData from 'object-to-formdata';
import BootstrapVue from 'bootstrap-vue';
import AlertCenter from 'components/alert-center.vue';

Vue.use(BootstrapVue);

export default {
    data() {
        return {
            job_id: '',
            valid_name: null,
            submitted: false,
            code: false,
            data: null,
        };
    },
    created() {
            this.tasks = [];
            var tasks = window.gon.tasks;
            this.tasks = tasks;
            console.log(tasks)
        },
    methods: {
        searchJob() {
            const { alertCenter } = this.$refs;
            
            if (this.job_id.length <= 0){
                this.valid_name = false;
            }else {
                axios.post(
                    `/query-app-task/`,
                    objectToFormData({'job_id': this.job_id}),
                    {  
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    console.log(response);
                    this.submitted = true;
                    if (response.data.code) {
                        this.data = response.data.data.msg;
                        if(this.data.status == 'finished'){
                            this.code = true;
                        }else{
                            this.code = false;
                        }
                    } else {
                        alertCenter.add('danger', response.data.data);
                    }
                }).catch((reason) => {
                    alertCenter.add('danger', `${reason}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                });
            }
        },
        dummyDemo() {
            axios.post(
                    `/query-app-task/`,
                    objectToFormData({'job_id': this.job_id}),
                    {  
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    console.log(response);
                    this.submitted = true;
                    if (response.data.code) {
                        this.data = response.data.data.msg;
                        if(this.data.status == 'finished'){
                            this.code = true;
                        }else{
                            this.code = false;
                        }
                    } else {
                        alertCenter.add('danger', response.data.data);
                    }
                }).catch((reason) => {
                    alertCenter.add('danger', `${reason}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                });
        },
        returnQuery(){
            this.submitted = false;
        },
        token_search(token){
            console.log("=======")
            this.job_id = token;
            console.log(this.job_id)
            this.searchJob();
        },
        example_zero(){
            this.job_id = 'yOLQ9xABNOAvlp4j';// 'yOLQ9xABNOAvlp4j,K7VXyBAOgoA1Yoq2'
            this.searchJob();
        },
        example_one(){
            this.job_id = 'K7VXyBAOgoA1Yoq2';
            this.searchJob();
        },
        example_two(){
            this.job_id = 'yOLQ9xABNOAvlp4j';
            this.searchJob();
        },
    },
    components: {
        AlertCenter,
    },
};
</script>

<style lang="scss">
#job-query .fas.fa-tasks {
	font-size: 5rem !important;
	margin-right: 0px;
}

#job-query .query-card {
    margin: 20px;
	padding: 3rem;
}
#job-query .result-card {
    margin: 20px 0;
    font-size: 20px;
}
#job-query .error-info {
    min-height: 300px;
}
#job-query .result-image {
    width: 70%;
}
</style>
