export interface VizData {
    name: string;
    desc: string;
    files: {name:string, path:string}[]
    type: string; 
    dataName: string;
}

export interface VizAnalysis {
    name: string;
    desc: string;
    analysisName: string;
}

export function findFilesByDataName(data:VizData[], dataName: string)
                : {name:string, path:string}[] {
    for (let i=0; i<data.length; i++)
        if (data[i].dataName === dataName){
            return data[i].files;
        }
    return [];
}

export const testVizDataList: VizData[] = [
    {
        name: "",
        desc: "",
        type: "tsv",
        dataName: "heatmapData",
        files: [
            {
                name: "T1_sample.xls",
                path: "/data/drug used"
            },
            {
                name: "T2_sample.xls",
                path: "/data/drug used"
            }
        ]
    }
]
