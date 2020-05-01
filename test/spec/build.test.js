var assert = require('assert');
var rimraf = require('rimraf');

var nodeTests = require('../..');
var CACHE_DIR = require('../../lib/DIRECTORIES').CACHE;
var BUILD_DIR = require('../../lib/DIRECTORIES').BUILD;

describe('build', function () {
  before(rimraf.bind(null, CACHE_DIR));
  beforeEach(rimraf.bind(null, BUILD_DIR));
  afterEach(rimraf.bind(null, BUILD_DIR));
  after(rimraf.bind(null, CACHE_DIR));

  it('fails if directory is missing', function (done) {
    nodeTests.build({ version: 'junk' }, function (err) {
      assert.ok(!!err);
      done();
    });
  });

  it('builds a valid version', function (done) {
    nodeTests.install({ repository: 'https://codeload.github.com/kmalakoff/node-tests-data/zip/', version: 'v1.0.0' }, function (err) {
      assert.ok(!err);

      nodeTests.build({ version: 'v1.0.0' }, function (err) {
        assert.ok(!err);
        done();
      });
    });
  });
});
