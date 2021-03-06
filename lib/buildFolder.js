var path = require('path');
var fs = require('fs');
var mkpath = require('mkpath');
var Iterator = require('fs-iterator');
var startsWith = require('starts-with');
var transpile = require('./transpile');
var log = require('single-line-log2').stdout;

module.exports = function buildFolder(folder, options, callback) {
  var sourceRoot = path.join(options.cacheDirectory, options.version, folder);
  var buildRoot = path.join(options.buildDirectory, options.version, folder);

  mkpath(buildRoot, function (err) {
    if (err) return callback(err);

    var iterator = new Iterator(sourceRoot);
    iterator.forEach(
      function (entry, callback) {
        var targetPath = path.join(buildRoot, entry.path);
        if (entry.stats.isDirectory()) return callback();

        // transpile or copy
        if (path.extname(targetPath) === '.js' && !startsWith(entry.path, 'fixtures')) {
          log('Transpiling   ' + entry.path);
          transpile(entry.fullPath, targetPath, callback);
        } else {
          log('Copying ' + entry.path + '\n');
          mkpath(path.dirname(targetPath), function mkpathCallback(err) {
            err ? callback(err) : fs.copyFile(entry.fullPath, targetPath, callback);
          });
        }
      },
      { callbacks: true, concurrency: 1 },
      callback
    );
  });
};
