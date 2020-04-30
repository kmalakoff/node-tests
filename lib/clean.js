var path = require('path');
var rimraf = require('rimraf');
var Queue = require('queue-cb');

// var CACHE_DIR = path.join(__dirname, '..', '.cache');
var BUILD_DIR = path.join(__dirname, '..', '.build');

module.exports = function clean(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  var queue = new Queue(1);
  // queue.defer(rimraf.bind(null, CACHE_DIR)
  queue.defer(rimraf.bind(null, BUILD_DIR, {}));
  queue.await(callback);
};
