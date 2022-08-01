<template>
    <!-- eslint-disable max-len -->
    <div>
        <div v-if="!isLoading">

            <div class="prepare mb-5" v-if="!submitted">
                <div class="index-banner">
                    <div class="container">
                        <p class="mt-5" style="color:gray;font-size:1.4em;"><i>This page may need some time to load data. Please wait for some seconds if there is no analysis available.</i></p>

                        <h2 class="display-2">
                            <!-- Start Analysis -->
                            <button class = "btn btn-1" style="display:inline" >
                            <a href= "/tutorial/analysis/2">Submission Helper</a>
                            </button>
                        </h2>
                        <!-- <p style="font-size:1.2em;">
                            TIMEDB provides state-of-the-arts tools of immune micro-enviroment deconvolution analysis. Official tutorial is available at Tutorial (link). You may try submit the tasks with our demo input files, or view the ideal demo results.
                        </p> -->
                    </div>
                </div>
                <div v-if="isConv==true" id = "singleMultipleSelect">
                    <div class="container">
                        <h2 class="display-5">
                            Please choose to upload single or multiple dataset(s): 
                        </h2>
                        <br>
                        <button type = "button" id = "single-button" class = "btn btn-dark btn-lg btn-select" @click="updateMode('single')">
                        Single
                        </button>
                        <button type = "button" id = "multiple-button" class = "btn btn-secondary btn-lg btn-select" @click="updateMode('multiple')">
                        Multiple
                        </button>
                    </div>
                </div>
                <div class="index-banner">
                    <div class="container">
                        <h2 class="display-4">
                            Analysis
                        </h2>
                        <p class="lead mt-2">
                            Please choose an analysis below:
                        </p>
                        <p class="mt-2" style="color:gray;font-size:1.4em;"><i>Data loading may need some time. Please wait for some seconds after you select the analysis.</i></p>
                    </div>
                </div>
                <div class="container-fluid container" id="analyses_list">
                    <div id="accordion">
                        <div class="cols-xs-space cols-sm-space cols-md-space container">
                            <div class = "row" id="jumpDivStart">
                                <div class="col-lg-4 mb-4 justify-content-center text-center" v-for="a in analyses" :key="a.pid" @click="updateApp(a, true)">
                                    <div class="card">
                                        <img v-if="a.cover_image == null" v-bind:src="require('../assets/images/module.png')" class="card-img-top pipeline_img">
                                        <img v-else :src="a.cover_image" class="pipeline_img card-img-top">
                                        <div v-bind:class = "selected_analysis!=null&&selected_analysis.name==a.name?'image_overlay image_overlay_blur container active':'image_overlay image_overlay_blur container'">
                                            <div class = "image_title">
                                                {{a.name}}
                                            </div>
                                        </div>
                                    </div>
                                    <h4 class = "text-center">{{a.name}}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br><br>
            </div>

            <div id="jumpStart" style="height:100px;">
            </div>


            <div class = "col-md-12" id = "submit-app-back" v-if="started && !submitted ">
                <div class = "row mb-5">
                    <div class="col-md-2">
                        <img v-bind:src="require('../assets/images/nav-up-blue.png')">
                        <svg width="100px" height="1100px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 0 v 100 l 10 10 l -10 10 v 430 l 10 10 l -10 10 v 530" fill="transparent" stroke="#253959" stroke-width = "3px"></path> 
                        </svg>

                        <div v-if="step==1" id = "timeline-file" class = "timeline-step" style="vertical-align:center">
                            <img v-bind:src="require('../assets/images/nav-up-pink.png')" style="margin-right: 10px"> 
                            <i class="fa fa-arrow-right"></i>  <b-btn v-b-modal.submit-helper class = "btn btn-secondary" id = "helper-trigger"> Analysis Helper </b-btn>
                        </div>

                        <div v-if="step==2" id = "timeline-parameter" class = "timeline-step" style="vertical-align:center">
                            <img v-bind:src="require('../assets/images/timeline-param.png')" style="margin-right: 10px"> 
                            <i class="fa fa-arrow-right"></i>  <b-btn v-b-modal.submit-helper class = "btn btn-secondary" id = "helper-trigger"> Analysis Helper </b-btn>
                        </div>

                        <img v-if="submitted == true" v-bind:src="require('../assets/images/nav-submit-blue.png')">
                        <img v-else v-bind:src="require('../assets/images/nav-submit-gray.png')">
                        <br>                      
                    </div>
                    <div class="col-md-10">
                        <div id="run-app">
                            <alert-center ref="alertCenter" />
                            
                            <!-- Inputs -->
                            <div v-if="started && !submitted">

                                <div class = "row">
                                    <div @click="submitDemoTask()" class = "col-md-2" b-tooltip.hover :title="`Click here to run demo task for ${app.name}`">
                                        <img class = "demoPng" id = "runDemoImage" v-bind:src="require('../assets/images/runDemo.png')" style="width:100%;">
                                    </div>
                                    <div @click="checkDemoTask()" class = "col-md-2" b-tooltip.hover :title="`Click here to check demo task for ${app.name}`">
                                        <img class = "demoPng" id = "checkDemoImage" v-bind:src="require('../assets/images/checkDemo.png')" style="width:100%;">
                                    </div>
                                    <div class = "col-md-2">
                                    </div>
                                    <div class = "col-md-6">
                                        <h6 class="text-right">{{ app.name }}</h6>
                                        <h2 class = "text-right"> TASK SUBMISSISON </h2>
                                    </div>
                                </div>
                                
                                <div id = "file-upload-step" class = "row justify-content-center submit-container-lg">
                                    <div>
                                        <h3 v-if="picked_single_multiple=='multiple'" class = "text-center">Batch effect config</h3>
                                        <h3 v-else class = "text-center">File Submission</h3>
                                        <br>

                                        <div class = "row submit-box justify-content-center">
                                            <div v-if="picked_single_multiple=='single'" class = "row justify-content-center">
                                                <div class = "row justify-content-center">
                                                    <div class="text-center" v-for="input in pure_inputs" :key="input.id">
                                                        <label :for="`i-${input.id}`">{{ input.name }}
                                                            <span class="required">*</span>
                                                        </label>
                                                        <div v-b-modal="'single-upload-' + input.id" class="uploadPng text-center justify-content-center container" @click="updateStepToFile()">
                                                            <img v-bind:src="require('../assets/images/big_upload.png')" style="width:90%">
                                                        </div>
                                                    </div>
                                                    
                                                </div>

                                                <div class = "row justify-content-center">
                                                    <label>
                                                        <span>You can select a dataset to merge: </span>
                                                        <i class="fa fa-question-circle" v-b-tooltip.rightbottom.hover title="You may choose one dataset with single project source to automatically upload merged files"></i>
                                                    </label>
                                                    <b-form-select @focus="updateStepToFile()" class="col-md-8" 
                                                        name="selected-dataset"
                                                        v-model="ds_selected"
                                                    >
                                                        <option value="" key="default">--Please select your own dataset--</option>
                                                        <option v-for="(option, index) in select_box_option" :key="index" :value="option.value" :disabled="option.disabled">
                                                            {{option.lable}}
                                                        </option>
                                                    </b-form-select>
                                                </div>
                                            </div>
                                            <div v-else class = "row justify-content-center">
                                                <div class = "text-center submit-container">
                                                    <label for="pairs_num_select">Please select maximum pairs of files you want to upload:
                                                    </label>
                                                    <div>
                                                        <b-form-input id="pairs_num_select" value=1 max="5" type="number" step="1" name="selected_pairs_num" v-model="multiple_pairs_num" />
                                                    </div>
                                                </div>
                                                <div id = "multiple-upload-box" class = "row justify-content-center text-center" v-if="displayedPairsNum > 0">
                                                    <div v-for="input_idx in parseInt(displayedPairsNum)" :key="input_idx" class="text-center col-md-4">
                                                        <div v-b-modal="`batchEffect-config-${input_idx}`" class="uploadPng text-center justify-content-center container" @click="updateStepToFile()">
                                                            <img v-bind:src="require('../assets/images/batchEffectSetting.png')" style="width:90%;">
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
                                        </div>
                                    </div>
                                    
                                </div>

                                <div id="parameter-setting-step" class = "row justify-content-center submit-container-lg">
                                    <div class="set-param-section">
                                        <h3 class = "text-center">Parameter setting</h3>
                                        <br>

                                        <div class = "row submit-box justify-content-center;">
                                            <div class = "col-md-6">

                                                <div class = "row mt-3 mb-3" style="height:350px; overflow:scroll;">
                                                        <b-list-group>
                                                            <b-list-group-item class="mb-2" style="height:100px important!;">
                                                                <div style="margin-bottom:10px" v-for="(params, pname) in single_sync_params" :key="pname">
                                                                    <label :for="`p-${params[0].id}`">{{ params[0].name }}
                                                                        <span v-if="params[0].required" class="required">*</span>
                                                                    </label>
                                                                    <div v-if="params[0].name === 'Protocol normalization'">
                                                                        <select @focus="provide_param_desc(params[0])" :value="params[0].default" :required="params[0].required" class="form-control custom-select" 
                                                                                v-model="parameters[`p-${params[0].id}`]"
                                                                                :placeholder="parameters[`p-${params[0].id}`]"
                                                                                >
                                                                            <option v-for="option in protocol_options" :value="option" :key="option"
                                                                                    selected="array_none">
                                                                                {{ option }}
                                                                            </option>
                                                                        </select>
                                                                    </div>
                                                                    <div v-else>
                                                                        <b-form-input @focus="provide_param_desc(params[0])" :id="`p-${params[0].id}`" :value="params[0].default" :required="params[0].required"
                                                                            v-model="parameters[`p-${params[0].id}`]" :name="`p-${params[0].id}`" :state="inputValid[`p-${params[0].id}`]" />
                                                                    </div>
                                                                </div>
                                                            </b-list-group-item>
                                                            <div v-for="(value, key) in single_module_params" :key="value.id">
                                                                <b-list-group-item href="javascript:void(0)" v-b-toggle="`m-${value.id}`" class="mb-2">
                                                                    <i class="fab fa-app-store-ios"></i> {{ key }}
                                                                </b-list-group-item>
                                                                <b-collapse visible :id="`m-${value.id}`" class="mb-4 p-4 border">
                                                                    
                                                                    <div class="col-md-10" v-for="param in value.params" :key="param.id">
                                                                        
                                                                        <label :for="`p-${param.id}`">{{ param.name }}
                                                                            <span v-if="param.required" class="required">*</span>
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
                                                                    
                                                                </b-collapse>
                                                            </div>
                                                        </b-list-group>
                                                    <div class = "col-md-10 mt-4" v-if="parameters_input.length > 0"> 
                                                        <p>
                                                            CIBERSORT is only freely available for academic users and could not be directly included in this package.
                                                            To use CIBERSORT with this package, you need to register on the cibersort website,
                                                            obtain a license, and download the CIBERSORT source code.
                                                            The source code package contains two files, that are required:
                                                        </p>
                                                        <ol>
                                                            <li>CIBERSORT.R</li>
                                                            <li>LM22.txt</li>
                                                        </ol>
                                                    </div>
                                                    <div class="col-md-10" v-for="param_input in parameters_input" :key="param_input.id">
                                                        <label :for="`p-${param_input.id}`">{{ param_input.name }}
                                                            <span class="required">*</span>
                                                        </label>
                                                        <div>
                                                            <b-form-file
                                                                :id="`i-${param_input.id}`"
                                                                v-model="files[`i-${param_input.id}`]"
                                                                :state="inputValid[`i-${param_input.id}`]"
                                                                placeholder="Choose a file or drop it here..."
                                                                drop-placeholder="Drop file here..." 
                                                                :name="`i-${param_input.id}`"
                                                                :required="param_input.required"
                                                            >
                                                            </b-form-file>  
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <div class = "col-md-6" style="height:350px; overflow:scroll; display:flex; flex-direction: column; justify-content: center;">
                                                <h2>Parameters description</h2>
                                                <div id = "single_params_desc" v-html="single_params_desc"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br>
                                <br>
                                <b-btn @click="checkInputValid()" class="float-right mt-2"><i class="fa fa-location-arrow"></i> Submit</b-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div v-else-if="submitted">
                <div class="text-center job-info">
                    <h1>Successfully</h1>
                    <h1>Submitted</h1>
                    <p>We are preparing your visualization,you can copy the code and check the status of your work in the <a ref = "goTo" :href = "`/submit/job-query`" id = "redirection-link">[workspace]</a>.</p>
                    <div class = "row">
                        <div class = "col-md-2">
                            <b-btn :id = "copyButton" @click = "copyToClipboard" type = "button" class = "btn btn-dark">Copy</b-btn>
                        </div>
                        <div class = "col-md-2">
                            <button id = "jobIDButton" type = "button" class = "btn">{{jobID}}</button>
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


        <b-modal class= "file-submit-modal" :id="`single-upload-${input.id}`" size="lg" :title="`Submit input file - ${input.name}`" centered v-for="input in pure_inputs" :key="input.id">
                <div class = "row justify-content-center submit-container">
                    <div class="col-md-12 text-left mb-4">
                        <button class = "btn btn-secondary">
                            <a :href="`/public/data/module_demo/${input.name}_demo.csv`" :download="input.name">Download demo file</a>
                        </button>
                    </div>
                    <h6 style="color: gray;" class="p-2"><i>Please upload .csv files for analysis</i></h6>
                    <div class = "col-md-12 text-center">
                        <div>
                            <div>
                                <b-form-file
                                    :id="`i-${input.id}`"
                                    v-model="files[`i-${input.id}`]"
                                    :state="inputValid[`i-${input.id}`]"
                                    :placeholder="files[`i-${input.id}`]? files[`i-${input.id}`].name:`Choose a file or drop it here...`"
                                    drop-placeholder="Drop file here..." 
                                    :name="`i-${input.id}`"
                                    :required="input.required"
                                    :disabled="picked_single_multiple=='single' && ds_selected != ''"
                                >
                                </b-form-file>
                            </div>
                        </div>
                    </div>
                    <div class = "col-md-10 text-left" id = "description-card">
                        <div class = "row submit-container">
                            <div v-html="input.description"></div>
                        </div>
                    </div>
                </div>
        </b-modal>

        <b-modal class= "file-submit-modal" :id="`batchEffect-config-${input_idx}`" size="xl" centered title="File Submission and Parameter Setting for Batch Effect" v-for="input_idx in parseInt(displayedPairsNum)" :key="input_idx">    
                <div class = "row justify-content-center">

                    <div class = "col-md-10 text-center">
                        <h4 class = "mb-4"> File submission </h4>
                        <div class = "row">
                            <div id = "be-file-submit" class = "col-md-6 text-center" v-for="input in pure_inputs" :key="input.id">
                                <div>
                                    <label :for="`multiple-i-${input.id}-${input_idx}`" class = "row justify-content-around">
                                        <div class = "col-md-6 text-left" style="margin:auto;">
                                            {{ input.name }}
                                            <span class="required" style="color:red;">*</span>
                                        </div>
                                        <div class = "col-md-6 text-right">
                                            <button class = "btn btn-secondary">
                                                <a :href="`/public/data/module_demo/${input.name}_demo.csv`" :download="input.name">Download demo file</a>
                                            </button>
                                        </div>
                                    </label>
                                    <h6 style="color: gray;" class="p-2"><i>Please upload .csv files for analysis</i></h6>
                                    <b-form-file
                                        :id="`multiple-i-${input.id}-${input_idx}`"
                                        v-model="files[`multiple-i-${input.id}-${input_idx}`]"
                                        :placeholder="files[`multiple-i-${input.id}-${input_idx}`] ? files[`multiple-i-${input.id}-${input_idx}`].name : 'no file uploaded'"
                                        drop-placeholder="Drop file here..." 
                                        :name="`multiple-i-${input.id}-${input_idx}`"
                                        :required="input.required"
                                        :disabled="ds_selected[input_idx - 1]!=''"
                                    >
                                    </b-form-file>
                                    <div class = "submit-container text-left">
                                        <div v-html="input.description">
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <br>
                    <br>

                    <div class = "col-md-8 justify-content-center submit-container">
                        <h4>
                            Or you can select a dataset to merge:
                        </h4>
                        <b-form-select
                            name="selected-dataset"
                            v-model="ds_selected[input_idx - 1]"
                            :placeholder="ds_selected[input_idx - 1]"
                        >
                            <option value="" key="default">--click to select your own dataset--</option>
                            <option v-for="(option, index) in select_box_option" :key="index" :value="option.value" :disabled="option.disabled">
                                {{option.lable}}
                            </option>
                        </b-form-select>
                    </div>

                    <br>
                    <br>

                    <div class = "col-md-12 text-center" v-if="picked_single_multiple=='multiple'">
                        <h4> Parameter setting </h4>

                        <div class = "row m-5">
                            <div class = "col-md-6">
                                <div style="height:350px; overflow:scroll;">
                                    <b-list-group>
                                        <div style="vertical-align:center">
                                            <b-list-group-item class="mb-2">
                                                <div style="margin-bottom:10px" v-for="(params, pname) in multiple_sync_params" :key="pname">
                                                    <div v-if="ds_selected[input_idx - 1] == '' && params[0].name != 'Protocol normalization' ">
                                                        <label :for="`multiple-p-${params[0].id}-${input_idx}`">{{ params[0].name }}
                                                            <span v-if="params[0].required" class="required" style="color:red;">*</span>
                                                        </label>
                                                        <div>
                                                            <b-form-input @focus="provide_multiple_param_desc(params[0])" :id="`multiple-p-${params[0].id}-${input_idx}`" :value="params[0].default" :required="params[0].required" :placeholder="parameters[`multiple-p-${params[0].id}-${input_idx}`]"
                                                            v-model="parameters[`multiple-p-${params[0].id}-${input_idx}`]" :name="`multiple-p-${params[0].id}-${input_idx}`" />
                                                        </div>
                                                    </div>
                                                    <div v-else-if="params[0].name == 'Protocol normalization' ">
                                                        <label :for="`multiple-p-${params[0].id}-${input_idx}`">{{ params[0].name }}
                                                            <span v-if="params[0].required" class="required" style="color:red;">*</span>
                                                        </label>
                                                        <select @focus="provide_param_desc(params[0])" :value="params[0].default" :required="params[0].required" class="form-control custom-select" 
                                                                v-model="parameters[`multiple-p-${params[0].id}-${input_idx}`]"
                                                                :placeholder="parameters[`multiple-p-${params[0].id}-${input_idx}`]"
                                                                >
                                                            <option v-for="option in protocol_options" :value="option" :key="option"
                                                                    selected="array_none">
                                                                {{ option }}
                                                            </option>
                                                        </select>
                                                    </div>   
                                                </div>
                                            </b-list-group-item>
                                        </div>
                                    
                                        <!-- <div v-for="(value, key) in multiple_module_params" :key="value.id">
                                            <div v-if="value.params!=null">
                                                <b-list-group-item href="javascript:void(0)" v-b-toggle="`mm-${value.id}`" class="mb-2">
                                                    <i class="fab fa-app-store-ios"></i> {{ key }}
                                                </b-list-group-item>
                                                <b-collapse visible :id="`mm-${value.id}`" class="mb-4 p-4 border">
                                                        <label :for="`multiple-p-${value.params.id}-${input_idx}`">{{ value.params.name }}
                                                            <span v-if="value.params.required" class="required" style="color:red;">*</span>
                                                        </label>
                                                        <div v-if="value.params.name === 'Protocol normalization'">
                                                            <select @focus="provide_param_desc(value.params)" :value="value.params.default" :required="value.params.required" class="form-control custom-select" 
                                                                    v-model="parameters[`multiple-p-${value.params.id}-${input_idx}`]"
                                                                    :placeholder="parameters[`multiple-p-${value.params.id}-${input_idx}`]"
                                                                    >
                                                                <option v-for="option in protocol_options" :value="option" :key="option"
                                                                        selected="array_none">
                                                                    {{ option }}
                                                                </option>
                                                            </select>
                                                        </div>
                                                        <div v-else>
                                                            <b-form-input @focus="provide_param_desc(value.params)" :value="value.params.default" :required="value.params.required"
                                                                        :placeholder="parameters[`multiple-p-${value.params.id}-${input_idx}`]"
                                                                        v-model="parameters[`multiple-p-${value.params.id}-${input_idx}`]" :state="inputValid[`multiple-p-${value.params.id}-${input_idx}`]" />
                                                        </div> 
                                                </b-collapse>
                                            </div>
                                        </div> -->
                                    </b-list-group>  
                                </div>
                            </div>
                             <div class = "col-md-6 text-left" style="vertical-align:center; height:300px;overflow:scroll;">
                                <div id = "multiple_params_desc" v-html="multiple_params_desc"></div>
                            </div>
                        </div>
                    </div>
                </div>
        </b-modal>

        <b-modal v-if="started" ref="submit-helper" v-model="showhelper" id = "submit-helper" size="xl" scrollable title="Analysis Helper" centered @ok="jumpToUpload">
            <br>
            <div class = "row justify-content-center container">
                <!-- <div class="container infor" style="background-color: #">
                    <i > Please Click the Image If You Want to Enlarge It</i>
                </div> -->
                <div id="rendered_doc" v-html="selected_analysis.rendered_doc" class = "text-left container" style="margin: 50px;">
                </div>
            </div>

        </b-modal>

            <div id="outerdiv" style="position:fixed; border-color:rgba(0,0,0,0.7);z-index:99999;display:none;overflow: scroll;">
                <div id="innerdiv" style="">
                    <img id="bigimg" style="border:5px solid #fff;" src=""/>
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
    import VueTagsInput from '@johmun/vue-tags-input';
    import AlertCenter from 'components/alert-center.vue';
    import GlobalSaveButton from 'components/global-save-button.vue';
    import Router from '../router';
    import * as $ from "jquery";
    import { ModalPlugin } from 'bootstrap-vue'
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'

    Vue.use(ModalPlugin)
    Vue.use(BootstrapVue);

    export default {
        data() {
            return {
                ds_info : {}, // for dataset selection
                selected_analysis : null,
                isConv: true,
                app: { 
                    //record for fetched information for selected analysis
                },
                files: {
                    // for v-modal in this vue
                },
                parameters: {
                    // for v-model in this vue
                },
                file_names: {
                    //record for file names for later dataset merge files in submit controller

                },
                file_required: {
                },
                demo_id: 0, // demo task id for fetching task information
                result_demo_id: 0, // demo task id for local platform for demo  visualizaition
                demo_inputs: {}, // for submit demo task
                demo_parameters: {}, // for submit demo task
                ds_selected: "", // for selected dataset

                boolSelectOpt: [
                    { value: true, text: 'Yes' },
                    { value: false, text: 'No' },
                ],
                inputValid: {}, // useful for telling user about the problematic parameter input
                submitted: false,
                jobID: '', // display submitted job id to user
                isLoading: false,
                analyses: [], // all analyses under a specific category for user selection
                started: false,

                // single_sync_params_desc: "",
                // single_module_params_desc: "",
                // multiple_sync_params_desc: "",
                // multiple_module_params_desc: "",
                single_params_desc: "",
                multiple_params_desc: "",

                
                picked_single_multiple: "single",

                multiple_pairs_num: 1,
                multiple_completed: [],
                step: 1,
                showhelper: false,
                parameters_input: [], // for signature file and cibersort r file
                pure_inputs: [],
                pipeline_json: {}, // seeems not useful
                
                //not syncronized parameters
                single_module_params: {},
                multiple_module_params: {},

                //syncronized paramters
                single_sync_params: {},
                multiple_sync_params: {},
                multiple_sync_pnames: ["Dataset name", "Platform", 'Protocol normalization'],
                single_sync_pnames: ["Project name", 'Protocol normalization'],

                demo_setting_json: {},
                ptype: "",
                protocol_options: [
                    "array_none", "array_quantile", "RNA-Seq_TPM", "RNA-Seq_none"
                ]
                
            
            };
        },
        created() {
            this.ds_info = window.gon.select_box_option;
            console.log("Outputing dataset information of the user:");
            console.log(this.ds_info);
            this.ptype = window.gon.ptype;
            
            this.isConv = true;
            this.updateApp(null, false);
            this.select_box_option = [];

            var oplist = [];
            for (var key in this.ds_info){
                var op = {value: key, lable: key};
                oplist.push(op);
            }
            this.select_box_option = oplist;

            axios.get('/submit/pipelines.json', { params: { ptype: this.ptype }  }).then(response => {
                this.analyses = response.data; console.log(response.data)
            });
            // this.multiple_completed = Array(10).fill(false);
        },
        computed: {
            //improvement sort the parameter with respect to their default name
            // displayedInputs() {
            //     return this.pure_inputs;
            //     return _.sortBy(this.app.inputs.filter(x => (!x._destroy && x.name != 'CIBERSORT.R' && x.name != 'Signature file')), ['name']);
            // },
            // displayedSingleParams() {
            //     console.log("logging displayed single parameters => called by displayedSingleParams function:")
            //     console.log(this.single_parameters);
            //     return this.single_parameters;
            // },
            // displayedBatchEffectParams() {
            //     return _.sortBy(this.multiple_parameters.filter(x => !x._destroy), ['name']);
            // },
            // displayedAnalyses() {
            //     var filtered_analyses = this.analyses;
            //     // if (this.isConv == true) {
            //     //     if (this.picked_supervised == "supervised") {
            //     //         filtered_analyses = filtered_analyses.filter(item => !(item.name == "TIMEDB Deconv LinSeed"));
            //     //     }
            //     //     else {
            //     //         filtered_analyses = filtered_analyses.filter(item => (item.name == "TIMEDB Deconv LinSeed"));
            //     //     }
            //     // }
            //     return filtered_analyses;
            // },
            displayedPairsNum() {
                return this.multiple_pairs_num;
            },
            updateUploadedStatus() {
                // still for multiple uploading verification
                // console.log("updating upload status under multiple mode:");
                // console.log("multiple pairs number: " + this.multiple_pairs_num);
                // console.log("type of multiple pairs number: " + typeof(this.multiple_pairs_num));

                for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                    this.multiple_completed[input_idx - 1] = true;

                    if(this.ds_selected[input_idx - 1] != '' && this.ds_info[this.ds_selected[input_idx - 1]][0] == 0) this.multiple_completed[input_idx - 1] = false;

                    //check whether input value is empty or not
                    if (this.ds_selected[input_idx - 1] == "") {
                        this.pure_inputs.forEach((item) => {
                            // console.log(item);
                            // console.log("priting files and status when updating status for multiple upload: " + input_idx + " - " + item.name);
                            // console.log(this.files['multiple-i-' + item.id + '-' + input_idx] == null)
                            // console.log(this.files['multiple-i-' + item.id + '-' + input_idx])
                            if (this.files['multiple-i-' + item.id + '-' + input_idx] == null) {
                                this.multiple_completed[input_idx - 1] = false;
                                // console.log(item.name + " is not uploaded");
                            }
                        })
                    }

                    //check module syncronized parameters
                    if (this.multiple_completed[input_idx - 1] == true && this.ds_selected[input_idx - 1] == '') {
                        for (let input_name in this.multiple_sync_params) {
                            var rep_input = this.multiple_sync_params[input_name][0];
                            // console.log(rep_input);
                            var cur_value = this.parameters["multiple-p-" + rep_input.id + "-" + input_idx];
                            const valid = !!cur_value && !!_.trim(cur_value);
                            //all of multipe parameters are required
                            if (!valid) {
                                // console.log(cur_value);
                                // console.log("Input sync parameters has problems, and the problematic value is: ");
                                // console.log(cur_value);
                                this.multiple_completed[input_idx - 1] = false;
                            }
                        }
                    }
                    //check module not syncronized parameters
                    // if (this.multiple_completed[input_idx - 1] == true) {
                    //     for (let k in this.multiple_module_params) {
                    //         console.log("jbjhbjb", k);
                    //         console.log(this.multiple_module_params[k].params);
                    //         if ( this.multiple_module_params[k].params != null) {
                            
                    //             var cur_value = this.parameters["multiple-p-" + this.multiple_module_params[k].params.id + "-" + input_idx];
                    //             const valid = !!cur_value && !!_.trim(cur_value);
                    //             //all of multipe parameters are required
                    //             if (!valid) {
                    //                 console.log(cur_value);
                    //                 console.log("Input module parameters has problems, and the problematic value is: ");
                    //                 console.log(cur_value);
                    //                 this.multiple_completed[input_idx - 1] = false;
                    //             }
                    //         }
                    //     }
                    // }
                }
                console.log(this.multiple_completed);
                return this.multiple_completed;
            },
            
        },
        watch: {
            ds_selected:function(newValue) {
                if (this.picked_single_multiple == 'single' && newValue != "") {
                    console.log("new selected dataset is (under single mode): ");
                    console.log(newValue);
                    for (var k in this.pure_inputs) {
                        this.files['i-' + this.pure_inputs[k].id]  = null;
                    }
                }
                if (this.picked_single_multiple == 'multiple') {
                    for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                        if (this.ds_selected[input_idx - 1] != '') {
                            this.pure_inputs.forEach((item) => {
                                this.files['multiple-i-' + item.id + '-' + input_idx] = null;
                            })
                        }
                    }
                }
            },
            files:function() {
                console.log("file changes");
            },
            parameters:function() {
                console.log("parameter changes");
            },
            multiple_pairs_num:function(newValue) {
                console.log("new multiple pairs number is: ");
                console.log(newValue);
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
                console.log("Parameters:");
                console.log(this.parameters);

                var formatted_params = []

                //for single syncronized parameters
                for (var k in this.single_sync_params) {
                    console.log(k);
                    var syncp = this.single_sync_params[k];
                    console.log(syncp);

                    var single_sync_value = this.parameters["p-" + syncp[0].id];
                    for (let k in syncp) {
                        formatted_params.push({['p-' + syncp[k].id]: single_sync_value});
                    }
                }

                //for single module parameters
                for (var module_name in this.single_module_params) {
                    var module_params = this.single_module_params[module_name].params;
                    // console.log("-----------");
                    // console.log(module_params);
                    for (var k in module_params) {
                        // console.log("Format params:----");
                        // console.log(this.parameters["p-" + module_params[k].id]);

                        formatted_params.push({['p-' + module_params[k].id]: this.parameters["p-" + module_params[k].id]});
                    }
                }

                // under multiple mode
                // thingking - first is dataset merging, second is file uploading
                // improvement: considering time consuming
                if (this.picked_single_multiple == "multiple") {
                    var multiple_sync_array = {};
                    //var multiple_module_array = {};
                    for (let msp_name in this.multiple_sync_params) {
                        multiple_sync_array[msp_name] = [];
                    }
                    // for (let module_name in this.multiple_module_params) {
                    //     multiple_module_array[module_name] = [];
                    
                    for (let input_idx = 1; input_idx <=  this.multiple_pairs_num; input_idx++ ) {
                        if (this.multiple_completed[input_idx - 1] == true) {
                            // if this pair is from dataset merging
                            if (this.ds_selected[input_idx - 1] != '') {
                                //console.log("for input pair " + input_idx + " we use dataset merging");
                                //Dataset name
                                var dataset_names = this.ds_info[this.ds_selected[input_idx - 1]][2].split(',');
                                //console.log(dataset_names);
                                //Platform name
                                var platform_names = this.ds_info[this.ds_selected[input_idx - 1]][1].split(',');
                                //console.log(platform_names);
                                //project source number
                                var ps_number = this.ds_info[this.ds_selected[input_idx - 1]][0];
                                multiple_sync_array['Dataset name'] = multiple_sync_array['Dataset name'].concat(dataset_names);
                                multiple_sync_array["Platform"] = multiple_sync_array["Platform"].concat(platform_names);
                                multiple_sync_array['Protocol normalization'] = multiple_sync_array['Protocol normalization'].concat(Array(ps_number).fill(this.parameters["multiple-p-" + this.multiple_sync_params['Protocol normalization'][0].id + "-" + input_idx]));
                                // for (let module_name in this.multiple_module_params) {
                                //     if (this.multiple_module_params[module_name].params != null) {
                                //         multiple_module_array[module_name] += Array(ps_number).fill(this.parameters["multiple-p-" + this.multiple_module_params[module_name].params.id + "-" + input_idx]);
                                //     }
                                // }
                                //console.log(multiple_sync_array);
                            }
                        }
                    }
                    // console.log(multiple_sync_array);
                    for (let input_idx = 1; input_idx <=  this.multiple_pairs_num; input_idx++ ) {
                        if (this.multiple_completed[input_idx - 1] == true) {
                            // this.parameters["multiple-p-" + this.multiple_module_params[module_name].params.id + "-" + input_idx]
                            // if this pair is from dataset merging
                            if (this.ds_selected[input_idx - 1] == '') {
                                //console.log("for input pair " + input_idx + " we use file uploading:");
                                multiple_sync_array['Dataset name'].push(this.parameters["multiple-p-" + this.multiple_sync_params['Dataset name'][0].id + "-" + input_idx]);
                                multiple_sync_array["Platform"].push(this.parameters["multiple-p-" + this.multiple_sync_params['Platform'][0].id + "-" + input_idx]);
                                multiple_sync_array['Protocol normalization'].push(this.parameters["multiple-p-" + this.multiple_sync_params['Protocol normalization'][0].id + "-" + input_idx]);

                                // for (let module_name in this.multiple_module_params) {
                                //     if (this.multiple_module_params[module_name].params != null) {
                                //         multiple_module_array[module_name].push(this.parameters["multiple-p-" + this.multiple_module_params[module_name].params.id + "-" + input_idx]);
                                //     }
                                // }
                            }
                        }
                    }
                    for (let msp_name in this.multiple_sync_params) {
                        let sync_pvalue = multiple_sync_array[msp_name].join(',');
                        for (let k in this.multiple_sync_params[msp_name]) {
                            formatted_params.push({['p-' + this.multiple_sync_params[msp_name][k].id]: sync_pvalue});
                        }
                    }
                    // for (let module_name in this.multiple_module_params) {
                    //     if (this.multiple_module_params[module_name].params != null) {
                    //         let integrated_value = multiple_module_array[module_name].join(",");
                    //         formatted_params.push({['p-' + this.multiple_module_params[module_name].params.id]: integrated_value});
                    //     }
                    // }
                }
                console.log("formatted parameters:");
                console.log(formatted_params);
                return formatted_params
            },

            formatFiles() {
                if (this.picked_single_multiple == 'single') {
                    return this.files;
                }
                else {
                    var formatted_files = {};
                    for (var k in this.pure_inputs) {
                        var input_arr = [];
                        for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                            if (this.multiple_completed[input_idx - 1] == true && this.ds_selected[input_idx - 1] == "" && this.files['multiple-i-' + this.pure_inputs[k].id + '-' + input_idx] != null ) {
                                input_arr.push(this.files['multiple-i-' + this.pure_inputs[k].id + '-' + input_idx]);
                            }
                        }
                        formatted_files['i-' + this.pure_inputs[k].id] = input_arr;
                    }

                    for (var k in this.parameters_input) {
                        formatted_files['i-' + this.parameters_input[k].id] = this.files['i-' + this.parameters_input[k].id];
                    }
                    console.log("formatted files:");
                    console.log(formatted_files);
                    return formatted_files;
                }
            },

            formatDatasets() {
                var ds_arr = []
                if (this.picked_single_multiple == 'single' && this.ds_selected != "") {
                    ds_arr.push(this.ds_selected);
                }
                if (this.picked_single_multiple == 'multiple') {
                    for (var input_idx = 0; input_idx < this.multiple_pairs_num;  input_idx++ ) {
                        if (this.multiple_completed[input_idx] == true && this.ds_selected[input_idx] != "") {
                            ds_arr.push(this.ds_selected[input_idx]);
                        }
                    }
                }
                return ds_arr;
            },

            updateApp(s_ana, flag) {
                this.inputValid = {};
                this.files = {};
                this.parameters = {};
                this.file_names = {};
                this.file_required = {};
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

                    //clear inputs and parameters container
                    this.single_sync_params = {};
                    this.single_module_params = {};
                    this.multiple_sync_params = {};
                    //this.multiple_module_params = {};
                    this.pure_inputs = [];
                    this.parameters_input = [];


                    this.showhelper = true;
                    console.log("start update app");

                    this.selected_analysis = s_ana; // records information of local database

                    //improvement: for some pipeline, should only be multiple mode and no selection should be allowed
                    
                    var newid;
                    if (this.picked_single_multiple == "single") {
                        newid = s_ana.pid;
                        this.demo_id = s_ana.single_demo_id;
                        this.result_demo_id = s_ana.single_result_id;
                    }
                    else {
                        newid = s_ana.multiple_pid;
                        this.demo_id = s_ana.multiple_demo_id;
                        this.result_demo_id = s_ana.multiple_result_id;
                    }
                    axios.get(`https://deepomics.org/api/pipeline_flowchart/${newid}/`).then((response) => {
                        this.app = response.data;
                    }).finally(() => {
                        console.log("Successfully get pipeline flowchart json");
                        axios.get(`https://deepomics.org/api/pipelines/${newid}/`).then((response) => {
                            const { alertCenter } = this.$refs;
                            if (response.data.code) { 
                                this.app.name = response.data.name;
                                this.app.params = response.data.data; // with respect to their modules
                                this.pipeline_json = response.data.pipeline_json;
                                // pipeline json records each nodes' inputs, and returned parameters are empty
                                // parameter information are stored in the response.data.data
                            } else {
                                alertCenter.add('danger', response.data.data);
                            }
                        }).finally(() => {
                            console.log("created: fetched inputs:");
                            console.log(this.app.inputs);
                            console.log("created: fetched params:");
                            console.log(this.app.params);

                            var params_copy = this.app.params;
                            for (let k in params_copy) {

                                var module_params = params_copy[k].params;
                                this.single_module_params[k] = {};
                                //this.multiple_module_params[k] = {};
                                this.single_module_params[k].id = params_copy[k].id
                                //this.multiple_module_params[k].id = params_copy[k].id
                                this.single_module_params[k].params = []


                                for (let t in module_params) {
                                    var param = module_params[t];
                                    // single syncronized parameters array - Project name
                                    // if (param.name == "Project name") {
                                    //     this.single_sync_params.push(param);
                                    // }
                                    if (this.picked_single_multiple == 'multiple' && this.multiple_sync_pnames.includes(param.name)) {
                                        if (this.multiple_sync_params[param.name] == null) {
                                            this.multiple_sync_params[param.name] = [param];
                                        }
                                        else {
                                            this.multiple_sync_params[param.name].push(param);
                                        }
                                    }
                                    else if (this.single_sync_pnames.includes(param.name)) {
                                        if (this.single_sync_params[param.name] == null) {
                                            this.single_sync_params[param.name] = [param];
                                        }
                                        else {
                                            this.single_sync_params[param.name].push(param);
                                        }
                                    }
                                    else {
                                        this.parameters['p-' + param.id] = param.default; //commonly only for single parameters
                                        this.single_module_params[k].params.push(param);
                                    }
                                }
                            }

                            this.single_params_desc = this.single_sync_params['Project name'][0].description;

                            if (this.picked_single_multiple == "multiple") {
                                this.multiple_completed = Array(10).fill(false);
                                this.ds_selected = Array(10).fill("");
                                this.multiple_params_desc = this.multiple_sync_params["Dataset name"][0].description;
                                // this.multiple_sync_params_desc = this.multiple_sync_params["Dataset name"][0].description;
                                // this.single_module_params_desc = this.multiple_module_params[Object.keys(this.single_parameters)[0]].description;
                            }
                            
                            
                            for (var k in this.app.inputs){
                                this.file_names['i-' + this.app.inputs[k].id]  = this.app.inputs[k].name; //for later dataset merging - file matching
                                this.file_required['i-' + this.app.inputs[k].id] = this.app.inputs[k].required;
                            }

                            for (var k in this.app.inputs) {
                                if (this.app.inputs[k].name == "CIBERSORT.R" || this.app.inputs[k].name == "Signature file") {
                                    this.parameters_input.push(this.app.inputs[k]);
                                }
                                else {
                                    this.pure_inputs.push(this.app.inputs[k]);
                                }
                            }
                            console.log("end update app");
                            console.log(this.single_sync_params);
                            console.log(this.single_module_params);
                            console.log(this.multiple_sync_params);
                            //console.log(this.multiple_module_params);

                            this.started = flag;
                        });
                    });

                    
                    
                }
            },


            checkInputValid() {

                const { alertCenter } = this.$refs;
                let allRight = true;
                let is_single = (this.picked_single_multiple == 'single')

            
                //valid checking, need imporvement for complete error reporting
                document.querySelectorAll("select[name^='multiple-p-'], input[name^='multiple-p-'], input[name^='p-'], select[name^='p-']").forEach((input) => {
                    if(input.required) {
                        const valid = !!input.value && !!_.trim(input.value);
                        //Vue.set(this.inputValid, input.name, valid);
                        if (!valid) {
                            // console.log(input);
                            // console.log("you missed some required parameters")
                            // console.log(input.name)
                            allRight = false;
                            alertCenter.add('danger', "You missed some required parameters!");
                        }
                    }
                })

                //there will be double check later
                if (is_single && this.ds_selected != "") {
                    if (this.ds_info[this.ds_selected][0] > 1) {
                        // console.log("Selected datasets has multiple project sources!")
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

                if (allRight == true) {
                    var anyFile;

                    if (is_single) {
                        anyFile = true;
                        if (this.ds_selected == "") {
                            for (var file_inputs in this.file_required) {
                                if (this.files[file_inputs] == null) {
                                    anyFile = false;
                                    alertCenter.add('danger', "You are under single mode, but you have not uploaded any file input or selected any single source dataset!");
                                }
                            }
                        }
                    }
                    else {
                        anyFile = false;
                        for (var input_idx = 0; input_idx < this.multiple_pairs_num;  input_idx++ ) {
                            if (this.multiple_completed[input_idx] == true) {
                                anyFile = true;
                                break;
                            }
                        }
                    }

                    for (var k in this.parameters_input) {
                        if (this.files[`i-${this.parameters_input[k].id}`] == null) {
                            anyFile = false;
                            alertCenter.add('danger', "Please upload Signature file and CIBERSORT.R.");
                        }
                    }
                    // for (var file_inputs in this.files) {
                    //     if (is_single) {
                    //         anyFile = true;
                    //         if (this.files[file_inputs] == null) {
                    //             console.log(file_inputs)
                    //             anyFile = false;
                    //             alertCenter.add('danger', "You are under single mode, but you have not uploaded any file input or selected any single source dataset!");
                    //         }
                    //     }
                    //     else {
                    //         anyFile = false;
                    //         for (var be_num in this.multiple_pairs_num) {
                    //             if (this.multiple_completed[be_num] != null) {
                    //                 anyFile = true;
                    //             }
                    //         }
                    //         if (anyFile == false) {
                    //             alertCenter.add('danger', "You are under multiple mode, but there is no valid input pairs!");
                    //         }
                    //     }
                    // }
                    allRight = anyFile == true
                    if (!allRight) {
                        alertCenter.add('danger', "Not enough inputs with parameters.");
                    }
                }

                console.log("Priting final files keys:")
                for (var key in this.files) {
                    console.log(this.files[key]);
                }

                console.log("Here are final formatted input files and input parameters");
                console.log(this.formatFiles());
                console.log(this.formatParams());

                console.log("All right is true here")

                if (allRight) {
                    this.submitTask();
                }
                else {
                    alertCenter.add('danger', "Please recheck your inputs. Something error here!");
                }

            },

            submitDemoTask() {
                const { alertCenter } = this.$refs;
                let alertData;
                var demo_files = {};
                var demo_params = {};

                var submitted_pid;
                if (this.picked_single_multiple == 'multiple') {
                    submitted_pid = this.selected_analysis.multiple_pid;
                }
                else {
                    submitted_pid = this.selected_analysis.pid;
                }
                
                //$("#disable-fill").fadeIn(10);
                this.isLoading = true;
                console.log("loading: " + this.isLoading);

                axios.post(
                    `/query-deepomics/`,
                    objectToFormData({'id': this.demo_id, 'type': 'pipeline'}),
                    {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    console.log("Module query result for testing pipelines:", response);
                    this.demo_inputs = response.data.message.inputs;
                    this.demo_parameters = response.data.message.node_records;
                    
                }).catch((error) => {
                    const message = error.response && error.response.status === 404 ? "The task does not exist" : error;
                    alertCenter.add('danger', `${message}`);
                }).finally(() => {
                    // setTimeout(() => { alertCenter.add('danger', ''); }, 2000);
                    console.log("Log:", this.demo_inputs, this.demo_parameters)

                    //process demo info
                    
                    for (var k in this.demo_inputs){
                        let input = this.demo_inputs[k];
                        console.log(input, k);
                        let f_arr = [];
                        for (var t in input.files) {
                            let file = input.files[t];
                            let f_path = file.path + "/" + file.name;
                            f_arr.push(f_path);
                        }
                        demo_files[`i-${input.id}`] = f_arr.join(","); 
                    }

                    for (var k in this.demo_parameters) {
                        let module_params = this.demo_parameters[k].params;
                        for (let t in module_params) {
                            demo_params[`p-${module_params[t].id}`] = module_params[t].value;
                        }
                    }

                    console.log("Outputing demo inputs json:");
                    console.log(demo_files);
                    console.log("Outputing demo inputs parameters:");
                    console.log(demo_params);

                    axios.post(
                        `/submit-app-task/`,
                        objectToFormData({
                            "search_id": this.selected_analysis.pid,
                            "mid": submitted_pid,
                            "is_demo": true,
                            "inputs": demo_files,
                            "params": demo_params,
                            "is_pipeline": true,
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
                        console.log("submitted");
                        console.log(demo_files);


                        //$("#disable-fill").fadeOut(10);
                        this.isLoading = false;
                        if (!!alertData) {
                            this.$refs.alertCenter.add('danger', alertData);
                        }
                        // if (this.submitted) {
                        //     setTimeout(() => {
                        //         location.replace(`/submit/job-query`)
                        //     }, 1000);
                        // }
                    });
                });
            },

            checkDemoTask() {
                window.location.href = '/submit/job-query-demo?demo_id=' + this.result_demo_id + "&jobName=" + this.app.name; 
            },
            
            
            submitTask() {
                // send selected file to files

                //this.submitted = true;
                //this.updateUploadedStatus();

                const { alertCenter } = this.$refs;
                let alertData;
       
                let submitted_pid;
                if (this.picked_single_multiple == 'multiple') {
                    submitted_pid = this.selected_analysis.multiple_pid;
                }
                else {
                    submitted_pid = this.selected_analysis.pid;
                }
                //$("#disable-fill").fadeIn(10);
                this.isLoading = true;
                axios.post(
                    `/submit-app-task/`,
                    
                    objectToFormData({
                        "inputs": this.formatFiles(),
                        "params": this.formatParams(),
                        "datasets": this.formatDatasets(),
                        "search_id": this.selected_analysis.pid,
                        "mid": submitted_pid,
                        "is_single": this.picked_single_multiple=='single',
                        "file_names": this.file_names,
                        "is_demo": false,
                        "is_pipeline": true,
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
                    //$("#disable-fill").fadeOut(10);
                    this.isLoading = false;
                    if (!!alertData) {
                        this.$refs.alertCenter.add('danger', alertData);
                    }
                    // if (this.submitted) {
                    //     setTimeout(() => {
                    //         location.replace(`/submit/job-query`)
                    //     }, 1000);
                    // }
                });
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
            // resetMultipleUpload(input_idx) {
                
            //     for ( var k in this.app.inputs) {
            //         this.files["multiple-i-" + this.app.inputs[k].id + "-" + input_idx] = null;
            //     }

            //     for ( var k in this.multiple_parameters) {
            //         this.parameters["multiple-p-" + this.multiple_parameters[k].id + "-" + input_idx] = null;
            //     }

                
            //     this.ds_selected[input_idx - 1] = "";
            //     this.ds_param_selected[input_idx - 1] = "";
            // },
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
                document.getElementById('copyButton').removeClass('btn-light');
                document.getElementById('copyButton').addClass('btn-dark');
            },
            jumpToUpload() {
                var el = document.getElementById('jumpStart');
                el.scrollIntoView({behavior: "smooth"});
            },
            provide_param_desc(param) {
                this.single_params_desc = param.description
                // $("#params_desc").text(param.description);
                this.step = 2;
            },
            provide_multiple_param_desc(param) {
                this.multiple_params_desc = param.description;
                // $("#multiple_params_desc").text(param.description)
            },
            updateStepToFile() {
                this.step = 1;
            }, 
            // improvement update step tp file or parameters // add some style

        },
        components: {
            VueTagsInput, AlertCenter, GlobalSaveButton
        },
        updated(){

            $("#rendered_doc").find('img').on('click', function() {
                var _this = $(this);
                imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
            });
            function imgShow(outerdiv, innerdiv, bigimg, _this) {
                var src = _this.attr("src");
                $(bigimg).attr("src", src);

                $("<img/>").attr("src", src).on('load', function() {
                    var windowW = $(window).width();
                    var windowH = $(window).height();
                    var realWidth = this.width;
                    var realHeight = this.height;
                    var imgWidth, imgHeight;
                    var scale = 0.9;

                    if(realWidth > windowW * scale) {
                        imgWidth = windowW * scale;
                        imgHeight = imgWidth / realWidth * realHeight;
                    }else{
                        imgWidth = realWidth;
                        imgHeight = imgHeight;
                    }

                    $(bigimg).css("width", imgWidth);

                    var w = (windowW - imgWidth) / 2;
                    var h = (windowH - imgHeight) / 2;
                    $(outerdiv).css({"top": 100, "left":w});
                    $(outerdiv).css({"height":windowH* scale, "width":imgWidth});

                    $(outerdiv).fadeIn("fast");
                });
                window.addEventListener("click", function(e){
                   $(outerdiv).fadeOut("fast");
                });

            }
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

.submit-container-lg {
    margin: 3em;
}

#submit-app-back.active {
    filter: blur(5px);
    //background-color: #000;
}
#run-app {
    background-color: #f8f9fa;
}


// #run-app .row {
//     display: flex;
//     align-items: center;
// }

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


#loadingBlock {
    //margin: 0 1px;
    //padding: 8rem 4rem;
    text-align: center;
    color: #000;
    //position: fixed !important;
    //top: 30% !important;
    //left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    opacity: 1;
    //border: solid 1px;
    vertical-align: center;
}

#loadingBlock img {
    width: 200px;
    //height: 100px;
    position: relative;
    top: 10px;
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
    transform: scale(0.8);
    transition: all 0.5s;
}

.uploadPng:hover {
    transform: scale(0.9);
}

.demoPng {
    cursor: pointer;
    transform: scale(1.0);
    transition: all 0.5s;
}

.demoPng:hover {
    transform: scale(1.2);
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

.timeline-step {
    border-radius:20px;
    overflow:auto;
    position: absolute;
    padding: 0px;
    z-index:1;
    width: 300px;
}

.timeline-step img {
    width: 80px;
}

#timeline-file {
    top:150px;
}

#timeline-parameter {
    top:600px;
}

#file-upload-step {
    // border: solid 1px;
    margin-left: 10%;
    margin-top: 50px;
    height: 450px;
    // overflow: scroll;
}

#parameter-setting-step {
    // border: solid 1px;
    margin-left: 10%;
    margin-top: 50px;
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
    width : 80%;
    //box-shadow: 0 0 64px darken(#dee2e6, 2%);
    display: flex;
    align-items: center;


}

#parameter-setting-step .row {
    vertical-align: center;
}

#multiple-upload-box > .text-center {
    display: inline-block !important;
}

@-webkit-keyframes greenPulse {
  from { background-color: #1f201d; -webkit-box-shadow: 0 0 9px #333;}
  50% { background-color: #8c8b91; -webkit-box-shadow: 0 0 18px #c4c2cd;}
  to { background-color: #525452; -webkit-box-shadow: 0 0 9px rgb(136, 132, 135);}
}

.timeline-step .btn {
  -webkit-animation-name: greenPulse;
  -webkit-animation-duration: 2s;
  -webkit-animation-iteration-count: infinite;
}

#accordion h4 {
    text-align: center !important;
    margin-top: 10px;
}

.modal-backdrop
{
    opacity: 1.0 !important;
    background-color: rgb(165, 165, 165) !important;

}

#submit-helper img {
    width: 100%;
}

.btn-light {
    color: black;
}

.modal.fade {
  z-index: 1000000000 !important;
}

.infor{
    i{
        font-size: 8px;
    }
    background-color: #314893;
    color: #fff;
    margin-left: 50px !important;
    margin-right: 50px !important;
    padding: 10px;
    border-radius: 20px;
}

</style>
