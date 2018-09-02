const pathLib = require("path");
let filepath = pathLib.resolve(__filename, "../");
module.exports = {
    name: "freeboard",
    output: pathLib.resolve(__filename, "./ps-editor/output.js"),
    templates: {
        path: pathLib.resolve(filepath, "./ps-editor/templates"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    controllers: {
        path: pathLib.resolve(filepath, "./ps-editor/controllers"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    directives: {
        path: pathLib.resolve(filepath, "./ps-editor/directives"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    services: {
        path: pathLib.resolve(filepath, "./ps-editor/services"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    filters: {
        path: pathLib.resolve(filepath, "./ps-editor/filters"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    },
    styles: {
        path: pathLib.resolve(filepath, "./ps-editor/styles"),
        exclude: [/\.test/g, /[\\\/]exclude[\\\/]/g]
    }
}