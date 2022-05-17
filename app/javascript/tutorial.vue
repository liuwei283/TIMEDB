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
                    <div class= "search  text-left">
                        <i class="fa fa-search"></i>
                        Type here to search
                    </div>
                </div>

                <div class="col-md-4 offset-1">
                    <!-- <%= image_tag src="icons brightmode12.png", class: "d-block w-100"%> -->
                    <img src="/assets/icons brightmode12.png" class="d-block w-100">
                </div>
            </div>

            <i class="fa fa-chevron-down fa-3x"></i>

            <div class="row">
                <div class="col-md-4 text-center">
                    <!-- <%=image_tag src="icons brightmode12.png" ,class:  "d-block w-100"%> -->
                    <img src="/assets/icons brightmode12.png" class="d-block w-100">
                </div>
                <div class="col-md-8 text-center">
                    <br><br>
                    <div class="row">
                        <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="intro">
                               introduction
                        </div>

                        <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="1">
                                How to view Database Information1
                        </div>


                    </div>
                    <div class="row">
                        <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="2">
                                How to view Database Information2
                        </div>

                        <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="3">
                                How to view Database Information3
                        </div>

                    </div>
                    <div class="row">
                        <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="4">
                                How to view Database Information4
                        </div>

                        <div @click="showdetail($event)" class="col-md-5 tutorial-items text-center" id="5">
                                How to view Database Information5
                        </div>

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
                    <img src="/assets/icons brightmode42.png" class="d-block w-100">
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
                now: "intro"
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
        }
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
    .search{
        border: solid;
        border-color: #6c757d;
        border-radius: 30px ;
        padding: 2%;
        color: #6c757d;
        .fa {
            color: #6c757d;
        }
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
