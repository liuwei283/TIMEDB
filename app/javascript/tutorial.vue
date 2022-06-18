<template>
    <div>
        <div class="container text-center tutorial" v-if="this.details == false">
            <br>
            <div class="row">
                <div class="col-md-6 text-right">
                    <h1 class="title">Documentation</h1>
                    <p>Welcome to TIMEBD Tutorial <br>
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

                <div class="row">
                    <div class="col-md-4 text-center">
                        <!-- <%=image_tag src="icons brightmode12.png" ,class:  "d-block w-100"%> -->
                        <img v-bind:src="require('../assets/images/database1.png')" class="d-block w-100">

                    </div>
                    <div class="col-md-8 text-center">
                        <br><br>
                        <div class="row">
                            <div v-for="a in articles" :id="a.id" @click="showdetail($event)" class="col-md-5 tutorial-items text-center" :key="a.id">
                            {{a.title}}
                            
                            </div>
                        </div>
                    </div>


                </div>

                <div class="row">
                    <!-- <div class="col-md-8 text-center">
                        <br><br>
                        <div class="row">
                            <div class="col-md-5 tutorial-items-red text-center">
                                introduction
                            </div>

                            <div class="col-md-5 tutorial-items-red text-center">
                                How to view Database Information
                            </div>

                        </div>

                        <div class="row">

                            <div class="col-md-5 tutorial-items-red text-center">
                                How to view Database Information
                            </div>

                            <div class="col-md-5 tutorial-items-red text-center">
                                How to view Database Information
                            </div>

                            </div>
                            <div class="row">
                            <div class="col-md-5 tutorial-items-red text-center">
                                How to view Database Information
                            </div>

                            <div class="col-md-5 tutorial-items-red text-center">
                                How to view Database Information
                            </div>

                        </div>
                    </div> -->
                    <div class="col-md-8 text-center">
                        <br><br>
                        <div class="row">
                            <div v-for="a in articles2" :id="a.id" @click="showdetail2($event)" class="col-md-5 tutorial-items-red text-center" :key="a.id">
                            {{a.title}}
                            
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 text-center">
                        <img v-bind:src="require('../assets/images/analyses1.png')" class="d-block w-100">

                    </div>
                    
                </div>
            </div>
            <div v-if="this.found == true">
                <h1 class="title"><i class="fa fa-caret-left" @click="backsearch"></i>There are the search results</h1>

                <div class="row" style="margin-left:15%">
                    <div v-for="a in results" :id="a.id" @click="showdetail($event)" class="col-md-5 tutorial-items text-center" :key="a.id">
                        {{a.title}}
                    </div>
                    <div v-for="a in results2" :id="a.id" @click="showdetail2($event)" class="col-md-5 tutorial-items-red text-center" :key="a.id">
                        {{a.title}}
                    </div>
                </div>
                <div class="row" style="margin-left:15%">

                </div>
            </div>
        </div>

        <div v-if="this.details == 1">
            <br><br>
            <div class="row">
                <div class="sidebar">
                        <ul class="nav flex-column ">
                            <li class="nav-item" @click="showdetail($event)" id ="intro">
                                <p class="nav-link" >Introduction</p>
                            </li>
                            <br>
                            <li class="nav-item" @click="showdetail($event)" id="1">
                                <p class="nav-link ">How to View Database Information</p>
                            </li>
                            <br>

                            <li class="nav-item" @click="showdetail($event)" id="2">
                                <p class="nav-link" >How to add data to your workspace</p>
                            </li>
                            <br>

                            <li class="nav-item" @click="showdetail($event)" id="3">
                                <p class="nav-link" href="#"> How to Download Database Data</p>
                            </li>
                            <br>
                            <li class="nav-item" @click="showdetail($event)" id="4">
                                <p class="nav-link" >How to view the  visualization plots</p>
                            </li>
                            <br>
                            <li class="nav-item" @click="showdetail($event)" id="5">
                                <p class="nav-link" > How to download the visualization plots</p>
                            </li>
                        </ul>
                        <br>
                </div>

                <div class="col-md-8 offset-1">

                    <div v-if="this.now == 'intro'">

                        <h1 class ="title">
                            <i class="fa fa-caret-left" @click="back"></i> Database Introduction
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>Welcome to TIMEDB Database</h1>
                                    <p>TIMEDB provides the tumor immune micro-enviornment (TIME) cell proportions from bulk RNA expression profiles of <b>50,000 + samples</b> and <b>500+ projects</b> across <b>43 cancer types</b>. Users can download the following files directly with TIMEDB:
                                    </p>
                                </div>
                                <img src="/public/data/image/tutorial/1ppt.png" class="page-image">
                            </div>
                            <div>
                                <div class="headers">
                                    <h2>Gene expression file and meta file</h2>
                                    <ul>
                                        <li> Gene expression file: The gene expression file stores the bulk gene expression of tumor samples, with sample as column and gene as row.</li>
                                        <li>Clinical file: The clinical file stores the manually curated clinical information of the sample, such as age, gender, etc. Each row is a sample and each column is a clinical feature.</li>
                                        <li>Scaled immmunoregulator expression file: The scaled gene expression profiles of seventy-nine immunoregular genes. [1]</li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <div class="headers">
                                    <h1>Cancers</h1>
                                    <h2>Cancers Details to view the data</h2>
                                </div>
                                <br>
                                <img  src="/public/data/image/tutorial/3ppt.png" class="page-image">
                            </div>
                            <div>
                                <div class="headers">
                                    <h1>Projects</h1>
                                    <h2>Projects Details to view the data and the graphs</h2>
                                </div>
                                <br>
                                <img  src="/public/data/image/tutorial/4ppt.png" class="page-image">
                            </div>
                            <div>
                                <div class="headers">
                                    <h1>Samples</h1>
                                    <h2>Samples Details to view the data and the graphs</h2>
                                </div>
                                <br>
                                <img  src="/public/data/image/tutorial/5ppt.png" class="page-image">
                            </div>
                            <br><br>

                        </div>





                    </div><div v-else-if="this.now =='1'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to View Database Information
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>Database Information</h1>
                                    <h2>We have 43 Cancer Type, 538 Projects, 35817 Samples</h2>
                                </div>
                                <br><br>
                                <img src="/public/data/image/tutorial/2-1ppt.png" class="page-image">
                            </div>
                            <div>
                                <div class="headers">
                                    <h1>Detail Information</h1>
                                    <h2>You can view the detail information and the data visualization for each cancer type, project or samples</h2>
                                </div>
                                <img src="/public/data/image/tutorial/2-2ppt.png" class="page-image">
                            </div>
                            <br><br>

                        </div>
                    </div><div v-else-if="this.now =='2'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to add TIMEDB database data to your workspace
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>You can check your dataset in workspace</h1>
                                </div>
                                <img src="/public/data/image/tutorial/3-1ppt.png" class="page-image">
                            </div>
                            <br>
                            <div>
                                <div class="headers">
                                    <h1>Add samples to your dataset from at the page of your dataset</h1>
                                </div>
                                <img src="/public/data/image/tutorial/3-2ppt.png" class="page-image">
                            </div>
                            <div>
                                <div class="headers">
                                    <h1>Select the samples and add them to a specify dataset</h1>
                                </div>
                                <img src="/public/data/image/tutorial/3-3ppt.png" class="page-image">
                            </div>
                            <br>
                            <div>
                                <div class="headers">
                                    <h1>Also can add samples from a specify project at the project detail page</h1>
                                </div>
                                <img src="/public/data/image/tutorial/3-4ppt.jpg" class="page-image">
                            </div>

                        </div>
                    </div><div v-else-if="this.now =='3'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to Download Database Data
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>Download data from Download Page</h1>
                                </div>
                                <img src="/public/data/image/tutorial/4-0ppt.jpg" class="page-image">
                            </div>
                            <br>
                            <div>
                                <div class="headers">
                                    <h1>Download the data from the dataset</h1>
                                </div>
                                <img src="/public/data/image/tutorial/4-1ppt.jpg" class="page-image">
                            </div>
                            <br>

                            <div>
                                <div class="headers">
                                    <h1>Download data from projects</h1>
                                </div>
                                <img src="/public/data/image/tutorial/9.png" class="page-image">
                            </div>
                            <br>
                            <div>
                                <div class="overhead">
                                    <h1>Download data from samples</h1>
                                </div>
                                <br><br>
                                <img src="/public/data/image/tutorial/4-3ppt.jpg" class="page-image">
                            </div>
                            <br><br>

                        </div>      
                    </div><div v-else-if="this.now =='4'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to view the  visualization plots of project and sample
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>You can view the visualizations plot of each Project</h1>
                                    <h2> Subtype page</h2>
                                </div>
                                <br>
                                <img src="/public/data/image/tutorial/5-1ppt.png" class="page-image">
                                <img src="/public/data/image/tutorial/5-2ppt.png" class="page-image">

                            </div>
                            <br><br>                           
                            <div>
                                <div class="headers">
                                    <h1>Fraction page</h1>
                                </div>
                                <br>
                                <img src="/public/data/image/tutorial/5-3ppt.png" class="page-image">
                                <img src="/public/data/image/tutorial/5-4ppt.png" class="page-image">

                            </div>
                            <br><br>
                        </div> 
                    </div><div v-else-if="this.now =='5'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to download the visualization plots
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>Click the Download all charts button to download all Charts </h1>
                                    <h1>Click the Download button to download chart and relative data files</h1>
                                </div>
                                <br>
                                <img src="/public/data/image/tutorial/6-1ppt.png" class="page-image">

                            </div>
                            <br><br>

                        </div> 
                    </div>
                </div>
            </div>
        </div>
        <div v-if="this.details == 2">
            <br><br>
            <div class="row">
                <div class="sidebar">
                        <ul class="nav flex-column ">
                            <li class="nav-item" @click="showdetail2($event)" id ="intro">
                                <p class="nav-link" >Introduction</p>
                            </li>
                            <br>
                            <li class="nav-item" @click="showdetail2($event)" id="1">
                                <p class="nav-link ">How to start an analysis</p>
                            </li>
                            <br>

                            <li class="nav-item" @click="showdetail2($event)" id="2">
                                <p class="nav-link" >How to view Analysis Results</p>
                            </li>
                            <br>

                            <li class="nav-item" @click="showdetail2($event)" id="3">
                                <p class="nav-link" href="#">How to edit the visualization of results</p>
                            </li>
                            <br>
                            <li class="nav-item" @click="showdetail2($event)" id="4">
                                <p class="nav-link" > How to ask us for help</p>
                            </li>
                        </ul>
                        <br>
                </div>

                <div class="col-md-8 offset-1">
                    <div v-if="this.now == 'intro'">

                        <h1 class ="title">
                            <i class="fa fa-caret-left" @click="back"></i> Analysis Introduction
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>Module</h1>
                                    <h2>We have many Modules for data analysis</h2>
                                </div>
                                <img src="/public/data/image/tutorial/a1-1ppt.png" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>We have detail module helper</h1>
                                </div>
                                <img src="/public/data/image/tutorial/a1-2ppt.png" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>Sumbit page to upload files and set parameter</h1>
                                </div>
                                <br>
                                <img src="/public/data/image/tutorial/a1-3ppt.png" class="page-image">
                            </div>
                            <br><br>                           

                        </div>
                    </div><div v-else-if="this.now =='1'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to start an analysis
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>Select the wanted Module </h1>
                                </div>
                                <br>
                                <img src="/public/data/image/tutorial/a2-1ppt.png" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="headers">
                                    <h1>Upload the file and Set the Parameter</h1>
                                </div>
                                <img src="/public/data/image/tutorial/a2-2ppt.png" class="page-image">
                            </div>
                            <br><br>

                        </div>
                    </div><div v-else-if="this.now =='2'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to view Analysis Results
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers">
                                    <h1>View the Task Query from Workspace</h1>
                                </div>
                                <img src="/public/data/image/tutorial/a3-1ppt.png" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="headers">
                                    <h1>Click Result to view the Task Detail</h1>
                                </div>
                                <img src="/public/data/image/tutorial/a3-2ppt.png" class="page-image">
                            </div>
                            <br><br>

                        </div>
                    </div><div v-else-if="this.now =='3'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to edit the visualization of analysis results
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="overhead">
                                    <h1>Click Visualization to view Chart</h1>
                                    <h2>Using Editor to edit chart</h2>
                                </div>
                                <img src="/public/data/image/tutorial/a4-1ppt.jpg" class="page-image">
                            </div>
                            <br><br>


                    </div>      
                    </div><div v-else-if="this.now =='4'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to ask us for help
                        </h1><br>
                        <div class="page">

                        </div> 
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
                details: 0,
                now: "intro",
                articles:[
                    {title:"Introduction", id:"intro",key:["intro","0"]},
                    {title:"How to View Database Information", id:"1",key:["database","1"]},
                    {title:"How to add data to your workspace", id:"2",key:["database","2"]},
                    {title:"How to Download Database Data", id:"3",key:["database","3"]},
                    {title:"How to view the  visualization plots", id:"4",key:["database","4"]},
                    {title:"How to download the visualization plots", id:"5",key:["database","5"]},
                ],
                articles2:[
                    {title:"Introduction", id:"intro",key:["intro","0"]},
                    {title:"How to start an analysis", id:"1",key:["database","1"]},
                    {title:"How to view Analysis Results", id:"2",key:["database","2"]},
                    {title:"How to edit the visualization of results", id:"3",key:["database","3"]},
                    {title:"How to ask us for help", id:"4",key:["database","4"]},
                    // {title:"ou shu xian de hao kan ()", id:"5",key:["database","5"]},
                ],
                results:[],
                results2:[],
                search_value: null,
                found: false,
            }
    },
    created() {
    },
    mounted() {
        //this.all_viz();
    },
    methods: {
        showdetail(a){
            this.details = 1;
            this.now= a.currentTarget.id;
            this.gotop();
        },
        showdetail2(a){
            this.details = 2;
            this.now= a.currentTarget.id;
            this.gotop();
        },
        back(){
            this.details = 0;
        },
        search(){
            this.found = false;
            this.results = [];
            this.results2 = [];
            console.log(this.search_value);
            for (var i=0; i<this.articles.length;i++){
                for(var j =0; j<this.articles[i].key.length;j++){
                    var str = this.articles[i].key[j];
                    if(str.indexOf(this.search_value) !=-1 && this.search_value!=''){
                        this.results.push(this.articles[i]);
                    }
                }
            }
            for (var i=0; i<this.articles2.length;i++){
                for(var j =0; j<this.articles2[i].key.length;j++){
                    var str = this.articles2[i].key[j];
                    if(str.indexOf(this.search_value) !=-1 && this.search_value!=''){
                        this.results2.push(this.articles2[i]);
                    }
                }
            }

            this.found = true;
        },
        backsearch(){
            this.found = false;
        },
        gotop(){
            $('html,body').animate({scrollTop:'0px'},'fast');
        }
    }
}
</script>

<style scoped lang = "scss">

.title{
    font-size: 5rem;
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
        border-color: #314893;
        border-radius: 30px ;
        margin: 10px;
        // height:5%;
        padding-top: 2.5%;
        padding-bottom: 2.5%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        &:hover{
            background-color: #314893;
            color: #fff;
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
        color: #333;
        &:hover{
            background-color: #cc4f78;
            color: #fff;
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
.overhead{
    position: absolute ;
    color:#cc4f78;
    z-index: 9;
}
.headers{
    color:#cc4f78;
    p{
        font-size: 20px
    }
    b{
        color: #00008b
    }
}
</style>
