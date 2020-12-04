/* eslint-env node */
"use strict";

var defaultConfig = require("./config/environment")();

module.exports = {
  name: "ember-cli-tinymce",

  options: {
    nodeAssets: {
      tinymce() {
        const config =
          Object.assign(defaultConfig.tinyMCE, this.project.config().tinyMCE) ||
          {};
        const { skin } = config;

        return {
          public: {
            include: [`skins/${skin}/fonts/*`, `skins/${skin}/img/*`],
          },
          vendor: {
            include: [
              "tinymce.js",
              "themes/*/theme.js",
              "plugins/*/plugin.js",
              `skins/${skin}/*.css`,
              "content.min.css",
            ],
          },
        };
      },
    },
  },

  included(app) {
    this._super.included(app);

    const config =
      Object.assign(defaultConfig.tinyMCE, this.project.config().tinyMCE) || {};
    const { skin, themes, plugins } = config;

    app.import("vendor/tinymce/tinymce.js");
    app.import(`vendor/tinymce/skins/${skin}/skin.min.css`);
    app.import("vendor/tinymce/content.min.css");

    for (let theme of themes) {
      app.import(`vendor/tinymce/themes/${theme}/theme.js`);
    }

    for (let plugin of plugins) {
      app.import(`vendor/tinymce/plugins/${plugin}/plugin.js`);
    }
  },
};
