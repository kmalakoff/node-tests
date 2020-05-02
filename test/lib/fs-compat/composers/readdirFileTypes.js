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

function readdirFileTypesFn(fn) {
  return function readdirFileTypes(path, options, callback) {
    if (arguments.length === 2) return fn(path, options);
    if (!options.withFileTypes) return fn(path, callback);

    fn(path, function readdirCallback(err, names) {
      if (err) return callback(err);
      each(names, create.bind(null, path), callback);
    });
  };
}

module.exports = function readdirFileTypesComposer(fn, sort) {
  var composedfn = readdirFileTypesFn(fn);
  if (!sort) return composedfn;
  return function readdirFileTypesWithSort(path, options, callback) {
    if (arguments.length === 2) return composedfn(path, sortedResultsCallbackFn(options));
    else return composedfn(path, options, sortedResultsCallbackFn(callback));
  };
};
