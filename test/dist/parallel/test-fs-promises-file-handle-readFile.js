'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common'); // The following tests validate base functionality for the fs.promises
// FileHandle.readFile method.


var fs = require('fs');

var open = fs.promises.open;

var path = require('path');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var tmpDir = tmpdir.path;
tmpdir.refresh();

function validateReadFile() {
  return _validateReadFile.apply(this, arguments);
}

function _validateReadFile() {
  _validateReadFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var filePath, fileHandle, buffer, fd, readFileData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filePath = path.resolve(tmpDir, 'tmp-read-file.txt');
            _context.next = 3;
            return open(filePath, 'w+');

          case 3:
            fileHandle = _context.sent;
            buffer = Buffer.from('Hello world'.repeat(100), 'utf8');
            fd = fs.openSync(filePath, 'w+');
            fs.writeSync(fd, buffer, 0, buffer.length);
            fs.closeSync(fd);
            _context.next = 10;
            return fileHandle.readFile();

          case 10:
            readFileData = _context.sent;
            assert.deepStrictEqual(buffer, readFileData);
            _context.next = 14;
            return fileHandle.close();

          case 14:
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
    var fileHandle, hostname;
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
            return open('/proc/sys/kernel/hostname', 'r');

          case 4:
            fileHandle = _context2.sent;
            _context2.next = 7;
            return fileHandle.readFile();

          case 7:
            hostname = _context2.sent;
            assert.ok(hostname.length > 0);

          case 9:
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