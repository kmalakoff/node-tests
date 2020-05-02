var assert = require('assert');

var NodeTests = require('../..');

describe('build', function () {
  var tests = new NodeTests({
    repositoryURL: function (version) {
      return 'https://codeload.github.com/kmalakoff/node-tests-data/zip/' + version;
    },
  });

  before(tests.clean.bind(tests));
  after(tests.clean.bind(tests));

  it('fails if directory is missing', function (done) {
    tests.build({ version: 'junk' }, function (err) {
      assert.ok(!!err);
      done();
    });
  });

  it('builds a valid version', function (done) {
    tests.build({ version: 'v1.0.0' }, function (err) {
      assert.ok(!err);
      done();
    });
  });
});
