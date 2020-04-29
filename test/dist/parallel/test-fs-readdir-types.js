// Flags: --expose-internals
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

var _require = require('internal/test/binding'),
    internalBinding = _require.internalBinding;

var binding = internalBinding('fs');
var readdirDir = tmpdir.path;
var files = ['empty', 'files', 'for', 'just', 'testing'];

var constants = require('fs').constants;

var types = {
  isDirectory: constants.UV_DIRENT_DIR,
  isFile: constants.UV_DIRENT_FILE,
  isBlockDevice: constants.UV_DIRENT_BLOCK,
  isCharacterDevice: constants.UV_DIRENT_CHAR,
  isSymbolicLink: constants.UV_DIRENT_LINK,
  isFIFO: constants.UV_DIRENT_FIFO,
  isSocket: constants.UV_DIRENT_SOCKET
};
var typeMethods = Object.keys(types); // Make sure tmp directory is clean

tmpdir.refresh(); // Create the necessary files

files.forEach(function (currentFile) {
  fs.closeSync(fs.openSync("".concat(readdirDir, "/").concat(currentFile), 'w'));
});

function assertDirents(dirents) {
  assert.strictEqual(files.length, dirents.length);

  var _iterator = _createForOfIteratorHelper(dirents.entries()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = (0, _slicedToArray2["default"])(_step.value, 2),
          i = _step$value[0],
          dirent = _step$value[1];

      assert(dirent instanceof fs.Dirent);
      assert.strictEqual(dirent.name, files[i]);
      assert.strictEqual(dirent.isFile(), true);
      assert.strictEqual(dirent.isDirectory(), false);
      assert.strictEqual(dirent.isSocket(), false);
      assert.strictEqual(dirent.isBlockDevice(), false);
      assert.strictEqual(dirent.isCharacterDevice(), false);
      assert.strictEqual(dirent.isFIFO(), false);
      assert.strictEqual(dirent.isSymbolicLink(), false);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
} // Check the readdir Sync version


assertDirents(fs.readdirSync(readdirDir, {
  withFileTypes: true
}));
fs.readdir(__filename, {
  withFileTypes: true
}, common.mustCall(function (err) {
  assert["throws"](function () {
    throw err;
  }, {
    code: 'ENOTDIR',
    name: 'Error',
    message: "ENOTDIR: not a directory, scandir '".concat(__filename, "'")
  });
})); // Check the readdir async version

fs.readdir(readdirDir, {
  withFileTypes: true
}, common.mustCall(function (err, dirents) {
  assert.ifError(err);
  assertDirents(dirents);
}));
(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var dirents;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return fs.promises.readdir(readdirDir, {
            withFileTypes: true
          });

        case 2:
          dirents = _context.sent;
          assertDirents(dirents);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))(); // Check for correct types when the binding returns unknowns

var UNKNOWN = constants.UV_DIRENT_UNKNOWN;
var oldReaddir = binding.readdir;
process.on('beforeExit', function () {
  binding.readdir = oldReaddir;
});
binding.readdir = common.mustCall(function (path, encoding, types, req, ctx) {
  if (req) {
    var oldCb = req.oncomplete;

    req.oncomplete = function (err, results) {
      if (err) {
        oldCb(err);
        return;
      }

      results[1] = results[1].map(function () {
        return UNKNOWN;
      });
      oldCb(null, results);
    };

    oldReaddir(path, encoding, types, req);
  } else {
    var results = oldReaddir(path, encoding, types, req, ctx);
    results[1] = results[1].map(function () {
      return UNKNOWN;
    });
    return results;
  }
}, 2);
assertDirents(fs.readdirSync(readdirDir, {
  withFileTypes: true
}));
fs.readdir(readdirDir, {
  withFileTypes: true
}, common.mustCall(function (err, dirents) {
  assert.ifError(err);
  assertDirents(dirents);
})); // Dirent types

for (var _i = 0, _typeMethods = typeMethods; _i < _typeMethods.length; _i++) {
  var method = _typeMethods[_i];
  var dirent = new fs.Dirent('foo', types[method]);

  var _iterator2 = _createForOfIteratorHelper(typeMethods),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var testMethod = _step2.value;
      assert.strictEqual(dirent[testMethod](), testMethod === method);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}