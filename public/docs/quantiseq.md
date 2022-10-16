# TIMEDB Deconv quanTIseq  - Regression Tools

## Introduction

This model uses the quanTIseq (quantification of the Tumor Immune contexture from human RNA-seq data) method to quantify the proportion of 10 different immune cell types and the proportion of other non-characteristic cells in the heterogeneous sample. Besides, our platform provides <font color=#B22222>interactive visualization analysis result</font>.

### Citation

Finotello F, Mayer C, Plattner C, Laschober G, Rieder D, Hackl H, Krogsdam A, Loncova Z, Posch W, Wilflingseder D, Sopper S, Ijsselsteijn M, Brouwer TP, Johnson D, Xu Y, Wang Y, Sanders ME, Estrada MV, Ericsson-Gonzalez P, Charoentong P, Balko J, de Miranda NFDCC, Trajanoski Z. Molecular and pharmacological modulators of the tumor immune contexture revealed by deconvolution of RNA-seq data. Genome Medicine, 2019. 11(1):34.

&emsp;
## Module Overview

![avatar](https://timedb.deepomics.org/public/data/image/quantiseq_structure.jpg)

## Input file (The uploaded files should contain at least two samples.)

`Gene expression data`(**required**):the gene expression file(CSV)

*  The first row should be a header with a 'GeneSymbol' column label followed by the sample name.
*  The first column should be the gene symbol(HGNC ID). The HGNC ID could be found on [HGNC website](https://www.genenames.org/).
*  The data type of reading count should be a number. 

`Clinical data`(**single mode: optional, multiple mode: required**):the clinical file(CSV)

* Clinical data is not required, and if clinical data is provided, the visualization will have a heatmap of the clinical features of the sample.
* If you want to display clinical features in the result visualization, please organize your data according to the following rules:
  - The header line keyword of the classification feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of the continuous feature follows n\_[feature] format, such as 'c\_age'.
  - More details could be seen in our demo file.
* <font color=#B22222>If clinical data is input</font>:when parameter Tumor is <font color=#B22222>Mixture</font>, Clinical data with <font color=#B22222>"c\_tumor\_subtype"</font> column is required. (normal sample should be filled with"normal", and tumor samples could be filled with "tumor" or detailed tumor subtypes.)

 <font color=#B22222>For multiple datasets</font>, please note:

* Clinical data and Gene expression data must be uploaded in the same order.
* The samples of gene expression data and clinical data need to match in each dataset.
* Multiple datasets submitted need to be of the same data type. For example, they are all "array" or "RNA-seq".


## Set parameters

- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_quanTIseq.csv".
- `Protocol normalization`(**required**): Set the case for data standardization. Options are:
  - *array_quantile*: The data type is an array, which needs to be preprocessed by Quantile;
  - *array_none*: The data type is an array, which does not require preprocessing;
  - *RNA-seq_TPM*: The data type is RNA-seq, which requires TPM preprocessing; 
  - *RNA-seq_none*: The data type is RNA-seq and no preprocessing is required.


    For a single dataset, we set options, and you can choose one of the above four options. 
    
    For multiple datasets, you need to manually fill in the operations for each dataset and <font color=#B22222>separate them with commas</font>, such as "array\_quantile,array\_quantile,array\_none".

- `Tumor`:Set whether the sample is tumor or not. Options are:
  - *TRUE*: all the samples in the uploaded gene expression file are tumor samples. (<font color=purpule>default</font>)
  - *FALSE*: all the samples in the uploaded gene expression file are normal samples.
  - *mixture*: The samples in the gene expression file are a mixture of cancer and normal samples. If you choose this, there must be a column named "c\_tumor\_subtype" filled with "normal" and "tumor" in your uploaded Clinical data.
- `MRNAscale`:Options are：
  - *TRUE*: Cell fractions must be scaled to account for cell-type-specific mRNA content. (<font color=purpule>default</font>)
  - *FALSE*: Cell fractions will not be scaled to account for cell-type-specific mRNA content.
- `Deconvolution method`: Choose the method for regression. Options are：
  - *hampel*: Robust regression with Hampel.
  - *huber*: Robust regression with Huber.
  - *bisquare*: Robust regression with Tukey bisquare estimators.
  - *lsei*: Constrained least squares regression. In the result file, the fraction of uncharacterized cells ("other") is computed only by the "lsei" method. (<font color=purpule>default</font>)
- `Btotalcells`: 
  - *TRUE*: Compute cell densities instead of fractions;
  - *FALSE*: Compute cell fractions. (<font color=purpule>default</font>)

**The following parameters are only used for multiple datasets:**

- `Platforms`: The list of sequencing platforms of datasets, <font color=#B22222>separated by comma</font>, such as "GPL570,GPL571,GPL690".
- `Dataset names`: The list of names of datasets, <font color=#B22222>separated by comma</font>, such as "GES14337,GES19794,GSE68492".

More information about parameters could be seen in [quanTIseq](https://github.com/icbi-lab/quanTIseq).

&emsp;
## Results

### Cell fraction file(CSV)

- "Project name\_full\_quanTIseq.csv": The deconvolution results of quanTIseq, the first column is the immune cell type, and each column after that is a sample.
- "Project name\_quanTIseq.csv": The deconvolution results of quanTIseq after scaled (The sum of the proportion of different cells is 1), the first column is the immune cell type, and each column after that is a sample. If the option of MRNAscale is TRUE, this result is the same as "Project name\_full\_quanTIseq.csv".

### Clinical data(CSV)

- "Project name\_clinical.csv": The clinical data used for visualization.


### Visualization

<center>Immune Microenvironment Landscape Plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/quantiseq_visualization.jpg)


The result's visualization  consists of four parts:

- The first part is the `cell fraction heatmap` in the middle, each column is a sample, and each row is an immune cell. The darker the color, the larger the relative value of immune cells.

- The second part is the `stacked bar` on the cell fraction heatmap, a bar representing a sample, which shows the immune cell composition of each sample.

- The third part is the `box plot` on the left side of the cell fraction heatmap. Each box represents an immune cell, showing the distribution of this immune cell in the sample.

- The fourth part is the `clinical feature heatmap` under the cell fraction heatmap. Each row is a classification feature of the sample, and each column is a sample.

The colors of all cells follow the following tree diagram, which is constructed according to cell classification:
<img src="https://timedb.deepomics.org/public/data/image/quantiseq_cell_tree.jpg">

&emsp;
### Editor settings

*  Change the color of lines (Motion picture).
*  Filter the sample (Motion picture).

## Download demo data

-  [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/Gene expression data_demo.csv).
-  [Clinical data](https://timedb.deepomics.org/public/data/module_demo/Clinical data_demo.csv).