# Welcome to TIMEDB database

## Download data

TIMEDB provides the tumor immune micro-enviornment (TIME) cell proportions from bulk expression profiles of **35,000 + samples** and **500+ datasets** across **43 cancer types**. Users can download the following files directly from TIMEDB:

![all cancer icons](../data/image/tutorial/database-overview-cancer.png ':size=500')


### Gene expression file and meta file

- ``Gene expression file``: The gene expression file stores the bulk gene expression of tumor samples, with sample as column and gene as row.
- ``Clinical file``: The clinical file stores the manually curated clinical information of the sample, such as age, gender, etc. Each row is a sample and each column is a clinical feature.
- ``Scaled immmunoregulator expression file``: The scaled gene expression profiles of seventy-nine immunoregular genes. <sup>[1]</sup>

### TIME cell estimation result file

TIMEDB uses **ABIS, CIBERSORT, CIBERSORTX, ConsensusTME, EPIC, ImmucellAI, Mcpcounter, quanTIseq and TIMER** to quantify the cells in tumor microenvironment. Users can download the following TIME estimation results.

- ``ABIS estimation result file``: TIME estimation result from ABIS. <sup>[2]</sup>
- ``CIBERSORT estimation result file``: TIME estimation result from CIBERSORT. <sup>[3]</sup>
- ``CIBERSORTx estimation result file``: TIME estimation result from online website [CIBERSORTx](https://cibersortx.stanford.edu/index.php). <sup>[4]</sup>
-  ``EPIC estimation result file``: TIME estimation result from EPIC. (Applicable only for RNA-Seq count data.) <sup>[5]</sup>
-  ``ImmuCellAI estimation result file``: TIME estimation result from online website [ImmuCellAI](http://bioinfo.life.hust.edu.cn/ImmuCellAI#!/). <sup>[6]</sup> 
-  ``Mcpcounter estimation result file``: TIME estimation result from Mcpcounter. <sup>[7]</sup> 
-  ``ConsensusTME estimation result file``: TIME estimation result from ConsensusTME. (Applicable only for 32 TCGA cancer types.) <sup>[8]</sup> 
-  ``TIMER estimation result file``: TIME estimation result from ConsensusTME. (Applicable only for 32 TCGA cancer types.)  <sup>[9]</sup> 
-  ``quanTIseq estimation result file``: TIME estimation result from quanTIseq. <sup>[10]</sup> 
-  ``xCell estimation result file``: TIME estimation result from xCell. <sup>[11]</sup> 
-  ``TIME Consensus estimation result file``: This file stores the TIME estimation result of common cell types occured one than once from nine estimation tools.(<font color=red size=4>download the cell mapping file</font>) <sup>[2-11]</sup> 
-  ``TIME All estimation result file``: This file stores the TIME estimation result of all cell types from nine estimation tools. <sup>[2-11]</sup> 


### C1-C6 subtyping result file

TIMEDB adopts **ImmuneSubtypeClassifier** <sup>[12, 13]</sup>  to catelogue the immune subtype of tumor samples based on gene expression levels. Users can download the result file which shows the probability of sample being six immune status, including C1 (wound healing), C2 (IFN-γ dominant),C3 (inflammatory), C4 (lymphocyte depleted), C5 (immuno-logically quiet), and C6 (TGF-β dominant).

## Database usage

TIMEDB provides four parts to show data with visualizations available: **Database overview, Cancers, Datasets and Samples**.</p>

![all cancer icons](../data/image/tutorial/2-1ppt.png ':size=500')

### Overview

Users can look through the <a href="/database/overview">"Overview"</a> page to check a comprehensive panorama of the TIMEDB database.

- Users can click anatomy icons to query one specific cancer in detail.
<img src="../data/image/tutorial/database-overview-cancer.png" style="width:420px;height: 300px; margin: 15px;">

- Users can explore various visualizations.
<img src="../data/image/tutorial/database-overview-pie.png" style="width:300px;height: 250px; margin: 15px;">
<img src="../data/image/tutorial/database-overview-landscape.png" style="width:300px;height: 250px; margin: 15px;">
<img src="../data/image/tutorial/database-overview-immunoregulator.png" style="width:300px;height: 250px; margin: 15px;">


### Cancers

Users can have an overview about all <a href="/cancers">cancers</a> stored in TIMEDB database in the cancers indexing page.

Users can also click <button> details </button> button in the some cancer showing pages to query one specific dataset.

<img src="../data/image/tutorial/cancer-index.png" style="width:420px; height: 300px; margin: 15px;">
                           
<img src="../data/image/tutorial/cancer-show.png"  style="width:420px; height: 300px; margin: 15px;">


### Datasets

Users can have an overview about all <a href="/cancers">datasets</a> stored in TIMEDB database in the datasets indexing page.

Users can also click <button> Show </button> button in the dataset showing pages to query detailed information of samples belonging to this dataset.

<img src="../data/image/tutorial/dataset-index.png" style="width:420px; height: 300px; margin: 15px;">
<img src="../data/image/tutorial/dataset-show.png"  style="width:420px; height: 300px; margin: 15px;">

Dataset tables show detailed clinical information from different datasets, which may contains serveral samples individually. Basic samples information will includes:

- ``sample_name``: the name of donor.
- ``dataset_name``: the name of dataset.
- ``race``: the race of donor.
- ``gender``: the gender of donor.
- ``age``:  the age of donor.
- ``weight``: the weight of donor.
- ``height``:  the height of donor.
- ``cancer_name``: available for cancer donor, the cancer type classification, e.g. ``OV``, ``LUSC``.
- ``tumor_type``: available for cancer donor, the detailed cancer type.
- ``tumor_subtype``: available for cancer donor, the cancer subtype.
- ``tumor_grade``: available for cancer donor, e.g. ``GradeI``, ``GradeII``.
- ``tumor_stage``: available for cancer donor, e.g. ``StageI``, ``StageII``. 
- ``os``: available for cancer or diease donor, overall survival, the length of days from either the date of diagnosis or the start of treatment, that a patient still alive.
- ``os_status``: available for cancer donor, the os outcome, binary, value of 1 for death, 0 for alive.
- ``pfs``: available for cancer or diease donor, progression-free survival, the length of days during and after the treatment, that a patient lives with the disease but it does not get worse.
- ``pfs_status``: available for cancer donor, the pfs outcome, binary, value of 1 for pregression or recurrence, 0 for otherwise.

The Dataset visulization part has two sub-parts:

- C1_C6 subtyping overview: visualizations about immune subtype for tumor samples.
  
<img src="../data/image/tutorial/5-2ppt.png" style="width: 500px; height: 280px; margin: 15px;">
- TIME estimation overview: visualizations about TIME estimation.
  
<img src="../data/image/tutorial/5-4ppt.png" style="width: 500px; height: 265px; margin: 15px;">

### Samples

Users can click and check detailed samples information in <a href="/samples">"sample"</a> index page. For most samples, we provide visualizations for its immune cell type compositions estimated from different methods.</p>

## Interactive visualizations

The visualizations provided are interactive, whose features include changeing color and text size, rotating labels and multiple online adjustment options contained but not all listed.

<img src="../data/image/tutorial/dataset-viz1.png" style="width:300px;height: 250px; margin: 15px;">
<img src="../data/image/tutorial/dataset-viz2.png" style="width:300px;height: 250px; margin: 15px;">
<img src="../data/image/tutorial/dataset-viz3.png" style="width:300px;height: 250px; margin: 15px;">



## Citation

*[1] Vésteinn Thorsson, David L Gibbs, Scott D Brown, Denise Wolf, Dante S Bortone, TaiHsien Ou Yang, Eduard Porta-Pardo, Galen F Gao, Christopher L Plaisier, James A Eddy,et al. The immune landscape of cancer. Immunity, 51(2):411–412, 2019.*

*[2] Gianni Monaco, Bernett Lee, Weili Xu, Seri Mustafah, You Yi Hwang, Christophe Carré,Nicolas Burdin, Lucian Visan, Michele Ceccarelli, Michael Poidinger, et al. Rna-seq signatures normalized by mrna abundance allow absolute deconvolution of human immune cell types. Cell reports, 26(6):1627–1640, 2019.*

*[3] Aaron M Newman, Chih Long Liu, Michael R Green, Andrew J Gentles, Weiguo Feng, Yue Xu, Chuong D Hoang, Maximilian Diehn, and Ash A Alizadeh. Robust enumeration of cell subsets from tissue expression profiles. Nature methods, 12(5):453–457, 2015.*

*[4] A. M. Newman, C. B. Steen, C. L. Liu, A. J. Gentles, A. A. Chaudhuri, F. Scherer, M. S. Khodadoust, M. S. Esfahani, B. A. Luca, and D. Steiner. Determining cell type abundance and expression from bulk tissues with digital cytometry. Nature biotechnology, 37(7):773, 2019.*

*[5] J. Racle, Kaat De Jonge, P. Baumgaertner, D. E. Speiser, and D. Gfeller. Simultaneous enumeration of cancer and immune cell types from bulk tumor gene expression data. eLife,6,(2017-11-10), 6, 2017.*

*[6] Ya Ru Miao, Qiong Zhang, Qian Lei, Mei Luo, and An Yuan Guo. Immucellai: a unique method for comprehensive t-cell subsets abundance prediction and its application in cancer immunotherapy. 2019.*

*[7] Becht E, Giraldo NA, Lacroix L, Buttard B, Elarouci N, Petitprez F, Selves J, Laurent-Puig P, Sautès-Fridman C, Fridman WH, de Reyniès A. Estimating the population abundance of tissue-infiltrating immune and stromal cell populations using gene expression. Genome Biol. 2016 Oct 20;17(1):218.*

*[8] Alejandro Jiménez-Sánchez, Oliver Cast, and Martin L Miller. Comprehensive benchmarking and integration of tumor microenvironment cell estimation methods. Cancer Research, 79(24):6238–6246, 2019.*

*[9] T. Li, J. Fan, B. Wang, N. Traugh, Q. Chen, J. S. Liu, B. Li, and X. S. Liu. Timer: A web server for comprehensive analysis of tumor-infiltrating immune cells. Cancer Research, 77(21):e108, 2017.*

*[10] Francesca Finotello, Clemens Mayer, Christina Plattner, Gerhard Laschober, Dietmar Rieder, Hubert Hackl, Anne Krogsdam, Zuzana Loncova, Wilfried Posch, Doris Wilflingseder, et al. Molecular and pharmacological modulators of the tumor immune contexture revealed by deconvolution of rna-seq data. Genome medicine, 11(1):1–20, 2019.*

*[11] D. Aran, Z. Hu, and A. J. Butte. xcell: digitally portraying the tissue cellular heterogeneity landscape. Genome Biology, 18(1):220, 2017.*

*[12] David L Gibbs. Robust classification of immune subtypes in cancer. bioRxiv, 2020.*

*[13] James A Eddy, Vésteinn Thorsson, Andrew E Lamb, David L Gibbs, Carolina Heimann, Jia Xin Yu, Verena Chung, Yooree Chae, Kristen Dang, Benjamin G Vincent, et al. Criiatlas: an interactive portal for immuno-oncology research. F1000Research, 9, 2020.*