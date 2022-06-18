<template>
    <div>
        <link rel="stylesheet" type="text/css" href="chrome-extension://ckkdlimhmcjmikdlpkmbgfkaikojcbjk/themes/github.css" id="_theme"></link>
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
                                    <p>TIMEDB provides the tumor immune micro-enviornment (TIME) cell proportions from bulk RNA expression profiles of <b>35,000 + samples</b> and <b>500+ projects</b> across <b>43 cancer types</b>. Users can download the following files directly with TIMEDB:
                                    </p>
                                </div>
                                <img src="/public/data/image/tutorial/1ppt.png" class="page-image">
                            </div>
                            <div>
                                <div class="headers markdown-body">
                                    <h2>Gene expression file and meta file</h2>
                                    <ul>
                                        <li><code>Gene expression file</code>: The gene expression file stores the bulk gene expression of tumor samples, with sample as column and gene as row.</li>
                                        <li><code>Clinical file</code>: The clinical file stores the manually curated clinical information of the sample, such as age, gender, etc. Each row is a sample and each column is a clinical feature.</li>
                                        <li><code>Scaled immmunoregulator expression file</code>: The scaled gene expression profiles of seventy-nine immunoregular genes. <sup>[1]</sup></li>
                                    </ul>
                                    <h2>TIME cell estimation result file</h2>
                                    <p>TIMEDB uses <strong>ABIS, CIBERSORT, CIBERSORTX, ConsensusTME, EPIC, ImmucellAI, Mcpcounter, quanTIseq and TIMER</strong> to quantify the cells in tumor microenvironment.  Users can download the following TIME estimation results. </p>
                                    <ul>
                                        <li><code>ABIS estimation result file</code>: TIME estimation result from ABIS. <sup>[2]</sup></li>
                                        <li><code>CIBERSORT estimation result file</code>: TIME estimation result from CIBERSORT. <sup>[3]</sup></li>
                                        <li><code>CIBERSORTx estimation result file</code>: TIME estimation result from online website <a href="https://cibersortx.stanford.edu/index.php">CIBERSORTx</a>. <sup>[4]</sup></li>
                                        <li> <code>EPIC estimation result file</code>: TIME estimation result from EPIC. (Applicable only for RNA-Seq count data.) <sup>[5]</sup></li>
                                        <li> <code>ImmuCellAI estimation result file</code>: TIME estimation result from online website <a href="http://bioinfo.life.hust.edu.cn/ImmuCellAI#!/">ImmuCellAI</a>. <sup>[6]</sup> </li>
                                        <li> <code>Mcpcounter estimation result file</code>: TIME estimation result from Mcpcounter. <sup>[7]</sup> </li>
                                        <li> <code>ConsensusTME estimation result file</code>: TIME estimation result from ConsensusTME. (Applicable only for 32 TCGA cancer types.) <sup>[8]</sup> </li>
                                        <li> <code>TIMER estimation result file</code>: TIME estimation result from ConsensusTME. (Applicable only for 32 TCGA cancer types.)  <sup>[9]</sup> </li>
                                        <li> <code>quanTIseq estimation result file</code>: TIME estimation result from quanTIseq. <sup>[10]</sup> </li>
                                        <li> <code>xCell estimation result file</code>: TIME estimation result from xCell. <sup>[11]</sup> </li>
                                        <li> <code>TIME Consensus estimation result file</code>: This file stores the TIME estimation result of common cell types occured one than once from nine estimation tools.(<a href="public/data/consensus_mapping.csv">download the cell mapping file</a>) <sup>[2-11]</sup> </li>
                                        <li> <code>TIME All estimation result file</code>: This file stores the TIME estimation result of all cell types from nine estimation tools. <sup>[2-11]</sup> </li>
                                    </ul>
                                    <h2>C1-C6 subtyping result file</h2>
                                        <p>TIMEDB adopts <strong>ImmuneSubtypeClassifier</strong> <sup>[12, 13]</sup>  to catelogue the immune subtype of tumor samples based on gene expression levels. Users can download the result file which shows the probability of sample being six immune status, including C1 (wound healing), C2 (IFN-γ dominant),C3 (inflammatory), C4 (lymphocyte depleted), C5 (immuno-logically quiet), and C6 (TGF-β dominant). </p>
                                    <h2>Database usage</h2>
                                    <p>TIMEDB provides four pages to show data: "Overview","Cancer","Project" and "Sample"</p>
                                    <img src="/public/data/image/tutorial/2-1ppt.png" class="page-image">
                                    <h3>Overview</h3>
                                    <p>If users are interested in database summary, they can look through the <a href="/database/overview">''Overview''</a> page. </p>
                                    <ul>
                                        <li>Click the anatomy icons to query the related projects.</li>
                                        <img src="/public/data/image/tutorial/1-1ppt.gif" class="page-image">
                                        <li>See the visualization.
                                        <img src="/public/data/image/tutorial/1-2ppt.gif" class="page-image">
                                        <img src="/public/data/image/tutorial/1-3ppt.gif" class="page-image">
                                        <img src="/public/data/image/tutorial/1-4ppt.gif" class="page-image">


                                        <h2 id="cancer">Cancer</h2>
                                        If users are interested in one cancer type, they can click the details in <a href="/cancers">''Cancer''</a> page to query the related datasets. <br></br>
                                        <img src="/public/data/image/tutorial/1-5ppt.gif" class="page-image">
                                        <h2 id="project">Project</h2>
                                        If users are interested in specific project, they can choose the project in <a href="/projects">''Project''</a> page to query the project.
                                        <img src="/public/data/image/tutorial/1-6ppt.gif" class="page-image">
                                        </li>
                                    </ul>
                                    <p>The project table show the clinical information, each project may contains serveral samples. The basic information of sample includes:</p>
                                    <ul>
                                        <li><code>sample_name</code>: the name of donor.</li>
                                        <li><code>project_name</code>: the name of project.</li>
                                        <li><code>race</code>: the race of donor.</li>
                                        <li><code>gender</code>: the gender of donor.</li>
                                        <li><code>age</code>:  the age of donor.</li>
                                        <li><code>weight</code>: the weight of donor.</li>
                                        <li><code>height</code>:  the height of donor.</li>
                                        <li><code>cancer_name</code>: available for cancer donor, the cancer type classification, e.g. <code>OV</code>, <code>LUSC</code>.</li>
                                        <li><code>tumor_type</code>: available for cancer donor, the detailed cancer type.</li>
                                        <li><code>tumor_subtype</code>: available for cancer donor, the cancer subtype.</li>
                                        <li><code>tumor_grade</code>: available for cancer donor, e.g. <code>GradeI</code>, <code>GradeII</code>.</li>
                                        <li><code>tumor_stage</code>: available for cancer donor, e.g. <code>StageI</code>, <code>StageII</code>. </li>
                                        <li><code>os</code>: available for cancer or diease donor, overall survival, the length of days from either the date of diagnosis or the start of treatment, that a patient still alive.</li>
                                        <li><code>os_status</code>: available for cancer donor, the os outcome, binary, value of 1 for death, 0 for alive.</li>
                                        <li><code>pfs</code>: available for cancer or diease donor, progression-free survival, the length of days during and after the treatment, that a patient lives with the disease but it does not get worse.</li>
                                        <li><code>pfs_status</code>: available for cancer donor, the pfs outcome, binary, value of 1 for pregression or recurrence, 0 for otherwise.</li>
                                    </ul>
                                    <p>The project visulization has two parts:</p>
                                    <ul>
                                        <li>"C1_C6 subtyping overview": visualization about immune subtype of tumor samples.</li>
                                        <img src="/public/data/image/tutorial/5-2ppt.png" class="page-image">
                                        <li>"TIME estimation overview": visualization about TIME estimation.</li>
                                        <img src="/public/data/image/tutorial/5-4ppt.png" class="page-image">

                                    </ul>
                                    <h2>sample</h2>
                                    <p>If users are interested in specific sample, they can choose the sample in <a href="/samples">"sample"</a> a page to see the sample information.</p>
                                    <p>In this sample visulization, users could click the button to change the TIME estimation method.</p>
                                    <div class="focus">
                                        <p>The visualizations we provide are interactive:</p>
                                        <ul>
                                            <li>tooltips
                                            <font color="red" size="4">找一个database部分好看的图展示改字体大小（fraction）里面倒数第二个图，动图</font></li>
                                            <li>change the color</li>
                                            <img src="/public/data/image/tutorial/1-8ppt.gif" class="page-image">
                                            <li>change the text size</li>
                                            <img src="/public/data/image/tutorial/1-9ppt.gif" class="page-image">
                                            <li>rotate the label</li>
                                            <img src="/public/data/image/tutorial/1-10ppt.gif" class="page-image">
                                            <li>and multiple online adjustments options, contains but not all listed.</li>
                                        </ul>
                                    </div>
                                    <h2>Citation</h2>
                                    <em>[1] Vésteinn Thorsson, David L Gibbs, Scott D Brown, Denise Wolf, Dante S Bortone, TaiHsien Ou Yang, Eduard Porta-Pardo, Galen F Gao, Christopher L Plaisier, James A Eddy,et al. The immune landscape of cancer. Immunity, 51(2):411–412, 2019.</em><br>
                                    <em>[2] Gianni Monaco, Bernett Lee, Weili Xu, Seri Mustafah, You Yi Hwang, Christophe Carré,Nicolas Burdin, Lucian Visan, Michele Ceccarelli, Michael Poidinger, et al. Rna-seq signatures normalized by mrna abundance allow absolute deconvolution of human immune cell types. Cell reports, 26(6):1627–1640, 2019.</em><br>
                                    <em>[3] Aaron M Newman, Chih Long Liu, Michael R Green, Andrew J Gentles, Weiguo Feng, Yue Xu, Chuong D Hoang, Maximilian Diehn, and Ash A Alizadeh. Robust enumeration of cell subsets from tissue expression profiles. Nature methods, 12(5):453–457, 2015.</em><br>
                                    <em>[4] A. M. Newman, C. B. Steen, C. L. Liu, A. J. Gentles, A. A. Chaudhuri, F. Scherer, M. S. Khodadoust, M. S. Esfahani, B. A. Luca, and D. Steiner. Determining cell type abundance and expression from bulk tissues with digital cytometry. Nature biotechnology, 37(7):773, 2019.</em><br>
                                    <em>[5] J. Racle, Kaat De Jonge, P. Baumgaertner, D. E. Speiser, and D. Gfeller. Simultaneous enumeration of cancer and immune cell types from bulk tumor gene expression data. eLife,6,(2017-11-10), 6, 2017.</em><br>
                                    <em>[6] Ya Ru Miao, Qiong Zhang, Qian Lei, Mei Luo, and An Yuan Guo. Immucellai: a unique method for comprehensive t-cell subsets abundance prediction and its application in cancer immunotherapy. 2019.</em><br>
                                    <em>[7] Becht E, Giraldo NA, Lacroix L, Buttard B, Elarouci N, Petitprez F, Selves J, Laurent-Puig P, Sautès-Fridman C, Fridman WH, de Reyniès A. Estimating the population abundance of tissue-infiltrating immune and stromal cell populations using gene expression. Genome Biol. 2016 Oct 20;17(1):218.</em><br>
                                    <em>[8] Alejandro Jiménez-Sánchez, Oliver Cast, and Martin L Miller. Comprehensive benchmarking and integration of tumor microenvironment cell estimation methods. Cancer Research, 79(24):6238–6246, 2019.</em><br>
                                    <em>[9] T. Li, J. Fan, B. Wang, N. Traugh, Q. Chen, J. S. Liu, B. Li, and X. S. Liu. Timer: A web server for comprehensive analysis of tumor-infiltrating immune cells. Cancer Research, 77(21):e108, 2017.</em><br>
                                    <em>[10] Francesca Finotello, Clemens Mayer, Christina Plattner, Gerhard Laschober, Dietmar Rieder, Hubert Hackl, Anne Krogsdam, Zuzana Loncova, Wilfried Posch, Doris Wilflingseder, et al. Molecular and pharmacological modulators of the tumor immune contexture revealed by deconvolution of rna-seq data. Genome medicine, 11(1):1–20, 2019.</em><br>
                                    <em>[11] D. Aran, Z. Hu, and A. J. Butte. xcell: digitally portraying the tissue cellular heterogeneity landscape. Genome Biology, 18(1):220, 2017.</em><br>
                                    <em>[12] David L Gibbs. Robust classification of immune subtypes in cancer. bioRxiv, 2020.</em><br>
                                    <em>[13] James A Eddy, Vésteinn Thorsson, Andrew E Lamb, David L Gibbs, Carolina Heimann, Jia Xin Yu, Verena Chung, Yooree Chae, Kristen Dang, Benjamin G Vincent, et al. Criiatlas: an interactive portal for immuno-oncology research. F1000Research, 9, 2020.</em><br>
                                </div>

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
    border: 3px solid;
    border-radius: 10px;
    padding: 1%;
}
</style>
