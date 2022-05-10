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
            <div class="index-banner">
                <div class="container">
                    <h2 class="display-4">
                        Module
                    </h2>
                    <p class="lead mt-2">
                        Please choose a module below.
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
                    
                    <div class="row cols-xs-space cols-sm-space cols-md-space">
                        <div class="col-lg-4 mb-4 cardContainer" @click="updateApp(null, true)">
                            <div class="card">
                                <img v-bind:src="require('../assets/images/module.png')" class="card-img-top">
                                <div class = "image_overlay image_overlay_blur">
                                    <div class = "image_title">
                                        Test only
                                    </div>
                                    <div class = "image_decscription">
                                        just for testing
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-4" v-for="a in analyses" :key="a.id" @click="updateApp(a, true)">
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
                    <svg width="100px" height="500px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 0 v 200 l -10 10 l 10 10 v 120 l 10 10 l -10 10 v 140" fill="transparent" stroke="#253959" stroke-width = "3px"></path> 
                    </svg>

                    <div v-if="demo==false" class="jump before">
                        <img v-bind:src="require('../assets/images/nav-up-pink.png')" style="float :left; margin-right: 5px"> 
                        <p style="padding-top:20px">Don't know how to upload data? Click to download the  <a href="#" @click = "clickDemo" >demo file!</a>   </p>
                    </div>
                    <div v-else class="jump after">
                        <img v-bind:src="require('../assets/images/nav-up-pink.png')" style="float :left; margin-right: 5px"> 
                        <p style="padding-top:30px"><a href = "#" @click = "closeDemo">Close helper!</a></p>
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
                            <div class = "row">

                                
                                <div class="set-input-section col-md-6" ref="inputSection">
                                    <h4 class = "text-center">File Submission</h4>

                                    <div class = "row">
                                        <div v-if="demo" id = "demo-helper" class = "col-md-8">
                                            <h4 class = "text-center">Submission Helper</h4>
                                            <br>
                                            <div class="row" style="margin:0">
                                                <div class="col-md-5 text-center" style="border:solid;border-radius:20px;padding:20px">
                                                    <!-- <a href="/public/data/module_demo/demo1.tsv" download = "testing">Download</a> -->
                                                    <a :href="`/public/data/module_demo/${app.name}_demo1.tsv`" download = "demo1">Download</a>
                                                </div>
                                                <div class="col-md-5 offset-2 text-center" style="border:solid;border-radius:20px;padding:20px">
                                                    <a :href="`/public/data/module_demo/${app.name}_demo2.tsv`" download = "demo2">Download</a>
                                                    <!-- <a href="/public/data/module_demo/test_demo2.tsv" download = "testing">Download</a> -->
                                                </div>
                                            </div>
                                            <br>

                                            <div style="border:solid;border-radius:10px;text-align:center;word-wrap:break-word;height:300px;overflow:scroll;">
                                                <img :src="`https://deepomics.org${app.image.url}`" alt="Italian Trulli">
                                                <p>{{app.description}}</p>
                                            </div>
                                        </div>
                                        <div v-if="demo" class = "col-md-1"></div>
                                        

                                        <div v-if="displayedInputs.length>0" :class="check_class(0)">
                                            <div class = "row">
                                                <div :class="check_class(1)" v-for="input in displayedInputs" :key="input.id">
                                                    <label :for="`i-${input.id}`">{{ input.name }}
                                                        <span v-if="input.required" class="required">*</span>
                                                        <!-- <i class="fa fa-question-circle" b-tooltip.hover
                                                        :title="input.description"></i> -->
                                                    </label>
                                                    <div @click = "uploadToggle" :id="`popup-trigger-${input.id}`"  class="uploadPng">
                                                        <img v-bind:src="require('../assets/images/big_upload.png')">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    
                                </div>


                                <div class="set-param-section mt-4 col-md-6" style="word-wrap:break-word;border-left:solid; padding-left:40px">
                                    <h4>Set Parameters</h4>
                                    <div class = "row">
                                        <div v-if="displayedParams.length > 0" class = "col-md-6" style="height:200px;overflow:scroll; vertical-align:center">
                                            <div class="row">
                                                <div class="col-md-12" v-for="param in displayedParams" :key="param.id">
                                                    <label :for="`p-${param.id}`">{{ param.name }}
                                                    </label>
                                                    <div v-if="param.param_type === 'string'">
                                                        <b-form-input @focus="provide_param_desc(param)" :id="`p-${param.id}`" :value="param.default" :required="param.required"
                                                                    :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]" />
                                                    </div>
                                                    <div v-else-if="param.param_type === 'int'">
                                                        <b-form-input @focus="provide_param_desc(param)" :id="`p-${param.id}`" :value="param.default" type="number" step="1"
                                                                    :required="param.required" :name="`p-${param.id}`"
                                                                    :state="inputValid[`p-${param.id}`]"/>
                                                    </div>
                                                    <div v-else-if="param.param_type === 'float'">
                                                        <b-form-input @focus="provide_param_desc(param)" :id="`p-${param.id}`" :value="param.default" type="number"
                                                                    step="0.01" :required="param.required"
                                                                    :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]"/>
                                                    </div>
                                                    <div v-else-if="param.param_type === 'boolean'">
                                                        <b-form-select @focus="provide_param_desc(param)" :id="`p-${param.id}`" :options="boolSelectOpt" :required="param.required"
                                                                    :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]"/>
                                                    </div>
                                                    <div v-else-if="param.param_type === 'enum'">
                                                        <select @focus="provide_param_desc(param)" :id="`p-${param.id}`" class="form-control custom-select" 
                                                                :required="param.required" :name="`p-${param.id}`" 
                                                                :state="inputValid[`p-${param.id}`]">
                                                            <option v-for="option in param.options" :value="option" :key="option"
                                                                    :selected="param.default == option ? 'selected' : ''">
                                                                {{ option }}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div v-else-if="param.param_type === 'splitchr'">
                                                        <b-form-select @focus="provide_param_desc(param)" :id="`p-${param.id}`" :options="boolSelectOpt" 
                                                                    :required="param.required" :name="`p-${param.id}`" 
                                                                    :state="inputValid[`p-${param.id}`]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class = "col-md-6">
                                            <h5>Parameters description</h5>
                                            <p id = "params_desc">{{this.params_desc}}</p>
                                        </div>
                                    </div>
                                    
                                    <p v-if="displayedParams.length == 0">No Parameters.</p>
                                </div>

                            </div>
                            
                            <b-btn v-if="demo" @click="closeDemo" class="float-right mt-2" style="border-radius:50%;margin-left:20px"> > </b-btn>
                            <b-btn @click="submitTask" class="float-right mt-2"><i class="fa fa-location-arrow"></i> Submit</b-btn>
                            <div class="is-loading w-100" v-if="isLoading">
                                <i class="fas fa-spinner fa-pulse fa-5x m-0"></i>
                                <h3 class="mt-4">Submitting task……</h3>
                            </div>
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

        <div class = "popup row" :id="`popup-upload-${input.id}`" v-for="input in displayedInputs" :key="input.id">
            
                <div class = "col-md-1"></div>
                <div class = "col-md-4 text-center" id = "upload-card">
                    <!-- <img v-bind:src="require('../assets/images/nav-upload.png')"> -->
                    <!-- <h1 class="text-center">Upload</h1> -->
                    <div class = "text-center">
                        <i class="fa fa-upload fa-10x"></i>
                    </div>
                    <br>
                    <br>
                    <b-form-file
                        :id="`i-${input.id}`"
                        v-model="files[`i-${input.id}`]"
                        :state="inputValid[`i-${input.id}`]"
                        placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here..."
                        :name="`i-${input.id}`"
                        :required="input.required"
                    >
                    </b-form-file>

                </div>
                <div class = "col-md-2"></div>

                <div class = "col-md-4 text-center" id = "description-card">
                    <!-- <h2>File description</h2> -->
                    <p class = "text-center">{{input.description}}</p>
                </div>
                <div class = "col-md-1"></div>
                <div class = "col-md-12 text-center" :id ="`closeToggle-${input.id}`">
                    <button type = "button" class = "btn" @click="uploadToggle"><i class="fa-solid fa-arrow-up"></i> Upload</button>
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


    Vue.use(BootstrapVue);

    export default {
        data() {
            return {
                id: window.gon.id,
                category_name: window.gon.cname,
                app: { 
                },
                files: {
                },
                selected: {},
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
                params_desc: null,

            };
        },
        created() {
            this.updateApp(null, false);
            this.selected = {};
            this.select_box_option = [];
            var ds = window.gon.select_box_option;
            var oplist = [];
            for (var key in ds){
                var op = {value: key, lable: key};
                oplist.push(op);
            }
            this.select_box_option = oplist;

            axios.get('/submit/analysesCategory.json', { params: { cname: this.category_name}  }).then(response => {this.analyses = response.data; console.log(response.data)});
            for (var k in this.app.inputs){
                this.files['i-' + this.app.inputs[k].id]  = null;
            }
        },
        computed: {
            displayedInputs() {
                // eslint-disable-next-line
                return _.sortBy(this.app.inputs.filter(x => !x._destroy), ['name']);
            },
            displayedParams() {
                // eslint-disable-next-line
                return _.sortBy(this.app.params.filter(x => !x._destroy), ['name']);
            }
        },
        watch: {
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
                return Array.from(document.querySelectorAll("input[name^='p-'], select[name^='p-']"))
                            .filter(x => x.value)
                            .map(({ name, value }) => ({ [name]: value}));
            },

            updateApp(app, flag) {
                this.started = flag;
                let newid, newapp;
                if (app == null) {
                    newid = window.gon.id;
                    newapp = {
                        image : "/media/img/instance/Sudden_Cardiac_Death_Detection.png",
                        name: 'test app for immune platform',
                        description: 'Sudden cardiac death (SCD) is a sudden, unexpected death caused by loss of heart function (sudden cardiac arrest). Sudden cardiac death is the largest cause of natural death in the United States, causing about 325,000 adult deaths in the United States each year. Sudden cardiac death is responsible for half of all heart disease deaths.\n\nSudden cardiac death occurs most frequently in adults in their mid-30s to mid-40s, and affects men twice as often as it does women. This condition is rare in children, affecting only 1 to 2 per 100,000 children each year.\n\n**Reference**: WH, L., \u0026 Dan, E. (2010). Genetic Variations in NOS1AP are Associated with Sudden Cardiac Death in U.S. White Community Based Populations.",',
                        inputs: [
                            {
                                id: "id1",
                                name: "name1",
                                description: "some descriptions1",
                                required: true,
                            },
                            {
                                id: "id2",
                                name: "name2",
                                description: "some descriptions2",
                                required: true,

                            },
                            
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

                            },
                            {
                                name: "parameter 3",
                                id: "pid3",
                                param_type: "enum",
                                options: [1, 2, 3, 4, 5],
                                default: "default value",
                                required: true,
                                description: "some descripxcvgkflkulguy ome descriuljkh tions some descriptions some descriptions",

                            },
                            {
                                name: "parameter 4",
                                id: "pid4",
                                param_type: "string",
                                default: "default value",
                                required: true,
                                description: "some descripxcvgkflkulguy ome descriuljkh tions some descriptions some descriptions",

                            },
                            {
                                name: "parameter 5",
                                id: "pid5",
                                param_type: "string",
                                default: "default value",
                                required: true,
                                description: "some descripxcvgkflkulguy ome descriuljkh tions some descriptions some descriptions",

                            }
                        ],
                    };
                    this.id = newid;
                    this.app = newapp;

                    this.params_desc = this.app.params[0].description;
                }

                else {
                    newid = app.mid;
                    // newapp = {
                    //     name: app.name,
                    //     description: app.description,
                    //     inputs: [],
                    //     params: [],
                    // };
                    axios.get(`https://deepomics.org/api/apps/${newid}/`).then((response) => {
                        let newapp = response.data.app;
                        for (var k in this.app.inputs) {
                            this.files['i-' + this.app.inputs[k].id]  = null;
                        }
                        this.id = newid;
                        this.app = newapp;
                        this.params_desc = this.app.params[0].description;
                    });
                }
            },

            submitTask() {
                // send selected file to files

                //this.submitted = true;

                const { alertCenter } = this.$refs;
                let allRight = true;
                document.querySelectorAll('input').forEach((input) => {
                    if(input.required) {
                        const valid = !!input.value && !!_.trim(input.value);
                        Vue.set(this.inputValid, input.name, valid);
                        if (!valid) {
                            allRight = false;
                        }
                    }
                })
                console.log("it is all right")
                if (allRight) {
                    let alertData;
                    $("#disable-fill").fadeIn(10);
                    this.isLoading = true;
                    axios.post(
                        `/submit-app-task/`,
                       objectToFormData({
                            "app_id": this.app.id,
                            "inputs": this.files,
                            "params": this.formatParams(),
                            "selected": this.selected,
                            "mid": this.id,
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
                if (this.submitted == true) {
                    var delay = 10000; // time in milliseconds

                    setTimeout(function(){
                        window.location.href = 'job-query'
                    },delay);
                    
                }
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
            uploadToggle(event){
                console.log("here")
                var blur = document.getElementById("submit-app-back");
                blur.classList.toggle('active')
                console.log(event.target);
                var target_id = event.target.parentNode.id
                if(target_id.includes("closeToggle")) {
                    var input_id = target_id.replace("closeToggle-", "");
                    console.log(input_id);
                    var popup_uploader = document.getElementById("popup-upload-" + input_id);
                    popup_uploader.classList.toggle('active')
                }
                else {
                    var input_id = target_id.replace("popup-trigger-", "");
                    console.log(input_id);
                    var popup_uploader = document.getElementById("popup-upload-" + input_id);
                    popup_uploader.classList.toggle('active')
                }
                
            },
            clickDemo(){

                this.demo=true;
            },
            closeDemo(){
                this.demo=false;
            },
            // checkDemo(index){
            //     if(index==0){
            //         return "col-md-6";
            //     }else if(index==1){
            //         if(this.demo==true){
            //             return "col-md-3";
            //         }else{
            //             return "col-md-4";
            //         }                    
            //     }
            // },
            check_class(block) {
                if(block == 0){
                    if(this.demo) return "col-md-3"
                    else return "col-md-12"
                }
                else {
                    if(this.demo) return "col-md-12"
                    else return "col-md-6"

                }
            },
            provide_param_desc(param) {
                $("#params_desc").text(param.description)

            }

        },
        components: {
            VueTagsInput, AlertCenter, GlobalSaveButton,
        },
    };
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';
@import '../assets/stylesheets/partials/variables';

#submit-app-back.active {
    filter: blur(5px);
    //background-color: #000;
}
#run-app {
    background-color: #f8f9fa;
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
    position: absolute;
    top:0;
    z-index: 1000;
    width: 100%;
    height: 100%;
}

.row {
    display: flex;
    align-items: center;
}

.set-input-section img {
    width: 80%;
}

#jobIDButton, button {
    background-color: $light_theme;
    color: white;
}

.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    box-shadow: 0 5px 30px rgba(0,0,0,.30);
    background-color: #f8f9fa;
    visibility: hidden;
    opacity: 0;
    transition: 0.5s;
    border-radius: 15px;
}

.popup button {
    background-color: $light_theme;
    color: white
}

.popup.active {
    visibility: visible;
    opacity: 1;
    transition: 0.5s;

}

.popup .fa {
    width: 100%;
    display: inline-block;
    text-align: center;
    vertical-align: center;
}


.popup .col-md-4 {
    padding-top: 5%;
    color: white;
    background-color: $light_theme;
    height: 50%;
    //margin-left: 5%;
    //margin-right: 5%;
    //width: 30%;
    //background-color: #000;
    border: 1px solid $gray-400;
    border-radius: 5px;
    text-align: center;
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


.jump{
    border:solid;
    border-radius:20px;
    overflow:auto;
    position: absolute;
    top:90px;
    padding: 0px;
    background-color: rgb(252, 157, 154);
    z-index:1;
}
.before {
    width: 300px;
}
.after {
    width: 180px;
}


</style>
