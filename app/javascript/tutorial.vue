<template>
    <div>
        <link rel="stylesheet" type="text/css" href="chrome-extension://ckkdlimhmcjmikdlpkmbgfkaikojcbjk/themes/github.css" id="_theme">
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
                <hr>
                <div class="row">
                    <div class="col-md-4 text-center">
                        <!-- <%=image_tag src="icons brightmode12.png" ,class:  "d-block w-100"%> -->
                        <img v-bind:src="require('../assets/images/database1.png')" class="d-block w-100">

                    </div>
                    <div class="col-md-8 text-center">
                        <br><br>
                        <h2 style="color: #1cb0b6 ">Database Tutorial</h2>

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
                        <h2 style="color: #cc4f78">Analysis Tutorial</h2>
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
                    <div class="col-md-7 text-center browser">
                        <div class=" ">
                        <h2>Browser Compatibility</h2>
                        <table class="table table-bordered">
                            <tr>
                                <td> </td> <td>Firefox</td> <td>Chrome</td> <td>Safari</td> <td>Edge</td>
                            </tr>
                            <tr>
                                <td>Linux</td> <td>√ </td> <td> √</td> <td> -</td> <td> - </td>
                            </tr>
                            <tr>
                                <td>Macos</td> <td> √</td> <td>√</td> <td>√ </td> <td>√ </td>
                            </tr>
                            <tr>
                                <td>Windows</td> <td>√ </td> <td> √</td> <td>- </td> <td>√ </td>
                            </tr>
                        </table>
                        <p>Browser compatibility of TIMEDB, √ for pass and - for not applicable</p>
                        </div>
                    </div>
                    <div class="col-md-4 offset-1 text-center">
                        <br><br>
                        <h2 style="color: #314893">Help</h2>

                            <div v-for="a in articles3" :id="a.id" @click="showdetail2($event)" class="tutorial-items-3 text-center" :key="a.id">
                            <b>{{a.title}}</b>
                            
                            </div>
                    </div>

                </div>

                <br><br>
            </div>
            <div v-if="this.found == true">
                <h1 class="title" style="text-align: left;"><i class="fa fa-caret-left" @click="backsearch"></i>There are the search results</h1>

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
                <div class="row" style="margin-left:15%">

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
                    {title:"Introduction", id:"1",key:["database","intro"]},
                    {title:"How to View Database Information", id:"2",key:["database","information","data"]},
                    {title:"How to Add Data to Your Workspace", id:"3",key:["database","workspace","dataset","data"]},
                    {title:"How to Download Database Data", id:"4",key:["database","download","data"]},
                    {title:"How to View the  Visualizations", id:"5",key:["database","visualization"]},
                    {title:"How to Download the Visualizations", id:"6",key:["database","visualization","download"]},
                ],
                articles2:[
                    {title:"Introduction", id:"1",key:["anaylsis","intro"]},
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
            }
    },
    created() {
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

        search(){
            this.found = false;
            this.results = [];
            this.results2 = [];
            this.results3= [];
            this.search_value = this.search_value.toLowerCase();
            console.log(this.search_value);

            for (var i=0; i<this.articles.length;i++){
                for(var j =0; j<this.articles[i].key.length;j++){
                    var str = this.articles[i].key[j];
                    if((str.indexOf(this.search_value) !=-1 || this.search_value.indexOf(str)!=-1)&& this.search_value!=''){
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
            for (var i=0; i<this.articles3.length;i++){
                for(var j =0; j<this.articles3[i].key.length;j++){
                    var str = this.articles3[i].key[j];
                    if(str.indexOf(this.search_value) !=-1 && this.search_value!=''){
                        this.results3.push(this.articles3[i]);
                    }
                }
            }
            this.found = true;
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
