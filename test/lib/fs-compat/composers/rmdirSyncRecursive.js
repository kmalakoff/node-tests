var rimraf = require('rimraf');

module.exports = function rmDirSyncRecursiveComposer(fn) {
  return function rmDirSyncRecursive(path, options) {
    if (arguments.length === 1) return fn(path);
    if (!options.recursive) return fn(path);
    return rimraf.sync(path);
  };
};
