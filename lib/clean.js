var Queue = require('queue-cb');
var rimraf = require('rimraf');

// var CACHE_DIR = require('./DIRECTORIES').CACHE;
var BUILD_DIR = require('./DIRECTORIES').BUILD;

module.exports = function clean(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};

  var queue = new Queue(1);
  // queue.defer(rimraf.bind(null, CACHE_DIR)
  queue.defer(rimraf.bind(null, BUILD_DIR, {}));
  queue.await(callback);
};
