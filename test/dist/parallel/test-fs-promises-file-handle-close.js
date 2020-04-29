// Flags: --expose-gc --no-warnings
'use strict'; // Test that a runtime warning is emitted when a FileHandle object
// is allowed to close on garbage collection. In the future, this
// test should verify that closing on garbage collection throws a
// process fatal exception.

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var _require = require('fs'),
    fs = _require.promises;

var warning = 'Closing a FileHandle object on garbage collection is deprecated. ' + 'Please close FileHandle objects explicitly using ' + 'FileHandle.prototype.close(). In the future, an error will be ' + 'thrown if a file descriptor is closed during garbage collection.';

function doOpen() {
  return _doOpen.apply(this, arguments);
}

function _doOpen() {
  _doOpen = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var fh;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fs.open(__filename);

          case 2:
            fh = _context.sent;
            common.expectWarning({
              Warning: [["Closing file descriptor ".concat(fh.fd, " on garbage collection")]],
              DeprecationWarning: [[warning, 'DEP0137']]
            });
            return _context.abrupt("return", fh);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _doOpen.apply(this, arguments);
}

doOpen().then(common.mustCall(function (fd) {
  assert.strictEqual((0, _typeof2["default"])(fd), 'object');
})).then(common.mustCall(function () {
  setImmediate(function () {
    // The FileHandle should be out-of-scope and no longer accessed now.
    global.gc(); // Wait an extra event loop turn, as the warning is emitted from the
    // native layer in an unref()'ed setImmediate() callback.

    setImmediate(common.mustCall());
  });
}));