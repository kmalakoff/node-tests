'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common'); // The following tests validate base functionality for the fs.promises
// FileHandle.read method.


var fs = require('fs');

var open = fs.promises.open;

var path = require('path');

var fixtures = require('../common/fixtures');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var tmpDir = tmpdir.path;
tmpdir.refresh();

function validateRead() {
  return _validateRead.apply(this, arguments);
}

function _validateRead() {
  _validateRead = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var filePath, fileHandle, buffer, fd, readAsyncHandle;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filePath = path.resolve(tmpDir, 'tmp-read-file.txt');
            _context.next = 3;
            return open(filePath, 'w+');

          case 3:
            fileHandle = _context.sent;
            buffer = Buffer.from('Hello world', 'utf8');
            fd = fs.openSync(filePath, 'w+');
            fs.writeSync(fd, buffer, 0, buffer.length);
            fs.closeSync(fd);
            _context.next = 10;
            return fileHandle.read(Buffer.alloc(11), 0, 11, 0);

          case 10:
            readAsyncHandle = _context.sent;
            assert.deepStrictEqual(buffer.length, readAsyncHandle.bytesRead);
            assert.deepStrictEqual(buffer, readAsyncHandle.buffer);
            _context.next = 15;
            return fileHandle.close();

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validateRead.apply(this, arguments);
}

function validateEmptyRead() {
  return _validateEmptyRead.apply(this, arguments);
}

function _validateEmptyRead() {
  _validateEmptyRead = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var filePath, fileHandle, buffer, fd, readAsyncHandle;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filePath = path.resolve(tmpDir, 'tmp-read-empty-file.txt');
            _context2.next = 3;
            return open(filePath, 'w+');

          case 3:
            fileHandle = _context2.sent;
            buffer = Buffer.from('', 'utf8');
            fd = fs.openSync(filePath, 'w+');
            fs.writeSync(fd, buffer, 0, buffer.length);
            fs.closeSync(fd);
            _context2.next = 10;
            return fileHandle.read(Buffer.alloc(11), 0, 11, 0);

          case 10:
            readAsyncHandle = _context2.sent;
            assert.deepStrictEqual(buffer.length, readAsyncHandle.bytesRead);
            _context2.next = 14;
            return fileHandle.close();

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _validateEmptyRead.apply(this, arguments);
}

function validateLargeRead() {
  return _validateLargeRead.apply(this, arguments);
}

function _validateLargeRead() {
  _validateLargeRead = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var filePath, fileHandle, pos, readHandle;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // Reading beyond file length (3 in this case) should return no data.
            // This is a test for a bug where reads > uint32 would return data
            // from the current position in the file.
            filePath = fixtures.path('x.txt');
            _context3.next = 3;
            return open(filePath, 'r');

          case 3:
            fileHandle = _context3.sent;
            pos = 0xffffffff + 1; // max-uint32 + 1

            _context3.next = 7;
            return fileHandle.read(Buffer.alloc(1), 0, 1, pos);

          case 7:
            readHandle = _context3.sent;
            assert.strictEqual(readHandle.bytesRead, 0);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _validateLargeRead.apply(this, arguments);
}

validateRead().then(validateEmptyRead).then(validateLargeRead).then(common.mustCall());