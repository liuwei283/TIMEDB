<template>
    <!-- eslint-disable max-len -->
    <div class="row my-4" >
        <div v-if="!isLoading">
            <ul class='list d-none'>
                <li v-for="a in analyses" :key="a.id" class='list-item'>
                {{a.id}}: {{a.name}}
                </li>
            </ul>

            <div class="prepare" v-if="!submitted">
                <div class="index-banner">
                    <div class="container">
                        <h1 style="color:red;">
                            TESTING... Do Not Submit Tasks!
                        </h1>
                        <h2 class="display-2">
                            Start Analysis
                        </h2>
                        <p style="font-size:1.2em;">
                            TIMEDB provides state-of-the-arts tools of immune micro-enviroment deconvolution analysis. Official tutorial is available at Tutorial (link). You may try submit the tasks with our demo input files, or view the ideal demo results.
                        </p>
                    </div>
                </div>
                <div v-if="isConv==true" id = "singleMultipleSelect">
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
                            <div class = "row submit-container">
                                <div class="col-lg-4 mb-4 justify-content-center text-center" v-for="a in displayedAnalyses" :key="a.id" @click="updateApp(a, true)">
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
                                    <h4 class = "text-center">{{a.name}}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br><br>
            </div>


            <div class = "col-md-12" id = "submit-app-back" v-if="started && !submitted ">
                <div class = "row">
                    <div class="col-md-2">
                        <img v-bind:src="require('../assets/images/nav-up-blue.png')">
                        <svg width="100px" height="1100px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 0 v 100 l 10 10 l -10 10 v 430 l 10 10 l -10 10 v 530" fill="transparent" stroke="#253959" stroke-width = "3px"></path> 
                        </svg>

                        <div v-if="step==1" id = "timeline-file" class = "timeline-step" style="vertical-align:center">
                            <img v-bind:src="require('../assets/images/nav-up-pink.png')" style="margin-right: 10px"> 
                            <i class="fa fa-arrow-right"></i>  <b-btn v-b-modal.submit-helper class = "btn btn-secondary" id = "helper-trigger"> Module Helper </b-btn>
                        </div>

                        <div v-if="step==2" id = "timeline-parameter" class = "timeline-step" style="vertical-align:center">
                            <img v-bind:src="require('../assets/images/timeline-param.png')" style="margin-right: 10px"> 
                            <i class="fa fa-arrow-right"></i>  <b-btn v-b-modal.submit-helper class = "btn btn-secondary" id = "helper-trigger"> Module Helper </b-btn>
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

                                <div class = "row">
                                    <!-- <div class = "col-md-2">
                                        <b-btn @click="submitDemoTask()" class="float-right mt-2 btn-lg"><i class="fa fa-caret-right fa-lg"></i>Run demo task</b-btn>
                                    </div> -->
                                    <!-- <div class = "col-md-3">
                                        <h4><i class="fa fa-caret-right fa-lg"></i>Run demo task</h4>
                                    </div> -->
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
                                    
                                <!-- <div class = "container row justify-content-around">
                                    <div class = "col-md-6">
                                        <h4 v-if="picked_single_multiple=='multiple'" class = "text-center">Batch effect config</h4>
                                        <h4 v-else class = "text-center">File Submission</h4>
                                    </div>
                                    <div class = "col-md-6">
                                        <h4 class = "text-center">Set Parameters</h4>
                                    </div>
                                </div> -->
                                
                                <div id = "file-upload-step" class = "row justify-content-center submit-container-lg">
                                    <div>
                                        <h3 v-if="picked_single_multiple=='multiple'" class = "text-center">Batch effect config</h3>
                                        <h3 v-else class = "text-center">File Submission</h3>
                                        <br>

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
                                            <div v-if="picked_single_multiple=='single'" class = "row justify-content-center">
                                                <div class = "row justify-content-center">
                                                    <div class="text-center" v-for="input in displayedInputs" :key="input.id">
                                                        <label :for="`i-${input.id}`">{{ input.name }}
                                                            <span v-if="input.required" class="required">*</span>
                                                        </label>
                                                        <div v-b-modal="'single-upload-' + input.id" class="uploadPng text-center justify-content-center container" @click="updateStepToFile()">
                                                            <img v-bind:src="require('../assets/images/big_upload.png')" style="width:90%">
                                                        </div>
                                                    </div>
                                                    
                                                </div>

                                                <div class = "row justify-content-center">
                                                    <label>
                                                        <span>You can select a dataset to merge: </span>
                                                        <i class="fa fa-question-circle" v-b-tooltip.rightbottom.hover title="You may choose one dataset with single project source to upload merged files"></i>
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
                                            <div v-if="displayedSingleParams.length > 0" class = "col-md-6">

                                                <div class="row" style="height:350px; overflow-y:scroll; display:flex; flex-direction: row; justify-content: center; align-items:center;">

                                                    <div class="col-md-10" v-for="param in displayedSingleParams" :key="param.id">
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
                                                </div>
                                            </div>
                                            <div class = "col-md-6" style="height:350px; overflow:scroll; display:flex; flex-direction: column; justify-content: center;">
                                                <h2>Parameters description</h2>
                                                <div id = "single_params_desc" v-html="single_params_desc"></div>
                                            </div>
                                        </div>
                                        <p v-if="displayedSingleParams.length == 0">No Parameters.</p>
                                    </div>
                                </div>
                                <br>
                                <br>
                                <b-btn @click="checkInputValid()" class="float-right mt-2"><i class="fa fa-location-arrow"></i> Submit</b-btn>
                                <b-btn @click="checkDemoTask()" class="float-right mt-2"><i class="fa fa-location-arrow"></i> Debug</b-btn>

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
                            <b-btn :id = "copyButton" @click = "copyToClipboard" type = "button" class = "btn btn-light">Copy</b-btn>
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


        <b-modal class= "file-submit-modal" :id="`single-upload-${input.id}`" size="md" :title="`Submit input file - ${input.name}`" centered v-for="input in displayedInputs" :key="input.id">
                <div class = "row justify-content-center submit-container">
                    <div class = "col-md-1">
                    </div>
                    <button class = "col-md-4 btn btn-secondary">
                        <a :href="`/public/data/module_demo/${input.name}_demo.csv`" :download="input.name">Download demo file</a>
                    </button>
                    <div class = "col-md-7">
                    </div>
                    
                    <div class = "col-md-12 text-center">
                        <div class = "submit-container">
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
                            <div v-html="input.description"></div>
                        </div>
                    </div>
                </div>
        </b-modal>

        <b-modal class= "file-submit-modal" :id="`batchEffect-config-${input_idx}`" size="xl" centered title="File Submission and Parameter Setting for Batch Effect" v-for="input_idx in parseInt(displayedPairsNum)" :key="input_idx">    
                
                
                <div class = "row justify-content-center">

                    <!-- <div class = "col-md-2">
                        <b-btn @click="resetMultipleUpload(input_idx)" class="float-right mt-2 btn-lg">Reset</b-btn>
                    </div>
                    <div class = "col-md-10">
                    </div> -->

                    <div class = "col-md-10 text-center">
                        <h4 class = "mb-4"> File submission </h4>
                        <div class = "row">
                            <div id = "be-file-submit" class = "col-md-6 text-center" v-for="input in displayedInputs" :key="input.id">
                                
                                <div>
                                    <label :for="`multiple-i-${input.id}-${input_idx}`" class = "row justify-content-around">
                                        <div class = "col-md-6 text-left" style="margin:auto;">
                                            {{ input.name }}
                                            <span v-if="input.required" class="required" style="color:red;">*</span>
                                        </div>
                                        <div class = "col-md-6 text-right">
                                            <button class = "btn btn-secondary">
                                                <a :href="`/public/data/module_demo/${input.name}_demo.csv`" :download="input.name">Download demo file</a>
                                            </button>
                                        </div>
                                    </label>
                                    <b-form-file
                                        :id="`multiple-i-${input.id}-${input_idx}`"
                                        v-model="files[`multiple-i-${input.id}-${input_idx}`]"
                                        :placeholder="files[`multiple-i-${input.id}-${input_idx}`] ? files[`multiple-i-${input.id}-${input_idx}`].name : 'no file uploaded'"
                                        drop-placeholder="Drop file here..." 
                                        :name="`multiple-i-${input.id}-${input_idx}`"
                                        :required="input.required"
                                    >
                                    </b-form-file>
                                    <div class = "submit-container">
                                        <div v-html="input.description">
                                        </div>
                                    </div>
                                    
                                </div>
                                <!-- <div><p>uploaded file name: {{files[`i-${input.id}-${input_idx}`] ? files[`i-${input.id}-${input_idx}`].name : "no file uploaded"}} </p></div> -->
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
                        >
                            <option value="" key="default">--click to select your own dataset--</option>
                            <option v-for="(option, index) in select_box_option" :key="index" :value="option.value" :disabled="option.disabled">
                                {{option.lable}}
                            </option>
                        </b-form-select>
                    </div>

                    <br>
                    <br>


                    <div class = "col-md-10 submit-container text-center">
                        <h4> Parameter setting </h4>

                        <div class = "row justify-content-center">
                            <div v-if="ds_selected[input_idx - 1] == '' && displayedBatchEffectParams.length > 0" class = "col-md-6" style="vertical-align:center">
                                <div class="row">
                                    <div class="col-md-12" style="margin-bottom:10px" v-for="param in displayedBatchEffectParams" :key="param.id">

                                        <label :for="`multiple-p-${param.id}-${input_idx}`">{{ param.name }}
                                            <span v-if="param.required" class="required" style="color:red;">*</span>
                                        </label>
                                        <div v-if="param.param_type === 'enum'">
                                            <select @focus="provide_multiple_param_desc(param)" :id="`multiple-p-${param.id}-${input_idx}`" class="form-control custom-select"  :placeholder="parameters[`multiple-p-${param.id}-${input_idx}`]"
                                                    v-model="parameters[`multiple-p-${param.id}-${input_idx}`]" :required="param.required" :name="`multiple-p-${param.id}-${input_idx}`">
                                                <option v-for="option in param.options" :value="option" :key="option"
                                                        :selected="param.default == option ? 'selected' : ''">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </div>
                                        <div v-else>
                                            <b-form-input @focus="provide_multiple_param_desc(param)" :id="`multiple-p-${param.id}-${input_idx}`" :value="param.default" :required="param.required" :placeholder="parameters[`multiple-p-${param.id}-${input_idx}`]"
                                            v-model="parameters[`multiple-p-${param.id}-${input_idx}`]" :name="`multiple-p-${param.id}-${input_idx}`" />
                                        </div>
                                            
                                    </div>
                                </div>
                            </div>



                            <div v-if="ds_selected[input_idx - 1] != ''" class = "col-md-6" style="vertical-align:center">
                                <div class="row">
                                    <div class="col-md-12" style="margin-bottom:10px">

                                        <label :for="`dp-${input_idx}`">{{ ds_params.name }} for selected dataset
                                            <span v-if="ds_params.required" class="required"  style="color:red;">*</span>
                                        </label>
                                        <div v-if="ds_params.param_type === 'enum'">
                                            <select @focus="provide_multiple_param_desc(ds_params)" :id="`dp-${input_idx}`" class="form-control custom-select"
                                                    v-model="ds_param_selected[input_idx - 1]" :required="ds_params.required" :name="`${ds_params.name}-${input_idx}`">
                                                <option v-for="option in ds_params.options" :value="option" :key="option"
                                                        :selected="ds_params.default == option ? 'selected' : ''">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </div>
                                        <div v-else>
                                            <b-form-input @focus="provide_multiple_param_desc(ds_params)" :id="`dp-${input_idx}`" :required="ds_params.required" :placeholder="ds_param_selected[input_idx - 1]"
                                            v-model="ds_param_selected[input_idx - 1]" :name="`${ds_params.name}-${input_idx}`" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class = "col-md-6">
                                <h2>Parameters description</h2>
                                <div id = "multiple_params_desc" v-html="multiple_params_desc"></div>
                            </div>
                        </div>
                    </div>
                </div>
        </b-modal>


        <b-modal v-if="started" ref="submit-helper" v-model="showhelper" id = "submit-helper" size="xl" scrollable title="Module Helper" centered @ok="jumpToUpload">
            <br>
            <div class = "row justify-content-center container">
                <div v-html="selected_analysis.rendered_doc" class = "text-left container" style="margin: 50px;">
                </div>
            </div>
        </b-modal>

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
                demo_id: 0,
                result_demo_id: 0,
                demo: false,
                demo_inputs: {},
                demo_parameters: {},
                ds_selected: [],
                ds_param_selected: [],
                ds_params: {},
                boolSelectOpt: [
                    { value: true, text: 'Yes' },
                    { value: false, text: 'No' },
                ],
                inputValid: {},
                submitted: false,
                jobID: '',
                isLoading: false,
                analyses: [],
                started: false,
                single_params_desc: "",
                multiple_params_desc: "",

                picked_single_multiple: "single", //for non-deconv module, initial value is single
                picked_supervised: "supervised",
                single_parameters: [],
                multiple_parameters: [],
                multiple_pairs_num: 1,
                multiple_completed: [],
                step: 1,
                showhelper: false,
                parameters_input: [],

                test_description: "<h5>There are something testing description</h5><ul><li>The first row is for something.</li><li>The first column is for something. It should be something.</li><li>Please be noted that the uploader is for something and somethind should be...</li></ul><p>This is the end of this line.</p>"
            };
        },
        created() {
            this.ds_info = window.gon.select_box_option;
            if (this.analysis_category == "TIME Estimation") {
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
                return _.sortBy(this.single_parameters.filter(x => !x._destroy), ['default']);
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
                console.log("updating upload status under multiple mode:");
                console.log("multiple pairs number: " + this.multiple_pairs_num);
                console.log("type of multiple pairs number: " + typeof(this.multiple_pairs_num));

                for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                    this.multiple_completed[input_idx - 1] = true;

                    if (this.ds_selected[input_idx - 1] == "") {
                        this.app.inputs.forEach((item) => {
                            console.log(item);
                            console.log("priting files and status when updating status for multiple upload: " + input_idx + " - " + item.name);
                            console.log(this.files['multiple-i-' + item.id + '-' + input_idx] == null)
                            console.log(this.files['multiple-i-' + item.id + '-' + input_idx])

                            // console.log(this.files['i-' + this.app.inputs[k].id + '-' + input_idx] == null)
                            // console.log(this.files['i-' + this.app.inputs[k].id + '---' + input_idx] == null)

                            if (this.files['multiple-i-' + item.id + '-' + input_idx] == null) {
                                this.multiple_completed[input_idx - 1] = false;
                                console.log(item.name + "not uploaded");
                            }
                        })
                    }

                    //check whetehr the parameters can fullfil the requirement
                    if (this.ds_selected[input_idx - 1] == '') {
                        for (var mp in this.multiple_parameters) {
                            var cur_value = this.parameters["multiple-p-" + this.multiple_parameters[mp].id + "-" + input_idx];
                            const valid = !!cur_value && !!_.trim(cur_value);
                            if (!valid) {
                                console.log(cur_value);
                                console.log("Input parameters has problems")
                                this.multiple_completed[input_idx - 1] = false;
                            }
                        }
                    }
                    else {
                        var cur_ds_param = this.ds_param_selected[input_idx - 1]
                        if (cur_ds_param == "") this.multiple_completed[input_idx - 1] = false;
                    }
                    // document.querySelectorAll("#multiple-upload-" + input_idx + " input[name^='multiple-p']").forEach((input) => {
                    //     if(input.required) {
                    //         console.log(input.value);
                    //         const valid = !!input.value && !!_.trim(input.value);
                    //         if (!valid) {
                    //             console.log(input);
                    //             console.log("Input parameters has problems")
                    //             this.multiple_completed[input_idx - 1] = false;
                    //         }
                    //     }
                    // })
                }
                console.log(this.multiple_completed)
                return this.multiple_completed;
            },
            
        },
        watch: {
            ds_selected:function(newValue) {
                if (this.picked_single_multiple == 'single' && newValue != "") {
                    console.log(newValue);
                    for (var k in this.app.inputs) {
                        this.files['i-' + this.app.inputs[k].id]  = null;
                    }
                }
                if (this.picked_single_multiple == 'multiple') {
                    for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                        if (this.ds_selected[input_idx - 1] != '') {
                            this.app.inputs.forEach((item) => {
                                this.files['multiple-i-' + item.id + '-' + input_idx] = null;
                            })
                        }
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
                    var formatted_multiple_params = [];

                    for (var mp in this.multiple_parameters) {
                        var pvalue = "";
                        var pvalue_arr = [];

                        // if (this.ds_selected != "") {
                        //     if (this.multiple_parameters[mp].name == 'Datasets name') {
                        //         pvalue = this.ds_info[this.ds_selected][2];
                        //     }
                        //     else if (this.multiple_parameters[mp].name == 'Platforms') {
                        //         pvalue = this.ds_info[this.ds_selected][1];
                        //     }
                        //     else {
                        //         pvalue =  Array(this.ds_info[this.ds_selected][0]).fill([this.ds_param_selected]).join(',') + ',';
                        //     }
                        // }
                        for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                            if(this.multiple_completed[input_idx - 1] == true && this.ds_selected[input_idx - 1] != "") {
                                var cur_pvalue = "";

                                if (this.multiple_parameters[mp].name == 'Datasets name') {
                                    cur_pvalue = this.ds_info[this.ds_selected[input_idx - 1]][2];
                                }
                                else if (this.multiple_parameters[mp].name == 'Platforms') {
                                    cur_pvalue = this.ds_info[this.ds_selected[input_idx - 1]][1];
                                }
                                else {
                                    cur_pvalue =  Array(this.ds_info[this.ds_selected[input_idx - 1]][0]).fill(this.ds_param_selected[input_idx - 1]).join(',');
                                }

                                if (pvalue == "") {
                                    pvalue = cur_pvalue;
                                }
                                else {
                                    pvalue = pvalue + "," + cur_pvalue;
                                }

                            }
                            // pvalue_arr.push(this.parameters['multiple-p-' + this.multiple_parameters[mp].id + '-' + input_idx]);
                        }

                        for (var input_idx = 1; input_idx <= this.multiple_pairs_num;  input_idx++ ) {
                            if(this.multiple_completed[input_idx - 1] == true && this.ds_selected[input_idx - 1] == "") {
                                if (pvalue == "") {
                                    pvalue = this.parameters['multiple-p-' + this.multiple_parameters[mp].id + '-' + input_idx];
                                }
                                else {
                                    pvalue = pvalue + "," + this.parameters['multiple-p-' + this.multiple_parameters[mp].id + '-' + input_idx];
                                }
                            }
                        }

                        // pvalue += pvalue_arr.join(',');
                        formatted_multiple_params.push({ ['p-' + this.multiple_parameters[mp].id]: pvalue});
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
                            if (this.multiple_completed[input_idx - 1] == true && this.ds_selected[input_idx - 1] == "") {
                                input_arr.push(this.files['multiple-i-' + this.app.inputs[k].id + '-' + input_idx]);
                            }
                        }
                        formatted_files['i-' + this.app.inputs[k].id] = input_arr;
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

                    if (s_ana.name = "TIMEDB Batch Effect") {
                        this.picked_single_multiple = 'multiple';
                    }
                    
                    var newid;
                    if (this.picked_single_multiple == "single") {
                        newid = s_ana.mid;
                        this.demo_id = s_ana.single_demo_id;
                        this.result_demo_id = s_ana.single_result_id;

                    }
                    else {
                        newid = s_ana.multiple_mid;
                        this.demo_id = s_ana.multiple_demo_id;
                        this.result_demo_id = s_ana.multiple_result_id;

                    }
                        
                    axios.get(`https://deepomics.org/api/apps/${newid}/`).then((response) => {
                        this.app = response.data.app;
                        console.log("Logging fetched input data information:")
                        console.log(response.data.app.inputs);
                        console.log();
                        this.files = {};
                        this.parameters = {};
                        

                        if (this.picked_single_multiple == "single") {
                            this.single_parameters = this.app.params;
                            this.multiple_parameters = [];
                            this.ds_selected = "";
                            this.ds_params = this.app.params[0];

                        }
                        else {
                            this.single_parameters = this.app.params.filter(x => !['Platforms', 'Datasets name', 'Protocol normalization'].includes(x['name']));
                            this.multiple_parameters = this.app.params.filter(x => ['Platforms', 'Datasets name', 'Protocol normalization'].includes(x['name']));
                            this.multiple_completed = Array(10).fill(false); // for both file upload and related parameter setting under multiple mode
                            this.ds_selected = Array(10).fill("");
                            this.ds_param_selected = Array(10).fill("");
                            
                            this.multiple_params_desc = this.multiple_parameters[0].description;
                            this.ds_params = this.app.params.find(x => x['name'] == 'Protocol normalization');//for dataset parameters

                            

                            console.log("printing dataset parameters");
                            console.log(this.ds_params.name);
                            // console.log();
                        }



                        for (var k in this.app.inputs){
                            if (this.app.inputs[k].id) = 
                            this.file_names['i-' + this.app.inputs[k].id]  = this.app.inputs[k].name; //for later dataset merging - file matching
                        }

                        for (var k in this.single_parameters) {
                            console.log("Dafult value for parameters: " + this.single_parameters[k].name)
                            console.log(this.single_parameters[k].default)

                            this.parameters['p-' + this.single_parameters[k].id] = this.single_parameters[k].default; //commonly only for single parameters
                        }

                        this.single_params_desc = this.single_parameters[0].description;

                    
                    });
                    console.log("end update app");
                    this.showhelper = true;
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
                            console.log(input);
                            console.log("you missed some required parameters")
                            console.log(input.name)
                            allRight = false;
                            alertCenter.add('danger', "You missed some required parameters!");
                        }
                    }
                })

                //there will be double check later
                if (is_single && this.ds_selected != "") {
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

                if (allRight == true) {
                    var anyFile;

                    if (is_single) {
                        anyFile = true;
                        if (this.ds_selected == "") {
                            for (var file_inputs in this.files) {
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

                console.log("Here are input files and input parameters");
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

                let submitted_mid;
                if (this.picked_single_multiple == 'multiple') {
                    submitted_mid = this.selected_analysis.multiple_mid;
                }
                else {
                    submitted_mid = this.selected_analysis.mid;
                }
                
                $("#disable-fill").fadeIn(10);
                this.isLoading = true;
                console.log("loading: " + this.isLoading);


                axios.post(
                    `/query-deepomics/`,
                    objectToFormData({'id': this.demo_id, 'type': 'app'}),
                    {  
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                ).then((response) => {
                    console.log("Module query result:", response);
                    this.demo_inputs = response.data.message.inputs;
                    this.demo_parameters = response.data.message.params;
                    
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
                        let params = this.demo_parameters[k];
                        demo_params[`p-${params.id}`] = params.value;
                    }

                    console.log("Outputing demo inputs json:");
                    console.log(demo_files);
                    console.log("Outputing demo inputs parameters:");
                    console.log(demo_params);


                    axios.post(
                        `/submit-app-task/`,
                        objectToFormData({
                            "search_mid": this.selected_analysis.mid,
                            "mid": submitted_mid,
                            "is_demo": true,
                            "inputs": demo_files,
                            "params": demo_params,
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


                        $("#disable-fill").fadeOut(10);
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
                        "datasets": this.formatDatasets(),
                        "search_mid": this.selected_analysis.mid,
                        "mid": submitted_mid,
                        "is_single": this.picked_single_multiple=='single',
                        "file_names": this.file_names,
                        "is_demo": false,
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
                    $("#disable-fill").fadeOut(10);
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
            resetMultipleUpload(input_idx) {
                
                for ( var k in this.app.inputs) {
                    this.files["multiple-i-" + this.app.inputs[k].id + "-" + input_idx] = null;
                }

                for ( var k in this.multiple_parameters) {
                    this.parameters["multiple-p-" + this.multiple_parameters[k].id + "-" + input_idx] = null;
                }

                
                this.ds_selected[input_idx - 1] = "";
                this.ds_param_selected[input_idx - 1] = "";
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
            jumpToUpload() {
                var el = document.getElementById('run-app');
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



</style>
