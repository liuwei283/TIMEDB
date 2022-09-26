<template>
    <div>
        <link rel="stylesheet" type="text/css" href="chrome-extension://ckkdlimhmcjmikdlpkmbgfkaikojcbjk/themes/github.css" id="_theme">
        <div class="container text-center tutorial" v-if="this.details == false">
            <br>
            
            <div class="row">
                <div class="col-md-6 text-right">
                    <h1 class="title">Documentation</h1>
                    <p>Welcome to TIMEDB tutorial <br>
                    Search for in-depth articles on TIMEDB functions</p>
                    <br>
                    <div class="test">
                        <input type="text" class="search" placeholder="Type here to search" v-model="search_value">
                        <button @click="search"><i class="fa fa-search"></i></button>
                    </div>
                </div>

                <div class="col-md-4 offset-1">
                    <!-- <%= image_tag src="icons brightmode12.png", class: "d-block w-100"%> -->
                    <img v-bind:src="require('../assets/images/icons brightmode12.png')" class="d-block w-100">

                </div>
            </div>
            <div v-if="this.found == false">
                <i class="fa fa-chevron-down fa-3x"></i>
                <hr>
                <div class="row">
                    <div class="col-md-4 text-center">
                        <!-- <%=image_tag src="icons brightmode12.png" ,class:  "d-block w-100"%> -->
                        <img v-bind:src="require('../assets/images/database1.png')" class="d-block w-100">

                    </div>
                    <div class="col-md-8 text-center">
                        <br><br>
                        <h2 style="color: #1cb0b6 " class="col-md-11">Database Tutorial</h2>

                        <div class="row">
                            <div v-for="a in articles" :id="a.id" @click="showdetail($event)" class="col-md-5 tutorial-items text-center" :key="a.id">
                            <b>{{a.title}}</b>
                            
                            </div>
                        </div>
                    </div>


                </div>
                <hr>
                <div class="row">

                    <div class="col-md-8 text-center">
                        <br><br>
                        <h2 style="color: #cc4f78" class="col-md-10" >Analysis Tutorial</h2>
                        <div class="row">
                            <div v-for="a in articles2" :id="a.id" @click="showdetail2($event)" class="col-md-5 tutorial-items-red text-center" :key="a.id">
                            <b>{{a.title}}</b>
                            
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 text-center">
                        <img v-bind:src="require('../assets/images/analyses12.png')" class="d-block w-100">

                    </div>
                    
                </div>
                <hr><br>
                <div class="row">
                    <div class="col-md-8 text-center browser">
                        <div class=" ">
                        <h2>Browser Compatibility</h2>
                        <table class="table table-bordered table-striped">
                        <tbody>
                            <tr>
                                <td> </td> <td>Firefox</td> <td>Chrome</td> <td>Safari</td> <td>Edge</td>
                            </tr>
                            <tr>
                                <td>Linux</td> <td>√ </td> <td> √</td> <td> -</td> <td> - </td>
                            </tr>
                            <tr>
                                <td>macOS</td> <td> √</td> <td>√</td> <td>√ </td> <td>√ </td>
                            </tr>
                            <tr>
                                <td>Windows</td> <td>√ </td> <td> √</td> <td>- </td> <td>√ </td>
                            </tr>
                        </tbody>
                        </table>
                        <p>Browser compatibility of TIMEDB, √ for pass and - for not applicable</p>
                        </div>
                    </div>
                    <div class="col-md-4 text-center">
                        <br><br>
                        <h2 style="color: #314893">Help</h2>

                            <div v-for="a in articles3" :id="a.id" @click="showdetail2($event)" class="tutorial-items-3 text-center" :key="a.id">
                            <b>{{a.title}}</b>
                            
                            </div>
                    </div>
                </div>
                <hr>
                <br>
                <div id="maintain-update" class="row text-left justify-content-left">
                    <div class="container col-md-12">
                        <h2>Maintain and update TIMEDB</h2>
                        <p>We have developed admin pages to help maintain and update TIMEDB platform.</p>
                        <ul>
                            <li>
                                <p>Permissions have been granted to administration accounts to perform multiple database operations, including but not limited to new project and sample records insertion, clinical data uploading, data file integration and reprocessing.</p>
                                <img v-bind:src="require('../assets/images/admin_f1.png')">
                            </li>
                            <li>
                                <p>New analysis modules and pipelines which have passed testing can be integrated with our platform easily to provide servies.</p>
                                <img v-bind:src="require('../assets/images/admin_f2.png')">
                                <img v-bind:src="require('../assets/images/admin_f3.png')">
                            </li>
                            <li>
                                <p>We have task monitor admin pages to check, debug and guarantee the normal function of task submission procedure.</p>
                                <img v-bind:src="require('../assets/images/admin_f4.png')">
                                <img v-bind:src="require('../assets/images/admin_f5.png')">
                            </li>
                        </ul>
                        <p>After fixing reported bugs, we will release new versions every 20 ~ 30 days. Detailed platform update information can be found in the home page.</p>
                    </div>
                </div>
                <br><br>
            </div>
            <div v-if="this.found == true">
                <h2 class="title-search" style="text-align: left;"><i class="fa fa-caret-left" @click="backsearch"></i>The searched fields can be found in the following tutorials</h2>

                <div class="row" style="margin-left:15%">
                    <div v-for="a in results" :id="a.id" @click="showdetail($event)" class="col-md-5 tutorial-items text-center" :key="a.id">
                        {{a.title}}
                    </div>
                    <div v-for="a in results2" :id="a.id" @click="showdetail2($event)" class="col-md-5 tutorial-items-red text-center" :key="a.id">
                        {{a.title}}
                    </div>
                    <div v-for="a in results3" :id="a.id" @click="showdetail2($event)" class="col-md-5 tutorial-items-3 text-center" :key="a.id">
                        {{a.title}}
                    </div>
                </div>
                <div v-if="results.length + results2.length + results3.length ==0" class="title" style="margin-top:2%;margin-bottom:2%">
                    <h2>No page found. Please change your word for searching</h2>
                </div>

            </div>
        </div>


    </div>
</template>

<script>
import vue from "vue";
import router from "vue-router";

export default {

    data() {
        return {
                details: 0,
                articles:[
                    {title:"Database Introduction", id:"1",key:["database","intro"]},
                    {title:"How to View Database Information", id:"2",key:["database","information","data"]},
                    {title:"How to Download Database Data", id:"3",key:["database","download","data"]},
                    {title:"Visualizations in the Database", id:"4",key:["database","visualization","download"]},
                ],
                articles2:[
                    {title:"Analysis Introduction", id:"1",key:["anaylsis","intro"]},
                    {title:"How to Complete an Analysis", id:"2",key:["analysis","step","complete"]},
                    {title:"What Analysis We Have", id:"3",key:["analysis","helper","kind"]},

                ],
                articles3:[
                    {title:"How to Ask Us for Help", id:"4",key:["help","cite","contact","cityu"]},
                ],
                results:[],
                results2:[],
                results3:[],
                search_value: null,
                found: false,
                index: null,
                filter: 0.1,
            }
    },
    created() {
        this.init()
    },
    mounted() {
        //this.all_viz();
    },
    methods: {
        showdetail(a){
            let url = '/tutorial/database/'+a.currentTarget.id;
            window.location.href = url;

        },
        showdetail2(a){
            let url = '/tutorial/analysis/'+a.currentTarget.id;
            window.location.href = url;

        },
        init(){
            this.index = elasticlunr(function () {
                this.addField('title');
                this.addField('body');
                this.setRef('id');
            });

            var doc1 = {
                "id": 1,
                "title": "Database Introduction",
                "body":"Welcome to TIMEDB DatabaseTIMEDB provides the tumor immune micro-enviornment (TIME) cell proportions from bulk expression profiles of 35,000 + samples and 500+ datasets across 43 cancer types. Users can download the following files directly with TIMEDB:Gene expression file and meta fileGene expression file: The gene expression file stores the bulk gene expression of tumor samples, with sample as column and gene as row.Clinical file: The clinical file stores the manually curated clinical information of the sample, such as age, gender, etc. Each row is a sample and each column is a clinical feature.Scaled immmunoregulator expression file: The scaled gene expression profiles of seventy-nine immunoregular genes. [1]TIME cell estimation result fileTIMEDB uses ABIS, CIBERSORT, CIBERSORTX, ConsensusTME, EPIC, ImmucellAI, Mcpcounter, quanTIseq and TIMER to quantify the cells in tumor microenvironment. Users can download the following TIME estimation results.ABIS estimation result file: TIME estimation result from ABIS. [2]CIBERSORT estimation result file: TIME estimation result from CIBERSORT. [3]CIBERSORTx estimation result file: TIME estimation result from online website CIBERSORTx. [4]EPIC estimation result file: TIME estimation result from EPIC. (Applicable only for RNA-Seq count data.) [5]ImmuCellAI estimation result file: TIME estimation result from online website ImmuCellAI. [6]Mcpcounter estimation result file: TIME estimation result from Mcpcounter. [7]ConsensusTME estimation result file: TIME estimation result from ConsensusTME. (Applicable only for 32 TCGA cancer types.) [8]TIMER estimation result file: TIME estimation result from ConsensusTME. (Applicable only for 32 TCGA cancer types.) [9]quanTIseq estimation result file: TIME estimation result from quanTIseq. [10]xCell estimation result file: TIME estimation result from xCell. [11]TIME Consensus estimation result file: This file stores the TIME estimation result of common cell types occured one than once from nine estimation tools.(download the cell mapping file) [2-11]TIME All estimation result file: This file stores the TIME estimation result of all cell types from nine estimation tools. [2-11]C1-C6 subtyping result fileTIMEDB adopts ImmuneSubtypeClassifier [12, 13] to catelogue the immune subtype of tumor samples based on gene expression levels. Users can download the result file which shows the probability of sample being six immune status, including C1 (wound healing), C2 (IFN-γ dominant),C3 (inflammatory), C4 (lymphocyte depleted), C5 (immuno-logically quiet), and C6 (TGF-β dominant).Database usageTIMEDB provides four pages to show data: Overview,Cancer, Dataset and Sample.OverviewIf users are interested in database summary, they can look through the ''Overview'' page.Click the anatomy icons to query the related datasets.See the visualization.CancerIf users are interested in one cancer type, they can click the details in ''Cancer'' page to query the related datasets.DatasetIf users are interested in specific dataset, they can choose the dataset in ''Dataset'' page to query the dataset.The dataset table show the clinical information, each dataset may contains serveral samples. The basic information of sample includes:sample_name: the name of donor.dataset_name: the name of dataset.race: the race of donor.gender: the gender of donor.age: the age of donor.weight: the weight of donor.height: the height of donor.cancer_name: available for cancer donor, the cancer type classification, e.g. OV, LUSC.tumor_type: available for cancer donor, the detailed cancer type.tumor_subtype: available for cancer donor, the cancer subtype.tumor_grade: available for cancer donor, e.g. GradeI, GradeII.tumor_stage: available for cancer donor, e.g. StageI, StageII.os: available for cancer or diease donor, overall survival, the length of days from either the date of diagnosis or the start of treatment, that a patient still alive.os_status: available for cancer donor, the os outcome, binary, value of 1 for death, 0 for alive.pfs: available for cancer or diease donor, progression-free survival, the length of days during and after the treatment, that a patient lives with the disease but it does not get worse.pfs_status: available for cancer donor, the pfs outcome, binary, value of 1 for pregression or recurrence, 0 for otherwise.The dataset visulization has two parts:C1_C6 subtyping overview: visualization about immune subtype of tumor samples.TIME estimation overview: visualization about TIME estimation.SampleIf users are interested in specific sample, they can choose the sample in sample a page to see the sample information.In this sample visulization, users could click the button to change the TIME estimation method.The visualizations we provide are interactive:change the color.change the text size.rotate the label.and multiple online adjustments options, contains but not all listed.Citation[1] Vésteinn Thorsson, David L Gibbs, Scott D Brown, Denise Wolf, Dante S Bortone, TaiHsien Ou Yang, Eduard Porta-Pardo, Galen F Gao, Christopher L Plaisier, James A Eddy,et al. The immune landscape of cancer. Immunity, 51(2):411–412, 2019.[2] Gianni Monaco, Bernett Lee, Weili Xu, Seri Mustafah, You Yi Hwang, Christophe Carré,Nicolas Burdin, Lucian Visan, Michele Ceccarelli, Michael Poidinger, et al. Rna-seq signatures normalized by mrna abundance allow absolute deconvolution of human immune cell types. Cell reports, 26(6):1627–1640, 2019.[3] Aaron M Newman, Chih Long Liu, Michael R Green, Andrew J Gentles, Weiguo Feng, Yue Xu, Chuong D Hoang, Maximilian Diehn, and Ash A Alizadeh. Robust enumeration of cell subsets from tissue expression profiles. Nature methods, 12(5):453–457, 2015.[4] A. M. Newman, C. B. Steen, C. L. Liu, A. J. Gentles, A. A. Chaudhuri, F. Scherer, M. S. Khodadoust, M. S. Esfahani, B. A. Luca, and D. Steiner. Determining cell type abundance and expression from bulk tissues with digital cytometry. Nature biotechnology, 37(7):773, 2019.[5] J. Racle, Kaat De Jonge, P. Baumgaertner, D. E. Speiser, and D. Gfeller. Simultaneous enumeration of cancer and immune cell types from bulk tumor gene expression data. eLife,6,(2017-11-10), 6, 2017.[6] Ya Ru Miao, Qiong Zhang, Qian Lei, Mei Luo, and An Yuan Guo. Immucellai: a unique method for comprehensive t-cell subsets abundance prediction and its application in cancer immunotherapy. 2019.[7] Becht E, Giraldo NA, Lacroix L, Buttard B, Elarouci N, Petitprez F, Selves J, Laurent-Puig P, Sautès-Fridman C, Fridman WH, de Reyniès A. Estimating the population abundance of tissue-infiltrating immune and stromal cell populations using gene expression. Genome Biol. 2016 Oct 20;17(1):218.[8] Alejandro Jiménez-Sánchez, Oliver Cast, and Martin L Miller. Comprehensive benchmarking and integration of tumor microenvironment cell estimation methods. Cancer Research, 79(24):6238–6246, 2019.[9] T. Li, J. Fan, B. Wang, N. Traugh, Q. Chen, J. S. Liu, B. Li, and X. S. Liu. Timer: A web server for comprehensive analysis of tumor-infiltrating immune cells. Cancer Research, 77(21):e108, 2017.[10] Francesca Finotello, Clemens Mayer, Christina Plattner, Gerhard Laschober, Dietmar Rieder, Hubert Hackl, Anne Krogsdam, Zuzana Loncova, Wilfried Posch, Doris Wilflingseder, et al. Molecular and pharmacological modulators of the tumor immune contexture revealed by deconvolution of rna-seq data. Genome medicine, 11(1):1–20, 2019.[11] D. Aran, Z. Hu, and A. J. Butte. xcell: digitally portraying the tissue cellular heterogeneity landscape. Genome Biology, 18(1):220, 2017.[12] David L Gibbs. Robust classification of immune subtypes in cancer. bioRxiv, 2020.[13] James A Eddy, Vésteinn Thorsson, Andrew E Lamb, David L Gibbs, Carolina Heimann, Jia Xin Yu, Verena Chung, Yooree Chae, Kristen Dang, Benjamin G Vincent, et al. Criiatlas: an interactive portal for immuno-oncology research. F1000Research, 9, 2020."
            }
            var doc2 = {
                "id": 2,
                "title": "How to View Database Information",
                "body": "Database InformationWe have 43 Type, 545 Projects, 39678 Samples.Detail InformationYou can view the detail information and the data visualization for each cancer type, project or sample.Let's take Project as an example:Click Filter to select information and Click Details to view Project's samples and charts."
            }

            var doc4 = {
                "id": 3,
                "title": "How to Download Database Data",
                "body": "Download data from Download Page The Download page contains the relative files of all projects.Download the data from the dataset Download data from projects Download data from samples?"
            }
            var doc6 = {
                "id": 4,
                "title": "Visualizations in the Database, vis,viz",
                "body": "We provide several visualizations for the whole databse overview, including, bar charts for datasets and samples statistics, pie charts for cell composition estimation of each dataset and each state-of-art tool, C1-C6 landscape for subtyping data, and heatmaps for scaled gene expression profiles. Visualizations in dataset detailed pages fall into two categories, C1-C6 subtyping vizs and cell fraction plots. C1_C6 subtyping overview : visualization about immune subtype of tumor samples. For each samples, we provid pie plots for TIC composition estimated from 10 state-of-art tools. Users can use selector to change different estimation results for horizontal comparisons. All visualizations we provided are allowed to download. Users can click the button next to plot itself to easily download the corresponding visualizations. Specifically for individual dataset showing pages, user can download all visualizations together for futhur exploration."
            }

            var doc7 = {
                "id": 21,
                "title": "Analysis Introduction",
                "body": "Welcome to TIMEDB Analysis TIMEDB provides 18 online tumor immune microenvironment analyses,details are shown in the following table:Analysis Category	Analysis Regression Tools.TIMEDB Decov CIBERSORT TIMEDB Decov TIMER TIMEDB Decov EPIC TIMEDB Decov ABIS TIMEDB Decov quanTIseq Enrichment Tools. TIMEDB Decov xCell TIMEDB Decov MCPcounter TIMEDB Decov ConsensusTME Unsupervised Tools TIMEDB Decov Linseed Consensus Tools TIMEDB Consensus array TIMEDB Consensus RNA-Seq Datasets Comparison	TIMEDB Batch Effect TIME Estimation Comparsion	TIMEDB Comparison array TIMEDB Comparison RNA-Seq Patient Subtyping	TIMEDB Cell Fraction Subtyping TIMEDB C1-C6 Subtyping Survival Analysis	TIMEDB HR OR TIMEDB KM Estimator Colrrelation Analysis	TIMEDB Cell Interaction TIMEDB Cell Correlation Different Expression	TIMEDB Immunoregulator Analysis submit and check TIMEDB provides a friendly submission page that guides users through analysis step by step.Users could view analysis detailed tutorial, run demo and view demo results with one click.During the submission process, the file format and parameters are explained in detail.For results, TIMEDB provides results downloads, as well as interactive visualization.Contact with us if you meet some problemsYou may contact us:Dr LI, ShuaichengEmail: shuaicli@cityu.edu.hk"
            }
            var doc8 = {
                "id": 22,
                "title": "How to Complete an Analysis",
                "body": "Analysis steps TIMEDB analyses are used in much the same way.Step one: choose the analysis.In TIMEDB, Regression tools include ABIS, quanTIseq, CIBERSORT and other analyses. Users can select the analysis according to the number of datasets they upload and the analysis method.Step 2 (optional): read the analysis helper, run the demo file.After selecting one analysis, the user entering for the first time will directly see the analysis helper, where the file format and parameters will be explained in detail.In each anlaysis, TIMEDB provides a RUN DEMO button. Users can run the demo task with one just click.Step three: upload the fileUsers can prepare their own files or select their own DataSets directly from the workspace for uploading. (how to add datasets in workspace)Users can check the file format and download the demo file in upload page.In the document submission section, all submitted file should be CSV format.Step four: set parametersUsers can fill the desired analysis paramters guided by detailed paramter explaination.Step five: submit and view the resultsAfter the task is submitted, the user gets a task id, which is automatically added to the user's workspace.In the workspace section, you can view the status of task. There are three task status: running, finished, and failed, which respectively indicate that the task is in progress, the task is completed and the task is failed. Click check to view the task results and interactive visualization."
            }
            var doc9 = {
                "id": 23,
                "title": "What Analysis We Have",
                "body": "TIMEDB Deconv ABIS TIMEDB Deconv xCell TIMEDB Deconv ConsensusTME TIMEDB Deconv MCPcounter TIMEDB Batch Effect TIMEDB Deconv quanTIseq TIMEDB Immunoregulator TIMEDB Deconv TIMER TIMEDB HR OR TIMEDB Deconv EPIC TIMEDB Deconv CIBERSORT TIMEDB C1-C6 TIMEDB Deconv LinSeed TIMEDB Cell Fraction Subtyping TIMEDB Cell Correlation TIMEDB Cell Interaction TIMEDB KM Estimator TIMEDB Consensus Array TIMEDB Consensus RNA-Seq"
            }
            var doc10 = {
                "id": 24,
                "title": "How to Ask Us for Help",
                "body": "Team Based in City University of Hong Kong, led by Dr. Shuaicheng LI, we are a multidisciplinary group of top-ranking and aspiring undergraduates, research assistants and Ph.D. students working tirelessly to bring you a brand-new experience in bioinformatics research that frees you from all the chores and empowers your journey of discovery.Dr. LI Shuaicheng.Supervisor.Contact Us.Dr LI, Shuaicheng.Tat Chee Avenue, Kowloon, Hong Kong.Email: shuaicli@cityu.edu.hk.About Us.Creating An Integrated Cloud-based System for Bioinformatics Visualization is our passion.Privacy Policy."
            }
            this.index.addDoc(doc1);
            this.index.addDoc(doc2);
            // this.index.addDoc(doc3);
            this.index.addDoc(doc4);
            // this.index.addDoc(doc5);
            this.index.addDoc(doc6);
            this.index.addDoc(doc7);
            this.index.addDoc(doc8);
            this.index.addDoc(doc9);
            this.index.addDoc(doc10);
        },
        search(){
            this.found = false;
            this.results = [];
            this.results2 = [];
            this.results3= [];
            console.log(this.search_value);
            // for (var i=0; i<this.articles.length;i++){
            //     for(var j =0; j<this.articles[i].key.length;j++){
            //         var str = this.articles[i].key[j];
            //         if(str.indexOf(this.search_value) !=-1 && this.search_value!=''){
            //             this.results.push(this.articles[i]);
            //         }
            //     }
            // }
            // for (var i=0; i<this.articles2.length;i++){
            //     for(var j =0; j<this.articles2[i].key.length;j++){
            //         var str = this.articles2[i].key[j];
            //         if(str.indexOf(this.search_value) !=-1 && this.search_value!=''){
            //             this.results2.push(this.articles2[i]);
            //         }
            //     }
            // }
            // for (var i=0; i<this.articles3.length;i++){
            //     for(var j =0; j<this.articles3[i].key.length;j++){
            //         var str = this.articles3[i].key[j];
            //         if(str.indexOf(this.search_value) !=-1 && this.search_value!=''){
            //             this.results3.push(this.articles3[i]);
            //         }
            //     }
            // }
            this.found = true;
            var temp=this.index.search(this.search_value,{expand:true});
            console.log(temp)

            for(var i=0;i<this.articles.length;i++){
                for (var j=0;j<temp.length;j++){
                    if(this.articles[i].id  == temp[j].ref && temp[j].score >= this.filter){
                        this.results.push(this.articles[i]);
                        break;
                    }
                }

            }

            for(var i=0;i<this.articles2.length;i++){
                for (var j=0;j<temp.length;j++){
                    if(parseInt(this.articles2[i].id)+20  == temp[j].ref && temp[j].score >= this.filter){
                        this.results2.push(this.articles2[i]);
                        break;
                    }
                }

            }
            for(var i=0;i<this.articles3.length;i++){
                for (var j=0;j<temp.length;j++){
                    if(parseInt(this.articles3[i].id) +20 == temp[j].ref && temp[j].score >= this.filter){
                        this.results3.push(this.articles3[i]);
                        break;
                    }
                }

            }
        },
        backsearch(){
            this.found = false;
        },

    }
}
</script>

<style scoped lang = "scss">

.title{
    font-size: 5rem;
    color: #314893;
    font-weight: bold;
}
.title-search{
    font-size: 3.5rem;
    color: #314893;
    font-weight: bold;
}

.fa-caret-left{
    &:hover{
        color: #1e6fff
    }
}
.tutorial{
    .test{
        position:relative;
        background-color: #F8F9FA;
        width: 70%;
        margin-left: 30%;
    }
    .test input{
        width:100%;
        z-index: 999;
    }
    .test button{
        position: absolute;
        width: 18%;
        height: 100%;
        right: 0%;
        border-color: #6c757d;
        border-radius: 30px ;
        outline:none;
        background-color: #F8F9FA;
    }

    .search{
        border: solid;
        border-color: #6c757d;
        border-radius: 30px ;
        padding: 2%;
        width: 100%;
        color: #6c757d;
        position: absoulte;
        left:0;
    }
    .fa-search{
            color: #6c757d;
            position: absolute;
            right: 10%;
            bottom: 25%;
        }
        
    .fa-chevron-down{
        color: #314893;
    }


    .tutorial-items{
        border: solid;
        border-color: #1cb0b6 ;
        border-radius: 30px ;
        margin: 10px;
        // height:5%;
        padding-top: 2.5%;
        padding-bottom: 2.5%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1cb0b6 ;
        color: #fff;
        &:hover{
            background-color: #fff;
            color: #333;
        }

    }

    .tutorial-items-red{
        border: solid;
        border-color: #cc4f78;
        border-radius: 30px ;
        margin: 10px;
        padding-top: 2.5%;
        padding-bottom: 2.5%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #cc4f78;
        color: #fff;
        &:hover{
            background-color: #fff;
            color: #333;
        }

    }
        .tutorial-items-3{
        border: solid;
        border-color: #314893;
        border-radius: 30px ;
        margin: 10px;
        padding-top: 2.5%;
        padding-bottom: 2.5%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #314893;
        color: #fff;
        &:hover{
            background-color: #fff;
            color: #333;
        }

    }
    .browser{
        padding: 0;
        border: 2px !important;
    }
    .col-md-4 {
        .tutorial-items-3{
            padding-bottom: 5% !important;
            padding-top: 5% !important;
        }
    }

}
.page{
    display: flex;
    // align-items: center;
    flex-direction: column;
}
.page-image{
    width: 90%;

}
.sidebar{
    text-align: center;
    padding-left: 0;
    position: sticky;
    width: 16.67%;
    height: 20%;
    top: 15%;
    li{

        background-color: #314893;
        color:#fff;
        padding-top:2.5%;
        padding-bottom: 2.5%;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        &:hover{
            background-color: #1e6fff;
        }
        p{
            margin: 0;   
        }
        height: 70px;
        justify-content: center;
        display: flex;
        align-items: center;
    }
}
.headers{
    li{
        font-size: 20px;
    }
    p{
        font-size: 20px
    }
    b{
        color: #00008b
    }
}
.focus{
    border: 3px solid #00008b;
    border-radius: 10px;
    padding: 1%;
}
img{
    background-color: transparent !important;
    margin-bottom: 2%;
}
.team-member-container{
    position: relative;
    flex-basis: 50%;
    min-width: 430px;
    padding: 1.75rem 2rem;
    &:hover{
        .team-member{
            transform: translate(0,-20px);
        }
        .team-member-links{
            transform: translate(0,20px);
        }
    }
}
.team-member-links{
    position: absolute;
    transition: all .2s ease-in;
    height: 56px;
    bottom: 1.25rem;
    left: 2rem;
    right: 2rem;
    padding-top: 6px;
    background: linear-gradient(120deg,#9c4cf0,#7512dd 85%);
    border-radius: 0 0 4px 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    a{
        color: #fff;
    }
}
.team-member{
    position: relative;
    transition: all .2s ease-in;
    border-radius: 4px;
    border: 1px solid #2a2a2a;
    padding: 2.5rem;
    height: 100%;
    background: linear-gradient(120deg,#212529,#101214);
    box-shadow: 0 0 16px #2a2a2a;
    display: flex;
    align-items: center;
    .avatar{
        width: 112px;
        flex-basis: 112px;
        flex-shrink: 0;
        height: 112px;
        border: 1px solid #333;
        border-radius: 57px;
        margin: 0 15px;
        box-shadow: 0 0 4px #000;
    }
    .intro{
        text-align: left;
        padding-left: 1em;
        color: #adb5bd
    }
}
</style>
