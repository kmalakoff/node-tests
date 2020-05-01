module.exports = function readdirFileTypesComposer(fn) {
  return function readdirFileTypes(path, options, callback) {
    if (arguments.length === 2) return fn(path, options);
    // if (options.withFileTypes) return callback(new Error('withFileTypes option not emulated'));
    return fn(path, options, callback);
  };
};
