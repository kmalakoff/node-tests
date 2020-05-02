var path = require('path');
var mock = require('mock-require');
var Iterator = require('fs-iterator');
var BigInt = require('big-integer');
var nextTick = require('next-tick');

var OVERRIDES = { 'internal/bootstrap/loaders': {} };

module.exports = function testSetup(options, callback) {
  try {
    var internalsPath = path.join(options.buildDirectory, options.version, 'lib', 'internal');
    var typesPath = path.join(internalsPath, 'util', 'types');

    global.internalBinding = function (name) {
      if (name === 'types') return require(typesPath);
      // eslint-disable-next-line node/no-deprecated-api
      return process.binding(name);
    };
    global.primordials = {};
    global.primordials.SymbolFor = Symbol.for;
    global.primordials.ObjectGetPrototypeOf = Object.getPrototypeOf;
    require(path.join(internalsPath, 'per_context', 'primordials'));
    global.queueMicrotask = typeof queueMicrotask === 'function' ? queueMicrotask : nextTick;
    process.env.NODE_TEST_KNOWN_GLOBALS = '0'; // don't error on these globals existing

    // TODO: undo monkey patches
    var originalPow = Math.pow;
    Math.pow = function pow(a, b) {
      if (typeof a === 'bigint' || typeof b === 'bigint') return BigInt(a).pow(BigInt(b)).value;
      return originalPow(a, b);
    };

    var iterator = new Iterator(internalsPath);
    iterator.forEach(function (entry) {
      if (!entry.stats.isFile()) return;
      var requirePath = 'internal/' + path.parse(entry.path).name;
      mock(requirePath, OVERRIDES[requirePath] || require.bind(null, entry.fullPath), true);
    }, callback);
  } catch (err) {
    callback(err);
  }
};
