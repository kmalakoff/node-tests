var compare = require('semver-compare');

module.exports = function statOptionsComposer(fn) {
  return function statOptions(path, options, callback) {
    if (arguments.length === 2) return fn(path, options);
    options = options || {};
    // if (options.bigInt) return callback(new Error('bigInt option not emulated'));
    return fn(path, options, callback);
  };
};
