#!/usr/bin/env node

var path = require('path');
var mock = require('mock-require');
var Queue = require('queue-cb');

var CACHE_DIR = require('../DIRECTORIES').CACHE;
// var BUILD_DIR = require('../DIRECTORIES').BUILD;

module.exports = function runTest(testPath, options, callback) {
  var version = options.version || 'v14.x';

  var queue = new Queue(1);
  queue.defer(require('./setup').bind(null, options));
  queue.defer(function (callback) {
    if (options.module) mock(options.module, require(options.modulePath));
    try {
      require(path.join(CACHE_DIR, version, 'test', testPath));
      callback();
    } catch (err) {
      callback(err);
    }
  });
  queue.defer(require('./teardown').bind(null, options));
  queue.await(callback);
};
