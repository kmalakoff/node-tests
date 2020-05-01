var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Iterator = require('fs-iterator');
var startsWith = require('starts-with');
var Queue = require('queue-cb');
var transpile = require('./transpile');
var log = require('single-line-log').stdout;

var CACHE_DIR = require('../DIRECTORIES').CACHE;
var BUILD_DIR = require('../DIRECTORIES').BUILD;

var FOLDERS = [path.join('lib', 'internal'), 'test'];

function buildFolder(folder, options, callback) {
  if (!options.version) return callback(new Error('Missing version'));
  var sourceRoot = path.join(CACHE_DIR, options.version, folder);
  var buildRoot = path.join(BUILD_DIR, options.version, folder);

  mkdirp(buildRoot, function (err) {
    if (err) return callback(err);

    var iterator = new Iterator(sourceRoot);
    iterator.forEach(
      function (entry, callback) {
        var targetPath = path.join(buildRoot, entry.path);
        if (entry.stats.isDirectory()) return fs.mkdir(targetPath, callback);

        // transpile or copy
        if (path.extname(targetPath) === '.js' && !startsWith(entry.path, 'fixtures')) {
          log('Transpiling   ' + entry.path);
          transpile(entry, targetPath, callback);
        } else {
          log('Copying ' + entry.path);
          fs.copyFile(entry.fullPath, targetPath, callback);
        }
      },
      { callbacks: true, concurrency: 1 },
      callback
    );
  });
}

module.exports = function build(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  if (!options.version) return callback(new Error('Missing version'));
  var cacheTarget = path.join(CACHE_DIR, options.version);
  var buildTarget = path.join(BUILD_DIR, options.version);

  fs.access(cacheTarget, function (missing) {
    if (missing) return callback(new Error('Node directory is missing'));

    fs.access(buildTarget, function (missing) {
      if (!missing && !options.force) return callback();

      var queue = new Queue(1);
      missing || queue.defer(rimraf.bind(null, buildTarget));
      for (var index in FOLDERS) queue.defer(buildFolder.bind(null, FOLDERS[index], options));
      queue.await(callback);
    });
  });
};
