
# TIMEDB Deconv ConsensusTME - Enrichment Tools

## Introduction
ConsensusTME is a consensus-based approach to generating cancer-specific gene sets for multiple cell types found within the tumor microenvironment. This package allows access to these gene sets and provides a wrapper for using these gene sets with various statistical frameworks to generate normalized enrichment scores. These can be used to identify relative quantities of cell types across multiple samples. This requires a bulk tumor gene expression profile as an input. <font color=#B22222>ConsensusTME is only used for 32 cancer types from TCGA.</font>

### Citation
Jiménez-Sánchez A, Cast O, Miller ML. Comprehensive Benchmarking and Integration of Tumor Microenvironment Cell Estimation Methods. Cancer Res. 2019 Dec 15;79(24):6238-6246. doi: 10.1158/0008-5472.CAN-18-3560. Epub 2019 Oct 22. PMID: 31641033.

&emsp;
## Module Overview
![avatar](https://timedb.deepomics.org/public/data/image/ConsensusTME_structure.jpg)


## Input file (The uploaded files should contain at least two samples.)
`Gene expression data`(**required**):the gene expression file(CSV)

*  The first row should be a header with a 'GeneSymbol' column label followed by the sample name.
*  The first column should be the gene symbol(HGNC ID). The HGNC ID could be found on [HGNC website](https://www.genenames.org/).
* The data type of reading count should be a number. 

`Clinical data`(**single mode: optional, multiple mode: required**):the clinical file(CSV)

* Clinical data is not required, and if clinical data is provided, the visualization will have a heatmap of the clinical features of the sample.
* If you want to display clinical features in the result visualization, please organize your data according to the following rules:
  - The header line keyword of the classification feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of the continuous feature follows n\_[feature] format, such as 'c\_age'.
  - More details could be seen in our demo file.


 <font color=#B22222>For multiple datasets</font>, please note:

* Clinical data and Gene expression data must be uploaded in the same order.
* The samples of gene expression data and clinical data need to match in each dataset.
* Multiple datasets submitted need to be of the same data type. For example, they are all "array" or "RNA-seq".


## Set parameters
- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_ConsensusTME.csv".
- `Protocol normalization`(**required**): Set the case for data standardization. Options are:
    - *array_quantile*: The data type is an array, which needs to be preprocessed by Quantile;
    - *array_none*: The data type is an array, which does not require preprocessing;
    - *RNA-Seq_TPM*: The data type is RNA-seq, which requires TPM preprocessing; 
    - *RNA-Seq_none*: The data type is RNA-seq and no preprocessing is required.
  
- `Cancer type`:Set the cancer type of samples. Options are：
    - *32 TCGA cancer types*: 
      - ACC(Adrenocortical carcinoma)
      - BLCA(Bladder Urothelial Carcinoma)
      - BRCA(Breast invasive carcinoma)
      - CESC(Cervical squamous cell carcinoma and endocervical adenocarcinoma)
      - CHOL(Cholangiocarcinoma)
      - COAD(Colon adenocarcinoma)
      - DLBC(Lymphoid Neoplasm Diffuse Large B-cell Lymphoma)
      - ESCA(Esophageal carcinoma)
      - GBM(Glioblastoma multiforme)
      - HNSC(Head and Neck squamous cell carcinoma)
      - KICH(Kidney Chromophobe)
      - KIRC(Kidney renal clear cell carcinoma)
      - KIRP(Kidney renal papillary cell carcinoma)
      - LGG(Brain Lower Grade Glioma)
      - LIHC(Liver hepatocellular carcinoma)
      - LUAD(Lung adenocarcinoma)
      - LUSC(Lung squamous cell carcinoma)
      - MESO(Mesothelioma)
      - OV(Ovarian serous cystadenocarcinoma)
      - PAAD(Pancreatic adenocarcinoma)
      - PCPG(Pheochromocytoma and Paraganglioma)
      - PRAD(Prostate adenocarcinoma)
      - READ(Rectum adenocarcinoma)
      - SARC(Sarcoma)
      - SKCM(Skin Cutaneous Melanoma)
      - STAD(Stomach adenocarcinoma)
      - TGCT(Testicular Germ Cell Tumors)
      - THCA(Thyroid carcinoma)
      - THYM(Thymoma)
      - UCEC(Uterine Corpus Endometrial Carcinoma)
      - UCS(Uterine Carcinosarcoma)
      - UVM(Uveal Melanoma)
    - *Mixture*: when parameter "Cancer type" is Mixture, Clinical data with "cancer\_name" column is required. (This column should be filled with the abbreviation for TCGA 32 cancer types, and details could be found in demo data.)
  
**The following parameters are only used for multiple data sets:**

- `Platform`: The platform name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
- `Dataset name`: The name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
  

More information about parameters could be seen in [ConsensusTME](https://rdrr.io/github/cansysbio/ConsensusTME/). In addition, For negative numbers, we convert them to NA.

&emsp;
## Results
### Cell fraction file(CSV)
- "Project name\_ConsensusTME\_full.csv": The deconvolution results of ConsensusTME, the first column is the immune cell type, and each column after that is a sample.
- "Project name\_ConsensusTME.csv": The deconvolution results of ConsensusTME after scaling (The sum of the proportion of different cells is 1), the first column is the immune cell type, and each column after that is a sample. 

### Clinical data(CSV)
- "Project name\_clinical.csv": The clinical data used for visualization.


### Visualization
<center>Immune Microenvironment Landscape Plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/ConsensusTME_visualization.jpg)



The result's visualization  consists of four parts:

- The first part is the `cell fraction heatmap` in the middle, each column is a sample, and each row is an immune cell. The darker the color, the larger the relative value of immune cells.

- The second part is the `stacked bar` on the cell fraction heatmap, a bar representing a sample, which shows the immune cell composition of each sample.

- The third part is the `box plot` on the left side of the cell fraction heatmap. Each box represents an immune cell, showing the distribution of this immune cell in the sample.

- The fourth part is the `clinical feature heatmap` under the cell fraction heatmap. Each row is a classification feature of the sample, and each column is a sample.

The colors of all cells follow the following tree diagram, which is constructed according to cell classification:
<img src="https://timedb.deepomics.org/public/data/image/ConsensusTME_cell_tree.jpg">


&emsp;
## Download demo data
### Single dataset
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/single/RNA_TCGA_ACC.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/single/Clinical_TCGA_ACC.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/single/TCGA_ACC_ConsensusTME.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/single/TCGA_ACC_ConsensusTME_full.csv)

### Multiple datasets
- [Gene expression data1](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/mul/input/RNA_GSE116959.csv)
- [Gene expression data2](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/mul/input/RNA_GSE14922.csv)
- [Input Clinical data1](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/mul/input/Clinical_GSE116959.csv)
- [Input Clinical data2](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/mul/input/Clinical_GSE14922.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/mul/output/demo_ConsensusTME_full.csv)
- [Outout Clinical data](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/mul/output/demo_Clinical.csv)

### Mixture dataset
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/single/RNA_Mixture.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/ConsensusTME/single/Clinical_Mixture.csv)