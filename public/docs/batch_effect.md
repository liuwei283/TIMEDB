# TIMEDB Batch Effect

## Introduction

For analysis involving multiple projects, we employed sva to eliminate the batch effects between different projects sharing the same platform, and then remove the batch effects between different platforms. We applied Uniform Manifold Approximation and Projection (UMAP) to check the efficacy of batch effect. Patients across projects and platforms may separated in UMAP plot before batch effect removal, while they intend to be mixed together after batch effect removal.

### Citation

Jeffrey T Leek, W Evan Johnson, Hilary S Parker, Andrew E Jaffe, and John D Storey. The sva package for removing batch effects and other unwanted variation in high-throughput experiments. Bioinformatics, 28(6):882–883, 2012.
Etienne Becht, Leland McInnes, John Healy, Charles-Antoine Dutertre, Immanuel WHKwok, Lai Guan Ng, Florent Ginhoux, and Evan W Newell. Dimensionality reduction for visualizing single-cell data using umap. Nature biotechnology, 37(1):38–44, 2019.w

## Module Structure

![avatar](https://timedb.deepomics.org/public/data/image/batcheffect_structure.jpg)


## Input file

`Gene expression data`(**required**):the gene expression file(csv)

*  First row should be a header with a 'GeneSymbol'column lable followed by
   sample name.
*  First column should be the the gene symbol(HGNC ID)the HGNC ID could be
   found on [HGNC website](https://www.genenames.org/).
*  The data type of reads count should be number. 

`Clinical data`(**optional**):the clinical file(csv)

* Please organize your data according to the following rules:
  - The header line keyword of classfication feature follows c\_[feature] format, such as 'c\_gender'.
  - The header line keyword of Continuous feature follows n\_[feature] format, such as 'c\_age'.
  - The first column should be named 'project\_name', which should be consistent with the parameter of "Dataset name", The second column should be named "sample\_name".
  - More details could be seen in our demo file.


## Set parameters

- `Platform`: The platform name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>.
- `Dataset name`: 
  - The name of each dataset, <font color=#B22222>which will be used as a reference for Batch effect</font>. If there are two datasets, the batch effect results will be named as "Dataset name1, Dataset name2\_UMAP.csv","Dataset name1,Dataset name2\_Clinical\_integrated.csv", and "Dataset name1,Dataset name2\_RNA\_integrated.csv".
  - It should be consistent with the "project name" in the first column of clinical data, noting that different datasets should have different names
- `Protocol normalization`(**required**): Set the case for data standardization. Options are:
  - *array_quantile*: The data type is array, which needs to be preprocessed by Quantile;
  - *array_none*: The data type is array, which does not require preprocessing;
  - *RNA-Seq_TPM*: The data type is RNA-seq, which requires TPM preprocessing; 
  - *RNA-Seq_none*: The data type is RNA-seq and no preprocessing is required.

## Results

### Integrated Gene expression data(csv)

The gene expression data after the batch effect operation, the first column is the GeneSymbol, and each column after that is a sample. The sample name will be renamed as “Dataset name_sample name".

### Integrated clinical data(csv)

The clinical data after the batch effect operation, the first column is the sample name, and each column after that is a clinical feature. The sample name will be renamed as “Dataset name_sample name".

### Umap data(csv)

The coordinates of the sample after UMAP operation, the first column is the sample name, the second column is the x coordinate and the third column is the y coordinate.

### Visualization

Each point represents a sample, different datasets are coloured differently.
![avatar](https://timedb.deepomics.org/public/data/image/batcheffect_visualization.jpg)

## Download demo data

- [Gene expression data1](https://timedb.deepomics.org/public/data/module_demo/batcheffect/input/RNA_GSE37175.csv)
- [Gene expression data2](https://timedb.deepomics.org/public/data/module_demo/batcheffect/input/RNA_GSE11151.csv)
- [clinical data1](https://timedb.deepomics.org/public/data/module_demo/batcheffect/input/Clinical_GSE37175.csv)
- [clinical data2](https://timedb.deepomics.org/public/data/module_demo/batcheffect/input/Clinical_GSE11151.csv)
- [Integrated clinical data](https://timedb.deepomics.org/public/data/module_demo/batcheffect/output/GSE68895,GSE14922_Clinical_integrated.csv)
- [Integrated Gene expression data](https://timedb.deepomics.org/public/data/module_demo/batcheffect/output/GSE68895,GSE14922_RNA_integrated.csv)