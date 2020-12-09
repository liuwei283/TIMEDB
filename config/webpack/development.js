process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

// if (process.env.PACK) {
//     const target = `viz/${process.env.PACK}`;
//     console.log(`Single pack mode: only compile ${target}`);

//     let found = false;
//     Object.keys(environment.entry).forEach(k => {
//         if (k.startsWith("viz/")) {
//             if (k === target) {
//                 found = true;
//             } else {
//                 delete environment.entry[k];
//             }
//         }
//     });
//     if (!found) {
//         throw new Error(`The specified pack is not found.`);
//     }
// }
Object.keys(environment.entry).forEach(k => {
    console.log(`======>${k}`)
    if (k.startsWith("viz/")) {
        console.log(`======>${k}`)
    }
});

module.exports = environment.toWebpackConfig()
