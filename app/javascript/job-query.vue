<template>
<!-- eslint-disable max-len -->
<div id="job-query">
    <alert-center ref="alertCenter" />
    <div>
        <div v-if="!submitted"> <!---->
            <b-card class="text-center query-card">

                <div class="img-icon">
                    <i class="fas fa-tasks"></i>
                </div>

                <p>Find your submitted task by Task ID</p>

                <div class="row justify-content-center">
                    <b-input-group class="justify-content-center">

                        <b-form-input
                            v-model="job_id"
                            size="lg"
                            :state="valid_name"
                            placeholder="Enter your task ID"
                            class="col-md-4 text-center"
                        ></b-form-input>

                        <b-input-group-append>
                            <b-button class = "btn btn-1" size="lg" @click="searchJob"
                            ><i class="fas fa-search"></i> Search</b-button
                            >
                        </b-input-group-append>

                    </b-input-group>
                </div>

                <div class="local-jobs .container">
                    <div class = "container row pb-2">
                            <div class= "col-7"> 
                                <h3 class="font-weight-bold float-right">Submitted Tasks</h3>
                            </div>

                            <b-button v-if="this.isDemo"
                                variant="info"
                                class=" col-2" @click="downloadInput()">demo input files
                            </b-button>

                            <b-button v-else
                                variant="success" 
                                class="btn-sm btn-4 col-1" @click="refreshJobs()">Refresh
                            </b-button>
                            <div class="col-1"><i v-if="!refreshEnd" class="fas fa-spinner fa-spin" style="font-size:24px"> </i> </div>
                    </div>

                    <div id="table-container">
                        <b-table
                            class="jobs-table"
                            hover
                            :items="all_jobs"
                            :fields="fields"
                            v-if="showTable"
                            show-empty
                        >
                            <template #cell(index)="data">
                                {{ data.index + 1 }}
                            </template>
                            
                            <template #cell(status)="data">
                                <b-badge
                                    pill
                                    variant="success"
                                    v-if="data.item.status == 'finished'"
                                >Finished</b-badge>

                                <span v-else-if="data.item.status == 'failed'" v-b-tooltip.rightbottom.html title="Please check the format of your file!">
                                    <b-badge
                                        pill
                                        variant="danger"
                                    >
                                        Failed
                                        <i class="fas fa-exclamation-circle small"></i>
                                    </b-badge>
                                </span>

                                <b-badge pill variant="info" v-else>Running</b-badge>
                            </template>

                            <template #cell(operation)="data">

                                <b-button
                                    class = "btn btn-1"
                                    size="sm"
                                    v-if="data.item.status == 'finished'"
                                    @click="showAnalyses(data.item.jobId)"
                                >
                                    <i class="fas fa-search mr-1"></i>
                                    Result
                                </b-button>

                                <b-button class = "btn btn-1" size="sm" v-else @click="showAnalyses(data.item.jobId)">
                                    <i class="fas fa-search mr-1"></i>
                                    Check
                                </b-button>

                                <b-button  v-if="!isDemo"
                                    size="sm"
                                    class="ml-4 btn-3"
                                    @click="deleteJob(data.item.jobId)"
                                    :disabled="data.item.isDemo"
                                >
                                    <i class="fas fa-trash-alt mr-1"></i>
                                    Delete
                                </b-button>

                            </template>
                            <template #empty>
                                <h4 class="text-center">No task... <a href="/submit/analyses">Submit your task now</a> </h4>
                            </template>
                        
                        </b-table>
                    </div>
                </div>
            </b-card>
        </div>

        <div class="viz-result mb-1" v-else> <!---->
            <b-card no-body>
                <b-card-header v-b-modal.modalBox class="border-1 py-2">
                    <b-button class="btn btn-1" @click="returnQuery">
                        <i class="fas fa-arrow-left"></i> Back to query
                    </b-button>

                    <b-button class="btn btn-1" disabled >
                        {{`${jobName} (No.${job_id})`}}
                    </b-button>

                    <dropdown-select
                            v-if="job_status == 'finished'"
                            right
                            v-model="chosenOutput"
                            :options="taskOutputs"
                            class="tool-bar-el btn px-0 m-0"/><!--v-if="data.outputs.length > 1"-->
                    <dropdown-select
                            v-if="job_status == 'finished'"
                            right
                            v-model="chosenModule"
                            :options="module_names"
                            class="tool-bar-el btn px-0 m-0"/><!--v-if="data.outputs.length > 1"-->
                    
                    <!-- <b-button v-else variant="dark" class="btn col-md-4" disabled >{{data.outputs[0].name}}
                    </b-button> -->




                    <div class="tabBtn">
                        <b-button class="btn btn-1" @click="display=0" :class="{active:display==0}">
                            Task Monitor
                        </b-button>

                        <b-button class="btn btn-1" @click="display=1" :class="{active:display==1}" v-if="job_status == 'finished'">
                            Visualization
                        </b-button><!---->

                        <b-button class="btn btn-1" disabled v-else>
                            Visualization
                        </b-button><!---->

                        <b-button class="btn float-right" variant="danger" v-if="job_status=='failed'">
                            Failed
                        </b-button>
                        <b-button class="btn float-right" variant="success" v-else-if="job_status=='finished'">
                            Finished
                        </b-button>
                        <b-button class="btn float-right" variant="info" v-else>
                            Running
                        </b-button>
                        
                        <b-button class="btn btn-3 float-right" @click="refreshStatus">
                            Refresh Status
                        </b-button>
                    </div>


                </b-card-header>

                <b-card-body v-show="display==0" class="p-4" >

                    <section id="inputs" class="mt-2 mb-4">
                        <h4 class="pb-1">Inputs</h4>
                        <p> You can click refresh button to refresh task status.</p>
                        <p> If the job is finished, visualization is avaliable through clicking the button above</p>
                        <b-list-group>
                            <b-list-group-item v-for="input in inputs" href="javascript:void(0)" v-b-toggle="`i-${input.id}`" :key="`i-${input.id}`">
                                <i class="fa fa-file"></i> {{ input.name }}
                                <i class="fa fa-question-circle" v-b-tooltip
                                :title="input.desc"></i>
                                <b-collapse :id="`i-${input.id}`">
                                    <ul class="mt-3">
                                        <li v-for="file in input.files" :key="file.id">
                                            <a :href="`https://deepomics.org/user/data/?this_path=${file.path}`" target="_blank">{{ file.name }}</a>
                                        </li>
                                    </ul>
                                </b-collapse>
                            </b-list-group-item>
                        </b-list-group>
                    </section>

                    <section id="settings" class="mt-2 mb-4">
                        <h4>Settings</h4>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Prefix</th>
                                    <th>Default</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="param in params" :key="`p-${param.id}`">
                                    <td>{{ param.name }} <i class="fa fa-question-circle" v-b-tooltip
                                                        :title="param.desc" placement="bottom"></i></td>
                                    <td>{{ param.prefix }}</td>
                                    <td>{{ param.default }}</td>
                                    <td>{{ param.value }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section id="resource-usage" class="p-0 float-left">
                        <h4>Resource Usage</h4>
                        <v-chart :options="chartOptions" />
                    </section>

                    <section id="test-log" class="float-right">
                        <h4>Test Log</h4>
                        <p class="font-italic">Console Output</p>
                        <pre id="stdout" class="light">{{stdout}}</pre>
                        <p class="font-italic">Error Message</p>
                        <pre id="stderr">{{stderr}}</pre>
                    </section>

                    <section id="outputs" class="mt-4 mb-4">
                        <h4 class="pt-2">Outputs</h4>
                        <b-list-group>
                            <b-list-group-item v-for="output in outputs" href="javascript:void(0)" v-b-toggle="`o-${output.id}`" :key="`o-${output.id}`">
                                <i class="fa fa-file"></i> {{ output.name }}
                                <i class="fa fa-question-circle" v-b-tooltip
                                :title="output.desc"></i>
                                <b-collapse :id="`o-${output.id}`">
                                    <ul class="mt-3">
                                        <li v-for="file in output.files" :key="file.id">
                                            <a :href="`https://deepomics.org/user/data/?this_path=${file.path}`" target="_blank">{{ file.name }}</a>
                                        </li>
                                    </ul>
                                </b-collapse>
                            </b-list-group-item>
                        </b-list-group>
                    </section>

                </b-card-body>

                <b-card-body v-show="display==1" class="p-2">
                   <div id = "viz-card"> 
                        <VApp/>
                    </div>
                </b-card-body>

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
import AlertCenter from 'components/alert-center.vue';
import VApp from "page/vapp.vue";
import DropDownSelect from "page/builtin/dropdown-select.vue";
import { event } from "crux/dist/utils";
import {registerViz} from "viz";
import EditText from "oviz-components/edit-text-vue.vue";

import ECharts from 'vue-echarts/components/ECharts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom';
import BootstrapVue from 'bootstrap-vue';

Vue.component('v-chart', ECharts);
Vue.component("VApp", VApp);
Vue.component("EditText", EditText);
Vue.use(BootstrapVue);
Vue.component("dropdown-select", DropDownSelect);

export default {
    data() {
        return {
            job_id: null,
            jobName: '',
            all_jobs: [],
            fields: ["index", "jobName", "jobId", "created", "status", "operation"],
            showTable:  true,
            valid_name: null,
            submitted: false,
            code: false,
            data: {outputs: []},
            chosenOutput: null,
            chosenModule: 0,
            module_names: [{value: 0, text: "fake module name 1"}, {value: 0, text: "fake module name 2"}],
            taskOutputs: [{value: 0, text: "Demo Files", secondaryText: ""}],
            refreshEnd: true,
            isDemo: false,

            taskId: 5212,
            display:0,
            inputs: [], 
            outputs: [],
            params: [],
            resource_usage: {},
            stderr: '',
            stdout: '',
            log: {
                stdout: '',
                error: ''
            },
            chartOptions: {},
            job_status: "",            
        };
    },
    created() {
        if (window.gon.isJobDemoPage) {
            this.refreshEnd = true;
            this.isDemo = true;
            this.getDemoJobs();
        } else {
            this.refreshJobs();
        }
    },
    beforeMount() {
        const getJobId = () => {
            const urls = window.location.href.split('?');
            if (urls.length <2) return;
            else {
                const params = urls[1].split("&").map(x => x.split("="));
                return params.find(x => x[0]==="job_id")[1];
            }
        }
        if (!this.job_id) this.job_id = getJobId();
    },
    mounted(){
        window.gon.viz_mode = "task-output";


        const { alertCenter } = this.$refs;

        // Test Pipeline
        axios.post(
            `/query-deepomics/`,
            objectToFormData({'id': 528, 'type': 'pipeline'}),
            {  
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'multipart/form-data',
                },
            },
        ).then((response) => {
            console.log("Pipeline query result:", response);
            
                }).catch((error) => {
                    const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                    alertCenter.add('danger', `${message}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                });
        
        // Code
        axios.post(
            `/query-deepomics/`,
            //improvement here: when we testing pipeline, here we need to check whether this is analyis or pipeline
            objectToFormData({'id': this.taskId, 'type': 'app'}),
            {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'multipart/form-data',
                },
            },
        ).then((response) => {
            console.log("Module query result:", response);
            this.inputs = response.data.message.inputs;
            this.outputs = response.data.message.outputs;
            this.params = response.data.message.params;
            
        }).catch((error) => {
            const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
            alertCenter.add('danger', `${message}`);
        }).finally(() => {
            // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
            console.log("Log:", this.inputs, this.outputs, this.params);
            this.getChartsInfo();
        });


        this.stderr = "Testing...";
        this.stdout = "Testing...";
    },
    watch: {
        chosenOutput:function() {
            if (this.submitted && this.job_status == "finished") {
                
                this.updateGon(this.data.outputs[this.chosenOutput]);
                event.emit("GMT:query-finished", this);
            }
        },
        chosenModule:function() {
            this.updateVis();
        }
    },
    methods: {
        getChartsInfo() {
            axios.post(
                `/task-details/`,
                objectToFormData({'id': this.job_id}),
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'multipart/form-data',
                    },
                },
            ).then(res => {
                    // console.log(res)
                    //improvement here we need to consider have different plot chart for different tasks
                    if (arg[0].isPipeline && !res.data.message.code) {
                        res.data.message.tasks.forEach((t, i) => {
                            this.update_chart(t);
                        });
                    } else if (res.data.message.code) {
                        
                        this.update_chart(res.data.message.data);
                        
                    } else {
                        this.taskDetails.code = "API_ERROR";
                        alertCenter.add('danger', res.data.message);
                    }
                    
            });

        },
        update_chart(data) {
            const chartOptions = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        }
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                    }
                ],
                legend: {
                    data:['memory','cpu']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.resource_usage.x_axis,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'memory',
                        min: data.resource_usage.memory.min,
                        max: data.resource_usage.memory.max,
                        // interval: 50,
                        axisLabel: {
                            formatter: function (value, index) {
                                let units = ['','K','M','G','T','P','E','Z'];
                                for (let i=0; i<units.length; i++) {
                                    if (value < 1024) {
                                        return Math.floor(value*10)/10.0 + units[i] + 'B';
                                    }
                                    value /= 1024.0;
                                }
                                return Math.floor(value) + 'YiB';
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: 'cpu',
                        min: data.resource_usage.cpu.min,
                        max: data.resource_usage.cpu.max,
                        // interval: 5,
                        axisLabel: {
                            formatter: function (value, index) {
                                let units = ['s','min','h','d','w'];
                                let unitNum = [60.0, 60.0, 24.0, 7.0, 1.0];
                                for (let i=0; i<units.length; i++) {
                                    if (value < unitNum[i]) {
                                        // ignore numbers after floating point for minutes
                                        if (i == 0){
                                            return Math.floor(value) + units[i];
                                        } else if (units[i] == 'min'){
                                            return Math.floor(value) + units[i];
                                        } else if (i > 1){
                                            return Math.floor(value) + units[i] + Math.floor(value*10)%10/10*unitNum[i-1] + units[i-1];
                                        }


                                    }
                                    value /= unitNum[i];
                                }
                                return Math.floor(value) + 'w';
                            }
                        }
                    }
                ],
                series: [
                    {
                        name:'memory',
                        type:'line',
                        data: data.resource_usage.memory.data
                    },
                    {
                        name:'cpu',
                        type:'line',
                        yAxisIndex: 1,
                        data:data.resource_usage.cpu.data
                    }
                ]
            };
        },
        refreshStatus() {
            console.log("Now refresh task", this.taskId)
            this.stdout = new Date() + " output test."
            // this.stderr = new Date() + " error test."
            // Production Code
            axios.post(
                `/query-deepomics/`,
                objectToFormData({'id': this.taskId, 'type': 'app'}),
                {  
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'multipart/form-data',
                    },
                },
            ).then((response) => {
            console.log("Module query result:", response);
            this.inputs = response.data.message.inputs;
            this.outputs = response.data.message.outputs;
            this.params = response.data.message.params;
            this.stderr = response.data.message.error_message;
            this.job_status = response.data.message.status;
            
                }).catch((error) => {
                    const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                    alertCenter.add('danger', `${message}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                    console.log("Log:", this.inputs, this.outputs, this.params)
                    this.getChartsInfo();

                });

            // console.log("Refreshed. New log:", this.stdout)

            
        },


        downloadInput() {
            window.open(window.gon.urls.download_input_demo);
        },
        searchJob() {
            const { alertCenter } = this.$refs;
            
            if (this.job_id.length <= 0){
                this.valid_name = false;
            }else {
                this.all_jobs.forEach(j => {
                    if (j.jobId === parseInt(this.job_id))
                        this.jobName = j.jobName;
                })
                axios.post(
                    `/query-app-task/`,
                    objectToFormData({'job_id': this.job_id, 'is_demo': this.isDemo}),
                    {  
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    console.log("searchJob() response:", response);
                    console.log("searchJob() response data:", response.data);
                    if (response.data.code === false) {
                        this.submitted = false;
                        alertCenter.add('danger', `${response.data.data}`);
                    } else {
                        this.data.outputs = response.data.body;

                        this.chosenOutput = 0;
                        if (response.data.body.length > 0) {
                            this.updateGon(this.data.outputs[0]);
                            this.taskOutputs = this.data.outputs.map((x, i) => ({value: i, text: x.name}));
                        }
                        this.submitted = true;

                        //tid
                        this.taskId = response.data.tid;
                        console.log("this.taskId:", this.taskId)
                    }
                }).catch((error) => {
                    const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                    alertCenter.add('danger', `${message}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                    if (this.submitted) {
                        this.refreshStatus();
                    }
                });
            }
        },
        showAnalyses(jobId) {
            this.job_id = jobId;
            this.searchJob();
        },
        updateGon(output) {
            event.emit("GMT:reset-query", this);
            this.module_names = output.module_names.map((x, i) => ({value: i, text: x}));
            this.chosenModule = 0;
            window.gon.module_name = output.module_names[this.chosenModule];
            
            window.gon.required_data = output.required_data;
            if (!window.gon.urls) window.gon.urls = {};
            window.gon.urls.chosen_file_paths = `/api/analysis/${output.analysis_id}/chosen_file_paths?visualizer=${this.chosenModule}`;
            window.gon.urls.download_demo_file = `/api/analysis/${output.analysis_id}/download_demo_file?visualizer=${this.chosenModule}`;
            console.log("outputing to be visualized plot:")
            console.log(output.module_names[this.chosenModule]);
            registerViz(output.module_names[this.chosenModule]);
            event.emit("GMT:query-finished", this);
        },
        updateVis() {
            event.emit("GMT:reset-query", this);
            window.gon.module_name = this.data.outputs[this.chosenOutput].module_names[this.chosenModule];

            window.gon.required_data = this.data.outputs[this.chosenOutput].required_data;
            if (!window.gon.urls) window.gon.urls = {};
            window.gon.urls.chosen_file_paths = `/api/analysis/${this.data.outputs[this.chosenOutput].analysis_id}/chosen_file_paths?visualizer=${this.chosenModule}`;
            window.gon.urls.download_demo_file = `/api/analysis/${this.data.outputs[this.chosenOutput].analysis_id}/download_demo_file?visualizer=${this.chosenModule}`;
            
            registerViz(this.data.outputs[this.chosenOutput].module_names[this.chosenModule]);
            event.emit("GMT:query-finished", this);

        },
        refreshJobs() {
            this.refreshEnd = false;
            axios.post(
                `/query-all-tasks/`,
                null,
            {  
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(r => {
                this.all_jobs = r.data.map((d, index) => {
                    return  {index, ...d}
                });
            }).finally(() => {
                // wait 1 sec
                 setTimeout(() => {
                    this.refreshEnd = true;
                    }, 1000);
            });
        },
        getDemoJobs() {
            axios.post(
                `/query-demo-tasks/`,
                null,
            {  
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(r => {
                this.all_jobs = r.data.map((d, index) => {
                    return  {index, ...d}
                });
            }).finally(() => {
                // // wait 1 sec
                //  setTimeout(() => {
                //     this.refreshEnd = true;
                //     }, 1000);
            });
        },
        deleteJob(jobId){
            const { alertCenter } = this.$refs;
            axios.post(
                `/remove-task/`,
                objectToFormData({'job_id': jobId}),
                {  
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(r => {
                    this.refreshJobs();
                })
                .catch(error => {
                    alertCenter.add('danger', error);
                });
        },
        returnQuery(){
            event.emit("GMT:reset-query", this);
            this.submitted = false;
        },
        token_search(token){
            this.job_id = token;
            this.searchJob();
        },
    },
    components: {
        AlertCenter,
    },
};
</script>

<style lang="scss">
#job-query {
    min-height: 900px;
    max-height: 1200px;
    margin-top: 10px;
}
#job-query .fas.fa-tasks {
	font-size: 5rem !important;
	margin-right: 0px;
}

#job-query .query-card {
    margin: 20px;
	padding: 3rem;
}
// all jobs
.local-jobs {
    margin-top: 2em;
}
// .center-title {
//     margin: auto; 
//     max-width: 250px;
// }

#job-query .result-card {
    margin: 0;
    font-size: 20px;
}
//result card div
#job-query .error-info {
    min-height: 300px;
}
#job-query .result-image {
    width: 70%;
}
// .task{
//     margin: 1em
// }
#tool-bar {
    height:30px;
    background:lightgrey; 
    position: relative;
}
#editor-conf {
    position: absolute;
    right: 0;
}
.viz-result {
    #canvas {
        height: 800px;
        width: 100%;
        overflow: scroll;
    }
}
.col-md-12 {
    width: 80px;
}
#viz-container {
    position: relative;
}
#viz-card {
    border: 1px solid #999;
    height: 835px;
}
.v-editor {
    position: absolute;
    top: 0;
    right: 0;
    z-index:20;
    transition: all 0.3s
}
#table-container {
    max-height: 40em;
    overflow-y: scroll;
}
.tooltip-inner {
    text-align: left !important;
}

#tabBtn {
    clear: both;
}

#inputs, #outputs{
    clear: both;
}

#stdout, #stderr{
    height: 150px;
    overflow: auto;
    padding: 15px 15px;
    border-radius: 4px; 
}

#stdout {
    background: #ecf0f1;
}

#stderr {
    background: #999;
    color: #fff;
}

#resource-usage {
    width: 40%;
}

#test-log {
    padding: 0;
    width: 40%;
}

</style>
