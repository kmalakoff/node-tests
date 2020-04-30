var assert = require('assert');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Queue = require('queue-cb');

var nodeTests = require('../..');
var BUILD_DIR = require('../../lib/DIRECTORIES').BUILD;

describe('clean', function () {
  beforeEach(rimraf.bind(null, BUILD_DIR));
  after(rimraf.bind(null, BUILD_DIR));

  it('ignores missing directory', function (done) {
    var queue = new Queue(1);

    queue.defer(function (callback) {
      nodeTests.clean({}, function (err) {
        assert.ok(!err);
        callback();
      });
    });

    queue.defer(function (callback) {
      fs.access(BUILD_DIR, function (err) {
        assert.ok(!!err);
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

    queue.defer(mkdirp.bind(null, BUILD_DIR));
    queue.defer(function (callback) {
      fs.access(BUILD_DIR, function (err) {
        assert.ok(!err);
        callback();
      });
    });

    queue.defer(function (callback) {
      nodeTests.clean({}, function (err) {
        assert.ok(!err);
        callback();
      });
    });

    queue.defer(function (callback) {
      fs.access(BUILD_DIR, function (err) {
        assert.ok(!!err);
        callback();
      });
    });

    queue.await(function (err) {
      assert.ok(!err);
      done();
    });
  });
});
