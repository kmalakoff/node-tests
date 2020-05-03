var compare = require('semver-compare');
var path = require('path');
var fs = require('fs');
var each = require('async-each');
var DirentFromStats = require('dirent-from-stats');

function create(root, name, callback) {
  return fs.lstat(path.join(root, name), function (err, stats) {
    err ? callback(err) : callback(null, new DirentFromStats(name, stats));
  });
}

function readdirFileTypesFn(fn, wrapper) {
  return function readdirFileTypes(path, options, callback) {
    if (arguments.length === 2) return fn(path, wrapper(options));
    options = options || {};
    if (!options.withFileTypes) return fn(path, wrapper(callback));

    fn(path, function readdirCallback(err, names) {
      if (err) return callback(err);
      each(names, create.bind(null, path), wrapper(callback));
    });
  };
}

module.exports = function readdirFileTypesComposer(fn) {
  if (compare(process.versions.node, '0.9.0') < 0) {
    return readdirFileTypesFn(fn, function sortedResultsCallbackFn(callback) {
      return function sortedResultsCallback(err, results) {
        err ? callback(err) : callback(null, results.sort());
      };
    });
  } else {
    return readdirFileTypesFn(fn, function callbackFn(callback) {
      return callback;
    });
  }
};
