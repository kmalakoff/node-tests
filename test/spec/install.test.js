var assert = require('assert');

var nodeTests = require('../..');

describe('install', function () {
  it('fails if directory is missing', function (done) {
    nodeTests.install({ version: 'junk' }, function (err) {
      assert.ok(!!err);
      done();
    });
  });

  it.only('builds a valid version', function (done) {
    nodeTests.install({ repository: 'https://codeload.github.com/kmalakoff/node-tests-data/zip/', version: 'v1.0.0' }, function (err) {
      assert.ok(!err);
      done();
    });
  });
});
