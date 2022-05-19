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

                <p>Find your submitted job by Job ID</p>

                <div class="row justify-content-center">
                    <b-input-group class="justify-content-center">

                        <b-form-input
                            v-model="job_id"
                            size="lg"
                            :state="valid_name"
                            placeholder="Enter your job ID"
                            class="col-md-4 text-center"
                        ></b-form-input>

                        <b-input-group-append>
                            <b-button variant="secondary" size="lg" @click="searchJob"
                            ><i class="fas fa-search"></i> Search</b-button
                            >
                        </b-input-group-append>

                    </b-input-group>
                </div>

                <div class="local-jobs .container">
                    <div class = "container row pb-2">
                            <div class= "col-7"> 
                                <h3 class="font-weight-bold float-right">Submitted Jobs</h3>
                            </div>

                            <b-button v-if="this.isDemo"
                                variant="info"
                                class=" col-2" @click="downloadInput()">demo input files
                            </b-button>

                            <b-button v-else
                                variant="success" 
                                class="btn-sm col-1" @click="refreshJobs()">Refresh
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
                                    variant="primary"
                                    size="sm"
                                    v-if="data.item.status == 'finished'"
                                    @click="showAnalyses(data.item.jobId)"
                                >
                                    <i class="fas fa-search mr-1"></i>
                                    Result
                                </b-button>

                                <b-button variant="primary" size="sm" v-else @click="showAnalyses(data.item.jobId)">
                                    <i class="fas fa-search mr-1"></i>
                                    Check
                                </b-button>

                                <b-button  v-if="!isDemo"
                                    variant="danger"
                                    size="sm"
                                    class="ml-4"
                                    @click="deleteJob(data.item.jobId)"
                                    :disabled="data.item.isDemo"
                                >
                                    <i class="fas fa-trash-alt mr-1"></i>
                                    Delete
                                </b-button>

                            </template>
                        
                        </b-table>
                    </div>
                </div>
            </b-card>
        </div>

        <div class="viz-result mb-1" v-else> <!---->
            <b-card no-body>
                <b-card-header v-b-modal.modalBox class="border-1 py-2">
                    <b-button class="btn col-md-2" variant = "primary" @click="returnQuery">
                        <i class="fas fa-arrow-left"></i> Back to query
                    </b-button>

                    <b-button variant="secondary" class="btn col-md-3" disabled >
                        {{`${jobName} (No.${job_id})`}}
                    </b-button>

                    <dropdown-select
                            right
                            v-model="chosenOutput"
                            :options="taskOutputs"
                            class="tool-bar-el btn px-0"/><!--v-if="data.outputs.length > 1"-->
                    
                    <!-- <b-button v-else variant="dark" class="btn col-md-4" disabled >{{data.outputs[0].name}}
                    </b-button> -->




                    <!--留个位置-->
                    <b-button class="btn col-md-2 float-right" variant="primary">
                        <i class="fas fa-arrow-right"></i>To Visualization Page
                    </b-button>

                    <div class="tabBtn">
                        <b-button class="btn col-md-2" variant="info" @click="display=0" :class="{active:display==0}">
                            Task Monitor
                        </b-button>

                        <b-button class="btn col-md-2" variant="info" @click="display=1" :class="{active:display==1}">
                            Visualization
                        </b-button><!--v-if="data.item.status == 'finished'-->

                        <b-button class="btn col-md-2 float-right" variant="success" @click="refreshStatus">
                            Refresh Status
                        </b-button>
                    </div>


                </b-card-header>

                <b-card-body v-show="display==0" class="p-4" >

                    <section id="inputs" class="mt-2 mb-4">
                        <h4 class="pb-1">Inputs</h4>
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
                        <pre id="stdout" class="light">(test msg)<br/>{{stdout}}</pre>
                        <p class="font-italic">Error Message</p>
                        <pre id="stderr">(test msg)<br/>{{stderr}}</pre>
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
            this.inputs = response.data.inputs;
            this.outputs = response.data.outputs;
            this.params = response.data.params;
            
                }).catch((error) => {
                    const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                    alertCenter.add('danger', `${message}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                });

        // 实际代码!

        // client = LocalApi::Client.new
        // result = client.task_info(45, this.taskId, 'app')
        // console.log(result)

        // let taskInfo = axios.get(`https://deepomics.org/api/task_info/?task_id=${this.taskId}&task_type=app_task` );
        // let taskResourceUsage = axios.get(`https://deepomics.org/api/task_resource_usage/?task_id=${this.taskId}&task_type=app_task` );
        // let taskLog = axios.get(`https://deepomics.org/api/task_log/?task_id=${this.taskId}&task_type=app_task` );

        // axios.all([taskInfo, taskResourceUsage, taskLog]).then(axios.spread((info, res, log) => {
        //     this.inputs = info.data.inputs;
        //     this.params = info.data.params;
        //     this.outputs = info.data.outputs;

        //     if (res.data.code) {
        //         this.resource_usage = res.data.data;
        //         this.update_chart();
        //     }else {
        //         alertCenter.add('danger', log.data.data);
        //     }

        //     if (log.data.code) {
        //         this.stderr = log.data.data.stderr;
        //         this.stdout = log.data.data.stdout;
        //     }else {
        //         alertCenter.add('danger', log.data.data);
        //     }
        // }));

        console.log("Log:", this.inputs, this.outputs)


        // test data
        // this.inputs = [
        //     {
        //         "id":1625,
        //         "name":"user_abd",
        //         "desc":"test demo",
        //         "files":[
        //             {
        //             "name":"i_2734_2022_03_23_16_48_abundance.tsv",
        //             "path":"/data"
        //             }
        //         ]
        //     },
        //     {
        //         "id":1627,
        //         "name":"group_info",
        //         "desc":"test demo",
        //         "files":[
        //             {
        //             "name":"i_2734_2022_03_23_16_48_group_info.tsv",
        //             "path":"/data"
        //             }
        //         ]
        //     }
        // ],
        // this.params = [
        //     {
        //         "name": "testName",
        //         "desc": "testDesc",
        //         "prefix": "testPrefix",
        //         "default": "testDefault",
        //         "value": "testValue"
        //     }
        // ],
        // this.outputs = [
        //     {
        //         "id":1215,
        //         "name":"output",
        //         "desc":"test demo",
        //         "files":[
        //             {
        //             "name":"annof.tsv",
        //             "path":"/home/platform/omics_rails/releases/20220504130039/media/user/meta_platform/project/platform_task_test/task_20220323164855"
        //             },
        //             {
        //             "name":"file1.tsv",
        //             "path":"/home/platform/omics_rails/releases/20220504130039/media/user/meta_platform/project/platform_task_test/task_20220323164855"
        //             },
        //             {
        //             "name":"merged_df.tsv",
        //             "path":"/home/platform/omics_rails/releases/20220504130039/media/user/meta_platform/project/platform_task_test/task_20220323164855"
        //             },
        //             {
        //             "name":"wilcox.test.tsv",
        //             "path":"/home/platform/omics_rails/releases/20220504130039/media/user/meta_platform/project/platform_task_test/task_20220323164855"
        //             },
        //             {
        //             "name":"group_info.tsv",
        //             "path":"/home/platform/omics_rails/releases/20220504130039/media/user/meta_platform/project/platform_task_test/task_20220323164855"
        //             },
        //             {
        //             "name":"abundance.tsv",
        //             "path":"/home/platform/omics_rails/releases/20220504130039/media/user/meta_platform/project/platform_task_test/task_20220323164855"
        //             }
        //         ]
        //     }
        // ],
        // this.resource_usage = {
        //     "x_axis":[
        //         "2022-04-27 15:09:53",
        //         "2022-04-27 15:09:54",
        //         "2022-04-27 15:10:27",
        //         "2022-04-27 15:10:34",
        //         "2022-04-27 15:10:35",
        //         "2022-04-27 15:10:37"
        //     ],
        //     "memory":{
        //         "min":0,
        //         "max":174899200,
        //         "data":[
        //             0,
        //             7307264,
        //             174882816,
        //             174899200,
        //             174899200,
        //             57958400
        //         ]
        //     },
        //     "cpu":{
        //         "min":0,
        //         "max":44,
        //         "data":[
        //             0,
        //             1,
        //             34,
        //             41,
        //             42,
        //             44
        //         ]
        //     }
        // };
        // this.update_chart();

        // this.stderr = new Date() + 'To execute GATK run: java -jar $EBROOTGATK/GenomeAnalysisTK.jar\nLmod has detected the following error: These module(s) or extension(s) exist\nbut cannot be loaded as requested: \"pelib/2021b\", \"python/3.7.10\",\n\"rust/1.56.1\", \"perl/5.30.2\", \"r/3.6.3\"\n   Try: \"module spider pelib/2021b python/3.7.10 rust/1.56.1 perl/5.30.2\nr/3.6.3\" to see how to load the module(s).\n\n\n\n';
        // this.stdout = 'meta_PCA task starts at: Wed Apr 27 23:09:53 HKT 2022\nfinishes at: Wed Apr 27 23:11:07 HKT 2022\n';
        
    },
    updated() {
        if (this.submitted && this.data.outputs.length > 0) {
            event.emit("GMT:reset-query", this);
            this.updateGon(this.data.outputs[this.chosenOutput]);
            event.emit("GMT:query-finished", this);
        }
    },
    methods: {
        update_chart() {
            this.chartOptions = {
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
                        data: this.resource_usage.x_axis,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'memory',
                        min: this.resource_usage.memory.min,
                        max: this.resource_usage.memory.max,
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
                        min: this.resource_usage.cpu.min,
                        max: this.resource_usage.cpu.max,
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
                        data:this.resource_usage.memory.data
                    },
                    {
                        name:'cpu',
                        type:'line',
                        yAxisIndex: 1,
                        data:this.resource_usage.cpu.data
                    }
                ]
            };
        },
        refreshStatus() {
            console.log("Now refresh task", this.taskId)
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
                this.inputs = response.data.inputs;
                this.outputs = response.data.outputs;
                this.params = response.data.params;
                
                    }).catch((error) => {
                        const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                        alertCenter.add('danger', `${message}`);
                    }).finally(() => {
                        // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                    });

            console.log("Refreshed. New log:", this.stdout)

            
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
                        if (response.data.body.length > 0 && false) {
                            this.updateGon(this.data.outputs[0]);
                            this.taskOutputs = this.data.outputs.map((x, i) => ({value: i, text: x.name}));
                        }
                        this.chosenOutput = 0;
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
                });
            }
        },
        showAnalyses(jobId) {
            this.job_id = jobId;
            this.searchJob();
        },
        updateGon(output) {
            window.gon.module_name = output.module_name;
            window.gon.required_data = output.required_data;
            if (!window.gon.urls) window.gon.urls = {};
            window.gon.urls.chosen_file_paths = `/api/analysis/${output.analysis_id}/chosen_file_paths`;
            window.gon.urls.download_demo_file = `/api/analysis/${output.analysis_id}/download_demo_file`;
            registerViz(output.module_name);
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
