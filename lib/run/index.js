// // var path = require('path');
// // var Iterator = require('fs-iterator');
// // var minimatch = require('minimatch');
// // var some = require('lodash.some');
// var mock = require('mock-require');
// require('expose-gc');

// global.internalBinding = function (name) {
//   if (name === 'types') return require('./internal/util/types');
//   // eslint-disable-next-line node/no-deprecated-api
//   return process.binding(name);
// };
// global.primordials = {};
// global.primordials.SymbolFor = Symbol.for;
// global.primordials.ObjectGetPrototypeOf = Object.getPrototypeOf;
// require('./internal/per_context/primordials');
// process.env.NODE_TEST_KNOWN_GLOBALS = '0'; // don't error on these globals existing

// mock('internal/assert', require.bind(null, './internal/assert'), true);
// mock('internal/errors', require.bind(null, './internal/errors'), true);
// mock('internal/test/binding', {});
// // mock('internal/test/binding', require.bind(null, './internal/test/binding'));
// mock('internal/util/types', require.bind(null, './internal/util/types'), true);
// mock('internal/util', require.bind(null, './internal/util'), true);
// // mock('internal/bootstrap/loaders', require.bind(null, './internal/bootstrap/loaders'));
// mock('internal/bootstrap/loaders', {});
// mock('internal/util/inspect', require.bind(null, './internal/util/inspect'), true);
// mock('internal/querystring', require.bind(null, './internal/querystring'), true);
// mock('internal/constants', require.bind(null, './internal/constants'), true);
// mock('internal/url', require.bind(null, './internal/url'), true);
// mock('internal/validators', require.bind(null, './internal/validators'), true);
// mock('internal/fs/utils', require.bind(null, './internal/fs/utils'), true);
// mock('fs', require('../../test/lib/fs-compat'));

// // var TESTS_DIR = path.join(__dirname, '..', 'test', 'dist');
// // var EXCLUDE_FILES = ['common/*', 'fixtures/*', 'pummel/*'];
// // var KEEP_FILES = ['common/*.js', 'parallel/**/*-fs-*.js', 'pummel/**/*-fs-*.js', 'sequential/**/*-fs-*.js'];

// // var errors = [];
// // var iterator = new Iterator(TESTS_DIR);
// // iterator.forEach(
// //   function (entry, callback) {
// //     if (!entry.stats.isFile()) return callback();
// //     if (some(EXCLUDE_FILES, minimatch.bind(null, entry.path))) return callback();
// //     if (!some(KEEP_FILES, minimatch.bind(null, entry.path))) return callback();

// // node scripts/run-tests --expose-gc --no-warnings --expose-internals

// try {
//   require('/Users/kevin/Dev/OpenSource/fs-compat/test/dist/parallel/test-fs-readdir.js');
// } catch (err) {
//   // console.log(entry.path);
//   // console.log(err);
//   // errors.push(err);
// }
// //     setTimeout(callback, 100);
// //   },
// //   {
// //     callbacks: true,
// //     concurrency: 1,
// //   },
// //   function (err) {
// //     if (err) return console.log(err.message);
// //     if (errors.length) console.log('Done with ' + errors.length + ' errors');
// //   }
// // );
