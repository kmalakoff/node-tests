'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var path = require('path');

var _require$promises = require('fs').promises,
    open = _require$promises.open,
    readFile = _require$promises.readFile;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();

function validateTruncate() {
  return _validateTruncate.apply(this, arguments);
}

function _validateTruncate() {
  _validateTruncate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var text, filename, fileHandle, buffer;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            text = 'Hello world';
            filename = path.resolve(tmpdir.path, 'truncate-file.txt');
            _context.next = 4;
            return open(filename, 'w+');

          case 4:
            fileHandle = _context.sent;
            buffer = Buffer.from(text, 'utf8');
            _context.next = 8;
            return fileHandle.write(buffer, 0, buffer.length);

          case 8:
            _context.t0 = assert;
            _context.next = 11;
            return readFile(filename);

          case 11:
            _context.t1 = _context.sent.toString();
            _context.t2 = text;

            _context.t0.deepStrictEqual.call(_context.t0, _context.t1, _context.t2);

            _context.next = 16;
            return fileHandle.truncate(5);

          case 16:
            _context.t3 = assert;
            _context.next = 19;
            return readFile(filename);

          case 19:
            _context.t4 = _context.sent.toString();

            _context.t3.deepStrictEqual.call(_context.t3, _context.t4, 'Hello');

            _context.next = 23;
            return fileHandle.close();

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validateTruncate.apply(this, arguments);
}

validateTruncate().then(common.mustCall());