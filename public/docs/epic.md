# TIMEDB Deconv EPIC  - Regression Tools

## Introduction
EPIC takes as input bulk gene expression data (RNA-seq) and returns the proportion of mRNA and cells composing the various samples. <font color=#B22222>EPIC is only suitable for RNA-Seq data</font>.

### Citation
Racle J, Gfeller D. EPIC: A Tool to Estimate the Proportions of Different Cell Types from Bulk Gene Expression Data. Methods Mol Biol. 2020;2120:233-248. doi: 10.1007/978-1-0716-0327-7_17. PMID: 32124324.

&emsp;
## Module Overview
![avatar](https://timedb.deepomics.org/public/data/image/EPIC_structure.jpg)


## Input file (The uploaded files should contain at least two samples.)
`Gene expression data`(**required**):the gene expression file(CSV)

*  The first row should be a header with a 'GeneSymbol' column label followed by the sample name.
*  The first column should be the gene symbol(HGNC ID). The HGNC ID could be found on [HGNC website](https://www.genenames.org/).
* The data type of reading count should be number. 

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
- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_EPIC.csv".
- `Protocol normalization`(**required**): Set the case for data standardization. Options are:
    - *array_quantile*: The data type is an array, which needs to be preprocessed by Quantile;
    - *array_none*: The data type is an array, which does not require preprocessing;
    - *RNA-Seq_TPM*: The data type is RNA-seq, which requires TPM preprocessing; 
    - *RNA-Seq_none*: The data type is RNA-seq and no preprocessing is required.
  
- `Tumor`:Set whether the sample is tumor or not. Options are：
    - *TRUE*: The bulk samples and reference gene expression profiles should be rescaled based on the list of genes in common between them. (<font color=purpule>default</font>)
    - *FALSE*: The bulk samples and reference gene expression profiles should be rescaled based on the list of genes in common between them. 
    - *Mixture*: The samples in the gene expression file are a mixture of cancer and normal samples. If you choose this, there must be a column named "c_tumor_subtype" filled with "normal" and "tumor" in your uploaded Clinical data. Details could be found in demo data.
- `MRNAscale`:Options are：
    - *TRUE*: Cell fractions must be scaled to account for cell-type-specific mRNA content. (<font color=purpule>default</font>)
    - *FALSE*: Cell fractions will not be scaled to account for cell-type-specific mRNA content.



**The following parameters are only used for multiple data sets:**

- `Platform`: The platform name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
- `Dataset name`: The name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
  

More information about parameters could be seen in [EPIC](http://epic.gfellerlab.org).

&emsp;
## Results
### Cell fraction file(CSV)
- "Project name\_EPIC\_full.csv": The deconvolution results of EPIC, the first column is the immune cell type, and each column after that is a sample.
- "Project name\_EPIC.csv": The deconvolution results of EPIC after scaling (The sum of the proportion of different cells is 1), the first column is the immune cell type, and each column after that is a sample. If the option of MRNAscale is TRUE, this result is the same as "Project name\_full\_EPIC.csv".

### Clinical data(CSV)
- "Project name\_clinical.csv": The clinical data used for visualization.


### Visualization
<center>Immune Microenvironment Landscape Plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/EPIC_visualization.jpg)



The result's visualization  consists of four parts:

- The first part is the `cell fraction heatmap` in the middle, each column is a sample, and each row is an immune cell. The darker the color, the larger the relative value of immune cells.

- The second part is the `stacked bar` on the cell fraction heatmap, a bar representing a sample, which shows the immune cell composition of each sample.

- The third part is the `box plot` on the left side of the cell fraction heatmap. Each box represents an immune cell, showing the distribution of this immune cell in the sample.

- The fourth part is the `clinical feature heatmap` under the cell fraction heatmap. Each row is a classification feature of the sample, and each column is a sample.

The colors of all cells follow the following tree diagram, which is constructed according to cell classification:
<img src="https://timedb.deepomics.org/public/data/image/EPIC_cell_tree.jpg">

&emsp;
## Download demo data
### Single dataset
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/EPIC/single/RNA_TCGA_ACC.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/EPIC/single/Clinical_TCGA_ACC.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/EPIC/single/TCGA_ACC_EPIC.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/EPIC/single/TCGA_ACC_EPIC_full.csv)

### Multiple datasets
- [Gene expression data1](https://timedb.deepomics.org/public/data/module_demo/EPIC/mul/input/RNA_TCGA_ACC.csv)
- [Gene expression data2](https://timedb.deepomics.org/public/data/module_demo/EPIC/mul/input/RNA_TCGA_BLCA.csv)
- [Clinical data1](https://timedb.deepomics.org/public/data/module_demo/EPIC/mul/input/Clinical_TCGA_ACC.csv)
- [Clinical data2](https://timedb.deepomics.org/public/data/module_demo/EPIC/mul/input/Clinical_TCGA_BLCA.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/EPIC/mul/output/demo_EPIC.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/EPIC/mul/output/demo_EPIC_full.csv)


### Mixture dataset
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/EPIC/single/RNA_Mixture.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/EPIC/single/Clinical_Mixture.csv)