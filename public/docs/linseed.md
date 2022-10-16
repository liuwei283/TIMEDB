
# TIMEDB Deconv LinSeed

## Introduction

This module uses the Linseed (LINear Subspace identification for Gene Expression Deconvolution) method to explore gene expression datasets in linear space.

### Attention

This deconvolution method is an <font color=#B22222>unsupervised learning method</font>, which only clusters immune cells without specific cell types.

### Citation

Zaitsev K, Bambouskova M, Swain A, et al. Complete deconvolution of cellular mixtures based on the linearity of transcriptional signatures[J]. Nature communications, 2019, 10(1): 1-16.

&nbsp;
## Module Structure

![avatar](https://timedb.deepomics.org/public/data/image/linseed_structure.jpg)

&emsp;
## Input file

`Gene expression data`（**required**）:the gene expression file(CSV)

*  The first row should be a header with a 'GeneSymbol' column label followed by the sample name.
*  The first column should be the gene symbol(HGNC ID). The HGNC ID could be found on [HGNC website](https://www.genenames.org/).
*  The data type of reading count should be a number. 
   ![avatar](https://timedb.deepomics.org/public/data/image/linseed_input_data.jpg)

&emsp;
## Set parameters

- `Cell type number`: Set the number of immune cells in the cell fraction file(default is 2).

- `Spearman threshold`:Set the threshold of spearman correlation to filter the gene (default is 0).

- `Filter Pval`: Set the P value of spearman correlation threshold results to filter the gene (default is 0.01).

- `Project name`（**required**）: Set the name of this data and the cell fraction result will be named as "Project name\_Linseed.csv".

More information about parameters could be seen in [LinSeed](https://github.com/ctlab/LinSeed).

&emsp;
## Results

### Cell fraction file(CSV)

The deconvolution results of Linseed. The first column is the immune cell type, and each column after that is a sample.
![avatar](https://timedb.deepomics.org/public/data/image/linseed_result.jpg)

&emsp;
### Visualization

Each broken line represents a cell type, and each dot represents a sample.
![avatar](https://timedb.deepomics.org/public/data/image/linseed_visualization.jpg)

&emsp;
## Download demo data

- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/Gene expression data_demo.csv)
- [Cell fraction result](https://timedb.deepomics.org/public/data/module_demo/Clinical data_demo.csv)