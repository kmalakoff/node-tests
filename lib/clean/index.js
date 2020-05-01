var path = require('path');
var rimraf = require('rimraf');
var Queue = require('queue-cb');

// var CACHE_DIR = require('./DIRECTORIES').CACHE;
var BUILD_DIR = require('../DIRECTORIES').BUILD;

module.exports = function clean(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  if (!options.version) return callback(new Error('Missing version'));
  var buildTarget = options.version ? path.join(BUILD_DIR, options.version) : BUILD_DIR;

  var queue = new Queue(1);
  // queue.defer(rimraf.bind(null, CACHE_DIR)
  queue.defer(rimraf.bind(null, buildTarget, {}));
  queue.await(callback);
};
