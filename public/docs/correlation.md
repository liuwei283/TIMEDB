# TIMEDB Cell Correlation
# Introduction
Using TIME cell fraction as input, we conducted the Pearson correlation and associated significant test with R package “corrplot”. P value less than 0.05 is regarded as statistically significant.


### Citation
 Taiyun Wei, Viliam Simko, Michael Levy, Yihui Xie, Yan Jin, and Jeff Zemla. Package ‘cor-rplot’ Statistician, 56(316):e24, 2017.
  
## Module Structure


## Input file
`Cell fraction data`(**required**):the TIME cell fraction result(CSV).

*  The first two columns in the first row should be "sample\_name" and "method", followed by the TIME cell type
*  The first column should be the sample name.
*  The second column should be the method name to get the TIME cell fraction result.
![avatar](https://timedb.deepomics.org/public/data/image/correlation_input_cell_fraction.jpg)

`Cluster result data`(**optional**):the cluster result file(CSV)

  - The first row should be a header with a 'sample\_name' column label followed by clinical features.
  - The header line keyword of the classification feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of the continuous feature follows n\_[feature] format, such as 'c\_age'.
  - The column related to survival days should be named "os" or "pfs"(**required**), details are:
    - os: available for cancer or disease donors, overall survival days, the length of time from either the date of diagnosis or the start of treatment that a patient is still alive.
    - pfs: available for cancer or disease donors, progression-free survival days, the length of time during and after the treatment that a patient lives with the disease, but it does not get worse.
    - os\_status: available for cancer donors, the os outcome, binary, value of 1 for death, 0 for alive.
    - pfs\_status: available for cancer donors, the pfs outcome, binary, value of 1 for progression or recurrence, 0 for otherwise.
  - More details could be seen in our demo file.
![avatar](https://timedb.deepomics.org/public/data/image/correlation_input_clinical_data.jpg)

## Results

### Correlation result file(CSV)
The correlation result file: We classify samples according to "c\_" column of the cluster result file and analyze the correlation between fraction values of two different immune cell types. 

- Value column is correlation value.
- Pvalue is significant value. 
- Metric column is correlation method. 
- Method is cell fraction analysis method. 

Feature and group indicate current classification of sample.

![avatar](https://timedb.deepomics.org/public/data/image/correlation.jpg)
### Visualization

![avatar](https://timedb.deepomics.org/public/data/image/correlation_visualization.jpg)




## Download demo data
- [Cell fraction result file](https://timedb.deepomics.org/public/data/module_demo/correlation/TCGA_ACC_quanTIseq.csv)
- [Cluster result file](https://timedb.deepomics.org/public/data/module_demo/correlation/quanTIseq_cluster_Result.csv)
- [Correlation result file](https://timedb.deepomics.org/public/data/module_demo/correlation/demo_Correlation.csv)