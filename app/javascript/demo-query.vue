<template>
<!-- eslint-disable max-len -->
<div id="job-query">
    <alert-center ref="alertCenter" />
    <div>
        <div class="viz-result mb-1"> <!---->
            <b-card no-body>
                <b-card-header v-b-modal.modalBox class="border-1 py-2">
                    <b-button class="btn btn-1" @click="returnSubmission">
                        <i class="fas fa-arrow-left"></i> Back to task submission
                    </b-button>

                    <b-button class="btn btn-1" disabled >
                        {{`${jobName} (No.${job_id})`}}
                    </b-button>

                    <dropdown-select
                            right
                            v-model="chosenOutput"
                            :options="taskOutputs"
                            class="tool-bar-el btn px-0 m-0"/><!--v-if="data.outputs.length > 1"-->
                    <dropdown-select
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

                        <b-button class="btn btn-3 float-right" @click="refreshStatus">
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
            jobName: window.gon.job_name,
            all_jobs: [],
            fields: ["index", "jobName", "jobId", "created", "status", "operation"],
            showTable:  true,
            valid_name: null,
            submitted: true,
            code: false,
            data: {outputs: []},
            chosenOutput: null,
            chosenModule: 0,
            module_names: [{value: 0, text: "fake module name 1"}, {value: 0, text: "fake module name 2"}],
            taskOutputs: [{value: 0, text: "Demo Files", secondaryText: ""}],
            taskVisualizers: [{value: 0, text: "Demo Files", secondaryText: ""}],

            refreshEnd: true,
            isDemo: true,

            taskId: 5212,
            display:1,
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
        this.refreshEnd = true;
        this.isDemo = true;
        let demo_result_id = window.gon.demo_result_id;
        this.job_id = demo_result_id
        this.searchJob();
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
            this.inputs = response.data.message.inputs;
            this.outputs = response.data.message.outputs;
            this.params = response.data.message.params;
            
        }).catch((error) => {
            const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
            alertCenter.add('danger', `${message}`);
        }).finally(() => {
            // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
            console.log("Log:", this.inputs, this.outputs, this.params)
        });

        this.resource_usage = {
            "x_axis":[
                "2022-04-27 15:09:53",
                "2022-04-27 15:09:54",
                "2022-04-27 15:10:27",
                "2022-04-27 15:10:34",
                "2022-04-27 15:10:35",
                "2022-04-27 15:10:37"
            ],
            "memory":{
                "min":0,
                "max":174899200,
                "data":[
                    0,
                    7307264,
                    174882816,
                    174899200,
                    174899200,
                    57958400
                ]
            },
            "cpu":{
                "min":0,
                "max":44,
                "data":[
                    0,
                    1,
                    34,
                    41,
                    42,
                    44
                ]
            }
        };
        this.update_chart();

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
            if (this.submitted && this.job_status == "finished") {
                this.updateVis();
            }
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

                        if (response.data.body.length > 0) {
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
                    if (this.submitted) {
                        this.refreshStatus();
                    }
                });
            }
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
        returnSubmission(){
            window.location.href = '/submit/analyses';
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
