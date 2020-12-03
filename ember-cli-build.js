/* eslint-env node */
"use strict";

const defaultConfig = require("./config/environment");
const EmberAddon = require("ember-cli/lib/broccoli/ember-addon");

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const config = Object.assign(
    {},
    defaultConfig,
    defaults.project.config().tinyMCE || {}
  );

  app.import("vendor/tinymce/tinymce.js");

  for (let theme of config.themes) {
    app.import(`vendor/tinymce/themes/${theme}/theme.js`);
  }

  return app.toTree();
};
