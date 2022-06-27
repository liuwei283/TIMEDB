<template>
<!-- eslint-disable max-len -->
<div id="job-query">
    <alert-center ref="alertCenter" />
    <div>
        <div class="viz-result mb-1"> <!---->
            <b-card no-body>
                <b-card-header v-b-modal.modalBox class="border-1 py-2">
                    <h3 class="m-4 text-center"><strong>{{`${jobName} (No.${job_id})`}}</strong>

                    <b-badge
                        pill
                        v-if="job_status=='failed'"
                        class="badge-failed"
                    >
                    Failed
                    </b-badge>
                    <b-badge
                        pill
                        v-if="job_status=='finished'"
                        class="badge-finished"
                    >
                    Finished
                    </b-badge>
                    <b-badge
                        pill
                        v-else
                        class="badge-running"
                    >
                    Running
                    </b-badge>
                    </h3>


                    
                    <b-button class="btn btn-1 col-md-2" @click="returnSubmission" @mouseover="backIcon=backColor" @mouseleave="backIcon=backWhite;">
                        <img v-bind:src="backIcon">
                        Back
                    </b-button>
     
                    <b-button class="btn btn-1 col-md-2" @click="display=0" :class="{active:display==0}" @mouseover="monitorIcon=monitorColor" @mouseleave="monitorIcon=monitorWhite;">
                        <img v-bind:src="monitorIcon">
                        Task Monitor
                    </b-button>

                    <b-button class="btn btn-1 col-md-2" @click="display=1" :class="{active:display==1}" v-if="job_status == 'finished'" @mouseover="visIcon=visColor" @mouseleave="visIcon=visWhite;">
                        <img v-bind:src="visIcon">
                        Visualization
                    </b-button><!---->

                    <b-button class="btn btn-1 col-md-2" disabled v-else @mouseover="visIcon=visColor" @mouseleave="visIcon=visWhite;">
                        <img v-bind:src="visIcon">
                        Visualization
                    </b-button>

                    <b-button class="btn btn-3 float-right col-md-2" @click="refreshStatus" @mouseover="refreshIcon=refreshColor" @mouseleave="refreshIcon=refreshWhite;">
                        <img v-bind:src="refreshIcon">
                        Refresh Status
                    </b-button>

                    <div class="switchBtn mt-4 mb-4">
                        
                        <dropdown-select
                            v-if="job_status == 'finished' && taskOutputs.length>1"
                            right
                            v-model="chosenOutput"
                            :options="taskOutputs"
                            class="tool-bar-el px-0 mb-1 col-md-3"/><!--v-if="data.outputs.length > 1"-->
                        
                        <dropdown-select
                            v-if="job_status == 'finished' && module_names.length>1"
                            right
                            v-model="chosenModule"
                            :options="module_names"
                            class="tool-bar-el px-0 mb-1 col-md-3"/><!--v-if="data.outputs.length > 1"-->

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
                                            <a :href="`https://deepomics.org/explorer/download_rel/?path=${file.path}/${file.name}`" target="_blank">{{ file.name }}</a>
                                        </li>
                                    </ul>
                                </b-collapse>
                            </b-list-group-item>
                        </b-list-group>
                    </section>

                    <section id="settings" class="mt-2 mb-4">
                        <div v-if="job_type=='app'">
                            <h4 class="pb-1">Settings</h4>
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
                        </div>
                        <div v-else>
                            <h4 class = "pb-1">Settings</h4>
                            <b-list-group>
                                <b-list-group-item v-for="task_setting in params" href="javascript:void(0)" v-b-toggle="`i-${task_setting.id}`" :key="`i-${task_setting.id}`">
                                    <i class="fa fa-cog"></i> {{ task_setting.app_name }}
                                    <b-collapse :id="`i-${task_setting.id}`">
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
                                                <tr v-for="param in task_setting.params" :key="`p-${param.id}`">
                                                    <td>{{ param.name }} <i class="fa fa-question-circle" v-b-tooltip
                                                                        :title="param.desc" placement="bottom"></i></td>
                                                    <td>{{ param.prefix }}</td>
                                                    <td>{{ param.default }}</td>
                                                    <td>{{ param.value }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </b-collapse>
                                </b-list-group-item>
                            </b-list-group>
                        </div>
                    </section>

                    <section id="details-container" class="mt-2 mb-4" v-if="taskDetailsCompleted==true">
                        <div v-if="taskDetails.type == 'pipeline'">
                            <h4 class="pb-1">Module Tasks Status</h4>
                            <table class="table table-bordered">
                                <tbody>
                                    <tr v-for="(task, taskKey) in taskDetails.tasks"
                                    :key="taskKey" >
                                        <td>{{ task.name }}</td>
                                        <td>
                                            <b-badge pill variant="success"
                                                    v-if="task.status == 'finished'">
                                                    Finished
                                                    </b-badge>
                                        </td>
                                        <td><b-button variant="light" class="float-right" size="small"
                                        @click="taskDetails.activeTask = taskKey">
                                        <i class="fas fa-eye"></i> View</b-button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <div class="row">
                                <div id="resource-usage" class="p-4 col-md-6">
                                    <h4>Resource Usage</h4>
                                    <v-chart :options="taskDetails.tasks[taskDetails.activeTask].chartOptions" />
                                </div>
                                <div id="task-log" class = "col-md-6 p-4">
                                    <h4> Log Message</h4>
                                    <p class="font-italic">Console Output</p>
                                    <pre id="stdout" class="light">{{ taskDetails.tasks[taskDetails.activeTask].log.stdout }}</pre>
                                    <p class="font-italic">Error Message</p>
                                    <pre id="stderr">{{ taskDetails.tasks[taskDetails.activeTask].log.stderr }}</pre>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="outputs" class="mt-4 mb-4">
                        <div v-if="job_type=='app'">
                            <h4 class="pt-2">Outputs</h4>
                            <b-list-group>
                                <b-list-group-item v-for="output in outputs" href="javascript:void(0)" v-b-toggle="`o-${output.id}`" :key="`o-${output.id}`">
                                    <i class="fa fa-file"></i> {{ output.name }}
                                    <i class="fa fa-question-circle" v-b-tooltip
                                    :title="output.desc"></i>
                                    <b-collapse :id="`o-${output.id}`">
                                        <ul class="mt-3">
                                            <li v-for="file in output.files" :key="file.id">
                                                <a :href="`https://deepomics.org/explorer/download_rel/?path=${file.path}/${file.name}`" target="_blank">{{ file.name }}</a>
                                            </li>
                                        </ul>
                                    </b-collapse>
                                </b-list-group-item>
                            </b-list-group>
                        </div>
                        <div v-else>
                            <h4 class = "pb-1">Output</h4>
                            <b-list-group>
                                <b-list-group-item v-for="task_output in outputs" href="javascript:void(0)" v-b-toggle="`i-${task_output.module_id}`" :key="`i-${task_output.module_id}`">
                                    <i class="fa fa-tasks"></i> {{ task_output.name }}
                                    <b-collapse :id="`i-${task_output.module_id}`">
                                            <div>
                                                <b-list-group>
                                                    <b-list-group-item v-for="output in task_output.outputs" href="javascript:void(0)" v-b-toggle="`o-${output.id}`" :key="`o-${output.id}`" @click="$event.stopPropagation();">
                                                        <i class="fa fa-file"></i> {{ output.name }}
                                                        <i class="fa fa-question-circle" v-b-tooltip
                                                        :title="output.desc"></i>
                                                        <b-collapse :id="`o-${output.id}`">
                                                            <ul class="mt-3">
                                                                <li v-for="file in output.files" :key="file.id">
                                                                    <a :href="`https://deepomics.org/explorer/download_rel/?path=${file.path}/${file.name}`" target="_blank">{{ file.name }}</a>
                                                                </li>
                                                            </ul>
                                                        </b-collapse>
                                                    </b-list-group-item>
                                                </b-list-group>
                                            </div>
                                        
                                    </b-collapse>
                                </b-list-group-item>
                            </b-list-group>
                        </div>
                    </section>

                </b-card-body>

                <b-card-body v-show="display==1" class="p-2 mb-10" style="padding: 0px !important;">
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

            refreshEnd: false,
            isDemo: true,

            taskId: 5212,
            job_type: "app",
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
            job_status: "", 
            
            taskDetails: {
                code: "NO_CHOSEN",
                id: null,
                type: 'app',
                activeTask: 'test',
                tasks: {
                },
                // name: "",
                // status: "",
                // log: {
                //     stdout: '',
                //     error: ''
                // },
                // chartOptions: {},
            },
            taskDetailsCompleted: false,
            backIcon: require('../assets/images/query_back_white.png'),
            backWhite: require('../assets/images/query_back_white.png'),
            backColor: require('../assets/images/query_back_color.png'),

            monitorIcon: require('../assets/images/query_monitor_white.png'),
            monitorWhite: require('../assets/images/query_monitor_white.png'),
            monitorColor: require('../assets/images/query_monitor_color.png'),

            visIcon: require('../assets/images/query_visualization_white.png'),
            visWhite: require('../assets/images/query_visualization_white.png'),
            visColor: require('../assets/images/query_visualization_color.png'),

            refreshIcon: require('../assets/images/query_refresh_white.png'),
            refreshWhite: require('../assets/images/query_refresh_white.png'),
            refreshColor: require('../assets/images/query_refresh_color.png'),
        };
    },
    created() {
        this.refreshEnd = false;
        this.isDemo = true;
        let demo_result_id = window.gon.demo_result_id;
        this.job_id = demo_result_id
        this.searchJob();
        

    },
    mounted(){
        this.outputs = [
            {
                module_id: 1022,
                name: "module1",
                outputs: [
                    {
                        desc: "something",
                        id: 888,
                        name: "test file name",
                        files: [
                            {
                                name: "name1",
                                path: "path1",
                            }

                        ]

                    }
                ],
                status: "finished",
            }
        ]
        window.gon.viz_mode = "task-output";
        const { alertCenter } = this.$refs;
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

        this.stderr = "Updating...";
        this.stdout = "Updating...";

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
        //improvement multiple charts for pipelines
        viewTaskDetails() {
            const { alertCenter } = this.$refs;
            this.taskDetails.id = this.job_id;
            this.taskDetails.tasks = {
            },
            this.taskDetails.activeTask = "test";
            axios.post(`/task-details/`,
                objectToFormData({'id': this.job_id}),
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'multipart/form-data',
                    },

                }
                ).then(res => {
                    console.log("viewTaskDetails fetched information:");
                    console.log(res);
                    // console.log(res)
                    if (this.job_type == "pipeline" && res.data.message.code != false) {
                        this.taskDetails.code = "CHOSEN";
                        this.taskDetails.type = 'pipeline';
                        res.data.message.tasks.forEach((t, i) => {
                            this.update_chart(t, `monitor_m_${t.module_id}`);
                            if (i == 0) this.taskDetails.activeTask = `monitor_m_${t.module_id}`;
                        });
                        this.taskDetailsCompleted = true;
                    }
                    else if (this.job_type == "app" && res.data.message.code == true) {
                        this.taskDetails.code = "CHOSEN";
                        this.taskDetails.type = 'app';
                        this.update_chart(res.data.message.data, `monitor_m_${this.job_id}`);
                        this.taskDetails.activeTask = `monitor_m_${this.job_id}`;
                        // this.taskDetails.log = res.data.message.data.task_log;
                        this.taskDetailsCompleted = true;
                    } else {
                        this.taskDetails.code = "API_ERROR";
                        alertCenter.add('danger', res.data.message);
                    }
                    console.log("viewTaskDetails Result:");
                    console.log(this.taskDetails);
            });
        },

        update_chart(data, key) {
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
            this.taskDetails.tasks[key] = {chartOptions,
                                log: data.task_log,
                                name: data.name,
                                status: data.status};
        },

        refreshStatus() {
            console.log("Now refresh task", this.taskId)
            axios.post(
                `/query-deepomics/`,
                objectToFormData({'id': this.taskId, 'type': this.job_type}),
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                        'Content-Type': 'multipart/form-data',
                    },
                },
            ).then((response) => {
                console.log("Module query result:", response);
                // response = {
                //     "data": {
                //         "status": "success",
                //         "message": 

                //     }
                // }
                this.job_status = response.data.message.status;
                this.inputs = response.data.message.inputs;

                if (this.job_type == "app") {
                    this.outputs = response.data.message.outputs;
                    this.params = response.data.message.params;
                }
                else {
                    this.outputs = response.data.message.tasks;
                    this.params = response.data.message.node_records;
                }

                
            }).catch((error) => {
                const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                alertCenter.add('danger', `${message}`);
            }).finally(() => {
                // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                console.log("Log:", this.inputs, this.outputs, this.params);
                this.viewTaskDetails();
            });
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
                        this.job_type = response.data.type;
                        console.log("this.taskId:", this.taskId);
                        console.log("this.job_type:", this.job_type); //get the type of the task
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
            this.module_names = output.module_names.map((x, i) => ({value: i, text: x[0]}));
            this.chosenModule = 0;
            window.gon.module_name = output.module_names[this.chosenModule][1];
            
            window.gon.required_data = output.required_data;
            if (!window.gon.urls) window.gon.urls = {};
            window.gon.urls.chosen_file_paths = `/api/analysis/${output.analysis_id}/chosen_file_paths?visualizer=${this.chosenModule}`;
            window.gon.urls.download_demo_file = `/api/analysis/${output.analysis_id}/download_demo_file?visualizer=${this.chosenModule}`;
            console.log("outputing to be visualized plot:")
            console.log(output.module_names[this.chosenModule][1]);
            registerViz(output.module_names[this.chosenModule][1]);
            event.emit("GMT:query-finished", this);
        },
        updateVis() {
            event.emit("GMT:reset-query", this);
            window.gon.module_name = this.data.outputs[this.chosenOutput].module_names[this.chosenModule][1];

            window.gon.required_data = this.data.outputs[this.chosenOutput].required_data;
            if (!window.gon.urls) window.gon.urls = {};
            window.gon.urls.chosen_file_paths = `/api/analysis/${this.data.outputs[this.chosenOutput].analysis_id}/chosen_file_paths?visualizer=${this.chosenModule}`;
            window.gon.urls.download_demo_file = `/api/analysis/${this.data.outputs[this.chosenOutput].analysis_id}/download_demo_file?visualizer=${this.chosenModule}`;
            
            registerViz(this.data.outputs[this.chosenOutput].module_names[this.chosenModule][1]);
            event.emit("GMT:query-finished", this);

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
    //min-height: 900px;
    //max-height: 1200px;
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
    border: none !important;
    // height: 835px;
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

.card-header img {
    width: 10%;
    margin-right: 5px;
}

</style>
