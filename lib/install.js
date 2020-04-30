var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var Queue = require('queue-cb');
var spawn = require('cross-spawn-cb');

var CACHE_DIR = require('./DIRECTORIES').CACHE;

module.exports = function install(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  var version = options.version || require('./VERSION');
  var cacheTarget = path.join(CACHE_DIR, version + Date.now());

  fs.access(cacheTarget, function (missing) {
    if (!missing && !options.force) return callback();

    var queue = new Queue(1);
    missing || queue.defer(rimraf.bind(null, cacheTarget));
    queue.defer(function (callback) {
      spawn('curl', ['https://codeload.github.com/nodejs/node/zip/' + version, '--output', cacheTarget], { stdio: 'inherit' }, function (err, res) {
        if (err || res.exitCode !== 0) return callback(err || new Error('Failed download' + res.exitCode));
        callback();
      });
    });
    queue.await(callback);
  });
};
