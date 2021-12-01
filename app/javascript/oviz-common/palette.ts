const palettes = {
    npg: {
        name: "NPG",
        colors: ["#E64B35", "#4DBBD5", "#00A087", "#3C5488", "#F39B7F", "#8491B4", "#91D1C2", "#DC0000", "#7E6148", "#B09C85"],
    },
    aaas: {
        name: "AAAS",
        colors: ["#3B4992", "#EE0000",  "#008B45", "#631879",  "#008280", "#BB0021",  "#5F559B", "#A20056",  "#808180", "#1B1919"],
    },
    nejm: {
        name: "NEJM",
        colors: ["#BC3C29", "#0072B5", "#E18727", "#20854E", "#7876B1", "#6F99AD", "#FFDC91", "#EE4C97"],
    },
    lancet: {
        name: "Lancet",
        colors: ["#00468B", "#ED0000", "#42B540", "#0099B4", "#925E9F", "#FDAF91", "#AD002A", "#ADB6B6", "#1B1919"],
    },
    // jama: {
    //     name: "JAMA",
    //     colors: ["#BC3C29", "#0072B5", "#E18727", "#20854E", "#7876B1", "#6F99AD", "#FFDC91", "#EE4C97"],
    // },
};

export default palettes;

const colorScheme = {
    purple:["#f3e5f5ff","#e1bee7ff","#e6aaefff","#ce93d8ff","#e040fbff","#9c27b0ff","#7b1fa2ff","#3f0249ff"],
    pink:["#fce4ecff","#f8bbd0ff","#db7f9dff","#d3658aff","#c13063ff","#c12a5dff","#6f1940ff","#591129ff"],
    red:["#ffebeeff","#ffcdd2ff","#efa5b0ff","#e57373ff","#ef5350","#cc0202ff","#af0b00ff","#600707ff"],
    orange:["#ffe0b2ff","#fbc56bff","#ffa726ff","#ff9800ff","#fb8c00ff","#ef6c00ff","#e65100ff","#b35b00ff"],
    yellow:["#fff9c4ff","#fff59dff","#ffee58ff","#ffd600ff","#dab800ff","#ce9e25ff","#a07b1dff","#724d11ff"],
    green:["#dcedc8ff","#aed581ff","#9ccc65ff","#8bc34aff","#43a047ff","#558b2fff","#2b662eff","#1b5e20ff"],
    teal:["#b2dfdbff","#80cbc4ff","#4db6acff","#26a69aff","#009688ff","#00695cff","#32746eff","#15322fff"],
    cyan:["#def6f9ff","#b9ecf3ff","#b2ebf2ff","#a2e0e8ff","#80deeaff","#26c6daff","#00acc1ff","#005661ff"],
    blue:["#ccdfffff","#8aa9ffff","#638cffff","#3c70ffff","#395abdff","#1d3b9cff","#17368cff","#0c1b46ff"]
};
const hslScheme = {
    "red":["#F7C9C9","#F19D9D","#EB7070","#E44444","#D61F1F","#AA1818","#7D1212"],
    "orange":["#F7D9C9","#F1B99D","#EB9970","#E47944","#D65C1F","#AA4918","#7D3612"],
    "soil":["#F7E8C9","#F1D59D","#EBC270","#E4AF44","#D6991F","#AA7918","#7D5912"],
    "yellow":["#F7F7C9","#F1F19D","#EBEB70","#E4E444","#D6D61F","#AAAA18","#7D7D12"],
    // "green":["#E8F7C9","#D5F19D","#C2EB70","#AFE444","#99D61F","#79AA18","#597D12"],
    // "leaves":["#D1F7C9","#ABF19D","#85EB70","#5EE444","#3DD61F","#30AA18","#247D12"],
    "tea":["#C9F7E0","#9DF1C7","#70EBAD","#44E494","#1FD67A","#18AA61","#127D47"],
    "sea":["#C9E8F7","#9DD5F1","#70C2EB","#44AFE4","#1F99D6","#1879AA","#12597D"],
    "sapphire":["#C9D9F7","#9DB9F1","#7099EB","#4479E4","#1F5CD6","#1849AA","#12367D"],
    "blue":["#D1C9F7","#AB9DF1","#8570EB","#5E44E4","#3D1FD6","#3018AA","#24127D"],
    "violet":["#E8C9F7","#D59DF1","#C270EB","#AF44E4","#991FD6","#7918AA","#59127D"],
    "magenta":["#F7C9E8","#F19DD5","#EB70C2","#E444AF","#D61F99","#AA1879","#7D1259"],
    "purple":["#F7C9D9","#F19DB9","#EB7099","#E44479","#D61F5C","#AA1849","#7D1236"]
};
export function colorsPlan(dict) {
    let pointerI = 0;
    let pointerJ = [];
    const result: any = {};
    const colorKeys = Object.keys(hslScheme);
    Object.keys(dict).forEach(k => {
        dict[k].forEach((sp, j) => {
            const key = colorKeys[pointerI+Math.floor(j/7)];
            result[`${k}|${sp}`] = hslScheme[key][j%7];
        });
        pointerJ.push([pointerI+Math.floor(dict[k].length/7), dict[k].length%7]);
        pointerI += Math.floor(dict[k].length/7) + 1;
    });
    return result;
    // const result=new Object();
    // const catindex=Object.keys(dict)
    // const colorindex=Object.keys(colorScheme)
    // if (catindex.length<colorindex.length){
    //     let z=0;
    //     for(var i=0; i < catindex.length; i++){
    //         let cat_item=catindex[i];
    //         const catarray=dict[cat_item];
    //         var catidnex = catarray.length
    //         let n=0;
    //         while(catidnex > 0 ){
    //             const color_item=colorindex[z]
    //             const colorarray=colorScheme[color_item];
    //             if (catidnex <= colorarray.length){
    //                 for(var j=0;j<catidnex;j++){
    //                     const obj={[catarray[j+8*n]]:colorarray[j]};
    //                     Object.assign(result,obj);
    //                 };
    //                 z++;
    //                 catidnex=0;
    //             }else{
    //                 colorarray.forEach((item,index) => {
    //                     const cat=catarray[index+8*n]
    //                     const obj={[cat]:item};
    //                     Object.assign(result,obj)
    //                 });
    //                 n++
    //                 z++;
    //                 catidnex=catidnex-7;
    //             }
    //         }
    //     }
    // }else{
    //     return;
    // }
    // return result;
}

/*
    C>A
    C>G
    C>T
    T>A
    T>C
    T>G
*/
export const cosmicPalettes = {
    cosmicLight: {
        name: "COSMIC",
        colors: [
            "#49BCED",
            "#000000",
            "#E1422C",
            "#999999",
            "#9FCE66",
            "#ECC6C5",
        ],
    },
};

export const rainbowL = [ "hsl(330, 82%, 76%)",
"hsl(0, 85%, 77%)",
"hsl(14, 100%, 78%)",
"hsl(36, 100%, 75%)",
"hsl(45, 100%, 75%)",
"hsl(54, 100%, 72%)",//"hsl(54, 100%, 81%)",
"hsl(66, 71%, 77%)",
"hsl(88, 50%, 76%)",
"hsl(122, 37%, 74%)",
"hsl(174, 42%, 65%)",
"hsl(187, 72%, 71%)",
"hsl(199, 92%, 74%)",
"hsl(207, 90%, 77%)",
"hsl(231, 44%, 74%)",
"hsl(261, 46%, 74%)",
"hsl(291, 47%, 71%)",
];

export const rainbow1 = [ "hsl(340, 82%, 76%)",
"hsl(0, 73%, 77%)",
"hsl(14, 100%, 78%)",
"hsl(36, 100%, 75%)",
"hsl(45, 100%, 75%)",
"hsl(54, 90%, 72%)", // "hsl(54, 100%, 81%)",
"hsl(66, 71%, 77%)",
"hsl(88, 50%, 76%)",
"hsl(122, 37%, 74%)",
"hsl(150, 37%, 74%)",
"hsl(174, 42%, 65%)",
"hsl(187, 72%, 71%)",
"hsl(199, 92%, 74%)",
"hsl(207, 90%, 77%)",
"hsl(207, 90%, 77%)",
"hsl(231, 44%, 74%)",
"hsl(261, 46%, 74%)",
"hsl(291, 47%, 71%)",
"hsl(310, 47%, 71%)",
"hsl(325, 47%, 71%)",
];

export const groupedChartColors = [
// "#3CC145",
// "#f06748",
// "#6748f0",
// "#48d1f0",
// "#bb48f0",
// "#f0bb48",
"#20854E", "#BC3C29", "#0072B5", "#E18727", "#7876B1",
];

export const groupedColors2 = [
    "hsl(0, 73%, 70%)",
    "hsl(45, 100%, 70%)",
    "hsl(199, 92%, 70%)",
    "hsl(231, 44%, 70%)",
    "hsl(291, 47%, 70%)",
    "hsl(340, 82%, 70%)",
];

export const controlGroupColors = [
    "#27AE60", "#E74C3C"
];
export const signedChartColors = {
    posRange: "#27AE60",
    negRange: "#E74C3C",
    origin: "white"
}

// export const groupedChartColors = ["green", "red"]

export function withDefaultPalette(colors: string[], extraPalettes?: Dictionary<any>) {
    return {
        ...{ default: { name: "Default", colors }},
        ...extraPalettes,
        ...palettes,
    };
}

export function genDefaultPalette(colors: Record<string, string>, keyOrder?: string[]): [string[], Record<string, number>] {
    const paletteMap = {};
    const keys = keyOrder || Object.keys(colors);
    let i = 0;
    for (const name of keys) {
        paletteMap[name] = i++;
    }
    return [Object.values(colors), paletteMap];
}


export function genPaletteMap(keys: string[]): Dictionary<string | number> {
    const keyMap = {};
    keys.forEach((k, i) => keyMap[k] = i);
    return keyMap;

}
