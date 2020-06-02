var path = require('path');
var Iterator = require('fs-iterator');
var minimatch = require('minimatch');
var some = require('lodash.some');
var spawn = require('cross-spawn-cb');

var TEST_RUNNER = path.resolve(path.join(__dirname, '..', 'bin', 'node-test.js'));
var RUNTIME_ARGS = ['--expose-gc', '--no-warnings', '--expose-internals', '--expose_externalize_string'];

module.exports = function runTestFolder(name, options, callback) {
  var errors = [];
  var iterator = new Iterator(path.join(options.cacheDirectory, options.version, 'test', name), {
    filter: function (entry) {
      return entry.stats.isDirectory() ? minimatch(entry.basename, '*.js') : true;
    },
  });
  iterator.forEach(
    function (entry, callback) {
      if (!entry.stats.isFile()) return callback();

      var scopedPath = path.join(name, entry.path);
      if (options.ignore && (some(options.ignore, minimatch.bind(null, entry.basename)) || some(options.ignore, minimatch.bind(null, scopedPath))))
        return callback();
      if (options.match && !some(options.match, minimatch.bind(null, entry.basename)) && !some(options.match, minimatch.bind(null, scopedPath)))
        return callback();

      var args = RUNTIME_ARGS.concat([TEST_RUNNER, scopedPath, '--version', options.version]);
      if (options.module) args = args.concat(['--module', options.module]);

      spawn('node', args, { stdio: 'inherit', cwd: options.cacheDirectory }, function (err) {
        if (err) errors.push(err);
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
        err = err || new Error('Tests failed');
        errors.forEach(function (x) {
          console.log('Error: ' + x.message);
        });
        console.log('------------------------');
      }
      callback(err);
    }
  );
};
