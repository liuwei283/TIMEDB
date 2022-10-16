# TIMEDB cell Interaction
# Introduction
With TIME cell fraction as input, we conducted the Pearson correlation and associated significant test with R package “corrplot”. P value less than 0.05 is regarded as statistically significant.


### Citation
 Taiyun Wei, Viliam Simko, Michael Levy, Yihui Xie, Yan Jin, and Jeff Zemla. Package ‘cor-rplot’ Statistician, 56(316):e24, 2017.
 
&emsp;
## Module Structure
![avatar](https://timedb.deepomics.org/public/data/image/interaction_structure.jpg)

&emsp;
## Input file
`Cell fraction data`(**required**):the TIME cell fraction result(CSV).

*  The first two columns in the first row should be "sample\_name" and "method", followed by the TIME cell type
*  The first column should be the sample name.
*  The second column should be the method name to get the TIME cell fraction result.
![avatar](https://timedb.deepomics.org/public/data/image/interaction_input_cell_fraction.jpg)

`Cluster result data`(**optional**):the cluster result file(CSV)

  - The first row should be a header with a 'sample\_name' column label followed by clinical features.
  - The header line keyword of the classification feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of the continuous feature follows n\_[feature] format, such as 'c\_age'.
  - The column related to survival days should be named "os" or "pfs".
  - More details could be seen in our demo file.
![avatar](https://timedb.deepomics.org/public/data/image/interaction_input_clinical_data.jpg)

&emsp;
## Results
### Interaction result file(CSV)
The correlation result file: We classify samples according to "c\_" column of the cluster result file and analyze the correlation between fraction values of two different immune cell types. 

- Value column is correlation value.
- Pvalue is significant value. 
- Metric column is correlation method. 
- Method is cell fraction analysis method. 

Feature and group indicate current classification of sample.

![avatar](https://timedb.deepomics.org/public/data/image/interaction_correlation.jpg)
&emsp;
### Visualization
<center>Chord plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/interaction_visualization.jpg)



## Download demo data
- [Cluster result data](https://timedb.deepomics.org/public/data/module_demo/interaction/quanTIseq_cluster_Results.csv)
- [Cell fraction data](https://timedb.deepomics.org/public/data/module_demo/interaction/TCGA_ACC_quanTIseq.csv)
- [Interaction result file](https://timedb.deepomics.org/public/data/module_demo/interaction/demo_Interaction.csv)



