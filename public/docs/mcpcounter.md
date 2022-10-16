
# TIMEDB Deconv MCPcounter - Enrichment Tools
## Introduction
This model uses MCPcounter (Microenvironment Cell Populations-counter) method to quantify the absolute abundance of eight immune and two stromal cell populations in heterogeneous tissues from transcriptomic data provided interactive visualization for analysis results.

### Citation
Becht E, Giraldo N A, Lacroix L, et al. Estimating the population abundance of tissue-infiltrating immune and stromal cell populations using gene expression[J]. Genome biology, 2016, 17(1): 1-20.

&emsp;
## Module Overview
![avatar](https://timedb.deepomics.org/public/data/image/MCPcounter_structure.jpg)


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
- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_MCPcounter.csv".
- `Protocol normalization`(**required**): Set the case for data standardization. Options are:
    - *array_quantile*: The data type is an array, which needs to be preprocessed by Quantile;
    - *array_none*: The data type is an array, which does not require preprocessing;
    - *RNA-Seq_TPM*: The data type is RNA-seq, which requires TPM preprocessing; 
    - *RNA-Seq_none*: The data type is RNA-seq and no preprocessing is required.


**The following parameters are only used for multiple datasets:**

- `Platform`: The platform name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
- `Dataset name`: The name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
  
`Note that for multiple datasets, upload datasets from different platforms, or you can merge files into one dataset and use a module for a single dataset.`

More information about parameters could be seen in [MCPcounter](https://github.com/ebecht/MCPcounter).

&emsp;
## Results
### Cell fraction file(CSV)
- "Project name\_MCPcounter\_full.csv": The deconvolution results of MCPcounter, the first column is the immune cell type, and each column after that is a sample.
- "Project name\_MCPcounter.csv": The deconvolution results of MCPcounter after scaled(The sum of the proportion of different cells is 1), the first column is the immune cell type, and each column after that is a sample.

### Clinical data(CSV)
- "Project name\_Clinical.csv": The clinical data used for visualization.


### Visualization
<center>immune microenvironment landscape plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/MCPcounter_visualization.jpg)



The result's visualization consists of four parts:

- The first part is the `cell fraction heatmap` in the middle, each column is a sample, and each row is an immune cell. The darker the color, the larger the relative value of immune cells.

- The second part is the `stacked bar` on the cell fraction heatmap, a bar representing a sample, which shows the immune cell composition of each sample.

- The third part is the `box plot` on the left side of the cell fraction heatmap. Each box represents an immune cell, showing the distribution of this immune cell in the sample.

- The fourth part is the `clinical feature heatmap` under the cell fraction heatmap. Each row is a classification feature of the sample, and each column is a sample.


The colors of all cells follow the following tree diagram, which is constructed according to cell classification:
<img src="https://timedb.deepomics.org/public/data/image/MCPcounter_cell_tree.jpg">


&emsp;
## Download demo data
### Single dataset
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/single/RNA_TCGA_ACC.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/single/Clinical_TCGA_ACC.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/single/TCGA_ACC_MCPcounter.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/single/TCGA_ACC_MCPcounter_full.csv)

### Multiple datasets
- [Gene expression data1](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/mul/input/RNA_GSE9891.csv)
- [Gene expression data2](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/mul/input/RNA_GSE14922.csv)
- [Clinical data1](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/mul/input/Clinical_GSE9891.csv)
- [Clinical data2](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/mul/input/Clinical_GSE14922.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/mul/output/demo_MCPcounter.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/MCPcounter/mul/output/demo_MCPcounter_full.csv)
