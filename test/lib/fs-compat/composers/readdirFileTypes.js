var compare = require('semver-compare');

module.exports = function readdirFileTypesComposer(fn) {
  var path = require('path');
  var fs = require('fs');
  var each = require('async-each');
  var DirentFromStats = require('dirent-from-stats');

  function create(root, name, callback) {
    return fs.lstat(path.join(root, name), function (err, stats) {
      err ? callback(err) : callback(null, new DirentFromStats(name, stats));
    });
  }

  function sortedResultsCallbackFn(callback) {
    return function sortedResultsCallback(err, results) {
      err ? callback(err) : callback(null, results.sort());
    };
  }

  if (compare(process.versions.node, '0.9.0') < 0) {
    return function readdirFileTypesSorted(path, options, callback) {
      if (arguments.length === 2) return fn(path, sortedResultsCallbackFn(options));
      if (!options.withFileTypes) return fn(path, sortedResultsCallbackFn(callback));

      fn(path, function readdirCallback(err, names) {
        if (err) return callback(err);
        each(names, create.bind(null, path), sortedResultsCallbackFn(callback));
      });
    };
  } else {
    return function readdirFileTypes(path, options, callback) {
      if (arguments.length === 2) return fn(path, options);
      if (!options.withFileTypes) return fn(path, callback);

      fn(path, function readdirCallback(err, names) {
        if (err) return callback(err);
        each(names, create.bind(null, path), callback);
      });
    };
  }
};
