var path = require('path');
var Iterator = require('fs-iterator');
var minimatch = require('minimatch');
var some = require('lodash.some');
var spawn = require('cross-spawn-cb');
var Queue = require('queue-cb');
var assign = require('object.assign');

var CACHE_DIR = require('../DIRECTORIES').CACHE;
var TEST_RUNNER = path.resolve(path.join(__dirname, '..', '..', 'bin', 'node-test'));
var RUNTIME_ARGS = ['--expose-gc', '--no-warnings', '--expose-internals', '--expose_externalize_string'];

var TEST_SUITES = {
  parallel: { concurrency: 1 },
};

function runTests(name, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  if (!options.version) return callback(new Error('Missing version'));

  var errors = [];
  var iterator = new Iterator(path.join(CACHE_DIR, options.version, 'test', name), {
    filter: function (entry) {
      return entry.stats.isDirectory() ? minimatch(entry.basename, '*.js') : true;
    },
  });
  iterator.forEach(
    function (entry, callback) {
      if (!entry.stats.isFile()) return callback();

      var scopedPath = path.join(name, entry.path);
      if (options.filters && !some(options.filters, minimatch.bind(null, entry.basename)) && !some(options.filters, minimatch.bind(null, scopedPath)))
        return callback();

      var args = RUNTIME_ARGS.concat([TEST_RUNNER, scopedPath, '--version', options.version]);
      if (options.module) args = args.concat(['--module', options.module]);

      spawn('node', args, { stdio: 'inherit', cwd: CACHE_DIR }, function (err, res) {
        if (err) {
          console.log(err);
          errors.push(err);
        } else if (res.exitCode !== 0) {
          var message = entry.path + ' failed. Code:' + res.exitCode;
          console.log(message);
          errors.push(new Error(message));
        } else console.log(entry.path);
        callback();
      });
    },
    assign({ callbacks: true }, TEST_SUITES[name]),
    function (err) {
      if (err) console.log(err.message);
      console.log('\n------------------------');
      console.log('Tests completed ' + errors.length + ' errors');
      console.log('------------------------');
      if (errors.length) {
        errors.forEach(function (x) {
          console.log('Error: ' + x.message);
        });
        console.log('------------------------');
      }
      callback();
    }
  );
}

module.exports = function runSuite(options, callback) {
  var queue = new Queue(1);
  for (var name in TEST_SUITES) queue.defer(runTests.bind(null, name, options));
  queue.await(callback);
};
