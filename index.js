/* eslint-env node */
"use strict";

var path = require("path");
var MergeTrees = require("broccoli-merge-trees");
var Funnel = require("broccoli-funnel");
var defaultConfig = require("./config/environment")();
var map = require("broccoli-stew").map;
var fs = require("fs");
var files = ["tinymce.js"];

const tinyMCERoot = path.relative(
  ".",
  path.dirname(require.resolve("tinymce"))
);
console.log("ROOT", tinyMCERoot);

module.exports = {
  name: "ember-cli-tinymce",

  treeForVendor(vendorTree) {
    let tinymce = new Funnel(tinyMCERoot, {
      files: files,
      destDir: "tinymce",
    });

    tinymce = map(
      tinymce,
      (content) => `if (typeof FastBoot === 'undefined') { ${content} }`
    );

    return vendorTree ? new MergeTrees([vendorTree, tinymce]) : tinymce;
  },

  included: function (app) {
    app.import("app/styles/addons.css");

    const config =
      Object.assign(defaultConfig.tinyMCE, this.project.config().tinyMCE) || {};

    const skin = config.skin;
    var assets = walkSync(path.join(tinyMCERoot, "skins", skin));

    assets.forEach((asset) => {
      let opts = {
        destDir:
          `assets/skins/${skin}/` +
          (asset.includes("/") ? asset.split("/")[0] : ""),
      };
      if (asset.includes(".css")) opts.outputFile = `${opts.destDir}/${asset}`;

      console.log("IMPORTING", path.join(tinyMCERoot, "skins", skin, asset));
      app.import(path.join(tinyMCERoot, "skins", skin, asset), opts);
    });

    config.themes.forEach(function (theme) {
      files.push(`themes/${theme}/theme.min.js`);
    });

    config.themes.forEach(function (theme) {
      files.push(`themes/${theme}/theme.min.js`);
    });

    var plugins =
      config.plugins || fs.readdirSync(path.join(tinyMCERoot, "plugins"));

    plugins.forEach(function (pluginName) {
      files.push(`plugins/${pluginName}/plugin.min.js`);
    });

    files.forEach(function (file) {
      app.import(`vendor/tinymce/${file}`, { destDir: "tinymce" });
    });
  },
};

var walkSync = function (dir, filelist = [], subDirName = "") {
  var fs = fs || require("fs"),
    files = fs.readdirSync(dir);

  files.forEach(function (file) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist, path.join(subDirName, file));
    } else {
      filelist.push(path.join(subDirName, file));
    }
  });
  return filelist;
};
