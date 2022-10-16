# TIMEDB Deconv xCell - Enrichment Tools


## Introduction
xCell performs cell type enrichment analysis from gene expression data for 64 immune and stroma cell types. xCell is a gene signatures-based method learned from thousands of pure cell types from various sources. xCell applies a novel technique for reducing associations between closely related cell types. 



### Citation
Aran D, Hu Z, Butte A J. xCell: digitally portraying the tissue cellular heterogeneity landscape[J]. Genome biology, 2017, 18(1): 1-14.

&emsp;
## Module Overview
![avatar](https://timedb.deepomics.org/public/data/image/xCell_structure.jpg)


## Input file (The uploaded files should contain at least two samples.)
`Gene expression data`(**required**):the gene expression file(CSV)

*  The first row should be a header with a 'GeneSymbol' column label followed by the sample name.
*  The first column should be the gene symbol(HGNC ID). The HGNC ID could be found on [HGNC website](https://www.genenames.org/).
* The data type of reading count should be a number. 

`Clinical data`(**single mode: optional, multiple mode: required**):the clinical file(CSV)

* Clinical data is not required, and if clinical data is provided, the visualization will have a heatmap of the clinical features of the sample.
* If you want to display clinical features in the result visualization, please organize your data according to the following rules:
  - The header line keyword of the classification feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of the continuous feature follows n\_[feature] format, such as 'n\_age'.
  - More details could be seen in our demo file.


 <font color=#B22222>For multiple datasets</font>, please note:

* Clinical data and Gene expression data must be uploaded in the same order.
* The samples of gene expression data and clinical data need to match in each dataset.
* Multiple datasets submitted need to be of the same data type. For example, they are all "array" or "RNA-Seq".


## Set parameters
- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_quanTIseq.csv".
- `Protocol normalization`(**required**): Set the case for data standardization. Options are:
    - *array_quantile*: The data type is an array, which needs to be preprocessed by Quantile;
    - *array_none*: The data type is an array, which does not require preprocessing;
    - *RNA-Seq_TPM*: The data type is RNA-seq, which requires TPM preprocessing; 
    - *RNA-Seq_none*: The data type is RNA-seq and no preprocessing is required.
  

    For a single dataset, we set options, and you can choose one of the above four options. 



**The following parameters are only used for multiple datasets:**

- `Platform`: The platform name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
- `Dataset name`: The name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.

  
`Note that for multiple datasets, upload datasets from different platforms, or you can merge files into one dataset and use a module for a single dataset.`

More information about parameters could be seen in [xCell](https://github.com/giannimonaco/xCell).

&emsp;
## Results
### Cell fraction file(CSV)
- "Project name\_xCell\_full.csv": The deconvolution results of xCell, the first column is the immune cell type, and each column after that is a sample.
- "Project name\_xCell.csv": The deconvolution results of xCell after scaled (The sum of the proportion of different cells is 1), the first column is the immune cell type, and each column after that is a sample. In addition, For negative numbers > =-0.1, we convert it to 0, and for negative numbers <-0.1, we convert it to NA.

### Clinical data(CSV)
- "Project name\_clinical.csv": The clinical data used for visualization.


### Visualization
<center>Immune Microenvironment Landscape Plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/xCell_visualization.jpg)


The result's visualization  consists of four parts:

- The first part is the `cell fraction heatmap` in the middle, each column is a sample, and each row is an immune cell. The darker the color, the larger the relative value of immune cells.

- The second part is the `stacked bar` on the cell fraction heatmap, a bar representing a sample, which shows the immune cell composition of each sample.

- The third part is the `box plot` on the left side of the cell fraction heatmap. Each box represents an immune cell, showing the distribution of this immune cell in the sample.

- The fourth part is the `clinical feature heatmap` under the cell fraction heatmap. Each row is a classification feature of the sample, and each column is a sample.

The colors of all cells follow the following tree diagram, which is constructed according to cell classification:
<img src="https://timedb.deepomics.org/public/data/image/xCell_cell_tree.jpg">

&emsp;
## Download demo data
### Single dataset
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/xCell/single/RNA_TCGA_ACC.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/xCell/single/Clinical_TCGA_ACC.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/xCell/single/TCGA_ACC_xCell.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/xCell/single/TCGA_ACC_xCell_full.csv)

### Multiple datasets
- [Gene expression data1](https://timedb.deepomics.org/public/data/module_demo/xCell/mul/input/RNA_TCGA_ACC.csv)
- [Gene expression data2](https://timedb.deepomics.org/public/data/module_demo/xCell/mul/input/RNA_TCGA_BLCA.csv)
- [Clinical data1](https://timedb.deepomics.org/public/data/module_demo/xCell/mul/input/Clinical_TCGA_ACC.csv)
- [Clinical data2](https://timedb.deepomics.org/public/data/module_demo/xCell/mul/input/Clinical_TCGA_BLCA.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/xCell/mul/output/demo_xCell.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/xCell/mul/output/demo_xCell_full.csv)