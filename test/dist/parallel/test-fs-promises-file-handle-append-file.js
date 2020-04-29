'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common'); // The following tests validate base functionality for the fs.promises
// FileHandle.appendFile method.


var fs = require('fs');

var open = fs.promises.open;

var path = require('path');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var tmpDir = tmpdir.path;
tmpdir.refresh();

function validateAppendBuffer() {
  return _validateAppendBuffer.apply(this, arguments);
}

function _validateAppendBuffer() {
  _validateAppendBuffer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var filePath, fileHandle, buffer, appendedFileData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filePath = path.resolve(tmpDir, 'tmp-append-file-buffer.txt');
            _context.next = 3;
            return open(filePath, 'a');

          case 3:
            fileHandle = _context.sent;
            buffer = Buffer.from('a&Dp'.repeat(100), 'utf8');
            _context.next = 7;
            return fileHandle.appendFile(buffer);

          case 7:
            appendedFileData = fs.readFileSync(filePath);
            assert.deepStrictEqual(appendedFileData, buffer);
            _context.next = 11;
            return fileHandle.close();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validateAppendBuffer.apply(this, arguments);
}

function validateAppendString() {
  return _validateAppendString.apply(this, arguments);
}

function _validateAppendString() {
  _validateAppendString = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var filePath, fileHandle, string, stringAsBuffer, appendedFileData;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filePath = path.resolve(tmpDir, 'tmp-append-file-string.txt');
            _context2.next = 3;
            return open(filePath, 'a');

          case 3:
            fileHandle = _context2.sent;
            string = 'x~yz'.repeat(100);
            _context2.next = 7;
            return fileHandle.appendFile(string);

          case 7:
            stringAsBuffer = Buffer.from(string, 'utf8');
            appendedFileData = fs.readFileSync(filePath);
            assert.deepStrictEqual(appendedFileData, stringAsBuffer);
            _context2.next = 12;
            return fileHandle.close();

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _validateAppendString.apply(this, arguments);
}

validateAppendBuffer().then(validateAppendString).then(common.mustCall());