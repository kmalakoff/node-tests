#!/usr/bin/env node

var path = require('path');
var mock = require('mock-require');
var Queue = require('queue-cb');

var BUILD_DIR = path.join(require('../DIRECTORIES').CACHE, 'v14.x');
var TEST_DIR = path.join(BUILD_DIR, 'test');

module.exports = function runTest(testPath, options, callback) {
  var queue = new Queue(1);
  queue.defer(require('./setup').bind(null, options));
  queue.defer(function (callback) {
    if (options.module) mock(options.module, require(options.modulePath));
    require(path.join(TEST_DIR, testPath));
    callback();
  });
  queue.defer(require('./teardown').bind(null, options));
  queue.await(callback);
};
