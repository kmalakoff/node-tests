var assert = require('assert');
var path = require('path');

var NodeTests = require('../..');
var fsCompatModulePath = require.resolve(path.join('..', 'lib', 'fs-compat'));

var IGNORES = ['test-fs-read-type.js', 'test-fs-close-errors.js'];

describe('test-suite', function () {
  var tests = new NodeTests({
    repositoryURL: function (version) {
      return 'https://codeload.github.com/kmalakoff/node-tests-data/zip/' + version;
    },
  });

  // before(tests.clean.bind(tests));
  // after(tests.clean.bind(tests));

  it.only('runs fs tests with built-in fs', function (done) {
    tests.install({ version: 'v1.0.0' }, function (err) {
      assert.ok(!err);

      tests.build({ version: 'v1.0.0' }, function (err) {
        assert.ok(!err);

        tests.runSuite({ version: 'v1.0.0', ignore: IGNORES }, function (err) {
          assert.ok(!err);
          done();
        });
      });
    });
  });

  it.only('runs fs tests with fs-compat', function (done) {
    tests.install({ version: 'v1.0.0' }, function (err) {
      assert.ok(!err);

      tests.build({ version: 'v1.0.0' }, function (err) {
        assert.ok(!err);

        tests.runSuite({ version: 'v1.0.0', ignore: IGNORES, module: 'fs,' + fsCompatModulePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
    });
  });
});
