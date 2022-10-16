# TIMEDB HR OR
# Introduction
Prognostic associations hazard ratio (HR) and odds ratio (OR) between patient subtypes and survival outcomes (OS or PFS) are conducted by multivariate Cox regression and logistic regression repressively. R package “survival”  and “oddsratio” were used. P value less than 0.05 is regarded as statistically significant. We report the 95% confidence intervals (CIs) if necessary. We wrapped the prognostic associations analysis into the analysis module “TIMEDB HR OR” for researchers to run their newly sequenced data and customized clinical subgroup labels.


### Citation
Terry M Therneau and Thomas Lumley. Package ‘survival’. R Top Doc, 128(10):28–33,2015.
 
&emsp;
## Module Structure
![avatar](https://timedb.deepomics.org/public/data/image/HR_OR_structure.jpg)

## Input file

`Cluster result data`(**required**):the cluster result file(CSV)

  - The first row should be a header with a 'sample\_name' column label followed by clinical features.
  - The header line keyword of the classification feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of the continuous feature follows n\_[feature] format, such as 'c\_age'.
  - The column related to survival days should be named "os" or "pfs"(**required**), details are:
    - os: available for cancer or disease donors, overall survival days, the length of time from either the date of diagnosis or the start of treatment that a patient is still alive.
    - pfs: available for cancer or disease donors, progression-free survival days, the length of time during and after the treatment that a patient lives with the disease, but it does not get worse.
    - os\_status: available for cancer donors, the os outcome, binary, value of 1 for death, 0 for alive.
    - pfs\_status: available for cancer donors, the pfs outcome, binary, value of 1 for progression or recurrence, 0 for otherwise.
  - More details could be seen in our demo file.
![avatar](https://timedb.deepomics.org/public/data/image/HR_OR_input_clinical_data.jpg)

## Set parameters
- `Project name`(**required**): Set the name of this data. The HR result will be named as "Project name\_hazard\_ratio.csv" and the OR result will be named as "Project name\_odds\_ratio.csv", 

&emsp;
## Results
### Hazard ratio result file(CSV)
- The hazard ratio result file: we group samples according to the "Variable" column.
- The "Survival" column indicates whether HR is calculated according to os or pfs metrics.
- The "Pr(>|z|)" column indicates the significance level of HR.
- The "lower .95" and "upper .95" columns show the reliable range of values in which we expect the proper population parameter to be included.
- Columns that begin with "pretty\_" result from tweaking the original data for visualization.

More information could be found in our demo data.
### Odds ratio result file(CSV)
- The hazard ratio result file: we group samples according to the "Variable" column.
- The "Survival" column indicates whether HR is calculated according to os or pfs metrics.
- The "Pr(>|z|)" column indicates the significance level of OR.
- The "lower .95" and "upper .95" columns show the reliable range of values in which we expect the true population parameter to be included.
- Columns that begin with "pretty\_" result from tweaking the original data for visualization.

More information could be found in our demo data.
![avatar](https://timedb.deepomics.org/public/data/image/HR_OR_results.jpg)

### Visualization
dot plot
There are two forms of visualization of "TIMEDB HR OR" that can be switched:
<center>Dot Plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/HR_OR_visualization.jpg)

<center>Forest Plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/HR_OR_visualization2.jpg)



## Download demo data
- [Cluster result data](https://timedb.deepomics.org/public/data/module_demo/HR_OR/quanTIseq_cluster_Result.csv)
- [Hazard ratio result](https://timedb.deepomics.org/public/data/module_demo/HR_OR/demo_hazard_ratio.csv)
- [Odds ratio result](https://timedb.deepomics.org/public/data/module_demo/HR_OR/demo_odds_ratio.csv)
