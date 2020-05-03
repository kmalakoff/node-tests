var compare = require('semver-compare');
var path = require('path');
var fs = require('fs');
var DirentFromStats = require('dirent-from-stats');

var sortReaddirResults = require('../helpers/sortReaddirResults');

function readdirFileTypesFn(fn, wrapper) {
  return function readdirFileTypes(root, options) {
    if (arguments.length === 1) return wrapper(fn(root));
    options = options || {};
    if (!options.withFileTypes) return wrapper(fn(root));

    var results = [];
    var names = fn(root);
    for (var index in names) {
      results.push(new DirentFromStats(names[index], fs.lstatSync(path.join(root, names[index]))));
    }
    return wrapper(results);
  };
}

module.exports = function readdirSyncFileTypesComposer(fn) {
  if (compare(process.versions.node, '0.9.0') < 0) {
    return readdirFileTypesFn(fn, function (results) {
      return sortReaddirResults(results);
    });
  } else {
    return readdirFileTypesFn(fn, function (results) {
      return results;
    });
  }
};
