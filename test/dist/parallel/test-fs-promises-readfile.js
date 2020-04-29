'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var path = require('path');

var _require$promises = require('fs').promises,
    writeFile = _require$promises.writeFile,
    readFile = _require$promises.readFile;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var fn = path.join(tmpdir.path, 'large-file');

function validateReadFile() {
  return _validateReadFile.apply(this, arguments);
}

function _validateReadFile() {
  _validateReadFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var buffer, readBuffer;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Creating large buffer with random content
            buffer = Buffer.from(Array.apply(null, {
              length: 16834 * 2
            }).map(Math.random).map(function (number) {
              return number * (1 << 8);
            })); // Writing buffer to a file then try to read it

            _context.next = 3;
            return writeFile(fn, buffer);

          case 3:
            _context.next = 5;
            return readFile(fn);

          case 5:
            readBuffer = _context.sent;
            assert.strictEqual(readBuffer.equals(buffer), true);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validateReadFile.apply(this, arguments);
}

function validateReadFileProc() {
  return _validateReadFileProc.apply(this, arguments);
}

function _validateReadFileProc() {
  _validateReadFileProc = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var hostname;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (common.isLinux) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            _context2.next = 4;
            return readFile('/proc/sys/kernel/hostname');

          case 4:
            hostname = _context2.sent;
            assert.ok(hostname.length > 0);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _validateReadFileProc.apply(this, arguments);
}

validateReadFile().then(function () {
  return validateReadFileProc();
}).then(common.mustCall());