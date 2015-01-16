var fs = require('fs');
var path = require('path');

module.exports = {
  name: 'ember-cli-rails-addon',
  warnMissingDependencyChecker: function() {
    var dependencies = this.project.dependencies();

    if (!dependencies['ember-cli-dependency-checker']) {
      console.warn('Usage of "ember-cli-dependency-checker" is strongly advised to ensure your project cache is in sync with the project\'s requirements.');
    }
  },

  init: function() {
    this.warnMissingDependencyChecker();
  },

  buildError: function(error) {
    fs.writeFileSync(this.errorFilePath(), error.stack)
  },

  included: function(app) {
    app.options.storeConfigInMeta = false;

    if (process.env.DISABLE_FINGERPRINTING === 'true') {
      app.options.fingerprint.enabled = false;
    }

    if (process.env.EXCLUDE_EMBER_ASSETS) {
      var excludeEmberAssets = process.env.EXCLUDE_EMBER_ASSETS;
      var excludeRegex = new RegExp("(?:" + excludeEmberAssets.replace(",", "|") + ")\\.js$");
      var excludeAssets = app.legacyFilesToAppend.filter(function(asset){ return excludeRegex.test(asset); });

      excludeAssets.forEach(function(asset){
        var index = app.legacyFilesToAppend.indexOf(asset);
        app.legacyFilesToAppend.splice(index, 1);
      });
    }
  },
  preBuild: function(result) {
    if(!fs.existsSync(lockfile = this.lockfilePath())) { fs.openSync(lockfile, 'w'); }
    if(fs.existsSync(errorFile = this.errorFilePath())) { fs.unlinkSync(errorFile); }
  },
  postBuild: function(result){
    if(fs.existsSync(lockfile = this.lockfilePath())) {
      fs.unlinkSync(lockfile);
    }
  },
  lockfilePath: function() {
    return path.join(process.cwd(), 'tmp', 'build.lock');
  },
  errorFilePath: function() {
    return path.join(process.cwd(), 'tmp', 'error.txt');
  }
};
