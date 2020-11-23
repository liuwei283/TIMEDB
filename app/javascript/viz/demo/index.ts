import { template } from "./template"

const Demo = {
    initViz
}

function initViz(): any {
    console.log("hello viz")
    const vizOpts = {
        template,
        data: {
        },
    };
    return {vizOpts};
}

export default Demo;