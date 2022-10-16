# TIMEDB Cell Fraction Subtyping
# Introduction
We utilized the obtained TIME cell fraction profiles and three unsupervised clustering approaches k-means, hierarchical clustering, and non-negative matrix factorization to get the patient subtyping. Moreover, we grouped the patients into quantiles according to the absolute TIME cell fraction score and treated quantiles as the patient subtype. For instance, the patients can be classified into Q1 B-cell (0%-25%), Q2 B-cell (25%-50%), Q3 B-cell (50%-75%), Q4 B-cell (75%-100%) according to B-cell fraction quantiles. We wrapped these scripts into the analysis module “TIMEDB Cell Fraction Subtyping” for researchers to run their newly sequenced data.

&emsp;
## Module Structure
![avatar](https://timedb.deepomics.org/public/data/image/Cell_fraction_subtyping_structure.jpg)



## Input file
`Cell fraction data`(**required**): the TIME cell fraction result(CSV).

*  The first two columns in the first row should be "sample\_name" and "method", followed by the TIME cell type
*  The first column should be the sample name.
*  The second column should be the method name to get the TIME cell fraction result.
![avatar](https://timedb.deepomics.org/public/data/image/Cell_fraction_subtyping_input_cell_fraction.jpg)

`Clinical data`(**optional**):the clinical file(CSV)

* Clinical data is not required, and if clinical data is provided, the visualization will have a heatmap of the clinical features of the sample.
* If you want to display clinical features in the result visualization, please organize your data according to the following rules:
  - The header line keyword of the classification feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of the continuous feature follows n\_[feature] format, such as 'c\_age'.
  - More details could be seen in our demo file.

## Set parameters
- `Cluster groups`(**required**): Set the number of groups for the subtyping (default is 4).
- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_cluster\_result.csv" and "Project name\_umap\_result.csv".

&emsp;
## Results
### Cluster result file(CSV)
The sample classification results according to cell fraction. The first column is the sample name followed by clinical features and cluster results. For the clustering result, the column name format is "c\_sub\_cluster method\_cell name". For example, "c\_sub\_Quantile\_B cell" is the result of classifying the B cell fraction of the sample using the quantile method.

![avatar](https://timedb.deepomics.org/public/data/image/Cell_fraction_subtyping_output_cluster.jpg)

### Umap result file(CSV)
The coordinates of the sample after UMAP operation, the first column is the sample name, the second column is the x coordinate and the third column is the y coordinate.

![avatar](https://timedb.deepomics.org/public/data/image/Cell_fraction_subtyping_output_umap.jpg)

### Visualization
<center>Patient Subtyping Stacked Bar</center>
![avatar](https://timedb.deepomics.org/public/data/image/Cell_fraction_subtyping_visualization.jpg)


&emsp;
## Download demo data
- [Cell fraction data](https://timedb.deepomics.org/public/data/module_demo/Cell_fraction_subtyping/input/TCGA_ACC_quanTIseq.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/Cell_fraction_subtyping/input/Clinical_TCGA_ACC.csv)
- [Cluster result file](https://timedb.deepomics.org/public/data/module_demo/Cell_fraction_subtyping/output/quanTIseq_cluster_Results.csv)
- [Umap result file](https://timedb.deepomics.org/public/data/module_demo/Cell_fraction_subtyping/output/quanTIseq_umap_Results.csv)