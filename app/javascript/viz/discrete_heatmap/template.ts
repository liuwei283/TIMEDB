export const template  = `svg {
    height = 1600; width = 1000
   Columns{
       x = 50; y = 20
       @for (data, i) in heatmapData {
           DiscreteHeatMap {
               x = 3
               width = 25 * data.columns.length
               drawRows = i === 0? true : false
               data = data.data
               colorMap = colorMap
               valueMap = valueMap
               gridW = 25
               gridH = 15
               colName = config.colName
               rowName = config.rowName
               columns = data.columns
               rows = data.rows
               colLabelRotaton = config.colLabelRotation
           }
       }
   }
}`;