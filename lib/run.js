var path = require('path');
var Iterator = require('fs-iterator');
var minimatch = require('minimatch');
var some = require('lodash.some');
var spawn = require('cross-spawn-cb');

var NODE_DIR = path.join(require('./DIRECTORIES').CACHE, 'v14.x');
var TEST_RUNNER = path.resolve(path.join(__dirname, '..', 'bin', 'run-test'));
var RUNTIME_ARGS = ['--expose-gc', '--no-warnings', '--expose-internals', '--expose_externalize_string'];

var TEST_SUITES = {
  parallel: { concurrency: Infinity },
};

module.exports = function run(options, callback) {
  var errors = [];
  var iterator = new Iterator(path.join(NODE_DIR, 'test'), {
    filter: function (entry) {
      if (!entry.stats.isDirectory()) return minimatch(entry.basename, '*.js');
      var paths = entry.path.split(path.sep);
      return paths.length > 1 ? true : !!TEST_SUITES[paths[0]];
    },
  });
  iterator.forEach(
    function (entry, callback) {
      if (!entry.stats.isFile()) return callback();

      if (options.match && !some(options.match, minimatch.bind(null, entry.basename)) && !some(options.match, minimatch.bind(null, entry.path)))
        return callback();

      spawn('node', RUNTIME_ARGS.concat([TEST_RUNNER, entry.path]), { stdio: 'inherit', cwd: NODE_DIR }, function (err, res) {
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
    { callbacks: true, concurrency: 1 },
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
};
