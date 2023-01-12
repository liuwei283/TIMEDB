<template>
<!-- eslint-disable max-len -->
<div id="job-query">
    <alert-center ref="alertCenter" />
    <div v-if="!isLoading">
        <div v-if="!submitted && !isDemo"> <!---->
            <b-card class="text-center query-card">
                <div class="row justify-content-center">
                    <b-input-group class="justify-content-center">

                        <b-form-input
                            v-model="job_id"
                            size="lg"
                            :state="valid_name"
                            placeholder="Please enter your task ID"
                            class="col-md-4 text-center"
                        ></b-form-input>

                        <b-input-group-append>
                            <b-button class = "btn btn-1" size="lg" @click="searchJob"
                            ><i class="fas fa-search"></i> Search</b-button
                            >
                        </b-input-group-append>

                    </b-input-group>
                    <p style="color:gray;font-size:1.4em;position:relative;right:30px;"><i>You could check the submitted task by Task ID.</i></p>
                    
                </div>

                <div class="local-jobs">
                    <div class = "container row pb-2 text-center justify-content-center" style="margin:auto;">
                        <div class="col-md-4">
                        </div>
                        <div class= "col-md-4" style="margin:auto;"> 
                            <h3 class="font-weight-bold" style="margin:auto;">Submitted Tasks</h3>
                        </div>
                        <div class="col-md-3 text-left">
                            <b-button class="btn btn-3" style="width: 180px;" @click="refreshJobs()" @mouseover="refreshIcon=refreshColor" @mouseleave="refreshIcon=refreshWhite;">
                                <img v-bind:src="refreshIcon" style="width:20px; margin-right:10px;">
                                Refresh Status
                            </b-button>
                            <!-- <b-button
                                class="btn-1" @click="refreshJobs()">Refresh
                            </b-button> -->
                        </div>
                        <div class="col-md-1">
                            <i v-if="!refreshEnd" class="fas fa-spinner fa-spin" style="font-size:24px"> </i> 
                        </div>
                    </div>
                    <p style="color:gray;font-size:1.4em;"><i> You can click refresh button to refresh task status.</i></p>

                    <div id="table-container">
                        <template>
                            <b-table
                                id="job-table"
                                hover
                                :filter="job_id"
                                :items="all_jobs"
                                :fields="fields"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc"
                                sort-icon-left
                                show-empty
                                :per-page="perPage"
                                :current-page="currentPage"
                            >
                                <template #cell(index)="data">
                                    {{ data.index + 1 }}
                                </template>
                                
                                <template #cell(status)="data">
                                    <b-badge
                                        pill
                                        class="badge-finished"
                                        v-if="data.item.status == 'finished'"
                                    >Finished</b-badge>

                                    <span v-else-if="data.item.status == 'failed'" v-b-tooltip.rightbottom.html title="Please check the format of your file!">
                                        <b-badge
                                            pill
                                            class="badge-failed"
                                        >
                                            Failed
                                            <i class="fas fa-exclamation-circle small"></i>
                                        </b-badge>
                                    </span>

                                    <b-badge pill class="badge-running" v-else>Running</b-badge>
                                </template>

                                <template #cell(operation)="data">

                                    <b-button
                                        class = "btn btn-1"
                                        size="sm"
                                        v-if="data.item.status == 'finished'"
                                        @click="showAnalyses(data.item.taskId)"
                                    >
                                        <i class="fas fa-search mr-1"></i>
                                        Result
                                    </b-button>

                                    <b-button class = "btn btn-1" size="sm" v-else @click="showAnalyses(data.item.taskId)">
                                        <i class="fas fa-search mr-1"></i>
                                        Check
                                    </b-button>

                                    <b-button  v-if="!isDemo"
                                        size="sm"
                                        class="ml-4 btn-3"
                                        @click="deleteJob(data.item.taskId)"
                                        :disabled="data.item.isDemo"
                                    >
                                        <i class="fas fa-trash-alt mr-1"></i>
                                        Delete
                                    </b-button>

                                </template>
                                <template #empty>
                                    <h4 class="text-center">No task... <a href="/submit/analyses">Please submit your tasks.</a> </h4>
                                </template>
                            </b-table>
                            <b-pagination
                                v-model="currentPage"
                                :total-rows="jobsNumber"
                                :per-page="perPage"
                                aria-controls="job-table"
                                align="center"
                            ></b-pagination>
                        </template>
                    </div>
                </div>
            </b-card>
        </div>
        <div class="viz-result mb-1" v-else-if="!reruned"> <!---->
            <b-card no-body>
                <b-card-header v-b-modal.modalBox class="border-1 py-2">
                    <h3 class="m-4 text-center">
                        <strong>{{`${jobName} (No.${job_id})`}}</strong>
                        <b-badge
                            pill
                            v-if="job_status=='failed'"
                            class="badge-failed"
                        >
                        Failed
                        </b-badge>
                        <b-badge
                            pill
                            v-else-if="job_status=='finished'"
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
                        <i v-if="!refreshEnd" class="fas fa-spinner fa-spin" style="font-size:24px"> </i>
                    </h3>

                    <b-button class="btn btn-1 col-md-2" v-if="!isDemo" @click="returnQuery" @mouseover="backIcon=backColor" @mouseleave="backIcon=backWhite;">
                        <img v-bind:src="backIcon">
                        Back to query
                    </b-button>

                    <b-button v-else-if="isDemo && category!='New Category'" class="btn btn-1 col-md-2" @click="returnSubmission" @mouseover="backIcon=backColor" @mouseleave="backIcon=backWhite;">
                        <img v-bind:src="backIcon">
                        Back
                    </b-button>

                    <b-button v-else class="btn btn-1 col-md-2" @click="returnTCRSubmission" @mouseover="backIcon=backColor" @mouseleave="backIcon=backWhite;">
                        <img v-bind:src="backIcon">
                        Back
                    </b-button>

     
                    <b-button class="btn btn-1 col-md-2" @click="display=0" :class="{active:display==0}" @mouseover="monitorIcon=monitorColor" @mouseleave="monitorIcon=monitorWhite;">
                        <img v-bind:src="monitorIcon">
                        Task Monitor
                    </b-button>

                    <b-button class="btn btn-1 col-md-2" @click="display=1" :class="{active:display==1}" v-if="jobName!='TCRanno Qualitative Annotation' && job_status == 'finished'" @mouseover="visIcon=visColor" @mouseleave="visIcon=visWhite;">
                        <img v-bind:src="visIcon">
                        Visualization
                    </b-button><!---->

                    <b-button class="btn btn-1 col-md-2" disabled v-else-if="jobName!='TCRanno Qualitative Annotation'" @mouseover="visIcon=visColor" @mouseleave="visIcon=visWhite;">
                        <img v-bind:src="visIcon">
                        Visualization
                    </b-button>
                    <b-button v-if="!isDemo" class="btn btn-1 col-md-2" @click="rerunTask" @mouseover="rerunIcon=rerunColor" @mouseleave="rerunIcon=rerunWhite;">
                        <img v-bind:src="rerunIcon">
                        Rerun Task
                    </b-button>

                    <b-button v-if="!isDemo" class="btn btn-3 float-right col-md-2" @click="searchJob" @mouseover="refreshIcon=refreshColor" @mouseleave="refreshIcon=refreshWhite;">
                        <img v-bind:src="refreshIcon">
                        Refresh Status
                    </b-button>
                    <p v-if="jobName=='TCRanno Qualitative Annotation'" style="color:gray;font-size:1.2em;margin-top: 5px;">Scroll down to the 'Outputs' tab to download the demo output file</p>
                    <p v-if="jobName=='TCRanno Qualitative and Quantitative Annotations'" style="color:gray;font-size:1.2em;margin-top: 5px;">Click 'Visualization' to view the generated plots. Scroll down to the 'Outputs' tab to download all demo output files.</p>
                    

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

                        <dropdown-select
                            v-if="job_status == 'finished' && jobName=='TCRanno Qualitative and Quantitative Annotations'"
                            right
                            v-model="chosenPicture"
                            :options="picture_names"
                            class="tool-bar-el px-0 mb-1 col-md-3"/><!--v-if="data.outputs.length > 1"-->

                        <p style="color:gray;font-size:1.4em;position:relative;left:20px;" v-if="job_status == 'finished' && taskOutputs.length>1" ><i>You could select different task outputs to check their visualizations.</i></p>
                    </div>
                    <p v-if="category=='New Category'" style="font-size:1.5em;margin-top: 5px;">
                        click <a href='https://timedb.deepomics.org/submit/tcrAnalyses'>here</a> to go back to wTCRanno main page.
                    </p>

                </b-card-header>



                <b-card-body v-show="display==0" class="p-4" >

                    <div v-if="!isDemo">
                        <p>Please note that</p>
                        <ul>
                            <li>You can click refresh button to refresh task status.</li>
                            <li v-if="jobName!='TCRanno Qualitative Annotation'">If the job is finished, visualization is available through clicking the 'Visualization' button above.</li>
                            <li>You could rerun your task within 30 days.</li>
                            <li>If the job is finished, output files will be available for download (scroll down to the 'Outputs' tab)</li>
                        </ul>
                        <hr>
                    </div>

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
                                            {{ file.name }}
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
                                    <p style="color:gray;font-size:0.8em;" ><i>Module-loading, GATK-related and matplotlib-related errors do not affect the running, please ignore them.</i></p>
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
                                    :title="output.desc"></i><i class="fa fa-download"></i>
                                    <b-collapse :id="`o-${output.id}`">
                                        <ul class="mt-3">
                                            <li v-for="file in output.files" :key="file.id">
                                                <a @click="downloadFile(file.path, file.name)">{{ file.name }}</a>
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
                                                        :title="output.desc"></i><i class="fa fa-download"></i>
                                                        <b-collapse :id="`o-${output.id}`">
                                                            <ul class="mt-3">
                                                                <li v-for="file in output.files" :key="file.id">
                                                                    <a @click="downloadFile(file.path, file.name)">{{ file.name }}</a>
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
                    <hr>

                    <section id="module_recommendation" v-if="modules_relation[category] != null" class="mt-4 mb-4">
                        <h4> Recommended for you
                            <b-button class="ml-2 btn btn-3" @click="downloadOutputs">
                                Download Outputs
                            </b-button>
                        </h4>
                        <p style="color:gray;font-size:1.4em;"><i>You could download outputs before conducting the following analyses.</i></p>
                        <!-- <ul class="container">
                            <li v-for="analysis_names in modules_relation[category]" v-bind:key="analysis_names">
                                {{analysis_names}}
                            </li>
                        </ul> -->

                        <div class="row m-4 text-center" style="border-left: 10px solid #34498e;">
                            <div class="col-4" style="width:80%;" v-for="(group,idx) in modules_relation[category]" :key="idx" >
                                <h5>
                                    Analysis Group 
                                    <span v-if="modules_relation[category].length > 1"> {{idx + 1}} </span>
                                    <!-- <b-button class="ml-2 btn btn-3" @click="submitAll">
                                        Submit All
                                    </b-button> -->
                                </h5> 
                                <div>
                                    <div class="row m-4 text-center" v-for="(aname, idx2) in group.split(',')" :key="idx2" @click="updateApp(a, true)">
                                        <b-button class="btn btn-1 w-100" @click="submitRecommendation(aname)">
                                            <h4 class = "text-center">{{aname}}</h4>
                                        </b-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </b-card-body>

                <b-card-body v-show="display==1" class="p-2">
                    <div id = "viz-card" v-if="category!='New Category'"> 
                        <VApp/>
                    </div>
                    <div v-else-if="jobName=='TCRanno Qualitative and Quantitative Annotations'" class="text-center">
                        <img v-bind:src="pictureViz" style="width:80%;">
                    </div>
                </b-card-body>

            </b-card>
        </div>
        <div v-else-if="reruned">
            <div class="text-center job-info container">
                <h1>Successfully</h1>
                <h1>Submitted</h1>
                <p>We are preparing your visualization,you can copy the code and check the status of your work in the <a ref = "goTo" :href = "`/submit/job-query`" id = "redirection-link">[workspace]</a>.</p>
                <div class = "row">
                    <div class = "col-md-2">
                        <b-btn :id = "copyButton" @click = "copyToClipboard" type = "button" class = "btn btn-dark">Copy</b-btn>
                    </div>
                    <div class = "col-md-2">
                        <button id = "jobIDButton" type = "button" class = "btn">{{rerunedJobID}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id = "loadingBlock" v-else>
        <h3 class="mt-4">
            <img v-bind:src="require('../assets/images/loading_icon.gif')">
            We are preparing your submission. Please wait for some minutes.
        </h3>
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
import * as $ from "jquery";

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
            sortBy: "index",
            sortDesc: false,
            perPage: 5,
            currentPage: 1,
            job_id: '',
            jobName: '',
            category: 'Regression Tools',
            all_jobs: [],
            fields: ["index", "taskName", "taskId", "created", "status", "operation"],
            showTable:  true,
            valid_name: null,
            submitted: false,
            code: false,
            data: {outputs: []},
            chosenOutput: null,
            chosenModule: 0,
            //module_names: [{value: 0, text: "fake module name 1"}, {value: 0, text: "fake module name 2"}],
            module_names: [],
            pictureViz: '/data/outputs/dir1/1.png',
            chosenPicture: "tcr2org_plot",
            picture_names: [{value: "tcr2org_plot", text: "tcr2org plot"}, {value: "tcr2ept_plot", text: "tcr2ept plot"}, {value: "tcr2ag_plot", text: "tcr2ag plot"}],

            taskOutputs: [{value: 0, text: "Demo Files", secondaryText: ""}],
            refreshEnd: true,
            isDemo: false,
            isLoading: false,
            reruned: false,
            analysis: [],

            taskId: 5212,
            run_id: -1,
            search_id: -1,
            job_type: "app",
            display: 0,
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
                    "test": {
                        chartOptions: {},
                        log: {
                            stderr: "",
                            stdout: "",
                        }
                    }
                },
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

            rerunIcon: require('../assets/images/query_rerun_white.png'),
            rerunWhite: require('../assets/images/query_rerun_white.png'),
            rerunColor: require('../assets/images/query_rerun_color.png'),

            modules_relation: {
                "Regression Tools": [
                    "TIMEDB Cell Fraction Subtyping,TIMEDB KM Estimator,Correlation Analysis", "TIMEDB C1-C6", "TIMEDB Immunoregulator"
                ],
                "Enrichment Tools": [
                    "TIMEDB Cell Fraction Subtyping,TIMEDB KM Estimator,Correlation Analysis", "TIMEDB C1-C6", "TIMEDB Immunoregulator"
                ],
                "Unsupervised Tools": [
                    "TIMEDB Cell Fraction Subtyping,TIMEDB KM Estimator,Correlation Analysis", "TIMEDB C1-C6", "TIMEDB Immunoregulator"
                ],
                "Comparison Analysis": [
                    "Regression Tools,Consensus Tools,Enrichment Tools,Estimation Comparison"
                ],
                "Patient Subtyping": [
                    "TIMEDB HR OR"
                ]
            } 
        };
    },
    created() {
        

        if (window.gon.isDemoJobPage == true) {
            this.refreshEnd = false;
            this.isDemo = true;
            this.job_id = window.gon.demo_result_id;
            this.jobName = window.gon.job_name

            this.category = window.gon.category;
            this.search_id = window.gon.search_id;
            this.run_id = window.gon.run_id;

            this.searchJob();

        }
        else {
            this.refreshJobs();
        }

        // axios.get('/submit/job-query.json',).then(response => {this.analyses = response.data; console.log("Fetched analyses data:"); console.log(response.data)});
    },

    beforeMount() {
        // const getJobId = () => {
        //     const urls = window.location.href.split('?');
        //     if (urls.length <2) return;
        //     else {
        //         const params = urls[1].split("&").map(x => x.split("="));
        //         return params.find(x => x[0]==="job_id")[1];
        //     }
        // }
        // if (!this.job_id) this.job_id = getJobId();
    },
    mounted(){
        window.gon.viz_mode = "task-output";


        const { alertCenter } = this.$refs;

        // for testing the output of task info api

        // Test Pipeline
        // axios.post(
        //     `/query-deepomics/`,
        //     objectToFormData({'id': 528, 'type': 'pipeline'}),
        //     {  
        //         headers: {
        //             'X-Requested-With': 'XMLHttpRequest',
        //             'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     },
        // ).then((response) => {
        //     console.log("Pipeline query result:", response);
            
        //         }).catch((error) => {
        //             const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
        //             alertCenter.add('danger', `${message}`);
        //         }).finally(() => {
        //             // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
        //         });
        
        // // Code
        // axios.post(
        //     `/query-deepomics/`,
        //     //improvement here: when we testing pipeline, here we need to check whether this is analyis or pipeline
        //     objectToFormData({'id': this.taskId, 'type': 'app'}),
        //     {
        //         headers: {
        //             'X-Requested-With': 'XMLHttpRequest',
        //             'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     },
        // ).then((response) => {
        //     console.log("Module query result:", response);
        //     this.inputs = response.data.message.inputs;
        //     this.outputs = response.data.message.outputs;
        //     this.params = response.data.message.params;
            
        // }).catch((error) => {
        //     const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
        //     alertCenter.add('danger', `${message}`);
        // }).finally(() => {
        //     // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
        //     console.log("Log:", this.inputs, this.outputs, this.params);
        //     this.getChartsInfo();
        // });


        this.stderr = "Updating ERR...";
        this.stdout = "Updating STD...";
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
        },
        chosenPicture:function(newValue) {
            
            var first_pic = this.outputs.find(x => x.name == newValue).files[0];
            this.pictureViz = '/data/outputs' + first_pic.path + '/' + first_pic.name;
            console.log(first_pic.path + first_pic.name);
        
        },
        submitted:function(newValue) {
            if(newValue == true) {
                document.getElementById("workspace_dataset").style.display = "none";
            }
            else {
                document.getElementById("workspace_dataset").style.display = "block";
                console.log("fkjbsdgfgb")
            }
        }
    },
    computed: {
        // displayedRecommended() {
        //     var rec_list = this.modules_relation[this.category];

        //     for (var k in rec_list) {
        //         //for each group
        //         var group = rec_list[k].split(",");
        //         for (var t in group) {
        //             aname = group[t];
        //             if (aname == "Consensus Tools") {
        //             }
        //         }
                
        //     }
        // }
        jobsNumber() {
            return this.all_jobs.length;
        }
    },
    methods: {
        //improvement multiple charts for pipelines
        viewTaskDetails() {
            this.taskDetailsCompleted = false;
            const { alertCenter } = this.$refs;
            this.taskDetails.id = this.job_id;
            this.taskDetails.tasks = {
            };
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
                        this.taskDetailsCompleted = false;
                        this.taskDetails.code = "API_ERROR";
                        //alertCenter.add('danger', res.data.message);
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
            const { alertCenter } = this.$refs;

            console.log("Now refresh task", this.taskId)
            this.stdout = new Date() + " output test."
            // this.stderr = new Date() + " error test."
            // Production Code
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

                if (this.jobName=="TCRanno Qualitative and Quantitative Annotations") {
                    console.log("Here outputing outputs data");
                    console.log(this.outputs);
                    var first_pic = this.outputs.find(x => x.name == "tcr2org_plot").files[0];
                    this.pictureViz = '/data/outputs' + first_pic.path + '/' + first_pic.name;
                    console.log(first_pic.path + first_pic.name);
                }
            }).catch((error) => {
                const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                alertCenter.add('danger', `${message}`);
            }).finally(() => {
                // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                console.log("Log:", this.inputs, this.outputs, this.params)
                this.viewTaskDetails();

            });  
        },


        downloadInput() {
            window.open(window.gon.urls.download_input_demo);
        },
        searchJob() {
            this.taskDetailsCompleted = false;
            this.refreshEnd = false;
            const { alertCenter } = this.$refs;
            
            if (this.job_id.length <= 0){
                this.valid_name = false;
            }else {
                if (this.isDemo != true) {
                    this.all_jobs.forEach(j => {
                        if (j.taskId === parseInt(this.job_id)) {
                            this.jobName = j.taskName;
                            this.category = j.category;
                            this.search_id = j.analysis_id;
                            this.run_id = j.run_id;
                            console.log(this.category);
                        }
                    })
                }
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
                        this.submitted = true;

                        if (response.data.body.length > 0) {
                            this.updateGon(this.data.outputs[0]);
                            this.taskOutputs = this.data.outputs.map((x, i) => ({value: i, text: x.name}));
                        }

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
                    this.refreshEnd = true;
                });
            }
        },
        showAnalyses(jobId) {
            this.job_id = jobId;
            this.searchJob();
        },
        copyToClipboard(){
            navigator.clipboard.writeText(this.rerunedJobID);
            document.getElementById('copyButton').removeClass('btn-light');
            document.getElementById('copyButton').addClass('btn-dark');
        },
        updateGon(output) {
            event.emit("GMT:reset-query", this);
            if (this.category != "New Category") {
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
            }
            
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
        // submitAll() {

            

        // },
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
        // getDemoJobs() {
        //     axios.post(
        //         `/query-demo-tasks/`,
        //         null,
        //     {  
        //         headers: {
        //             'X-Requested-With': 'XMLHttpRequest',
        //             'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     })
        //     .then(r => {
        //         this.all_jobs = r.data.map((d, index) => {
        //             return  {index, ...d}
        //         });
        //     }).finally(() => {
        //         // // wait 1 sec
        //         //  setTimeout(() => {
        //         //     this.refreshEnd = true;
        //         //     }, 1000);
        //     });
        // },
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
        token_search(token){
            this.job_id = token;
            this.searchJob();
        },
        submitRecommendation(aname) {
            // try to export files to submit
            // var export_json = "export_paths=";
            // var export_array = [];
            // for (var k in this.outputs) {
            //     var cur_file = this.outputs.files[0];
            //     var cur_path = cur_file.path + "/" + cur_file.name;
            //     export_array.push(this.outputs[k].name + ":" + cur_path);
            // }
            // export_json += export_array.join(',');
            // //window.location.href = `/submit/analyses/?aname=${aname}&${export_json}`;
            // window.location.href = `/submit/analyses/?aname=${aname}&export_paths=Clinical data:/dir1/file1.csv`;
            if (aname == "Consensus Tools") window.location.href = `/submit/pipelines?ptype=consensus`;
            else if (aname == "Estimation Comparison") window.location.href = `/submit/pipelines?ptype=all`
            else window.location.href = `/submit/analyses/?aname=${aname}`;
        },

        returnQuery(){
            event.emit("GMT:reset-query", this);
            this.submitted = false;
        },
        returnSubmission(){
            window.location.href = '/submit/analyses';
        },
        returnTCRSubmission() {
            window.location.href = '/submit/tcrAnalyses';
        },
        downloadFile(path, name) {
            window.open(`/api/download_target_file?file_path=/data/outputs${path}/${name}`);
        },
        downloadOutputs() {
            window.open(window.gon.urls.download_demo_file);
        },
        rerunTask() {
            const { alertCenter } = this.$refs;
            let alertData;
            var demo_files = {};
            var demo_params = {};

            let submitted_mid;

            this.isLoading = true;
            console.log("Task submitted: isLoading?")
            console.log(this.isLoading);

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
                console.log("Module query result (rerun tasks):", response);
                this.demo_inputs = response.data.message.inputs;
                if (this.job_type == "app") {
                    this.demo_parameters = response.data.message.params;
                }
                else {
                    this.demo_parameters = response.data.message.node_records;
                }
            }).catch((error) => {
                const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                alertCenter.add('danger', `${message}`);
            }).finally(() => {

                console.log("Fetched demo inputs and parameters: ");
                console.log(this.demo_inputs);
                console.log(this.demo_parameters);

                for (var k in this.demo_inputs){
                    let input = this.demo_inputs[k];
                    let f_arr = [];
                    for (var t in input.files) {
                        let file = input.files[t];
                        let f_path = file.path + "/" + file.name;
                        f_arr.push(f_path);
                    }
                    demo_files[`i-${input.id}`] = f_arr.join(","); 
                }

                for (var k in this.demo_parameters) {
                    let params = this.demo_parameters[k];
                    demo_params[`p-${params.id}`] = params.value;
                }

                console.log("Outputing demo inputs json:");
                console.log(demo_files);
                console.log("Outputing demo inputs parameters:");
                console.log(demo_params);

                var is_pipeline_param;

                if (this.job_type == 'app') {
                    is_pipeline_param = false;
                }
                else {
                    is_pipeline_param = true;
                }

                axios.post(
                    `/submit-app-task/`,
                    objectToFormData({
                        "search_id": this.search_id,
                        "mid": this.run_id,
                        "is_demo": true,
                        "inputs": demo_files,
                        "params": demo_params,
                        "is_pipeline": is_pipeline_param,
                    }),
                    {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    if (response.data.code) {
                        this.rerunedJobID = response.data.data.task_id;
                        this.reruned = true;
                    } else {
                        alertData = response.data.msg;
                    }
                }).catch((reason) => {
                    alertData = reason;
                }).finally(() => {
                    console.log("Tasks reruned!");
                    this.isLoading = false;
                    if (!!alertData) {
                        this.$refs.alertCenter.add('danger', alertData);
                    }
                });
            });
        },
    },
    components: {
        AlertCenter,
    },
};
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';
@import '../assets/stylesheets/partials/variables';
#job-query {
    background-color: #f8f9fa !important;
}

#job-query .fas.fa-tasks {
	font-size: 5rem !important;
	margin-right: 0px;
}

#job-query .query-card {
    margin: 20px;
	padding: 3rem;
    background-color: #f8f9fa;
    border: none;
    .input-group {
        input {
            border-color: $light-theme;
            border-radius: 30px;
            font-weight: 500;
            z-index: 1;
            padding-right: 48px;
        }
        button {
            z-index: 2;
            margin-left: -40px;
        }
    }
    // border-radius: 30px;
    // box-shadow: 0 0 32px darken($gray-300, 5%);

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
    //height: 835px;
}
.v-editor {
    position: absolute;
    top: 0;
    right: 0;
    z-index:20;
    transition: all 0.3s
}
#table-container {
    //max-height: 50em;
    //overflow-y: scroll;
    border: 1px solid darken($gray-300, 5%);
    border-radius: 10px;
    thead tr th {
        border: 0;
        background-color: #c5d4dd !important;
    }
    thead tr {
        background: #28ab74 !important;
    }
    tbody tr td {border: 0;}

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
    height: 300px;
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

#loadingBlock {
    text-align: center;
    color: #000;
    z-index: 1000;
    width: 100%;
    height: 100%;
    vertical-align: center;
}

#loadingBlock img {
    width: 200px;
    position: relative;
    top: 10px;
}

.job-info {
    min-height: 200px;
    padding: 100px 20px;
    font-size: 40px;
    background-color: #f8f9fa;

}

.job-info h1 {
    font-size: 1.5em;
    text-align: left;
}

.job-info p {
    text-align: left;
}

.job-info button {
    font-size: 0.8em;
}

#jobIDButton {
    background-color: $light_theme;
    color: white;
}

#table-container li button {
    background-color: #f8f9fa !important;
    color: black;
    
}

#table-container li span {
    background-color: #f8f9fa !important;
    color: black;
}

#table-container li.page-item.active button{
    background-color: #bbd1de !important;
    border: 1px solid #bbd1de;
    color: black;
    
}
</style>
