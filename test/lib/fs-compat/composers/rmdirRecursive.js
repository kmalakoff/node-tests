var compare = require('semver-compare');

module.exports = function rmdirRecursiveComposer(fn) {
  var patched = fn === require('fs').rmdir ? require('rimraf') : require('rimraf').sync;
  return function rmDirSyncRecursive(path, options) {
    if (arguments.length === 1) return fn(path);
    if (!options.recursive) return fn(path);
    return patched.apply(null, arguments);
  };
};
