## Introduction
The `Beta Diversity` draws a boxplot for the results. 

## Input Files
_Click on the `Download Data` button to check the official input files._

#### 1. Main data (TSV file)

| rank symbol |  Sample | Source | Abd |
|---|---|---|---|
| Streptococcus_thermophilus  | DS04  | clu01 | 100 |

- Source represents strain, Abd represents proportion

#### 2. P value (TSV file)

| spe |  group | type |
|---|---|---|
| Streptococcus_thermophilus  | Other(11)  | from_donor |

- The first column is the species. The column name doesn't matter. You may add as many meta features as you like.

## Display Interactions

- **Drag P**<br/>
  Drag the p notes to adjust its position.
- **Tooltips**<br/>
  Hover on the box and a info tooltip will show.
- **Drag x axis labels**<br/>
  When rotated x axis label is true, you can drag a label to adjust the rotation angle. The rotation rangle is from 0 to 90 degree with label anchored on right middle.
- **Download**<br/>
  One SVG file will be generated when the `Download Chart` button is clicked.

## Editor Functions

- **Files**
  - __*Manage Files*__: checklist of files uploaded previously, delete or download files.
  - __*Upload*__: upload files. Note that the duplicated file name will be alerted and given a random postfix.
  - __*Choose*__: choose files uploaded previously. 

- **Data**
  - __*Taxonomic Rank*__: select the rank of the data to display.
  - __*Range lower bound*__: edit the mininum of the value range.
  - __*Range upper bound*__: edit the maximum of the value range.


- **Plot Settings**
  - __*Plot Width*__: input a value to adjust the width of the plot.
  - __*Plot Height*__: input a value to adjust the height of the plot.
  - __*Label Font Size*__: input an integer to adjust the size of the x/y label.
  - __*Tick Font Size*__: input an integer to adjust the size of the axises ticks.
  - __*Rotate X Axis Labels*__: check the check box to rotate the x-axis labels.


- **Box Settings**
  - __*Customize Colors*__: adjust colors for the boxes, scatters, and violins.
  - __*Hollow box*__: check it to hollow boxes.
  - __*Outlier*__: check it to draw outliers.
  - __*P-value*__: check it to display the p notes.
  - __*Sample Scatters*__: check it to draw sample scatters over the boxes.
  - __*Draw Violin*__: check it to draw violins instead of boxes.


*Manual version=1.0*, written by Dr. JIANG Yiqi and Ms. WANG Yanfei on 2021-09-13.