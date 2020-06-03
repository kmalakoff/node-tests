var assert = require('assert');
var path = require('path');
var compare = require('semver-compare');

var NodeTests = require('../..');
var fsCompatModulePath = require.resolve(path.join('..', 'lib', 'fs-compat'));

var MATCHES = ['*fs-readd*', '*fs-stat*', '*fs-realp*'];
var IGNORES = ['test-fs-read-type.js', 'test-fs-close-errors.js'];

if (typeof BigInt === 'undefined') IGNORES = IGNORES.concat(['test-fs-stat-bigint.js']);
if (compare(process.versions.node, '9.0.0') < 0) IGNORES = IGNORES.concat(['test-fs-realpath-pipe.js']);
if (compare(process.versions.node, '7.0.0') < 0) IGNORES = IGNORES.concat(['test-fs-readdir-stack-overflow.js']);

describe.only('test-suite', function () {
  var tests = new NodeTests({
    repositoryURL: function (version) {
      return 'https://codeload.github.com/kmalakoff/node-tests-data/zip/' + version;
    },
  });
  // before(tests.clean.bind(tests));

  it.skip('runs fs tests with built-in fs', function (done) {
    tests.runSuite({ version: 'v1.0.0', match: MATCHES, ignore: IGNORES }, function (err) {
      assert.ok(!err);
      done();
    });
  });

  it('runs fs tests with fs-compat', function (done) {
    tests.runSuite({ version: 'v1.0.0', match: MATCHES, ignore: IGNORES, module: 'fs,' + fsCompatModulePath }, function (err) {
      assert.ok(!err);
      done();
    });
  });
});
