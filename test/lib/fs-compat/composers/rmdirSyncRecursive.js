var compare = require('semver-compare');

module.exports = function rmDirSyncRecursiveComposer(fn) {
  var rimraf = require('rimraf');
  return function rmDirSyncRecursive(path, options) {
    if (arguments.length === 1) return fn(path);
    if (!options.recursive) return fn(path);
    return rimraf.sync(path);
  };
};
