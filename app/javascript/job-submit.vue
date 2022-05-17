<template>
    <!-- eslint-disable max-len -->
    <div class="row my-4" >
        <ul class='list d-none'>
            <li v-for="a in analyses" :key="a.id" class='list-item'>
            {{a.id}}: {{a.name}}
            </li>
        </ul>

        <div class="prepare" v-if="!submitted">
            <div class="index-banner">
                <div class="container">
                    <h2 class="display-2">
                        Start Analysis
                    </h2>
                    <p class="lead mt-4">
                        GutMeta provides common applied methods of metagenomics sequence analysis. Official tutorial is available at Tutorial. You may try submit the tasks with our demo input files, and view the ideal results on the demo jobs page.
                    </p>
                </div>
            </div>
            <div id = "singleMultipleSelect">
                <div class="container">
                    <h2 class="display-5">
                        Please choose to upload single or multical file(s)/dataset(s): 
                    </h2>
                    <br>
                    <button type = "button" id = "single-button" class = "btn btn-dark btn-lg btn-select" @click="updateMode('single')">
                    Single
                    </button>
                    <button type = "button" id = "multiple-button" class = "btn btn-secondary btn-lg btn-select" @click="updateMode('multiple')">
                    Multiple
                    </button>

                    <!-- <input type="radio" id="single" value="single" v-model="picked_single_multiple">
                    <label for="single">Single</label>
                    <input type="radio" id="multiple" value="multiple" v-model="picked_single_multiple">
                    <label for="multiple">Multiple</label> -->
                    <!-- <br>
                    <p class="lead mt-2">You will upload {{ picked_single_multiple }} file(s)/dataset(s)</p> -->
                </div>
            </div>
            <div class="index-banner">
                <div class="container">
                    <h2 class="display-4">
                        Module
                    </h2>
                    <p class="lead mt-2">
                        Please choose a module below:
                    </p>
                </div>
            </div>
            <div class="container-fluid container" id="analyses_list">
                <div id="accordion">
                    <!-- <div id="head-for-analysis-list">
                        <h4 class = "mb-2"> Totally {{analyses.length + 1}} Module(s) available </h4>
                        <button aria-controls="collapseOne" aria-expanded="true" class="btn btn-link" data-target="#collapseOne" data-toggle="collapse">
                            Totally {{analyses.length + 1}} Module(s) available
                        </button></h5> -->
                    <!-- </div> -->
                    <div class="cols-xs-space cols-sm-space cols-md-space container">

                        <div class = "row" id = "supervisedSelect" v-if="isConv==true">
                            <div>
                                <h2 class="display-5">
                                    Submit tasks to supervised or unsupervised analyses:
                                </h2>
                                <br>
                                <input type="radio" class = "btn-check" name="supervise-select" autocomplete="off" id="supervised" value="supervised" v-model="picked_supervised" checked>
                                <label for="supervised" class = "btn btn-outline-secondary">Supervised Deconvolution</label>
                                <input type="radio" class = "btn-check" name="supervise-select" autocomplete="off" id="unsupervised" value="unsupervised" v-model="picked_supervised">
                                <label for="unsupervised" class = "btn btn-outline-secondary">Unsupervised Deconvolution</label>

                            </div>
                        </div>
                        <div class="col-lg-4 mb-4 row submit-container" v-for="a in displayedAnalyses" :key="a.id" @click="updateApp(a, true)">
                            <div class="card">
                                <img v-if="a.cover_image == null" v-bind:src="require('../assets/images/module.png')" class="card-img-top">
                                <img v-else :src="a.cover_image" class="card-img-top">
                                <div class = "image_overlay image_overlay_blur">
                                    <div class = "image_title">
                                        {{a.name}}
                                    </div>
                                    <div class = "image_decscription">
                                        {{a.description}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br><br>
        </div>


        <div class = "col-md-12" id = "submit-app-back" v-if="started && !submitted">
            <div class = "row">
                <div class="col-md-2">
                    <img v-bind:src="require('../assets/images/nav-up-blue.png')">
                    <svg width="100px" height="600px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 0 v 200 l -10 10 l 10 10 v 200 l 10 10 l -10 10 v 160" fill="transparent" stroke="#253959" stroke-width = "3px"></path> 
                    </svg>


                    
                    <div id = "submit-modal-trigger" style="vertical-align:center">
                        <img v-bind:src="require('../assets/images/nav-up-pink.png')" style="margin-right: 10px"> 
                        <i class="fa fa-arrow-right"></i>  <b-btn v-b-modal.submit-helper class = "btn btn-secondary"> Submit Helper </b-btn>
                    </div>

                    
                    <!-- <img v-if="!submittted" v-bind:src="require('../assets/images/nav-submit-gray.png')"> -->
                    <img v-if="submitted == true" v-bind:src="require('../assets/images/nav-submit-blue.png')">
                    <img v-else v-bind:src="require('../assets/images/nav-submit-gray.png')">
                    <br>                      
                </div>
                <div class="col-md-10">
                    <div id="run-app">
                        <alert-center ref="alertCenter" />
                        
                        <!-- Inputs -->
                        <div v-if="started && !submitted">
                            <h6 class="text-right">{{ app.name }}
                                <!-- <i class="fa  fa-question-circle" b-tooltip.hover
                                            :title="app.description"></i> -->
                            </h6>
                            <h2 class = "text-right"> JOB SUBMISSISON </h2>
                            <br>
                            <br>
                            <br>
                            <br>
                            <br>
                            <br>
                            <div class = "container row justify-content-around">
                                <div class = "col-md-6">
                                    <h4 v-if="picked_single_multiple=='multiple'" class = "text-center">Batch effect config</h4>
                                    <h4 v-else class = "text-center">File Submission</h4>

                                </div>
                                <div class = "col-md-6">
                                    <h4 class = "text-center">Set Parameters</h4>
                                </div>
                            </div>
                            <div class = "row">
                                <div class="col-md-6 h-100" ref="inputSection">
                        
                                    <!-- <div class = "row submit-container justify-content-center h-100">
                                        <div v-for="input in displayedInputs" :key="input.id" class = "text-center submit-box col-md-6">
                                            <a :href="`/public/data/module_demo/${app.name}_demo_${input.name}.tsv`" :download=input.name >Demo {{ input.name}} </a>
                                        </div>
                                        <div class="col-md-5 text-center submit-box">
                                            <a href="/public/data/module_demo/demo1.tsv" download = "testing">Download</a>
                                            <a :href="`/public/data/module_demo/${app.name}_demo1.tsv`" download = "demo1">Download</a>
                                        </div>
                                        <div class="col-md-5 offset-2 text-center" style="border:solid;border-radius:20px;padding:20px">
                                            <a :href="`/public/data/module_demo/${app.name}_demo2.tsv`" download = "demo2">Download</a>
                                            <a href="/public/data/module_demo/test_demo2.tsv" download = "testing">Download</a>
                                        </div> 
                                    </div> -->

                                    <div class = "row submit-box justify-content-center">
                                        <div v-if="picked_single_multiple=='single'">
                                            <div class = "row justify-content-around">
                                                <div class="col-md-6 text-center" v-for="input in displayedInputs" :key="input.id">
                                                    <label :for="`i-${input.id}`">{{ input.name }}
                                                        <span v-if="input.required" class="required">*</span>
                                                    </label>
                                                    <div v-b-modal="'single-upload-' + input.id" class="uploadPng text-center justify-content-center container">
                                                        <img v-bind:src="require('../assets/images/big_upload.png')" style="width:90%">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else class = "parent-overflow row justify-content-center">
                                            <div class = "text-center submit-container">
                                                <label for="pairs_num_select">Please select maximum pairs of files you want to upload:
                                                </label>
                                                <div >
                                                    <b-form-input id="pairs_num_select" value=1 max="6" type="number" step="1" name="selected_pairs_num" v-model="multiple_pairs_num" />
                                                </div>
                                            </div>

                                            <div id = "multiple-upload-box" class = "row justify-content-center text-center" v-if="displayedPairsNum > 0">
                                                <div v-for="input_idx in parseInt(displayedPairsNum)" :key="input_idx" class="text-center col-md-4">
                                                    <div v-b-modal="`multiple-upload-${input_idx}`" class="uploadPng text-center justify-content-center container">
                                                        <img v-bind:src="require('../assets/images/big_upload.png')" style="width:90%">
                                                    </div>
                                                    <div class = "text-center" v-if="updateUploadedStatus[input_idx - 1] == true">
                                                        <i class="fa fa-check" aria-hidden="true" style="color:green"></i>
                                                    </div>
                                                    <div class = "text-center" v-else>
                                                        <i class="fa fa-times" aria-hidden="true" style="color:red"></i>
                                                    </div>
                                                    <br>
                                                </div>
                                            </div>
                                            <br>
                                        </div>


                                        <div v-if="picked_single_multiple=='single'" class="row justify-content-center" style="margin-top:10px;">
                                            <!-- <p v-if="picked_single_multiple=='single' && selected != ''">
                                                Small notice: please be noted that you have selected single type analysis.
                                                <br>
                                                you should guarantee that selected datasets are from single project source to submit tasks, 
                                                and you should not upload any file which will be ignored.
                                            </p> -->
                                            <label>
                                                <span>
                                                You can select a dataset to merge: </span>
                                                <i class="fa fa-question-circle" v-b-tooltip.rightbottom.hover title="You may choose one dataset to upload merged files"></i>
                                            </label>
                                            <b-form-select class="col-md-8" 
                                                name="selected-dataset"
                                                v-model="ds_selected"
                                            >
                                                <option value="" key="default">--click to select your own dataset--</option>
                                                <option v-for="(option, index) in select_box_option" :key="index" :value="option.value" :disabled="option.disabled">
                                                    {{option.lable}}
                                                </option>
                                            </b-form-select>
                                        </div>

                                        <div v-else-if="ds_params!=null" class="row justify-content-center" style="vertical-align:bottom">
                                            <!-- <p v-if="picked_single_multiple=='single' && selected != ''">
                                                Small notice: please be noted that you have selected single type analysis.
                                                <br>
                                                you should guarantee that selected datasets are from single project source to submit tasks, 
                                                and you should not upload any file which will be ignored.
                                            </p> -->
                                            <div class = "col-md-6 justify-content-center">

                                                <label>
                                                    <span>
                                                    You can select a dataset to merge: </span>
                                                    <i class="fa fa-question-circle" v-b-tooltip.rightbottom.hover title="You may choose one dataset to upload merged files"></i>
                                                </label>
                                                <b-form-select> 
                                                    name="selected-dataset"
                                                    v-model="ds_selected"
                                                >
                                                    <option value="" key="default">--click to select your own dataset--</option>
                                                    <option v-for="(option, index) in select_box_option" :key="index" :value="option.value" :disabled="option.disabled">
                                                        {{option.lable}}
                                                    </option>
                                                </b-form-select>

                                            </div>

                                            <div class = "col-md-6 justify-content-center">

                                                <label :for="`dp-${ds_params.id}`">{{ ds_params.name }} for selected dataset
                                                    <span v-if="ds_params.required" class="required">*</span>
                                                    <i class="fa fa-question-circle" b-tooltip.hover
                                                    :title="ds_params.description"></i>
                                                </label>
                                                <div v-if="ds_params.param_type === 'enum'">
                                                    <select :id="`dp-${ds_params.id}`" class="form-control custom-select"
                                                            v-model="ds_param_selected" :required="ds_params.required" :name="ds_param_selected">
                                                        <option v-for="option in ds_params.options" :value="option" :key="option"
                                                                :selected="ds_params.default == option ? 'selected' : ''">
                                                            {{ option }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div v-else>
                                                    <b-form-input :id="`dp-${ds_params.id}`" :value="ds_params.default" :required="ds_params.required"
                                                    v-model="ds_param_selected" :name="ds_param_selected" />
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div class="set-param-section col-md-6 h-100" style="word-wrap:break-word; padding-left:40px">

                                    <div class = "row submit-box">
                                        <div v-if="displayedSingleParams.length > 0" class = "col-md-6" style="height:300px;overflow:scroll; vertical-align:center">
                                            <div class="row">
                                                <div class="col-md-12" v-for="param in displayedSingleParams" :key="param.id">
                                                    <label :for="`p-${param.id}`">{{ param.name }}
                                                    </label>
                                                    <div v-if="param.param_type === 'string'">
                                                        <b-form-input @focus="provide_param_desc(param)" :id="`p-${param.id}`" :value="param.default" :required="param.required"
                                                                    v-model="parameters[`p-${param.id}`]" :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]" />
                                                    </div>
                                                    <div v-else-if="param.param_type === 'int'">
                                                        <b-form-input @focus="provide_param_desc(param)" :id="`p-${param.id}`" :value="param.default" type="number" step="1"
                                                                    v-model="parameters[`p-${param.id}`]" :required="param.required" :name="`p-${param.id}`"
                                                                    :state="inputValid[`p-${param.id}`]"/>
                                                    </div>
                                                    <div v-else-if="param.param_type === 'float'">
                                                        <b-form-input @focus="provide_param_desc(param)" :id="`p-${param.id}`" :value="param.default" type="number"
                                                                    v-model="parameters[`p-${param.id}`]" step="0.01" :required="param.required"
                                                                    :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]"/>
                                                    </div>
                                                    <div v-else-if="param.param_type === 'boolean'">
                                                        <b-form-select @focus="provide_param_desc(param)" :id="`p-${param.id}`" :options="boolSelectOpt" :required="param.required"
                                                                    v-model="parameters[`p-${param.id}`]" :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]"/>
                                                    </div>
                                                    <div v-else-if="param.param_type === 'enum'">
                                                        <select @focus="provide_param_desc(param)" :id="`p-${param.id}`" class="form-control custom-select" 
                                                                v-model="parameters[`p-${param.id}`]" :required="param.required" :name="`p-${param.id}`" 
                                                                :state="inputValid[`p-${param.id}`]">
                                                            <option v-for="option in param.options" :value="option" :key="option"
                                                                    :selected="param.default == option ? 'selected' : ''">
                                                                {{ option }}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div v-else-if="param.param_type === 'splitchr'">
                                                        <b-form-select @focus="provide_param_desc(param)" :id="`p-${param.id}`" :options="boolSelectOpt" 
                                                                    v-model="parameters[`p-${param.id}`]" :required="param.required" :name="`p-${param.id}`" 
                                                                    :state="inputValid[`p-${param.id}`]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class = "col-md-6">
                                            <h5>Parameters description</h5>
                                            <p id = "params_desc">{{this.single_params_desc}}</p>
                                        </div>
                                    </div>
                                    <p v-if="displayedSingleParams.length == 0">No Parameters.</p>
                                </div>
                            </div>
                            <br>
                            <br>
                            <b-btn @click="submitTask" class="float-right mt-2"><i class="fa fa-location-arrow"></i> Submit</b-btn>

                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="submitted">
            <div class="text-center job-info">
                <h1>Successfully</h1>
                <h1>Submitted</h1>
                <p>We are preparing your visualization,you can copy the code and check the status of your work in the <a ref = "goTo" :href = "`/submit/job-query?job_id = ${jobID}`" id = "redirection-link">[workspace]</a>.</p>
                <div class = "row">
                    
                    <div class = "col-md-2">
                        <b-btn :id = "copyButton" @click = "copyToClipboard" type = "button" class = "btn btn-light">Copy</b-btn>
                    </div>
                    <div class = "col-md-2">
                        <button id = "jobIDButton" type = "button" class = "btn">{{jobID}}</button>
                    </div>
                </div>
            </div>
        </div>

        <b-modal class= "file-submit-modal" :id="`single-upload-${input.id}`" size="md" :title="`Submit input file - ${input.name}`" centered v-for="input in displayedInputs" :key="input.id">
                <div class = "row justify-content-center submit-container">
                    <div class = "col-md-10 text-center">
                        <div class = "row submit-container">
                            <div>
                                <b-form-file
                                    :id="`i-${input.id}`"
                                    v-model="files[`i-${input.id}`]"
                                    :state="inputValid[`i-${input.id}`]"
                                    placeholder="Choose a file or drop it here..."
                                    drop-placeholder="Drop file here..." 
                                    :name="`i-${input.id}`"
                                    :required="input.required"
                                    :disabled="picked_single_multiple=='single' && ds_selected != ''"
                                >
                                </b-form-file>
                            </div>
                        </div>
                    </div>
                    <div class = "col-md-10" id = "description-card submit-container">
                        <div class = "row submit-container">
                            <p class = "text-left">
                            <span v-for="des_patch in input.description.split('.')" v-bind:key="des_patch">
                                {{des_patch}} <br>
                            </span>
                            </p>
                        </div>
                    </div>
                </div>
        </b-modal>

        <b-modal class= "file-submit-modal" :id="`multiple-upload-${input_idx}`" size="lg" centered title="File Submission and configuration for batch effect" v-for="input_idx in parseInt(displayedPairsNum)" :key="input_idx">    
                
                <div class = "row justify-content-center">

                    <div class = "col-md-10 text-center">
                        <h4> File submission </h4>
                        <div class = "row">

                            <div id = "be-file-submit" class = "col-md-6 text-center" v-for="input in displayedInputs" :key="input.id">
                                
                                <div>
                                    <label :for="`multiple-i-${input.id}-${input_idx}`">{{ input.name }}
                                        <span v-if="input.required" class="required">*</span>
                                        <i class="fa fa-question-circle" b-tooltip.hover
                                        :title="input.description"></i>
                                    </label>
                                    <b-form-file
                                        :id="`multiple-i-${input.id}-${input_idx}`"
                                        v-model="files[`i-${input.id}-${input_idx}`]"
                                        :placeholder="files[`i-${input.id}-${input_idx}`] ? files[`i-${input.id}-${input_idx}`].name : 'no file uploaded'"
                                        drop-placeholder="Drop file here..." 
                                        :name="`multiple-i-${input.id}-${input_idx}`"
                                        :required="input.required"
                                    >
                                    </b-form-file>
                                </div>
                                <!-- <div><p>uploaded file name: {{files[`i-${input.id}-${input_idx}`] ? files[`i-${input.id}-${input_idx}`].name : "no file uploaded"}} </p></div> -->
                            </div>
                        </div>
                    </div>

                    <div id = "be-config" class = "col-md-10 submit-container text-center">
                        <h4> Parameter setting </h4>

                        <div v-if="displayedSingleParams.length > 0">
                            <div class="row">
                                <div class="col-md-6" style="margin-bottom:10px" v-for="param in displayedBatchEffectParams" :key="param.id">
                                    <label :for="`multiple-p-${param.id}-${input_idx}`">{{ param.name }}
                                        <span v-if="param.required" class="required">*</span>
                                        <i class="fa fa-question-circle" b-tooltip.hover
                                        :title="param.description"></i>
                                    </label>
                                    <div v-if="param.param_type === 'enum'">
                                        <select :id="`multiple-p-${param.id}-${input_idx}`" class="form-control custom-select"  :placeholder="parameters[`multiple-p-${param.id}-${input_idx}`]"
                                                v-model="parameters[`multiple-p-${param.id}-${input_idx}`]" :required="param.required" :name="`multiple-p-${param.id}-${input_idx}`">
                                            <option v-for="option in param.options" :value="option" :key="option"
                                                    :selected="param.default == option ? 'selected' : ''">
                                                {{ option }}
                                            </option>
                                        </select>
                                    </div>
                                    <div v-else>
                                        <b-form-input :id="`multiple-p-${param.id}-${input_idx}`" :value="param.default" :required="param.required" :placeholder="parameters[`multiple-p-${param.id}-${input_idx}`]"
                                        v-model="parameters[`multiple-p-${param.id}-${input_idx}`]" :name="`multiple-p-${param.id}-${input_idx}`" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </b-modal>


        <b-modal v-if="started" id = "submit-helper" size="xl" scrollable title="Submission Helper" centered>
            <br>
            <div class = "text-center submit-container">
                <img v-bind:src="require('../assets/images/' + selected_analysis.name + '_structure.jpg')" style= "width : 100%"> 
                <div v-html="selected_analysis.rendered_doc" class = "text-left submit-container">
                </div>
            </div>
        </b-modal>

        <div class="is-loading w-100" v-if="isLoading">
            <i class="fas fa-spinner fa-pulse fa-5x m-0"></i>
            <h3 class="mt-4">We are preparing your submission. Please wait for some minutes.</h3>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import Vue from 'vue';
    import axios from 'axios';
    import objectToFormData from 'object-to-formdata';
    import BootstrapVue from 'bootstrap-vue';
    import VueTagsInput from '@johmun/vue-tags-input';
    import AlertCenter from 'components/alert-center.vue';
    import GlobalSaveButton from 'components/global-save-button.vue';
    import Router from '../router';
    import * as $ from "jquery";

    Vue.use(BootstrapVue);

    export default {
        data() {
            return {
                ds_info : {},
                id : null,
                selected_analysis : null,
                isConv: false,
                analysis_category: window.gon.cname,
                category_name: window.gon.cname,
                app: { 
                },
                files: {
                },
                parameters: {

                },
                file_names: {

                },
                ds_selected: "",
                ds_param_selected: "",
                ds_params: null,
                boolSelectOpt: [
                    { value: true, text: 'Yes' },
                    { value: false, text: 'No' },
                ],
                inputValid: {},
                submitted: false,
                jobID: '',
                isLoading: false,
                analyses: [],
                demo: false,
                started: false,
                single_params_desc: null,

                picked_single_multiple: "single",
                picked_supervised: "supervised",
                single_parameters: [],
                multiple_parameters: [],
                multiple_pairs_num: 1,
                multiple_completed: [],
            };
        },
        created() {
            this.ds_info = window.gon.select_box_option;
            if (this.analysis_category == "Deconvolution Analysis") {
                this.isConv = true; //deconvolution analysis category are different from others
            }
            this.updateApp(null, false);
            this.select_box_option = [];

            var oplist = [];
            for (var key in this.ds_info){
                var op = {value: key, lable: key};
                oplist.push(op);
            }
            this.select_box_option = oplist;

            axios.get('/submit/analysesCategory.json', { params: { cname: this.category_name}  }).then(response => {this.analyses = response.data; console.log(response.data)});
            // for (var k in this.app.inputs){
            //     this.files['i-' + this.app.inputs[k].id]  = null;
            // }
            this.multiple_completed = Array(10).fill(false)
        },
        computed: {
            displayedInputs() {
                // eslint-disable-next-line
                return _.sortBy(this.app.inputs.filter(x => !x._destroy), ['name']);
            },
            displayedSingleParams() {
                // eslint-disable-next-line
                return _.sortBy(this.single_parameters.filter(x => !x._destroy), ['name']);
            },

            displayedBatchEffectParams() {
                return _.sortBy(this.multiple_parameters.filter(x => !x._destroy), ['name']);
                
            },
            displayedAnalyses() {
                var filtered_analyses = this.analyses;
                if (this.isConv == true) {
                    if (this.picked_supervised == "supervised") {
                        filtered_analyses = filtered_analyses.filter(item => !(item.name == "TIMEDB Deconv LinSeed"));
                    }
                    else {
                        filtered_analyses = filtered_analyses.filter(item => (item.name == "TIMEDB Deconv LinSeed"));
                    }
                }
                return filtered_analyses; 
            },
            displayedPairsNum() {
                //always listen to changes of user required pairs number and update related vue parts
                console.log(this.multiple_pairs_num)
                return this.multiple_pairs_num;
            },
            updateUploadedStatus() {
                console.log("here 1");
                console.log(this.multiple_pairs_num)
                console.log(typeof(this.multiple_pairs_num))

                for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                    this.multiple_completed[input_idx - 1] = true;
                    console.log("here 2");
                    console.log(input_idx);

                    this.app.inputs.forEach((item) => {
                        console.log(item);
                        // console.log("priting files in updatedSattus")
                        console.log(this.files['i-' + item.id + '-' + input_idx] == null)
                        console.log(this.files['i-' + item.id + '-' + input_idx])

                        // console.log(this.files['i-' + this.app.inputs[k].id + '-' + input_idx] == null)
                        // console.log(this.files['i-' + this.app.inputs[k].id + '---' + input_idx] == null)

                        if (this.files['i-' + item.id + '-' + input_idx] == null) {
                            this.multiple_completed[input_idx - 1] = false;
                            console.log("come here");
                        }
                    })

                    document.querySelectorAll("multiple-upload-" + input_idx + " input[name^='multiple-p']").forEach((input) => {
                        if(input.required) {
                            console.log(input.value);
                            const valid = !!input.value && !!_.trim(input.value);
                            if (!valid) {
                                console.log(input);
                                console.log("Input parameters has problems")
                                this.multiple_completed[input_idx - 1] = false;
                            }
                        }
                    })
                }
                console.log(this.multiple_completed)
                return this.multiple_completed;
            },
            
        },
        watch: {
            ds_selected:function(newValue) {
                if (newValue != "" && this.picked_single_multiple == 'single') {
                    console.log(newValue);
                    for (var k in this.app.inputs) {
                        this.files['i-' + this.app.inputs[k].id]  = null;
                    }
                }
            },
            files:function(newValue, oldValue) {
                console.log(newValue.size);
                console.log(oldValue.size);
                console.log("file changes");
            },
            picked_supervised:function() {
                this.started = false;
                console.log(this.started);
            },
            multiple_pairs_num:function(newValue) {
                console.log(newValue);
                // this.multiple_completed = Array(newValue).fill(false);
                // for (var k in this.app.inputs) {
                //     this.files['i-' + this.app.inputs[k].id]  = Array(newValue).fill(null);
                // }
            },
        },
        methods: {
            setStatusColor(status) {
                switch (status) {
                    case 'wait':
                        return 'secondary';
                    case 'running':
                        return 'info';
                    case 'finished':
                        return 'success';
                    case 'failed':
                        return 'danger';
                    case 'suspended':
                        return 'warning';
                    case 'aborted':
                        return 'danger';
                }
            },
            formatParams() {
                var formatted_params = []
                for (var sp in this.single_parameters) {
                    formatted_params.push({['p-' + this.single_parameters[sp].id]: this.parameters['p-' + this.single_parameters[sp].id]});
                }

                if (this.picked_single_multiple == 'multiple') {

                    for (var mp in this.multiple_parameters) {
                        var pvalue = ""
                        var pvalue_arr = [];
                        
                        if (this.multiple_parameters[mp].name == 'Datasets name') {
                            pvalue = this.ds_info[this.ds_selected][2];
                        }
                        else if (this.multiple_parameters[mp].name == 'Platforms') {
                            pvalue = this.ds_info[this.ds_selected][1];
                        }
                        else {
                            pvalue =  Array.new(3).fill([this.ds_param_selected]).flat();
                        }
                        for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                            pvalue_arr.push(this.parameters['multiple-p-' + this.multiple_parameters[mp].id + '-' + input_idx]);
                        }

                        pvalue += ',' + pvalue_arr.join(',');
                        formatted_multiple_params.push({ ['p-' + this.multiple_parameters[mp].id]: pvalue });
                    }
                    formatted_params = formatted_params.concat(formatted_multiple_params);
                }

                return formatted_params
            },

            formatFiles() {
                if (this.picked_single_multiple == 'single') {
                    return this.files;
                }

                else {

                    var formatted_files = {};
                    for (var k in this.app.inputs) {
                        var input_arr = [];
                        for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                            input_arr.push(this.files['multiple-i-' + this.app.inputs[k].id + '-' + input_idx]);
                        }
                        formatted_files['i-' + this.app.inputs[k].id] = input_arr;
                    }
                    return formatted_files;
                }
            },

            updateApp(s_ana, flag) {
                this.started = flag;
                let newapp;
                if (s_ana == null) {
                    newapp = {
                        id : "-1",
                        image : "/media/img/instance/Sudden_Cardiac_Death_Detection.png",
                        name: 'test app for immune platform',
                        description: 'Sudden cardiac death (SCD) is a sudden, unexpected death caused by loss of heart function (sudden cardiac arrest). Sudden cardiac death is the largest cause of natural death in the United States, causing about 325,000 adult deaths in the United States each year. Sudden cardiac death is responsible for half of all heart disease deaths.\n\nSudden cardiac death occurs most frequently in adults in their mid-30s to mid-40s, and affects men twice as often as it does women. This condition is rare in children, affecting only 1 to 2 per 100,000 children each year.\n\n**Reference**: WH, L., \u0026 Dan, E. (2010). Genetic Variations in NOS1AP are Associated with Sudden Cardiac Death in U.S. White Community Based Populations.",',
                        inputs: [
                        ],
                        params: [
                            {
                                id: "pid1",
                                name: "parameter 1",
                                param_type: "string",
                                default: "default value",
                                required: true,
                                description: "some descriptioons some descriphvvu uihiuhohnu some descriptions",
                            },
                            {
                                id: "pid2",
                                name: "parameter 2",
                                param_type: "string",
                                default: "default value",
                                required: true,
                                description: "some descriptions some descriptions some deescriptions some descriptions",
                            }
                        ],
                    };
                    this.app = newapp;
                    this.params_desc = this.app.params[0].description;
                }
                else {
                    console.log("start update app");
                    this.selected_analysis = s_ana;
                    var newid;
                    if (this.picked_single_multiple == "single") newid = s_ana.mid;
                    else newid = s_ana.multiple_mid;
                        
                    axios.get(`https://deepomics.org/api/apps/${newid}/`).then((response) => {
                        this.app = response.data.app;
                        console.log("====>")
                        console.log(response.data.app.inputs);
                        this.files = {};
                        this.parameters = {};
                        
                        console.log(k)
                        if (this.picked_single_multiple == "single") {
                            this.single_parameters = this.app.params
                            this.multiple_parameters = []
                        }
                        else {
                            //this.files['i-' + this.app.inputs[k].id]  = Array(10).fill(null); //multiple mode, file inputs are in the format of array
                            this.single_parameters = this.app.params.filter(x => !['Platforms', 'Datasets name', 'Protocol normalization'].includes(x['name']));
                            this.multiple_parameters = this.app.params.filter(x => ['Platforms', 'Datasets name', 'Protocol normalization'].includes(x['name']));
                            this.multiple_completed = Array(10).fill(false);

                            // for (var para in this.app.params) {
                            //     if (para.name == "Protocol normalization") {
                                    
                            //     }
                            // }
                            this.ds_params = this.app.params.find(x => x['name'] == 'Protocol normalization');
                            console.log("printing dataset parameters");
                            console.log(this.ds_params);
                        }
                        for (var k in this.app.inputs){
                            this.file_names['i-' + this.app.inputs[k].id]  = this.app.inputs[k].name;
                        }

                        for (var k in this.single_parameters) {
                            this.parameters['p-' + this.single_parameters[k].id] = this.single_parameters[k].default;
                        }

                        this.single_params_desc = this.single_parameters[0].description;
                    
                    });
                    console.log("end update app");

                }
            },

            submitTask() {
                // send selected file to files

                //this.submitted = true;
                //this.updateUploadedStatus();

                const { alertCenter } = this.$refs;
                let allRight = true;
                let is_single = (this.picked_single_multiple == 'single')
                let alertData;

            
                //valid checking, need imporvement for complete error reporting
                document.querySelectorAll("select[name^='multiple-p-'], input[name^='multiple-p-'], input[name^='p-'], select[name^='p-']").forEach((input) => {
                    if(input.required) {
                        const valid = !!input.value && !!_.trim(input.value);
                        //Vue.set(this.inputValid, input.name, valid);
                        if (!valid) {
                            console.log(input);
                            console.log("you missed some required parameters")
                            allRight = false;
                            alertCenter.add('danger', "You missed some required parameters!");
                        }
                    }
                })

                //there will be double check later
                if (this.ds_selected != "" && is_single) {
                    if (this.ds_info[this.ds_selected][0] > 1) {
                        console.log("Selected datasets has multiple project sources!")
                        allRight = false
                        alertCenter.add('danger', "Selected dataset has multiple project sources, but you are under single mode!");
                    }
                    // for (var file_inputs in this.files) {
                    //     if (this.files[file_inputs] != null) {
                    //         console.log("You should not upload any files if you select datsets under single mode.")
                    //         allRight = false;
                    //     }
                    // }
                }

                if (this.ds_selected == "") {
                    var anyFile;
                    for (var file_inputs in this.files) {
                        if (is_single) {
                            anyFile = true;
                            if (this.files[file_inputs] == null) {
                                console.log(file_inputs)
                                anyFile = false;
                                alertCenter.add('danger', "You are under single mode, but you have not uploaded any file input or selected any single source dataset!");
                            }
                        }
                        else {
                            anyFile = false;
                            for (var be_num in this.multiple_pairs_num) {
                                if (this.multiple_completed[be_num] != null) {
                                    anyFile = true;
                                }
                            }
                            if (anyFile == false) {
                                alertCenter.add('danger', "You are under multiple mode, but there is no valid input pairs!");
                            }
                        }
                    }
                    allRight = anyFile == true
                    if (!allRight) {
                        alertCenter.add('danger', "Please check your input files with parameters correctly!");
                    }
                }

                if (this.ds_selected != '' && is_single == false && this.ds_param_selected == '') {
                    alertCenter.add('danger', "You have not set your paraters for the selected dataset."); 
                }

                for (var key in this.files) {
                    console.log(this.files[key]);
                }

                
                console.log("All right is true here")
                
                if (allRight) {
                    let submitted_mid;
                    if (this.picked_single_multiple == 'multiple') {
                        submitted_mid = this.selected_analysis.multiple_mid;
                    }
                    else {
                        submitted_mid = this.selected_analysis.mid;
                    }
                    $("#disable-fill").fadeIn(10);
                    this.isLoading = true;
                    console.log(this.isLoading);
                    axios.post(
                        `/submit-app-task/`,
                        
                       objectToFormData({
                            "inputs": this.formatFiles(),
                            "params": this.formatParams(),
                            "selected": this.ds_selected,
                            "search_mid": this.selected_analysis.mid,
                            "mid": submitted_mid,
                            "is_single": this.picked_single_multiple=='single',
                            "file_names": this.file_names,
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
                            this.jobID = response.data.data.task_id;
                            this.submitted = true;
                            
                        } else {
                            alertData = response.data.msg;
                        }
                    }).catch((reason) => {
                        alertData = reason;
                    }).finally(() => {
                        setTimeout(() => {
                            $("#disable-fill").fadeOut(10);
                            this.isLoading = false;
                            if (!!alertData) {
                                alertCenter.add('danger', alertData);
                            }
                        }, 500);
                    });
                }
                else {
                    alertCenter.add('danger', "Please recheck your inputs. Something error here!");
                }

                if (this.submitted == true) {
                    var delay = 10000; // time in milliseconds

                    setTimeout(function(){
                        window.location.href = 'job-query'
                    },delay);
                    
                }
            },
            updateMode(type) {
                this.started = false;
                if (type == 'single') {
                    this.picked_single_multiple = "single";
                }
                else {
                    this.picked_single_multiple = "multiple";
                }
                document.getElementById("single-button").classList.toggle("btn-secondary");
                document.getElementById("single-button").classList.toggle("btn-dark");
                document.getElementById("multiple-button").classList.toggle("btn-secondary");
                document.getElementById("multiple-button").classList.toggle("btn-dark");
            },

            
            
            setSelectBox(){
                var i = 0;
                var s = "<option disabled vaule=''>Choose a file</option>";
                var list = ["dataset1-data.csv", "dataset2-data.csv", "dataset3-data.csv"]

                for(i=0; i<list.length; i++){
                    s += "<option>" + list[i] + "</option>";
                }
                this.$refs.select_box = s
            },
            copyToClipboard(){
                navigator.clipboard.writeText(this.jobID);
            },
            provide_param_desc(param) {
                $("#params_desc").text(param.description)
            },
            
            

        },
        components: {
            VueTagsInput, AlertCenter, GlobalSaveButton
        },
    };
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';
@import '../assets/stylesheets/partials/variables';

.submit-container {
    margin: 2em;
}

#submit-app-back.active {
    filter: blur(5px);
    //background-color: #000;
}
#run-app {
    background-color: #f8f9fa;
}


#run-app .row {
    display: flex;
    align-items: center;
}

#run-app #alert-center {
	z-index: 1000;
}

#run-app .required {
	color: red;
    font-size: 2px;
}

#run-app .set-input-section label {
	margin-top: 10px;
}

#run-app .set-input-section input {
	padding-right: 46px;
	cursor: pointer;
}

#run-app .set-input-section .icon-append {
	top: 38px;
	color: #6f6f6f;
	cursor: pointer;
	right: 10px;
	padding-left: 3px;
	border-left: solid 1px #d7d7d7;
	position: absolute;
	width: 34px;
	height: 34px;
	font-size: 15px;
	line-height: 34px;
	text-align: center;
}

#run-app .set-param-section label {
	margin-top: 10px;
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
.is-loading {
    margin: 0 1px;
    padding: 8rem 4rem;
    text-align: center;
    color: #000;
    position: fixed !important;
    top: 30% !important;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
}

.set-input-section img {
    width: 80%;
}

#jobIDButton {
    background-color: $light_theme;
    color: white;
}


.uploadPng {
    cursor: pointer;
    transform: scale(0.9);
    transition: all 0.5s;
}

.uploadPng:hover {
    transform: scale(1.0);
}


h2.display-4 {
    text-transform: uppercase;
}

.cardContainer {
    cursor: pointer;
}


// #modal-trigger {
//     overflow:auto;
//     position: absolute;
//     top:90px;
//     z-index:1;
//     width: 200px;
// }

// #modal-trigger image {
//     overflow:auto;
//     position: absolute;
//     z-index:1;
// }

input[type="radio"] {
  width: 3em;
  height: 1em;
  border: 0.15em solid currentColor;
  border-radius: 50%;
}

.btn-select {
    margin: 0.5em;
    width: 100px;
}

.bt-secondary {
    color: white !important;
}

.submit-box {
    box-shadow: 0 0 64px darken(#dee2e6, 5%);
    border-radius: 20px;
    padding: 20px;
    width: 100%;
}
.submit-box image {
    width: 100%;
}

#submit-helper {
    z-index: 40000 !important;
}

#submit-helper .submit-container {
    width: 80%;
}

#submit-modal-trigger{
    //border:solid;
    border-radius:20px;
    overflow:auto;
    position: absolute;
    top:90px;
    padding: 0px;
    z-index:1;
    width: 300px;
}

.file-submit-modal {
    vertical-align: center;
}

.file-submit-modal .row {
    vertical-align: center;

}

.parent-overlow {
    position: relative;
}

#multiple-upload-box {
    display: block !important;
    overflow-x: auto !important;
    white-space: nowrap !important;
    width : 90%;
    //box-shadow: 0 0 64px darken(#dee2e6, 2%);
    display: flex;
    align-items: center;


}

#multiple-upload-box > .text-center {
    display: inline-block !important;
}

#multiple-upload-box > .left-icon {
    position: absolute;
    top: 50%;
    left: 5px;
}
#multiple-upload-box > .right-icon {
    position: absolute;
    top: 50%;
    right: 30px;
}

@-webkit-keyframes greenPulse {
  from { background-color: #1f201d; -webkit-box-shadow: 0 0 9px #333;}
  50% { background-color: #8c8b91; -webkit-box-shadow: 0 0 18px #c4c2cd;}
  to { background-color: #525452; -webkit-box-shadow: 0 0 9px rgb(136, 132, 135);}
}

#submit-modal-trigger .btn {
  -webkit-animation-name: greenPulse;
  -webkit-animation-duration: 2s;
  -webkit-animation-iteration-count: infinite;
}


</style>
