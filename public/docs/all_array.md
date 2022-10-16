# TIMEDB All array

## Introduction
For  microarray data, we run ABIS, CIBERSORTX, quanTIseq, TIMER, ConsensusTME, ImmuCellAI, MCPcounter and xCell to estimate the TIME Cell fraction, and we compiled absolute results for all TIME cell types from these tools.

### Citation
[1] Vésteinn Thorsson, David L Gibbs, Scott D Brown, Denise Wolf, Dante S Bortone, TaiHsien Ou Yang, Eduard Porta-Pardo, Galen F Gao, Christopher L Plaisier, James A Eddy,et al. The immune landscape of cancer. Immunity, 51(2):411–412, 2019.

[2] Gianni Monaco, Bernett Lee, Weili Xu, Seri Mustafah, You Yi Hwang, Christophe Carré,Nicolas Burdin, Lucian Visan, Michele Ceccarelli, Michael Poidinger, et al. Rna-seq signatures normalized by mrna abundance allow absolute deconvolution of human immune cell types. Cell reports, 26(6):1627–1640, 2019.

[3] Aaron M Newman, Chih Long Liu, Michael R Green, Andrew J Gentles, Weiguo Feng, Yue Xu, Chuong D Hoang, Maximilian Diehn, and Ash A Alizadeh. Robust enumeration of cell subsets from tissue expression profiles. Nature methods, 12(5):453–457, 2015.

[4] A. M. Newman, C. B. Steen, C. L. Liu, A. J. Gentles, A. A. Chaudhuri, F. Scherer, M. S. Khodadoust, M. S. Esfahani, B. A. Luca, and D. Steiner. Determining cell type abundance and expression from bulk tissues with digital cytometry. Nature biotechnology, 37(7):773, 2019.

[5] J. Racle, Kaat De Jonge, P. Baumgaertner, D. E. Speiser, and D. Gfeller. Simultaneous enumeration of cancer and immune cell types from bulk tumor gene expression data. eLife,6,(2017-11-10), 6, 2017.

[6] Ya Ru Miao, Qiong Zhang, Qian Lei, Mei Luo, and An Yuan Guo. Immucellai: a unique method for comprehensive t-cell subsets abundance prediction and its application in cancer immunotherapy. 2019.

[7] Becht E, Giraldo NA, Lacroix L, Buttard B, Elarouci N, Petitprez F, Selves J, Laurent-Puig P, Sautès-Fridman C, Fridman WH, de Reyniès A. Estimating the population abundance of tissue-infiltrating immune and stromal cell populations using gene expression. Genome Biol. 2016 Oct 20;17(1):218.

[8] Alejandro Jiménez-Sánchez, Oliver Cast, and Martin L Miller. Comprehensive benchmarking and integration of tumor microenvironment cell estimation methods. Cancer Research, 79(24):6238–6246, 2019.

[9] T. Li, J. Fan, B. Wang, N. Traugh, Q. Chen, J. S. Liu, B. Li, and X. S. Liu. Timer: A web server for comprehensive analysis of tumor-infiltrating immune cells. Cancer Research, 77(21):e108, 2017.

[10] Francesca Finotello, Clemens Mayer, Christina Plattner, Gerhard Laschober, Dietmar Rieder, Hubert Hackl, Anne Krogsdam, Zuzana Loncova, Wilfried Posch, Doris Wilflingseder, et al. Molecular and pharmacological modulators of the tumor immune contexture revealed by deconvolution of rna-seq data. Genome medicine, 11(1):1–20, 2019.

[11] D. Aran, Z. Hu, and A. J. Butte. xcell: digitally portraying the tissue cellular heterogeneity landscape. Genome Biology, 18(1):220, 2017.

## Analysis Overview
![avatar](https://timedb.deepomics.org/public/data/image/all_array_structure.jpg)

## Input file
`Gene expression data`(**required**):the gene expression file(csv)

*  First row should be a header with a 'GeneSymbol'column lable followed by sample name.
*  First column should be the the gene symbol(HGNC ID)the HGNC ID could be found on [HGNC website](https://www.genenames.org/).
* The data type of reads count should be number. 

`Clinical data`(**optional**):the clinical file(csv)

* Clinical data is not required, and if clinical data is provided, the visualization will have a heatmap of the clinical features of the sample.
* If you want to display clinical features in the result visualization, please organize your data according to the following rules:
  - The header line keyword of classfication feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of Continuous feature follows n\_[feature] format, such as 'c\_age'.
  - More details could be seen in our demo file.
  
 <font color=#B22222>For multiple datasets</font>, please note:

* Clinical data and Gene expression data must be uploaded in the same order.
* The samples of gene expression data and clinical data need to match in each dataset.
* Multiple datasets submitted need to be of the same data type, for example, they are all "array" or "RNA-seq".


## Set parameters
- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_all.csv".
- `Protocol normalization`(**required**): Set the case for data standardization. Options are:
    - *array_quantile*: The data type is array, which needs to be preprocessed by Quantile;
    - *array_none*: The data type is array, which does not require preprocessing;
    - *RNA-Seq_TPM*: The data type is RNA-seq, which requires TPM preprocessing; 
    - *RNA-Seq_none*: The data type is RNA-seq and no preprocessing is required.

- In addition, the user needs to complete the parameters for each TIME estimation tool.

**The following parameters are only used for multiple data sets:**

- `Platform`: The platform name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
- `Dataset name`: The name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
  

More information about paremeters could be seen in each TIME estimation tool.

## Results
### Cell fraction file(csv)
For each TIME estimation tool there are cell fraction files, take CIBERSORT for example:

- "Project name\_CIBERSORT\_full.csv":The deconvolution results of CIBERSORT, the first column is the immune cell type, and each column after that is a sample.
- "Project name\_CIBERSORT.csv":The deconvolution results of CIBERSORT after scaled(The sum of the proportion of different cells is 1), the first column is the immune cell type, and each column after that is a sample.If the option of MRNAscale is TRUE, this result is the same as "Project name\_full\_CIBERSORT.csv".

### ALL result file(csv)
- "Project name\_all.csv":The cell type result of seven TIME estimation tools, the first column is the sample name, and the first row is "cell name|method name".


### Clinical data(csv)
- "Project name\_clinical.csv":The clinical data used for visualization.


### Visualization
<center>TIME Estimation Cell Fraction Boxplot and Pie</center>

![avatar](https://timedb.deepomics.org/public/data/image/all_array_visualization.jpg)


The colors of all cells follow the following tree diagram, which is constructed according to cell classification:
<img src="https://timedb.deepomics.org/public/data/image/all_array_cell_tree.jpg">


## Download demo data
### Single dataset
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/all_array/single/input/RNA_GSE116959.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/all_array/single/input/Clinical_GSE116959.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/all_array/single/output.zip)
- [Consensus result](https://timedb.deepomics.org/public/data/module_demo/all_array/single/all.zip)

### Multiple datasets
- [Gene expression data1](https://timedb.deepomics.org/public/data/module_demo/all_array/multiple/input/RNA_GSE116959.csv)
- [Gene expression data2](https://timedb.deepomics.org/public/data/module_demo/all_array/multiple/input/RNA_GSE14922.csv)
- [Clinical data1](https://timedb.deepomics.org/public/data/module_demo/all_array/multiple/input/Clinical_GSE116959.csv)
- [Clinical data2](https://timedb.deepomics.org/public/data/module_demo/all_array/multiple/input/Clinical_GSE14922.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/all_array/multiple/output.zip)
- [Consensus result](https://timedb.deepomics.org/public/data/module_demo/all_array/multiple/all.zip)
