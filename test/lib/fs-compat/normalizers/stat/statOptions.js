// var compare = require('semver-compare');

var normalizeStats = require('normalize-stats');

function patchBigIntStatsCallbackFn(callback) {
  return function patchBigIntStatsCallback(err, stats) {
    return err ? callback(err) : callback(err, normalizeStats(stats));
  };
}
function statOptionsTypesFn(fn, wrapper) {
  return function statOptions(path, options, callback) {
    if (arguments.length === 2) return fn(path, wrapper(options));
    options = options || {};
    if (!options.bigint) return fn(path, wrapper(callback));
    // if (options.bigInt) return callback(new Error('bigInt option not emulated'));
    return fn(path, options, wrapper(callback));
  };
}

module.exports = function statOptionsComposer(fn) {
  return statOptionsTypesFn(fn, patchBigIntStatsCallbackFn);

  // return statOptionsTypesFn(fn, function callbackFn(callback) {
  //   return callback;
  // });
};
