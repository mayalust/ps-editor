const pathLib = require(`path`),
  smartAngular = require("smart-angular"),
  save2JSON = require(`smart-angular-save2json`),
  app = smartAngular.run("dev", "editor"),
  options = { basePath : pathLib.resolve(__dirname, `./ps-editor`) };
save2JSON(app, options);
