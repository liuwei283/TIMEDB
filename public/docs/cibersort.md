# TIMEDB Deconv CIBERSORT - Regression Tools

## Introduction
CIBERSORT is an analytical tool from the Alizadeh Lab developed by Newman et al. to provide an estimation of the abundances of member cell types in a mixed cell population using gene expression data.

### Citation
Newman, A. M., Liu, C. L., Green, M. R., Gentles, A. J., Feng, W., Xu, Y., Hoang, C. D., Diehn, M., & Alizadeh, A. A. (2015). Robust enumeration of cell subsets from tissue expression profiles. Nature methods, 12(5), 453–457. https://doi.org/10.1038/nmeth.3337

&emsp;
## Module Overview
![avatar](https://timedb.deepomics.org/public/data/image/CIBERSORT_structure.jpg)

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

- `Signature file`:To use CIBERSORT with this package, you need to register on the CIBERSORT website, obtain a license, and download the "LM22.txt", or you can prepare your own signature file. 
  Mixture file formatting requirements for use with LM22 are listed below. Improperly formatted files may cause CIBERSORT to fail to run.
   - Tab-delimited tabular input format with no double quotations and no missing entries.
     HUGO gene symbols in column 1; Mixture labels in row 1
   - Data should be in non-log space. Note: if the maximum expression value is <50; CIBERSORT will assume that data are in log space and will anti-log all expression values by 2x.
   - CIBERSORT will (by default) normalize the input by quantile normalization. This can be disabled in the configuration of a CIBERSORT job.
   - If gene symbols are redundant, CIBERSORT will choose the one with the highest mean expression across the mixtures.
   - CIBERSORT performs a feature selection. Therefore, it typically does not use all genes in the signature matrix. It is generally ok if some genes are missing from the user’s mixture file. If <50% of signature matrix genes overlap, CIBERSORT will issue a warning.
   - For example, files and tips on preparing data, see the [CIBERSORT](https://cibersort.stanford.edu/tutorial.php).

- `CIBERSORT.R`: To use CIBERSORT with this package, you need to register on the CIBERSORT website, obtain a license, and download the CIBERSORT source code. Details could be found on the [CIBERSORT](https://cibersort.stanford.edu/tutorial.php).

 <font color=#B22222>For multiple datasets</font>, please note:

* Clinical data and Gene expression data must be uploaded in the same order.
* The samples of gene expression data and clinical data need to match in each dataset.
* Multiple datasets submitted need to be of the same data type. For example, they are all "array" or "RNA-seq".

&emsp;
## Set parameters
- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_CIBERSORT.csv".
- `Protocol normalization`(**required**): Set the case for data standardization. Options are:
    - *array_quantile*: The data type is an array, which needs to be preprocessed by Quantile;
    - *array_none*: The data type is an array, which does not require preprocessing;
    - *RNA-Seq_TPM*: The data type is RNA-seq, which requires TPM preprocessing; 
    - *RNA-Seq_none*: The data type is RNA-seq and no preprocessing is required.

- `mRNAscale`:Options are：
    - *TRUE*: Cell fractions must be scaled to account for cell-type-specific mRNA content.
    - *FALSE*: Cell fractions will not be scaled to account for cell-type-specific mRNA content.(<font color=purpule>default</font>)

- `Permutation times`:Set permutations for statistical analysis (≥100 permutations recommended).
- `Absolute method`:Choose method("sig.score" or "no.sumto1") to compute absolute score (only be used if MRNAscale=FALSE).
- `Filter Pval`: Set the P value to filter the sample in the deconvolution result.(<font color=purpule>default=0.05</font>) In "project name\_CIBERSORT.csv", we will filter the sample whose p value>Filter Pval, and full results could be found in "project name\_CIBERSORT\_full.csv"



**The following parameters are only used for multiple datasets:**

- `Platform`: The platform name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
- `Dataset name`: The name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
  

More information about parameters could be seen in [CIBERSORT](https://cibersort.stanford.edu/).

&emsp;
## Results
### Cell fraction file(CSV)
- "Project name\_CIBERSORT\_full.csv": The deconvolution results of CIBERSORT, the first column is the immune cell type, and each column after that is a sample.
- "Project name\_CIBERSORT.csv": The deconvolution results of CIBERSORT after scaled(The sum of the proportion of different cells is 1), the first column is the immune cell type, and each column after that is a sample. If the option of MRNAscale is TRUE, this result is the same as "Project name\_full\_CIBERSORT.csv".

### Clinical data(CSV)
- "Project name\_clinical.csv": The clinical data used for visualization.

### Visualization
<center>Immune Microenvironment Landscape Plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/CIBERSORT_visualization.jpg)


The result's visualization  consists of four parts:

- The first part is the `cell fraction heatmap` in the middle, each column is a sample, and each row is an immune cell. The darker the color, the larger the relative value of immune cells.

- The second part is the `stacked bar` on the cell fraction heatmap, a bar representing a sample, which shows the immune cell composition of each sample.

- The third part is the `box plot` on the left side of the cell fraction heatmap. Each box represents an immune cell, showing the distribution of this immune cell in the sample.

- The fourth part is the `clinical feature heatmap` under the cell fraction heatmap. Each row is a classification feature of the sample, and each column is a sample.

The colors of all cells follow the following tree diagram, which is constructed according to cell classification:
<img src="https://timedb.deepomics.org/public/data/image/CIBERSORT_cell_tree.jpg">

&emsp;
## Download demo data
### Single dataset
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/single/RNA_TCGA_ACC.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/single/Clinical_TCGA_ACC.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/single/TCGA_ACC_CIBERSORT.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/single/TCGA_ACC_CIBERSORT_full.csv)

### Multiple datasets
- [Gene expression data1](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/mul/input/RNA_TCGA_ACC.csv)
- [Gene expression data2](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/mul/input/RNA_TCGA_BLCA.csv)
- [Clinical data1](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/mul/input/Clinical_TCGA_ACC.csv)
- [Clinical data2](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/mul/input/Clinical_TCGA_BLCA.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/mul/output/demo_CIBERSORT.csv)
- [Cell fraction full result](https://timedb.deepomics.org/public/data/module_demo/CIBERSORT/mul/output/demo_CIBERSORT_full.csv)

