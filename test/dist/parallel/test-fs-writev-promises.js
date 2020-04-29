'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs').promises;

var tmpdir = require('../common/tmpdir');

var expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف';
var cnt = 0;

function getFileName() {
  return path.join(tmpdir.path, "writev_promises_".concat(++cnt, ".txt"));
}

tmpdir.refresh();
(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var filename, handle, buffer, bufferArr, expectedLength, _yield$handle$writev, bytesWritten, buffers, _yield$handle$writev2, _filename, _handle, _buffer, _bufferArr, _expectedLength, _yield$_handle$writev, _bytesWritten, _buffers, _yield$_handle$writev2;

  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          filename = getFileName();
          _context.next = 3;
          return fs.open(filename, 'w');

        case 3:
          handle = _context.sent;
          buffer = Buffer.from(expected);
          bufferArr = [buffer, buffer];
          expectedLength = bufferArr.length * buffer.byteLength;
          _context.next = 9;
          return handle.writev([Buffer.from('')], null);

        case 9:
          _yield$handle$writev = _context.sent;
          bytesWritten = _yield$handle$writev.bytesWritten;
          buffers = _yield$handle$writev.buffers;
          assert.deepStrictEqual(bytesWritten, 0);
          assert.deepStrictEqual(buffers, [Buffer.from('')]);
          _context.next = 16;
          return handle.writev(bufferArr, null);

        case 16:
          _yield$handle$writev2 = _context.sent;
          bytesWritten = _yield$handle$writev2.bytesWritten;
          buffers = _yield$handle$writev2.buffers;
          assert.deepStrictEqual(bytesWritten, expectedLength);
          assert.deepStrictEqual(buffers, bufferArr);
          _context.t0 = assert;
          _context.t1 = Buffer.concat(bufferArr);
          _context.next = 25;
          return fs.readFile(filename);

        case 25:
          _context.t2 = _context.sent;
          _context.t3 = _context.t1.equals.call(_context.t1, _context.t2);
          (0, _context.t0)(_context.t3);
          handle.close();
          _filename = getFileName();
          _context.next = 32;
          return fs.open(_filename, 'w');

        case 32:
          _handle = _context.sent;
          _buffer = Buffer.from(expected);
          _bufferArr = [_buffer, _buffer, _buffer];
          _expectedLength = _bufferArr.length * _buffer.byteLength;
          _context.next = 38;
          return _handle.writev([Buffer.from('')]);

        case 38:
          _yield$_handle$writev = _context.sent;
          _bytesWritten = _yield$_handle$writev.bytesWritten;
          _buffers = _yield$_handle$writev.buffers;
          assert.deepStrictEqual(_bytesWritten, 0);
          assert.deepStrictEqual(_buffers, [Buffer.from('')]);
          _context.next = 45;
          return _handle.writev(_bufferArr);

        case 45:
          _yield$_handle$writev2 = _context.sent;
          _bytesWritten = _yield$_handle$writev2.bytesWritten;
          _buffers = _yield$_handle$writev2.buffers;
          assert.deepStrictEqual(_bytesWritten, _expectedLength);
          assert.deepStrictEqual(_buffers, _bufferArr);
          _context.t4 = assert;
          _context.t5 = Buffer.concat(_bufferArr);
          _context.next = 54;
          return fs.readFile(_filename);

        case 54:
          _context.t6 = _context.sent;
          _context.t7 = _context.t5.equals.call(_context.t5, _context.t6);
          (0, _context.t4)(_context.t7);

          _handle.close();

        case 58:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();