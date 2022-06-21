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

                <div class="row">
                    <div class="col-md-4 text-center">
                        <!-- <%=image_tag src="icons brightmode12.png" ,class:  "d-block w-100"%> -->
                        <img v-bind:src="require('../assets/images/database1.png')" class="d-block w-100">

                    </div>
                    <div class="col-md-8 text-center">
                        <br><br>
                        <h2 style="color: #314893">Database Tutorial</h2>

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
                        <h2 style="color: #cc4f78">Analysis Tutorial</h2>
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
                                <p class="nav-link" >How to Add Data to Your Workspace</p>
                            </li>
                            <br>

                            <li class="nav-item" @click="showdetail($event)" id="3">
                                <p class="nav-link" href="#"> How to Download Database Data</p>
                            </li>
                            <br>
                            <li class="nav-item" @click="showdetail($event)" id="4">
                                <p class="nav-link" >How to View the Visualization Plots</p>
                            </li>
                            <br>
                            <li class="nav-item" @click="showdetail($event)" id="5">
                                <p class="nav-link" > How to Download the Visualization Plots</p>
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
                                <div class="headers markdown-body">
                                    <h1>Welcome to TIMEDB Database</h1>
                                    <p>TIMEDB provides the tumor immune micro-enviornment (TIME) cell proportions from bulk RNA expression profiles of <b>35,000 + samples</b> and <b>500+ projects</b> across <b>43 cancer types</b>. Users can download the following files directly with TIMEDB:
                                    </p>
                                    <br>
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
                                    <hr>
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

                                        <br>
                                        <h2 id="cancer">Cancer</h2>
                                        If users are interested in one cancer type, they can click the details in <a href="/cancers">''Cancer''</a> page to query the related datasets. <br>
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
                                    <h2>Sample</h2>
                                    <p>If users are interested in specific sample, they can choose the sample in <a href="/samples">"sample"</a> a page to see the sample information.</p>
                                    <p>In this sample visulization, users could click the button to change the TIME estimation method.</p>
                                    <hr>
                                    <h1>The visualizations we provide are interactive:</h1>

                                    <!-- <div class="focus"> -->
                                        <ul>
                                            <li>change the color</li><br>
                                            <img src="/public/data/image/tutorial/1-8ppt.gif" class="page-image">
                                            <li>change the text size</li><br>
                                            <img src="/public/data/image/tutorial/1-9ppt.gif" class="page-image">
                                            <li>rotate the label</li><br>
                                            <img src="/public/data/image/tutorial/1-10ppt.gif" class="page-image">
                                            <li>and multiple online adjustments options, contains but not all listed.</li>
                                        </ul>
                                    <!-- </div> -->
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
                                <div class="headers markdown-body">
                                    <h1>Database Information</h1>
                                    <h2>We have <b>43</b> Type, <b>538</b> Projects, <b>35817</b> Samples</h2>
                                    <img src="/public/data/image/tutorial/2-1ppt.png" class="page-image">
                                    <img src="/public/data/image/tutorial/2-2ppt.png" class="page-image">
                                    <hr>
                                    <h1>Detail Information</h1>
                                    <p>You can view the detail information and the data visualization for each cancer type, project or samples</p>
                                    <p>Let's take Project as an example </p>
                                    <p>Click Filter to select information and Click Details to view Project's samples and charts</p>
                                    <img src="/public/data/image/tutorial/1-6ppt.gif" class="page-image">
                                    <img src="/public/data/image/tutorial/5-2ppt.png" class="page-image">
                                    <img src="/public/data/image/tutorial/5-4ppt.png" class="page-image">

                                </div>
                            </div>
                            <br><br>

                        </div>
                    </div><div v-else-if="this.now =='2'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to add TIMEDB database data to your workspace
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers markdown-body">
                                    <h1>You can check your dataset in workspace</h1>
                                    <p>TIMEDB provides function that user can create their own dataset from multiple projects.</p>
                                    <p>User can upload their dataset data for analysis later</p>
                                    <img src="/public/data/image/tutorial/3-1ppt.png" class="page-image">
                                    <hr>
                                    <h1>Add samples to your dataset </h1>
                                    <h2>Directly add samples from the dataset page</h2>
                                    <p>Click Edit Dataset and go to add sample, it will jump to Samples page</p>
                                    <p>Then, select samples and export them to your dataset</p>
                                    <img src="/public/data/image/tutorial/3-2ppt.png" class="page-image">
                                    <img src="/public/data/image/tutorial/3-3ppt.png" class="page-image">
                                    <h2>Also, you can add samples from a specify project</h2>
                                    <img src="/public/data/image/tutorial/3-4ppt.jpg" class="page-image">


                                </div>
                                
                            </div>
                            <br><br></br>
                        </div>
                    </div><div v-else-if="this.now =='3'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to Download Database Data
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers markdown-body">
                                    <h1>Download data from Download Page</h1>
                                    <p>The Download page contains the relative files of all projects</p>
                                    <img src="/public/data/image/tutorial/4-0ppt.jpg" class="page-image">
                                    <h1>Download the data from the dataset</h1>
                                    <img src="/public/data/image/tutorial/4-1ppt.jpg" class="page-image">
                                    <h1>Download data from projects</h1>
                                    <img src="/public/data/image/tutorial/9.png" class="page-image">
                                    <h1>Download data from samples</h1>
                                    <img src="/public/data/image/tutorial/4-3ppt.jpg" class="page-image">
                                </div>
                            </div>
                            <br><br>

                        </div>      
                    </div><div v-else-if="this.now =='4'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to view the  visualization plots of project and sample
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers markdown-body">
                                    <h1>You can view the visualizations plot of each Project</h1>
                                    <p>The visualizations we provide are interactive, you can use the editor to do some personal change</p>
                                    <h2> "C1_C6 subtyping overview": visualization about immune subtype of tumor samples.</h2>
                                    <img src="/public/data/image/tutorial/5-1ppt.png" class="page-image">
                                    <img src="/public/data/image/tutorial/5-2ppt.png" class="page-image">
                                    <h2>"TIME estimation overview": visualization about TIME estimation</h2>
                                    <img src="/public/data/image/tutorial/5-3ppt.png" class="page-image">
                                    <img src="/public/data/image/tutorial/5-4ppt.png" class="page-image">
                                </div>
                            </div>
                            <br><br>
                        </div> 
                    </div><div v-else-if="this.now =='5'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to download the visualization plots
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers markdown-body">
                                    <ul>
                                    <li>Click the Download all charts button to download all Charts </li>
                                    <li>Click the Download button to download chart and relative data files</li>
                                    </ul>
                                    <img src="/public/data/image/tutorial/6-1ppt.png" class="page-image">

                                </div>
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
                                <p class="nav-link ">How to Complete an Analysis</p>
                            </li>
                            <br>

                            <li class="nav-item" @click="showdetail2($event)" id="2">
                                <p class="nav-link" >Analysis Tutorial</p>
                            </li>
                            <br>

                            <li class="nav-item" @click="showdetail2($event)" id="3">
                                <p class="nav-link" href="#">How to Ask Us for Help</p>
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
                            <div class="markdown-body headers">
                                <h1>Welcome to TIMEDB Analysis</h1>
                                <p>TIMEDB provides 18 online tumor immune microenvironment analyses,details are shown in the following table:</p>
                                <table>
                                    <tr>    <th>Analysis Category</th>  <th>Analysis</th> </tr>
                                    <tr>    <td rowspan="5">Regression Tools</td>   <td>TIMEDB Decov CIBERSORT</td>  </tr>
                                    <tr>    <td>TIMEDB Decov TIMER</td>  </tr>
                                    <tr>    <td>TIMEDB Decov EPIC </td>  </tr>
                                    <tr>    <td>TIMEDB Decov ABIS</td>  </tr>
                                    <tr>    <td>TIMEDB Decov quanTIseq</td>  </tr>
                                    <tr>    <td rowspan="3">Enrichment Tools</td>   <td>TIMEDB Decov xCell</td>  </tr>
                                    <tr>    <td>TIMEDB Decov MCPcounter</td>  </tr>
                                    <tr>    <td>TIMEDB Decov ConsensusTME</td>  </tr>
                                    <tr>    <td>Unsupervised Tools</td>   <td>TIMEDB Decov Linseed</td>  </tr>
                                    <tr>    <td rowspan="2">Consensus Tools</td> <td>TIMEDB Consensus array</td>  </tr>
                                    <tr>    <td>TIMEDB Consensus RNA-Seq</td>  </tr>
                                    <tr>    <td>Datasets Comparison</td> <td>TIMEDB Batch Effect</td>  </tr>
                                    <tr>    <td rowspan="2">TIME Estimation Comparsion</td>   <td>TIMEDB Comparison array</td>  </tr>
                                    <tr>    <td>TIMEDB Comparison RNA-Seq </td>  </tr>
                                    <tr>    <td rowspan="2">Patient Subtyping</td>           <td>TIMEDB Cell Fraction Subtyping</td>  </tr>
                                    <tr>    <td>TIMEDB C1-C6 Subtyping</td>  </tr>
                                    <tr>    <td rowspan="2">Survival Analysis</td>   <td>TIMEDB HR OR</td>  </tr>
                                    <tr>    <td>TIMEDB KM Estimator</td>  </tr>
                                    <tr>    <td rowspan="2">Colrrelation Analysis</td>   <td>TIMEDB Cell Interaction</td>  </tr>
                                    <tr>    <td>TIMEDB Cell Correlation</td>  </tr>
                                    <tr>    <td>Different Expression</td>   <td>TIMEDB Immunoregulator</td>  </tr>

                                </table>
                                <h2>Analysis submit and check</h2>
                                <p>TIMEDB provides a friendly submission page that guides users through analysis step by step.</p>
                                <p>Users could view analysis detailed tutorial, run demo and view demo results with one click. </p>
                                <img src="/public/data/image/tutorial/a-1-1ppt.png" class="page-image">
                                <p>During the submission process, the file format and parameters are explained in detail. </p>
                                <img src="/public/data/image/tutorial/a-1-2ppt.gif" class="page-image">
                                <p>For results, TIMEDB provides results downloads, as well as interactive visualization. </p>
                                <img src="/public/data/image/tutorial/a-1-3ppt.gif" class="page-image">
                                <p>Click to view the detailed steps of submitting the analysis.</p>
                                <button class="btn-5 btn" @click="showdetail2($event)" id="1">analysis steps</button>
                                <h2>Contact with us if you meet some problems</h2>
                                <p>You may contact us:</p>
                                <p>Dr LI, Shuaicheng</p>
                                <p>Email: Shuaicli@cityu.edu.hk</p>
                            </div>
                            <br><br>                           

                        </div>
                    </div><div v-else-if="this.now =='1'">
                        <h1 class="title">
                            <i class="fa fa-caret-left" @click="back"></i> How to Conmplete an Analysis
                        </h1><br>
                        <div class="page">
                            <div class="headers markdown-body">
                                <h1>Analysis steps</h1>
                                <p>TIMEDB analyses are used in much the same way.</p>
                                <h2>Step one: choose the analysis.</h2>
                                <p>In TIMEDB, <a href="/submit/analysesCategory?cname=Regression+Tools">Regression tools</a> include ABIS, quanTIseq, CIBERSORT and other analyses. Users can select the analysis according to the number of datasets they upload and the analysis method.</p>
                                <img src="/public/data/image/tutorial/a-2-1ppt.gif" class="page-image">
                                <hr>
                                <h2>Step 2 (optional): read the analysis helper, run the demo file.</h2>
                                <p>After selecting one analysis, the user entering for the first time will directly see the analysis helper, where the file format and parameters will be explained in detail.</p>
                                <img src="/public/data/image/tutorial/a-2-2ppt.gif" class="page-image">
                                <p>In each anlaysis, TIMEDB provides a "RUN DEMO" button. Users can run the demo task with one just click. </p>
                                <img src="/public/data/image/tutorial/a-2-3ppt.gif" class="page-image">
                                <hr>
                                <h2>Step three: upload the file</h2>
                                <p>Users can prepare their own files or select their own DataSets directly from the workspace for uploading. (see <a href="#" @click="jumpadd">how to add datasets in workspace </a>)</p>
                                <img src="/public/data/image/tutorial/a-2-4ppt.gif" class="page-image">
                                <p>Users can check the file format and download the demo file in "upload page". 动图展示</p>
                                <img src="/public/data/image/tutorial/a-2-5ppt.gif" class="page-image">
                                <h2>In the document submission section, all submitted file should be CSV format.</h2>
                                <hr>
                                <h2>Step four: set parameters</h2>
                                <p>Users can fill the desired analysis paramters guided by detailed paramter explaination.</p>
                                <img src="/public/data/image/tutorial/a-2-6ppt.gif" class="page-image">
                                <hr>
                                <h2>Step five: submit and view the results</h2>
                                <p>After the task is submitted, the user gets a task id, which is automatically added to the user's workspace.</p>
                                <img src="/public/data/image/tutorial/a-2-3ppt.gif" class="page-image">
                                <p>In the workspace section, you can view the status of task. There are three task status: running, finished, and failed, which respectively indicate that the task is in progress, the task is completed and the task is failed. Click "check" to view the task results and interactive visualization.</p>
                                <img src="/public/data/image/tutorial/a-2-7ppt.gif" class="page-image">

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
                            <i class="fa fa-caret-left" @click="back"></i> How to ask us for help
                        </h1><br>
                        <div class="page">
                            <div>
                                <div class="headers markdown-body">
                                    <h1>Team</h1>
                                    <p>Based in City University of Hong Kong, led by Dr. Shuaicheng LI, we are a multidisciplinary group of top-ranking and aspiring undergraduates, research assistants and Ph.D. students working tirelessly to bring you a brand-new experience in bioinformatics research that frees you from all the chores and empowers your journey of discovery.</p>
                                        <div class="team-member-container">
                                            <div class="team-member-links"><a class="link" href="http://www.cs.cityu.edu.hk/profile/shuaicli.html"><i
                                                        class="fas fa-home"></i></a><a class="link link-m" 
                                                    href="mailto:shuaicli@cityu.edu.hk"><i class="fas fa-envelope"></i></a></div>
                                            <div class="team-member"><img alt="Dr. LI Shuaicheng" class="avatar"
                                                    src="/public/data/image/tutorial/boss.jpg">
                                                <div class="intro">
                                                    <h2>Dr. LI Shuaicheng</h2>
                                                    <h5>Supervisor</h5>
                                                    <p>Supervisor</p>
                                                </div>
                                            </div>
                                        </div>                                
                                    <blockquote>
                                        <div class='row'>
                                            <div class="col-md-5">
                                                <h3>Contact Us</h3>
                                                <p>Dr LI, Shuaicheng</p>
                                                <p>Tat Chee Avenue, Kowloon, Hong Kong</p>
                                                <p>Email: <a href="mailto:shuaicli@cityu.edu.hk">shuaicli@cityu.edu.hk</a></p>
                                            </div>


                                            
                                            <div class="col-md-3">
                                                <h3>About Us</h3>
                                                <p>Creating An Integrated Cloud-based System for Bioinformatics Visualization is our passion.</p>
                                                <p><a href="/terms">Privacy Policy</a></p>
                                            </div>
                                        </div>
                                    </blockquote>
                                </div>

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
                    {title:"How to Add Data to Your Workspace", id:"2",key:["database","2"]},
                    {title:"How to Download Database Data", id:"3",key:["database","3"]},
                    {title:"How to View the  Visualization Plots", id:"4",key:["database","4"]},
                    {title:"How to Download the Visualization Plots", id:"5",key:["database","5"]},
                ],
                articles2:[
                    {title:"Introduction", id:"intro",key:["intro","0"]},
                    {title:"How to Complete an Analysis", id:"1",key:["database","1"]},
                    {title:"Analysis tutorial", id:"2",key:["database","2"]},
                    {title:"How to Ask Us for Help", id:"3",key:["database","3"]},
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
        },
        jumpadd(){
            this.details=1;
            this.now=3;
            this.gotop();
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
    z-index: 9;
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
