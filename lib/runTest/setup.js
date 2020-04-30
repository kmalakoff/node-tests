var path = require('path');
var mock = require('mock-require');
var Iterator = require('fs-iterator');

module.exports = function setup(options, callback) {
  var BUILD_DIR = path.join(require('../DIRECTORIES').CACHE, 'v14.x');
  var TYPES_PATH = path.join(BUILD_DIR, 'lib/internal/util/types');
  var NULL_PATHS = ['internal/test/binding', 'internal/bootstrap/loaders'];

  require('expose-gc');
  global.internalBinding = function (name) {
    if (name === 'types') return require(TYPES_PATH);
    // eslint-disable-next-line node/no-deprecated-api
    return process.binding(name);
  };
  global.primordials = {};
  global.primordials.SymbolFor = Symbol.for;
  global.primordials.ObjectGetPrototypeOf = Object.getPrototypeOf;
  require(path.join(BUILD_DIR, 'lib/internal/per_context/primordials'));
  process.env.NODE_TEST_KNOWN_GLOBALS = '0'; // don't error on these globals existing

  var iterator = new Iterator(path.join(BUILD_DIR, 'lib', 'internal'));
  iterator.forEach(
    function (entry) {
      if (!entry.stats.isFile()) return callback();
      mock('internal/' + path.parse(entry.path).name, require.bind(null, entry.fullPath), true);
    },
    function (err) {
      if (err) return callback(err);

      // do not load some paths
      NULL_PATHS.forEach(function (x) {
        mock.stop(x);
        mock(x, {});
      });
      callback();
    }
  );
};
