// var compare = require('semver-compare');

var normalizeStats = require('normalize-stats');

module.exports = function statSyncOptionsComposer(fn) {
  return function statSyncOptions(path, options) {
    if (arguments.length === 1) return fn(path);
    options = options || {};
    // if (options.bigInt) return callback(new Error('bigInt option not emulated'));
    return normalizeStats(fn(path, options));
  };
};
