'use strict';
/*
 * This test makes sure that `writeFile()` always writes from the current
 * position of the file, instead of truncating the file.
 */

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var path = require('path');

var _require = require('fs'),
    readFileSync = _require.readFileSync;

var open = require('fs').promises.open;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var fn = path.join(tmpdir.path, 'test.txt');

function writeFileTest() {
  return _writeFileTest.apply(this, arguments);
}

function _writeFileTest() {
  _writeFileTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var handle, buf, _yield$handle$write, bytesWritten;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return open(fn, 'w');

          case 2:
            handle = _context.sent;

            /* Write only five bytes, so that the position moves to five. */
            buf = Buffer.from('Hello');
            _context.next = 6;
            return handle.write(buf, 0, 5, null);

          case 6:
            _yield$handle$write = _context.sent;
            bytesWritten = _yield$handle$write.bytesWritten;
            assert.strictEqual(bytesWritten, 5);
            /* Write some more with writeFile(). */

            _context.next = 11;
            return handle.writeFile('World');

          case 11:
            /* New content should be written at position five, instead of zero. */
            assert.deepStrictEqual(readFileSync(fn).toString(), 'HelloWorld');
            _context.next = 14;
            return handle.close();

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _writeFileTest.apply(this, arguments);
}

writeFileTest().then(common.mustCall());