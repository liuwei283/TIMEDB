let data = [
    {Row: "a", Col: "a", Value: 1, PValue: 0.01},
    {Row: "b", Col: "a", Value: 2, PValue: 0.01},
    {Row: "c", Col: "a", Value: 3, PValue: 0.01},
    {Row: "a", Col: "b", Value: 1, PValue: 0.01},
    {Row: "b", Col: "b", Value: 1, PValue: 0.01},
    {Row: "c", Col: "b", Value: 1, PValue: 0.01},
    {Row: "a", Col: "c", Value: 1, PValue: 0.01},
    {Row: "b", Col: "c", Value: 1, PValue: 0.01},
    {Row: "c", Col: "c", Value: 1, PValue: 0.01},
]

// function loadData(data) {
    // dsvHasHeader
    console.log(data)
    let rowKey = "Row"
    let colKey = "Col"
    let valKey = "Value"
    let pvalKey = "PValue"
    let rowNames = Array.from(new Set(data.map(d => d[rowKey])))
    let colNames = Array.from(new Set(data.map(d => d[colKey])))
    console.log(rowNames)
    console.log(colNames)
    let matrix = colNames.map(col => rowNames.map(row => 0))
    let rMatrix = colNames.map(col => rowNames.map(row => 0))
    data.forEach((d, index) => {
        let row = index%colNames.length
        let col = Math.floor(index/colNames.length)
        matrix[col][row] = d[valKey]
        rMatrix[col][row] = d[pvalKey]
    })
    console.log(matrix)
    console.log(rMatrix)

// }(data)