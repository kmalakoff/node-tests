#!/usr/bin/env node

var path = require('path');
var mock = require('mock-require');
var Queue = require('queue-cb');

var setup = require('./setup');
var teardown = require('./teardown');

var BUILD_DIR = require('../DIRECTORIES').BUILD;

module.exports = function runTest(testPath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  if (!options.version) return callback(new Error('Missing version'));

  var queue = new Queue(1);
  queue.defer(setup.bind(null, options));
  queue.defer(function (callback) {
    if (options.module) {
      var parts = options.module.split(',');
      mock(parts[0], require(parts[1]));
    }
    try {
      // run test in root of node version
      process.chdir(path.join(BUILD_DIR, options.version));
      require(path.join(BUILD_DIR, options.version, 'test', testPath));
      callback();
    } catch (err) {
      callback(err);
    }
  });
  queue.await(function (err) {
    teardown(options);
    callback(err);
  });
};
