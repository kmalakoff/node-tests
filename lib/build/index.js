// var path = require('path');
// var fs = require('fs');
// var rimraf = require('rimraf');
// var mkdirp = require('mkdirp');
// var Iterator = require('fs-iterator');
// var ncp = require('ncp').ncp;
// var minimatch = require('minimatch');
// var some = require('lodash.some');
// var assign = require('object.assign');
// var Queue = require('queue-cb');
// var babel = require('@babel/core');
// var babelOptions = require('./babelOptions');

// var NODE_DIR = path.join(__dirname, '..', '..', '.cache', 'node');
// var BUILD_DIR = path.join(__dirname, '..', 'test', 'dist');
// var KEEP_FILES = ['common/*.js', 'parallel/**/*-fs-*.js', 'pummel/**/*-fs-*.js', 'sequential/**/*-fs-*.js'];
// var COPY_FOLDERS = ['fixtures'];

// module.exports = function build(options, callback) {
//   if (typeof options === 'function') {
//     callback = options;
//     options = null;
//   }
//   options = options || {};

//   fs.access(BUILD_DIR, function (err) {
//     assert.ok(!!err);
//     callback();
//   });

//   var queue = new Queue(1);

//   queue.defer(function (callback) {
//     fs.access(BUILD_DIR, function (err) {
//       assert.ok(!!err);
//       callback();
//     });
//   });
// };

// rimraf.sync(BUILD_DIR);

// var iterator = new Iterator(NODE_DIR);
// iterator.forEach(
//   function (entry) {
//     if (!entry.stats.isFile()) return;
//     if (!some(KEEP_FILES, minimatch.bind(null, entry.path))) return;

//     var contents = fs.readFileSync(entry.fullPath, 'utf8');
//     var transpiled = babel.transformSync(contents, assign({ filename: entry.fullPath }, babelOptions));
//     var fullPath = path.join(BUILD_DIR, entry.path);
//     mkdirp.sync(path.dirname(fullPath));
//     fs.writeFileSync(fullPath, transpiled.code);
//   },
//   function (err) {
//     if (err) return console.log(err.message);
//     var queue = new Queue(1);
//     COPY_FOLDERS.forEach(function (x) {
//       queue.defer(ncp.bind(null, path.join(NODE_DIR, x), path.join(BUILD_DIR, x)));
//     });
//     queue.await(function (err) {
//       if (err) return console.log(err.message);
//     });
//   }
// );
