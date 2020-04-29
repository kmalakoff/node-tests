'use strict';
/*
 * This test makes sure that `readFile()` always reads from the current
 * position of the file, instead of reading from the beginning of the file.
 */

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var path = require('path');

var _require = require('fs'),
    writeFileSync = _require.writeFileSync;

var open = require('fs').promises.open;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var fn = path.join(tmpdir.path, 'test.txt');
writeFileSync(fn, 'Hello World');

function readFileTest() {
  return _readFileTest.apply(this, arguments);
}

function _readFileTest() {
  _readFileTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var handle, buf, _yield$handle$read, bytesRead;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return open(fn, 'r');

          case 2:
            handle = _context.sent;

            /* Read only five bytes, so that the position moves to five. */
            buf = Buffer.alloc(5);
            _context.next = 6;
            return handle.read(buf, 0, 5, null);

          case 6:
            _yield$handle$read = _context.sent;
            bytesRead = _yield$handle$read.bytesRead;
            assert.strictEqual(bytesRead, 5);
            assert.deepStrictEqual(buf.toString(), 'Hello');
            /* readFile() should read from position five, instead of zero. */

            _context.t0 = assert;
            _context.next = 13;
            return handle.readFile();

          case 13:
            _context.t1 = _context.sent.toString();

            _context.t0.deepStrictEqual.call(_context.t0, _context.t1, ' World');

            _context.next = 17;
            return handle.close();

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _readFileTest.apply(this, arguments);
}

readFileTest().then(common.mustCall());