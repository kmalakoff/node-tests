var path = require('path');
var mock = require('mock-require');
var Iterator = require('fs-iterator');
var BigInt = require('big-integer');
var nextTick = require('next-tick');

var OVERRIDES = {
  worker_threads: { isMainThread: true },
  'internal/bootstrap/loaders': {},
  'internal/test/binding': { internalBinding: require },
};

module.exports = function testSetup(options, callback) {
  try {
    var internalsPath = path.join(options.buildDirectory, options.version, 'lib', 'internal');
    var typesPath = path.join(internalsPath, 'util', 'types');

    // run tests in root of node version
    process.env.NODE_TEST_DIR = path.join(options.buildDirectory, options.version, 'test');
    process.chdir(path.join(options.buildDirectory, options.version));

    // don't error on these globals existing
    process.env.NODE_TEST_KNOWN_GLOBALS = '0';
    global.internalBinding = function (name) {
      if (name === 'types') return require(typesPath);
      // eslint-disable-next-line node/no-deprecated-api
      return process.binding(name);
    };
    global.primordials = {};
    global.primordials.SymbolFor = Symbol.for;
    global.primordials.ObjectGetPrototypeOf = Object.getPrototypeOf;
    if (!global.queueMicrotask) global.queueMicrotask = nextTick;

    // TODO: undo monkey patches
    var originalPow = Math.pow;
    Math.pow = function pow(a, b) {
      if (typeof a === 'bigint' || typeof b === 'bigint') return BigInt(a).pow(BigInt(b)).value;
      return originalPow(a, b);
    };

    for (var requirePath in OVERRIDES) mock(requirePath, OVERRIDES[requirePath]);

    var iterator = new Iterator(internalsPath);
    iterator.forEach(function (entry) {
      if (!entry.stats.isFile()) return;
      var requirePath = 'internal/' + path.parse(entry.path).name;
      OVERRIDES[requirePath] || mock(requirePath, require.bind(null, entry.fullPath), true);
    }, callback);
  } catch (err) {
    callback(err);
  }
};
