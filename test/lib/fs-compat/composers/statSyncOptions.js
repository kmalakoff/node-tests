var compare = require('semver-compare');

module.exports = function statSyncOptionsComposer(fn) {
  return function statSyncOptions(path, options) {
    if (arguments.length === 1) return fn(path);
    options = options || {};
    // if (options.bigInt) return callback(new Error('bigInt option not emulated'));
    return fn(path, options);
  };
};
