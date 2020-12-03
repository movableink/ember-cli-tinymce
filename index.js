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
        const skin = config.skin;
        const themes = config.themes;

        return {
          public: {
            include: [
              `skins/${skin}/fonts/*`,
              `skins/${skin}/img/*`,
              `skins/${skin}/*.css`,
              "plugins/**/*.js",
            ],
          },
          vendor: {
            include: [
              "tinymce.js",
              ...themes.map((theme) => `themes/${theme}/theme.js`),
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
    const themes = config.themes;

    app.import("vendor/tinymce/tinymce.js");
    for (let theme of themes) {
      app.import(`vendor/tinymce/themes/${theme}/theme.js`);
    }
  },
};
