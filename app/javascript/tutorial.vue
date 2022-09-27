<template>
    <div>
        <div class="container text-center tutorial" v-if="this.details == false">
            <br>
            
            <div class="row">
                <div class="col-md-7 text-right" style="margin-top: auto;margin-bottom: auto; padding-right: 50px;">
                    <h1 class="title">Documentation</h1>
                    <p>Welcome to TIMEDB tutorial <br>
                    Search for in-depth articles on TIMEDB functions</p>
                    <br>
                    <div class="test">
                        <input type="text" class="search" placeholder='Enter letters or words, such as "v" or "visualization"' v-model="search_value">
                        <button @click="search"><i class="fa fa-search"></i></button>
                    </div>
                </div>

                <div class="col-md-5">
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
                            <div v-for="a in articles" :id="a.id" @click="showdetail($event)" class="col-md-5 tutorial-items text-center" :key="`${a.id}1`">
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
                            <div v-for="a in articles2" :id="a.id" @click="showdetail2($event)" class="col-md-5 tutorial-items-red text-center" :key="`${a.id}2`">
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

                            <div v-for="a in articles3" :id="a.id" @click="showdetail2($event)" class="tutorial-items-3 text-center" :key="`${a.id}3`">
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

                <div v-if="results.length + results2.length + results3.length !=0" style="margin-botton:15%">
                    <h1 class="title-sub" style="text-align: left;margin-left: 5%;"><i class="fa fa-caret-left" @click="backsearch"></i>The following tutorial title contains the letters you searched for</h1>

                    <div class="row" style="margin-left:15%">
                        <div v-for="a in results" :id="a.id" @click="showdetail($event)" class="col-md-5 tutorial-items text-center" :key="a.id" v-html="highlight(a.title)">
                        </div>
                        <div v-for="a in results2" :id="a.id" @click="showdetail2($event)" class="col-md-5 tutorial-items-red text-center" :key="a.id"  v-html="highlight(a.title)">
                        </div>
                        <div v-for="a in results3" :id="a.id" @click="showdetail2($event)" class="col-md-5 tutorial-items-3 text-center" :key="a.id"  v-html="highlight(a.title)">
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h1 class="title-sub" style="text-align: left;margin-left: 5%;"><i class="fa fa-caret-left" @click="backsearch"></i>Sorry, no tutorial title contains the letters you searched for</h1>

                </div>
                <div class="row" style="margin-left:15%">

                </div>
                <br><br>
            </div>
        </div>
        <!-- <span style="background-color:#FFFF00"
   onMouseOver="this.style.color='#fff'"
   onMouseOut="this.style.color='#333'" >Text</span> -->

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
                    {title:"Database Introduction", id:"1",key:["database","introduction"]},
                    {title:"How to View Database Information", id:"2",key:["how","to","view","database","information"]},
                    {title:"How to Download Database Data", id:"3",key:["how","to","Download","database","Data"]},
                    {title:"Visualizations in the Database", id:"4",key:["visualizations","in","Database","the",]},
                ],
                articles2:[
                    {title:"Analysis Introduction", id:"1",key:["anaylsis","introduction"]},
                    {title:"How to Complete an Analysis", id:"2",key:["how","to","an","Complete","Analysis"]},
                    {title:"What Analysis We Have", id:"3",key:["analysis","we","have","what"]},

                ],
                articles3:[
                    {title:"How to Ask Us for Help", id:"4",key:["how","to","ask","us","for","help"]},
                ],
                results:[],
                results2:[],
                results3:[],
                search_value: "",
                search_value_down_case: "",
                found: false,

            }
    },
    created() {
    },
    mounted() {
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
            this.search_value_down_case  = this.search_value.toLowerCase();

            console.log(this.search_value_down_case);
            for (var i=0; i<this.articles.length;i++){
                if(this.articles[i].title.toLowerCase().indexOf(this.search_value_down_case)!=-1&&this.search_value_down_case!=""){
                    this.results.push(this.articles[i]);
                    
                }
            }
            for (var i=0; i<this.articles2.length;i++){
                if(this.articles2[i].title.toLowerCase().indexOf(this.search_value_down_case)!=-1&&this.search_value_down_case!=""){
                    this.results2.push(this.articles2[i]);
                    
                }
            }
            for (var i=0; i<this.articles3.length;i++){
                if(this.articles3[i].title.toLowerCase().indexOf(this.search_value_down_case)!=-1&&this.search_value_down_case!=""){
                    this.results3.push(this.articles3[i]);
                    
                }
            }

            this.found = true;

        },
        backsearch(){
            this.found = false;
        },
        highlight(a){
            let index = a.toLowerCase().indexOf(this.search_value_down_case);
            let str = '<b>'

            for(let i=0;i<a.length;i++){
                if(i==index){
                    str+=`<span style="background-color:#FFFF00; color:#9F2B68" > `+a[i];
                }else{
                    str+=a[i];
                }
                if(i==index+this.search_value_down_case.length-1){
                    str+='</span>'
                }
            }

            return str+'</b>'
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
.title-sub{
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
