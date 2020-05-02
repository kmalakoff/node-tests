var compare = require('semver-compare');

module.exports = function rmdirSyncRecursiveComposer(fn) {
  var rimraf = require('rimraf');
  return function rmdirSyncRecursive(path, options) {
    if (arguments.length === 1) return fn(path);
    options = options || {};
    if (!options.recursive) return fn(path);
    return rimraf.sync(path, options);
  };
};
