# TIMEDB Kaplan Meier Estimation
# Introduction
We adopt Kaplan–Meier (KM) analysis with R package “survival” (36) to draw the difference in prognostic events among different patient subtypes. It shows the probability of OS or PFS for a patient subgroup at a certain time. We wrapped the KM analysis into the analysis module “TIMEDB KM Estimator” for researchers to run their newly sequenced data and customized clinical subgroup labels.


## Module Structure
![avatar](https://timedb.deepomics.org/public/data/image/KM_structure.jpg)


## Input file
`Cell fraction data`(**required**):the TIME cell fraction result(CSV).

*  The first two columns in the first row should be "sample_name" and "method", followed by the TIME cell type
*  The first column should be the sample name.
*  The second column should be the method name to get the TIME cell fraction result.
![avatar](https://timedb.deepomics.org/public/data/image/interaction_input_cell_fraction.jpg)

`Clinical data`(**required**):the clinical file(CSV)

- The first row should be a header with a 'sample_name' column label followed by clinical features.
  - The header line keyword of the classification feature follows c_[feature] format, such as 'c_gender'.
  - The header line keyword of the continuous feature follows n_[feature] format, such as 'c_age'.
  - The column related to survival days should be named "os" or "pfs"(**required**), details are:
    - os: available for cancer or disease donors, overall survival days, the length of time from either the date of diagnosis or the start of treatment that a patient is still alive.
    - pfs: available for cancer or disease donors, progression-free survival days, the length of time during and after the treatment that a patient lives with the disease, but it does not get worse.
    - os_status: available for cancer donor, the os outcome, binary, value of 1 for death, 0 for alive.
    - pfs_status: available for cancer donor, the pfs outcome, binary, value of 1 for progression or recurrence, 0 for otherwise.
  - More details could be seen in our demo file.

## Set parameters
- `Project name`(**required**): Set the name of this data, and the cell fraction result will be named as "Project name_os.csv" and "Project name_pfs.csv".

## Results
### OS result(CSV)
Status: the value of 1 for death, 0 for alive.
OS_TIME: the length of days from either the date of diagnosis or the start of treatment that a patient is still alive.
![avatar](https://timedb.deepomics.org/public/data/image/KM_os.jpg)

### PFS result(CSV)
Status: the value of 1 for progression or recurrence, 0 for otherwise.
PFS_TIME: the length of days during and after the treatment that a patient lives with the disease, but it does not get worse.

![avatar](https://timedb.deepomics.org/public/data/image/KM_pfs.jpg)

### Visualization
<center>Survival Curve</center>

![avatar](https://timedb.deepomics.org/public/data/image/KM_visualization.jpg)

## Download demo data
- [ Cell fraction data](https://timedb.deepomics.org/public/data/module_demo/KM/input/TCGA_ACC_quanTIseq.csv)
- [Clinical data](https://timedb.deepomics.org/public/data/module_demo/KM/input/Clinical_TCGA_ACC.csv)
- [OS result](https://timedb.deepomics.org/public/data/module_demo/KM/output/os.zip)
- [PFS result](https://timedb.deepomics.org/public/data/module_demo/KM/output/pfs.zip)