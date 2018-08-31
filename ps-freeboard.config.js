const pathLib = require("path");
let filepath = pathLib.resolve(__filename, "../");
module.exports = {
    name: "freeboard",
    output: pathLib.resolve(__filename, "./ps-freeboard/output.js"),
    templates: {
        path: pathLib.resolve(filepath, "./ps-freeboard/templates"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    controllers: {
        path: pathLib.resolve(filepath, "./ps-freeboard/controllers"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    directives: {
        path: pathLib.resolve(filepath, "./ps-freeboard/directives"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    services: {
        path: pathLib.resolve(filepath, "./ps-freeboard/services"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    filters: {
        path: pathLib.resolve(filepath, "./ps-freeboard/filters"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    styles: {
        path: pathLib.resolve(filepath, "./ps-freeboard/styles"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    }
}