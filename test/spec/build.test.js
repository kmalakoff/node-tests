var assert = require('assert');
var rimraf = require('rimraf');

var nodeTests = require('../..');
var BUILD_DIR = require('../../lib/DIRECTORIES').BUILD;

describe('build', function () {
  beforeEach(rimraf.bind(null, BUILD_DIR));
  after(rimraf.bind(null, BUILD_DIR));

  it('fails if directory is missing', function (done) {
    nodeTests.build({ version: 'junk' }, function (err) {
      assert.ok(!!err);
      done();
    });
  });

  it('builds a valid version', function (done) {
    nodeTests.build({ version: 'v14.x' }, function (err) {
      assert.ok(!err);
      done();
    });
  });
});
