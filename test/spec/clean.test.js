var assert = require('assert');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp-classic');
var Queue = require('queue-cb');

var NodeTests = require('../..');

describe('clean', function () {
  var tests = new NodeTests({
    repositoryURL: function (version) {
      return 'https://codeload.github.com/kmalakoff/node-tests-data/zip/' + version;
    },
  });

  before(tests.clean.bind(tests));
  after(tests.clean.bind(tests));

  it('ignores missing directory', function (done) {
    var queue = new Queue(1);

    queue.defer(mkdirp.bind(null, path.join(tests.options.cacheDirectory, 'v1.0.0')));
    queue.defer(tests.clean.bind(tests, { version: 'v1.0.0' }));
    queue.defer(function (callback) {
      fs.readdir(path.join(tests.options.buildDirectory, 'v1.0.0'), function (err) {
        assert.ok(err);
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

    queue.defer(mkdirp.bind(null, path.join(tests.options.cacheDirectory, 'v1.0.0')));
    queue.defer(mkdirp.bind(null, path.join(tests.options.buildDirectory, 'v1.0.0')));
    queue.defer(tests.clean.bind(tests, { version: 'v1.0.0' }));
    queue.defer(function (callback) {
      fs.readdir(path.join(tests.options.cacheDirectory, 'v1.0.0'), function (err) {
        assert.ok(err);
        callback();
      });
    });
    queue.defer(function (callback) {
      fs.readdir(path.join(tests.options.buildDirectory, 'v1.0.0'), function (err) {
        assert.ok(err);
        callback();
      });
    });
    queue.await(function (err) {
      assert.ok(!err);
      done();
    });
  });
});
