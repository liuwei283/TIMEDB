# TIMEDB Immunoregulator
# Introduction
We collected seventy-nine immunoregulators from “Immune Landscape of Cancer”. These immunoregulating proteins can be categorized into TNF, MHC Class II, Immunoglobulin, or CXC chemokine gene family; they can also be classified into ligand, receptor, or antigen presentation. From an immune checkpoint view, they can be inhibitory or stimulatory. We have built an analysis module, “TIMEDB Immunoregulator,” which leverages R package “limma” to obtain the differential expression among different patient subtypes, including tumor grades, tumor stages, tumor types, etc. if available. P value less than 0.05 is regarded as statistically significant.

### Citation
Vésteinn Thorsson, David L Gibbs, Scott D Brown, Denise Wolf, Dante S Bortone, TaiHsien Ou Yang, Eduard Porta-Pardo, Galen F Gao, Christopher L Plaisier, James A Eddy,et al. The immune landscape of cancer Immunity, 51(2):411–412, 2019.

**Note that we only conduct differential expression analysis of Immunoregulator genes for binary patient subtypes.**

&emsp;
## Module Structure
![avatar](https://timedb.deepomics.org/public/data/image/Immunoregulator_structure.jpg)

## Input file
`Gene expression data`(**required**):the gene expression file(CSV)

*  The first row should be a header with a 'GeneSymbol' column label followed by the sample name.
*  The first column should be the gene symbol(HGNC ID). The HGNC ID could be found on [HGNC website](https://www.genenames.org/).
* The data type of reading count should be a number. 

`Clinical data`(**required**): the clinical file(CSV)

* Clinical data is not required, and if clinical data is provided, the visualization will have a heatmap of the clinical features of the sample.
* If you want to display clinical features in the result visualization, please organize your data according to the following rules:
  - The header line keyword of the classification feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of the continuous feature follows n\_[feature] format, such as 'c\_age'.
  - More details could be seen in our demo file.

## Set parameters

- `Project name`(**required**): Set the name of this data and the cell fraction result will be named as "Project name\_immunoregulator.csv".
- `Protocol`(**required**): Set the protocol, options are: RNA-Seq, array.

&emsp;
## Results
### Immunoregulator result file(CSV)
![avatar](https://timedb.deepomics.org/public/data/image/Immunoregulator_results_file.jpg)
### Visualization
<center>Heatmap plot</center>

![avatar](https://timedb.deepomics.org/public/data/image/Immunoregulator_visualization.jpg)



&emsp;
## Download demo data
- [Gene expression data](https://timedb.deepomics.org/public/data/module_demo/Immunoregulator/RNA_TCGA_ACC.csv)
- [clinical data](https://timedb.deepomics.org/public/data/module_demo/Immunoregulator/Clinical_TCGA_ACC.csv)
- [Immunoregulator result file](https://timedb.deepomics.org/public/data/module_demo/Immunoregulator/demo_immunoregulator.csv)