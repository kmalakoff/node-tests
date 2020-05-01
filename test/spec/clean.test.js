var assert = require('assert');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var parallel = require('run-parallel');
var Queue = require('queue-cb');

var nodeTests = require('../..');
var CACHE_DIR = require('../../lib/DIRECTORIES').CACHE;
var BUILD_DIR = require('../../lib/DIRECTORIES').BUILD;

describe('clean', function () {
  beforeEach(parallel.bind(null, [rimraf.bind(null, CACHE_DIR), rimraf.bind(null, BUILD_DIR)]));
  afterEach(parallel.bind(null, [rimraf.bind(null, CACHE_DIR), rimraf.bind(null, BUILD_DIR)]));

  it('ignores missing directory', function (done) {
    var queue = new Queue(1);

    queue.defer(function (callback) {
      nodeTests.clean({ version: 'v1.0.0' }, function (err) {
        assert.ok(!err);
        callback();
      });
    });

    queue.defer(function (callback) {
      fs.access(path.join(BUILD_DIR, 'v1.0.0'), function (missing) {
        assert.ok(missing);
        callback();
      });
    });

    queue.await(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it('cleans existing directory', function (done) {
    var queue = new Queue(1);

    queue.defer(mkdirp.bind(null, path.join(CACHE_DIR, 'v1.0.0')));
    queue.defer(mkdirp.bind(null, path.join(BUILD_DIR, 'v1.0.0')));
    queue.defer(function (callback) {
      nodeTests.clean({ version: 'v1.0.0' }, function (err) {
        assert.ok(!err);
        callback();
      });
    });

    queue.defer(function (callback) {
      fs.access(path.join(CACHE_DIR, 'v1.0.0'), function (missing) {
        assert.ok(missing);
        callback();
      });
    });

    queue.defer(function (callback) {
      fs.access(path.join(BUILD_DIR, 'v1.0.0'), function (missing) {
        assert.ok(missing);
        callback();
      });
    });

    queue.await(function (err) {
      assert.ok(!err);
      done();
    });
  });
});
