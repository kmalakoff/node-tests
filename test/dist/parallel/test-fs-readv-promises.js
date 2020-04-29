'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs').promises;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف';
var exptectedBuff = Buffer.from(expected);
var cnt = 0;

function getFileName() {
  return path.join(tmpdir.path, "readv_promises_".concat(++cnt, ".txt"));
}

var allocateEmptyBuffers = function allocateEmptyBuffers(combinedLength) {
  var bufferArr = []; // Allocate two buffers, each half the size of exptectedBuff

  bufferArr[0] = Buffer.alloc(Math.floor(combinedLength / 2)), bufferArr[1] = Buffer.alloc(combinedLength - bufferArr[0].length);
  return bufferArr;
};

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var filename, handle, bufferArr, expectedLength, _yield$handle$readv, bytesRead, buffers, _yield$handle$readv2, _filename, _handle, _bufferArr, _expectedLength, _yield$_handle$readv, _bytesRead, _buffers, _yield$_handle$readv2;

  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          filename = getFileName();
          _context.next = 3;
          return fs.writeFile(filename, exptectedBuff);

        case 3:
          _context.next = 5;
          return fs.open(filename, 'r');

        case 5:
          handle = _context.sent;
          // const buffer = Buffer.from(expected);
          bufferArr = allocateEmptyBuffers(exptectedBuff.length);
          expectedLength = exptectedBuff.length;
          _context.next = 10;
          return handle.readv([Buffer.from('')], null);

        case 10:
          _yield$handle$readv = _context.sent;
          bytesRead = _yield$handle$readv.bytesRead;
          buffers = _yield$handle$readv.buffers;
          assert.deepStrictEqual(bytesRead, 0);
          assert.deepStrictEqual(buffers, [Buffer.from('')]);
          _context.next = 17;
          return handle.readv(bufferArr, null);

        case 17:
          _yield$handle$readv2 = _context.sent;
          bytesRead = _yield$handle$readv2.bytesRead;
          buffers = _yield$handle$readv2.buffers;
          assert.deepStrictEqual(bytesRead, expectedLength);
          assert.deepStrictEqual(buffers, bufferArr);
          _context.t0 = assert;
          _context.t1 = Buffer.concat(bufferArr);
          _context.next = 26;
          return fs.readFile(filename);

        case 26:
          _context.t2 = _context.sent;
          _context.t3 = _context.t1.equals.call(_context.t1, _context.t2);
          (0, _context.t0)(_context.t3);
          handle.close();
          _filename = getFileName();
          _context.next = 33;
          return fs.writeFile(_filename, exptectedBuff);

        case 33:
          _context.next = 35;
          return fs.open(_filename, 'r');

        case 35:
          _handle = _context.sent;
          // const buffer = Buffer.from(expected);
          _bufferArr = allocateEmptyBuffers(exptectedBuff.length);
          _expectedLength = exptectedBuff.length;
          _context.next = 40;
          return _handle.readv([Buffer.from('')]);

        case 40:
          _yield$_handle$readv = _context.sent;
          _bytesRead = _yield$_handle$readv.bytesRead;
          _buffers = _yield$_handle$readv.buffers;
          assert.deepStrictEqual(_bytesRead, 0);
          assert.deepStrictEqual(_buffers, [Buffer.from('')]);
          _context.next = 47;
          return _handle.readv(_bufferArr);

        case 47:
          _yield$_handle$readv2 = _context.sent;
          _bytesRead = _yield$_handle$readv2.bytesRead;
          _buffers = _yield$_handle$readv2.buffers;
          assert.deepStrictEqual(_bytesRead, _expectedLength);
          assert.deepStrictEqual(_buffers, _bufferArr);
          _context.t4 = assert;
          _context.t5 = Buffer.concat(_bufferArr);
          _context.next = 56;
          return fs.readFile(_filename);

        case 56:
          _context.t6 = _context.sent;
          _context.t7 = _context.t5.equals.call(_context.t5, _context.t6);
          (0, _context.t4)(_context.t7);

          _handle.close();

        case 60:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();