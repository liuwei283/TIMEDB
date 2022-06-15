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
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>many datas</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/1ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 2</h1>
                                    <h2>many graphs</h2>
                                </div>
                                <br>
                                <img v-bind:src="require('../assets/images/2ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 3</h1>
                                    <h2>projects</h2>
                                </div>
                                <br>
                                <img v-bind:src="require('../assets/images/3ppt.png')" class="page-image">
                            </div>
                            <br><br>                           
                            <div>
                                <div class="overhead">
                                    <h1>this is header 4</h1>
                                    <h2>sample</h2>
                                </div>
                                <br>
                                <img v-bind:src="require('../assets/images/4ppt.png')" class="page-image">
                            </div>
                            <br><br>

                        </div>





                    </div><div v-else-if="this.now =='1'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to View Database Information
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/2-1ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 2</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br><br>
                                <img v-bind:src="require('../assets/images/2-2ppt.png')" class="page-image">
                            </div>
                            <br><br>

                        </div>
                    </div><div v-else-if="this.now =='2'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to add TIMEDB database data to your workspace
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/3-1ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 2</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br><br>
                                <img v-bind:src="require('../assets/images/3-2ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 3</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br><br>
                                <img v-bind:src="require('../assets/images/3-3ppt.png')" class="page-image">
                            </div>
                            <br><br>

                        </div>
                    </div><div v-else-if="this.now =='3'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to Download Database Data
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/4-1ppt.png')" class="page-image">
                            </div>
                            <br><br>

                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/8.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/9.png')" class="page-image">
                            </div>
                            <br><br>

                    </div>      
                    </div><div v-else-if="this.now =='4'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to view the  visualization plots of project and sample
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/5-1ppt.png')" class="page-image">
                                <img v-bind:src="require('../assets/images/5-2ppt.png')" class="page-image">

                            </div>
                            <br><br>                           
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/5-3ppt.png')" class="page-image">
                                <img v-bind:src="require('../assets/images/5-4ppt.png')" class="page-image">

                            </div>
                            <br><br>
                        </div> 
                    </div><div v-else-if="this.now =='5'">
                        <h1>
                            <i class="fa fa-caret-left" @click="back"></i> How to download the visualization plots
                        </h1><br>
                        <div class="page">


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
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>many datas</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/a1-1ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 2</h1>
                                    <h2>many graphs</h2>
                                </div>
                                <br>
                                <img v-bind:src="require('../assets/images/a1-2ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 3</h1>
                                    <h2>projects</h2>
                                </div>
                                <br>
                                <img v-bind:src="require('../assets/images/a1-3ppt.png')" class="page-image">
                            </div>
                            <br><br>                           

                        </div>
                    </div><div v-else-if="this.now =='1'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to start an analysis
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/a2-1ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 2</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br><br>
                                <img v-bind:src="require('../assets/images/a2-2ppt.png')" class="page-image">
                            </div>
                            <br><br>

                        </div>
                    </div><div v-else-if="this.now =='2'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to view Analysis Results
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/a3-1ppt.png')" class="page-image">
                            </div>
                            <br><br>
                            <div>
                                <div class="overhead">
                                    <h1>this is header 2</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br><br>
                                <img v-bind:src="require('../assets/images/a3-2ppt.png')" class="page-image">
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
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/4-1ppt.png')" class="page-image">
                            </div>
                            <br><br>


                    </div>      
                    </div><div v-else-if="this.now =='4'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to ask us for help
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/5-1ppt.png')" class="page-image">
                                <img v-bind:src="require('../assets/images/5-2ppt.png')" class="page-image">

                            </div>
                            <br><br>                           
                            <div>
                                <div class="overhead">
                                    <h1>this is header 1</h1>
                                    <h2>ababababa</h2>
                                </div>
                                <br><br>
                                <img v-bind:src="require('../assets/images/5-3ppt.png')" class="page-image">
                                <img v-bind:src="require('../assets/images/5-4ppt.png')" class="page-image">

                            </div>
                            <br><br>
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
</style>
