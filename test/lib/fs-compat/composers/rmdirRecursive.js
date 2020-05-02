var compare = require('semver-compare');

module.exports = function rmdirRecursiveComposer(fn) {
  var rimraf = require('rimraf');
  return function rmdirRecursive(path, options, callback) {
    if (arguments.length === 2) return fn(path, options);
    options = options || {};
    if (!options.recursive) return fn(path, callback);
    return rimraf(path, options, callback);
  };
};
