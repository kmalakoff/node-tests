var assert = require('assert');

var nodeTests = require('../..');

describe('run', function () {
  it('runs the tests', function (done) {
    nodeTests.run({}, function (err) {
      assert.ok(!err);
      done();
    });
  });
});
