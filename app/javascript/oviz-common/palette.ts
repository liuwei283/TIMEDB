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
    jama: {
        name: "JAMA",
        colors: ["#BC3C29", "#0072B5", "#E18727", "#20854E", "#7876B1", "#6F99AD", "#FFDC91", "#EE4C97"],
    },
};

export default palettes;

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
