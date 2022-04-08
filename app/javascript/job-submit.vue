<template>
    <!-- eslint-disable max-len -->
    <div class="row my-4" >
        <div class = "col-md-12" id = "submit-app-back">
            <div class = "row">
                <div class="col-md-2">
                    <img v-bind:src="require('../assets/images/nav-up-blue.png')">
                    <svg width="100px" height="500px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 0 v 200 l -10 10 l 10 10 v 120 l 10 10 l -10 10 v 140" fill="transparent" stroke="#253959" stroke-width = "3px"></path> 
                    </svg>

                    <div v-if="demo==false" class=" jump">
                         <img v-bind:src="require('../assets/images/nav-up-pink.png')" style="float :left"> 
                        <p style="padding-top:20px">Don't know how to upload data? Click to download the  <a href="#" @click = "clickDemo" >demo file!</a>   </p>
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
                        <div v-if= "!submitted && !demo">
                            <h6 class="text-right">{{ app.name }}
                                <!-- <i class="fa  fa-question-circle" b-tooltip.hover
                                            :title="app.description"></i> -->
                            </h6>
                            <h2 class = "text-right"> JOB SUBMISSISON </h2>
                            <div class = "row">


                                <div class="set-input-section col-md-8" ref="inputSection">
                                    <h4 class = "text-left">Upload Input File</h4>
                                    <template v-if="displayedInputs.length > 0">
                                        <div class="row">
                                            
                                                
                                                    <div class="col-md-4" v-for="input in displayedInputs" :key="input.id">
                                                        <label :for="`i-${input.id}`">{{ input.name }}
                                                            <span v-if="input.required" class="required">*</span>
                                                            <!-- <i class="fa fa-question-circle" b-tooltip.hover
                                                            :title="input.description"></i> -->
                                                        </label>
                                                        <div @click = "uploadToggle" :id="`popup-trigger-${input.id}`"> <img v-bind:src="require('../assets/images/nav-upload.png')"></div>
                                                        

                                                        <!-- <select class="form-control custom-select" 
                                                            v-if="input.name=='second_i'"
                                                            :id="`i-${input.id}`"
                                                            :name="`i-${input.id}`"
                                                            :required="input.required"
                                                            v-model="selected[`i-${input.id}`]"
                                                            :state="inputValid[`i-${input.id}`]"
                                                        >
                                                            <option value="">--Please choose a file--</option>
                                                            <option v-for="(option, index) in select_box_option" :key="index" :value="option.value" :disabled="option.disabled">
                                                                {{option.lable}}
                                                            </option>
                                                        </select>

                                                        <b-form-file
                                                            v-else
                                                            :id="`i-${input.id}`"
                                                            v-model="files[`i-${input.id}`]"
                                                            :state="inputValid[`i-${input.id}`]"
                                                            placeholder="Choose a file or drop it here..."
                                                            drop-placeholder="Drop file here..."
                                                            :name="`i-${input.id}`"
                                                            :required="input.required"
                                                        >
                                                        <img v-bind:src="require('../assets/images/nav-upload.png')">
                                                        </b-form-file> -->

                                                    </div>

                                        </div>
                                    </template>
                                </div>




                                <div class="set-param-section mt-4 col-md-4" style="word-wrap:break-word;border-left:solid; padding-left:40px">
                                    <h4>Set Parameters</h4>
                                    <template v-if="displayedParams.length > 0">
                                        <div class="row">
                                            <div class="col-md-12" v-for="param in displayedParams" :key="param.id">
                                                <label :for="`p-${param.id}`">{{ param.name }}
                                                    <span v-if="param.required" class="required">*</span>
                                                    <i class="fa  fa-question-circle" b-tooltip.hover
                                                    :title="param.description"></i>
                                                </label>
                                                <div v-if="param.param_type === 'string'">
                                                    <b-form-input :id="`p-${param.id}`" :value="param.default" :required="param.required"
                                                                :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]" />
                                                </div>
                                                <div v-else-if="param.param_type === 'int'">
                                                    <b-form-input :id="`p-${param.id}`" :value="param.default" type="number" step="1"
                                                                :required="param.required" :name="`p-${param.id}`"
                                                                :state="inputValid[`p-${param.id}`]"/>
                                                </div>
                                                <div v-else-if="param.param_type === 'float'">
                                                    <b-form-input :id="`p-${param.id}`" :value="param.default" type="number"
                                                                step="0.01" :required="param.required"
                                                                :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]"/>
                                                </div>
                                                <div v-else-if="param.param_type === 'boolean'">
                                                    <b-form-select :id="`p-${param.id}`" :options="boolSelectOpt" :required="param.required"
                                                                :name="`p-${param.id}`" :state="inputValid[`p-${param.id}`]"/>
                                                </div>
                                                <div v-else-if="param.param_type === 'enum'">
                                                    <select :id="`p-${param.id}`" class="form-control custom-select" 
                                                            :required="param.required" :name="`p-${param.id}`" 
                                                            :state="inputValid[`p-${param.id}`]">
                                                        <option v-for="option in param.options" :value="option" :key="option"
                                                                :selected="param.default == option ? 'selected' : ''">
                                                            {{ option }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div v-else-if="param.param_type === 'splitchr'">
                                                    <b-form-select :id="`p-${param.id}`" :options="boolSelectOpt" 
                                                                :required="param.required" :name="`p-${param.id}`" 
                                                                :state="inputValid[`p-${param.id}`]" />
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <p v-if="displayedParams.length == 0">No Parameters.</p>
                                </div>

                            </div>

                            <!-- <div class="col-md-4 " style="word-wrap:break-word;border-left:solid; padding-left:40px">
                                <h2 style="color:blue; text-align:center">Set Parameters</h2><br>
                                <form>
                                    <input type="text" class="form-control" placeholder=""><br>
                                    <input type="text" class="form-control" placeholder=""><br>
                                    <input type="text" class="form-control" placeholder=""><br>
                                    <input type="text" class="form-control" placeholder=""><br>
                                    <button type="submit" class="btn btn-primary btn-lg" style="float:right">SUBMIT</button>
                                </form>
                            </div> -->
                        
                            <!-- Params -->
                            
                           
                            <b-btn @click="submitTask" class="float-right mt-2"><i class="fa fa-location-arrow"></i> Submit</b-btn>
                            <div class="is-loading w-100" v-if="isLoading">
                                <i class="fas fa-spinner fa-pulse fa-5x m-0"></i>
                                <h3 class="mt-4">Submitting task……</h3>
                            </div>
                        </div>
                        <div v-else-if= "demo==true">
                            <div class = "row">
                                <div class="col-md-5">
                                    <br><br><br>
                                    <div class="row" style="margin:0">
                                        <div class="col-md-5 text-center" style="border:solid;border-radius:20px;padding:20px">{{testdata.file1}}</div>
                                        <div class="col-md-5 offset-2 text-center" style="border:solid;border-radius:20px;padding:20px">{{testdata.file2}}</div>
                                    </div>
                                    <br>

                                        <div style="border:solid;border-radius:10px;text-align:center;word-wrap:break-word;">

                                            <p>{{testdata.description1}}</p>

                                            <h1 style="color:#314893;text-align:center; padding-top:120px; padding-bottom:120px">
                                            PICTURE
                                            </h1>
                                            <p>{{testdata.description2}}</p>
                                        </div>

                                </div>

                                <div class="col-md-6 offset-1">
                                    <h4 class="text-right">{{ app.name }}

                                    </h4>
                                    <h1 class = "text-right"> JOB SUBMISSISON </h1>

                                    <hr>
                                        <div class="col-md-6" style="word-wrap:break-word;border-right:solid;float:left">
                                            <br>
                                            <h3 style="color:#314893; text-align:center">Set Input Data</h3><br>

                                            <div style="border:solid;border-radius:20px;text-align:center;padding:20px">{{testdata.infor1}}</div><br>
                                            <div style="border:solid;border-radius:20px;text-align:center;padding:20px">{{testdata.infor2}}</div><br>
                                            <div style="border:solid;border-radius:20px;text-align:center;padding:20px">{{testdata.infor3}}</div><br>


                                        </div>
                                        <br>
                                        <div class="col-md-6" style="word-wrap:break-word; padding-left:40px;float:right">
                                                <h3 style="color:#314893; text-align:center">Set Parameters</h3><br>
                                                No Parameters
                                        </div>
                                </div>

                            </div>

                            <br><hr>
                            <button type="submit" class="btn  btn-lg" style="background-color:#314893;color:white;float:right; border-radius:50%;margin-left:20px" @click= "closeDemo"> > </button> 
                            <button type="submit" class="btn btn-lg" style="background-color:#314893;color:white;float:right">SUBMIT</button>

                        </div>
                        <div v-else>
                            <div class="text-center job-info">
                                <h1>Successfully</h1>
                                <h1>Submitted</h1>
                                <p>We are preparing your visualization,you can copy the code and check the status of your work in the <a :href = "`/submit/job-query?job_id = ${jobID}`">[workspace]</a>.</p>
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
    import * as $ from "jquery";


    Vue.use(BootstrapVue);

    export default {
        data() {
            return {
                id: window.gon.id,
                app: {
                    name: 'test app for immune platform',
                    description: 'some descriptions for this app',
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
                        {
                            id: "id3",
                            name: "name3",
                            description: "some descriptions3",
                            required: true,

                        },
                        {
                            id: "id4",
                            name: "name4",
                            description: "some descriptions4",
                            required: true,

                        }
                        
                    ],
                    params: [
                        {
                            id: "pid1",
                            name: "parameter 1",
                            param_type: "string",
                            default: "default value",
                            required: true
                        },
                        {
                            id: "pid2",
                            name: "parameter 2",
                            param_type: "string",
                            default: "default value",
                            required: true
                        },
                        {
                            name: "parameter 3",
                            id: "pid3",
                            param_type: "string",
                            default: "default value",
                            required: true
                        }
                    ],
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
                jobID: 'nhvxhjdsvlcbsd',
                isLoading: false,
                demo: false,

                testdata:{
                    file1: 'this is file1',
                    file2: 'this is file2',
                    description1:"dhwauhduagwduywgadugawgduawdgwduadgawudgawud agdugwydagygwyadga agydgwaydygawdyawdyawd",
                    description2:"dahwudhaudwg agdygwdyg adgay dgaywdgyawdgywadgyawgda aduadguwgdy",
                    infor1:"Group Info",
                    infor2:"User Abd",
                    infor3:"Second i",
                },

            };
        },
        created() {
            this.selected = {};
            this.select_box_option = [];
            var ds = window.gon.select_box_option;
            var oplist = [];
            for (var key in ds){
                var op = {value: key, lable: key};
                oplist.push(op);
            }
            this.select_box_option = oplist

            
            
            
            for (var k in this.app.inputs){
                // alert(k);
                this.files['i-' + this.app.inputs[k].id]  = null;
            }
            
            

            // axios.get(`https://deepomics.org/api/apps/${this.id}/`).then((response) => {
            //     this.app = response.data.app;
            //     for (var k in this.app.inputs){
            //         // alert(k);
            //         this.files['i-' + this.app.inputs[k].id]  = null;
            //     }
            // });
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
            submitTask() {
                // send selected file to files

                this.submitted = true;

                
                // const { alertCenter } = this.$refs;
                // let allRight = true;
                // document.querySelectorAll('input').forEach((input) => {
                //     if(input.required) {
                //         const valid = !!input.value && !!_.trim(input.value);
                //         Vue.set(this.inputValid, input.name, valid);
                //         if (!valid) {
                //             allRight = false;
                //         }
                //     }
                // })
                // if (allRight) {
                //     let alertData;
                //     $("#disable-fill").fadeIn(10);
                //     this.isLoading = true;
                //     axios.post(
                //         `/submit-app-task/`,
                //        objectToFormData({
                //             "app_id": this.app.id,
                //             "inputs": this.files,
                //             "params": this.formatParams(),
                //             "selected": this.selected,
                //             "mid": this.id,
                //         }),
                //         {
                //             headers: {
                //                 'X-Requested-With': 'XMLHttpRequest',
                //                 'X-CSRF-Token': document.head.querySelector('meta[name="csrf-token"]').content,
                //                 'Content-Type': 'multipart/form-data',
                //             },
                //         },
                //     ).then((response) => {
                //         if (response.data.code) {
                //             this.jobID = response.data.data.task_id;
                //             this.submitted = true;
                //         } else {
                //             alertData = response.data.msg;
                //         }
                //     }).catch((reason) => {
                //         alertData = reason;
                //     }).finally(() => {
                //         setTimeout(() => {
                //             $("#disable-fill").fadeOut(10);
                //             this.isLoading = false;
                //             if (!!alertData) {
                //                 alertCenter.add('danger', alertData);
                //             }
                //         }, 500);
                //     });
                // }
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
#run-app .job-info {
    min-height: 200px;
    padding: 100px 20px;
    font-size: 50px;
    background-color: #f8f9fa;

}

#run-app .job-info h1 {
    font-size: 2em;
    text-align: left;
}

#run-app .job-info p {
    text-align: left;
}

#run-app .job-info button {
    font-size: 1em;
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

.jump{
    border:solid;
    border-radius:20px;
    overflow:auto;
    position: absolute;
    top:90px;
    width: 300px;
    padding: 0px;
    background-color: rgb(252, 157, 154);
    z-index:1;
}
</style>
