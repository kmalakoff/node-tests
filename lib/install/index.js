var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var Queue = require('queue-cb');
var uuid = require('uuid');

var download = require('./download');
var moveExtracted = require('./moveExtracted');

var CACHE_DIR = require('../DIRECTORIES').CACHE;

module.exports = function install(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  if (!options.version) return callback(new Error('Missing version'));
  var cacheTarget = path.join(CACHE_DIR, options.version);

  fs.access(cacheTarget, function (missing) {
    if (!missing && !options.force) return callback();

    var tempTarget = path.join(path.dirname(cacheTarget), uuid.v4());
    var queue = new Queue(1);
    missing || queue.defer(rimraf.bind(null, cacheTarget));
    queue.defer(download.bind(null, tempTarget, options));
    queue.defer(moveExtracted.bind(null, tempTarget, cacheTarget, options));
    queue.await(function (err) {
      var q2 = new Queue();
      q2.defer(rimraf.bind(null, tempTarget, {}));
      !err || q2.defer(rimraf.bind(null, cacheTarget, {}));
      q2.await(function (err2) {
        callback(err || err2);
      });
    });
  });
};
