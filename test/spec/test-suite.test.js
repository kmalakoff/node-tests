var assert = require('assert');
var path = require('path');
var rimraf = require('rimraf');
var parallel = require('run-parallel');

var nodeTests = require('../..');
var CACHE_DIR = require('../../lib/DIRECTORIES').CACHE;
var BUILD_DIR = require('../../lib/DIRECTORIES').BUILD;
var fsCompatModulePath = require.resolve(path.join('..', 'lib', 'fs-compat'));

describe('test-suite', function () {
  // before(parallel.bind(null, [rimraf.bind(null, CACHE_DIR), rimraf.bind(null, BUILD_DIR)]));
  // after(parallel.bind(null, [rimraf.bind(null, CACHE_DIR), rimraf.bind(null, BUILD_DIR)]));

  it.only('runs fs tests with fs-compat', function (done) {
    nodeTests.install({ repository: 'https://codeload.github.com/kmalakoff/node-tests-data/zip/', version: 'v1.0.0' }, function (err) {
      assert.ok(!err);

      nodeTests.build({ version: 'v1.0.0' }, function (err) {
        assert.ok(!err);

        nodeTests.runSuite({ version: 'v1.0.0', module: 'fs,' + fsCompatModulePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
    });
  });
});
