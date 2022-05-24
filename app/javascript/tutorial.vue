<template>
    <div>
        <div class="container text-center tutorial" v-if="this.details == false">
            <br>
            <div class="row">
                <div class="col-md-6 text-right">
                    <h1>Documentation</h1>
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
                        <img v-bind:src="require('../assets/images/icons brightmode12.png')" class="d-block w-100">

                    </div>
                    <div class="col-md-8 text-center">
                        <br><br>
                        <div class="row">
                            <div v-for="a in articles" :id="a.id" @click="showdetail($event)" class="col-md-5 tutorial-items text-center" :key="a.id">
                            {{a.title}}
                            
                            </div>
                            <!-- <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="intro">
                                introduction
                            </div>
                            <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="1">
                                    How to view Database Information1
                            </div>
                            <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="2">
                                    How to view Database Information2
                            </div>
                            <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="3">
                                    How to view Database Information3
                            </div>
                            <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="4">
                                    How to view Database Information4
                            </div>
                            <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="5">
                                    How to view Database Information5
                            </div> -->
                        </div>
                    </div>


                </div>

                <div class="row">
                    <div class="col-md-8 text-center">
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
                    </div>

                    <div class="col-md-4 text-center">
                        <img v-bind:src="require('../assets/images/icons brightmode42.png')" class="d-block w-100">

                    </div>
                    
                </div>
            </div>
            <div v-if="this.found == true">
                <h1><i class="fa fa-caret-left" @click="backsearch"></i>There are the search results</h1>

                <div class="row" style="margin-left:15%">
                    <div v-for="a in results" :id="a.id" @click="showdetail($event)" class="col-md-5 tutorial-items text-center" :key="a.id">
                        {{a.title}}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="this.details == true">
        <br><br>
            <div class="row">
                
                <div class="col-md-1 sidebar">

                    <ul class="nav flex-column ">
                        <li class="nav-item" @click="showdetail($event)" id ="intro">
                            <p class="nav-link" >introduction</p>
                        </li>
                        <br>
                        <li class="nav-item" @click="showdetail($event)" id="1">
                            <p class="nav-link ">1</p>
                        </li>
                        <br>

                        <li class="nav-item" @click="showdetail($event)" id="2">
                            <p class="nav-link" >2</p>
                        </li>
                        <br>

                        <li class="nav-item" @click="showdetail($event)" id="3">
                            <p class="nav-link" href="#">3</p>
                        </li>
                        <br>
                        <li class="nav-item" @click="showdetail($event)" id="4">
                            <p class="nav-link" >4</p>
                        </li>
                        <br>
                        <li class="nav-item" @click="showdetail($event)" id="5">
                            <p class="nav-link" >5</p>
                        </li>
                    </ul>
                </div>
            
                <div class="col-md-8 offset-1">
                    <h1>
                        <i class="fa fa-caret-left" @click="back"></i>This is the title for {{this.now}}
                    </h1>
                    {{this.now}}

                    <div v-if="this.now == 'intro'">
                    this is the content for introduction <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi 
                    </div><div v-else-if="this.now =='1'">
                    this is the content for 1 <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi 
                    </div><div v-else-if="this.now =='2'">
                    this is the content for 2 <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi 
                    </div><div v-else-if="this.now =='3'">
                    this is the content for 3 <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi 
                    </div><div v-else-if="this.now =='4'">
                    this is the content for 4 <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi 
                    </div><div v-else-if="this.now =='5'">
                    this is the content for 5 <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi <br>
                    wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi  wihadiygwduaiwdghauwdguwadgauwd auwgdyiwgdiuawdgaiwugdaywigdawidgad
                    auwidgawydgwygdbqwjdqodywgyiudhqdi 
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
                details: false,
                now: "intro",
                articles:[
                    {title:"introduction", id:"intro",key:["intro","0"]},
                    {title:"How to view Database Information1", id:"1",key:["database","1"]},
                    {title:"How to view Database Information2", id:"2",key:["database","2"]},
                    {title:"How to view Database Information3", id:"3",key:["database","3"]},
                    {title:"How to view Database Information4", id:"4",key:["database","4"]},
                    {title:"How to view Database Information5", id:"5",key:["database","5"]},
                ],
                results:[],
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
            this.details = true;
            this.now= a.currentTarget.id;
        },
        back(){
            this.details = false;
        },
        search(){
            this.found = false;
            this.results = [];
            console.log(this.search_value);
            for (var i=0; i<this.articles.length;i++){
                for(var j =0; j<this.articles[i].key.length;j++){
                    var str = this.articles[i].key[j];
                    if(str.indexOf(this.search_value) !=-1 && this.search_value!=''){
                        this.results.push(this.articles[i]);
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

h1{
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
        padding-top: 2.5%;
        padding-bottom: 2.5%;
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
        &:hover{
            background-color: #cc4f78;
            color: #fff;
        }

    }

}
.sidebar{
    text-align: center;
    padding-left: 0;
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
    }
}
</style>
