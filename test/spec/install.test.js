var assert = require('assert');
// var rimraf = require('rimraf');

var nodeTests = require('../..');
// var BUILD_DIR = require('../../lib/DIRECTORIES').BUILD;

describe.only('install', function () {
  // beforeEach(rimraf.bind(null, BUILD_DIR));
  // after(rimraf.bind(null, BUILD_DIR));

  it('fails if directory is missing', function (done) {
    nodeTests.install({ version: 'junk' }, function (err) {
      assert.ok(!!err);
      done();
    });
  });

  it.only('builds a valid version', function (done) {
    nodeTests.install({ version: 'v14.1.0' }, function (err) {
      assert.ok(!err);
      done();
    });
  });
});
