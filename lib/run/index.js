var path = require('path');
var Iterator = require('fs-iterator');
var minimatch = require('minimatch');
var some = require('lodash.some');
var spawn = require('cross-spawn-cb');

var TEST_DIR = path.join(require('../DIRECTORIES').CACHE, 'v14.x', 'test');
var EXCLUDE_FILES = ['common/*', 'fixtures/*', 'pummel/*'];
var KEEP_FILES = ['common/*.js', 'parallel/**/*-fs-*.js', 'pummel/**/*-fs-*.js', 'sequential/**/*-fs-*.js'];
var TEST_RUNNER = path.resolve(path.join(__dirname, '..', '..', 'bin', 'run-test'));

var runTest = require('../runTest');

module.exports = function run(options, callback) {
  var errors = [];
  var iterator = new Iterator(TEST_DIR);
  iterator.forEach(
    function (entry, callback) {
      if (!entry.stats.isFile()) return callback();
      if (some(EXCLUDE_FILES, minimatch.bind(null, entry.path))) return callback();
      if (!some(KEEP_FILES, minimatch.bind(null, entry.path))) return callback();

      spawn('node', ['--expose-gc', '--no-warnings', '--expose-internals', TEST_RUNNER, entry.path], { stdout: 'inherit' }, function (err, res) {
        if (err) {
          console.log(err);
          errors.push(err);
        } else if (res.exitCode !== 0) {
          var message = entry.path + ' failed. Code:' + res.exitCode;
          console.log(message);
          errors.push(new Error(message));
        } else console.log(entry.path + ' success');
        callback();
      });
    },
    { callbacks: true, concurrency: 1 },
    function (err) {
      if (err) console.log(err.message);
      console.log('\n------------------------');
      console.log('Tests completed ' + errors.length + ' errors');
      console.log('------------------------');
      callback();
    }
  );
};
