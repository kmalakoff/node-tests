'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common'); // The following tests validate base functionality for the fs.promises
// FileHandle.write method.


var fs = require('fs');

var open = fs.promises.open;

var path = require('path');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var tmpDir = tmpdir.path;
tmpdir.refresh();

function validateWrite() {
  return _validateWrite.apply(this, arguments);
}

function _validateWrite() {
  _validateWrite = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var filePathForHandle, fileHandle, buffer, readFileData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filePathForHandle = path.resolve(tmpDir, 'tmp-write.txt');
            _context.next = 3;
            return open(filePathForHandle, 'w+');

          case 3:
            fileHandle = _context.sent;
            buffer = Buffer.from('Hello world'.repeat(100), 'utf8');
            _context.next = 7;
            return fileHandle.write(buffer, 0, buffer.length);

          case 7:
            readFileData = fs.readFileSync(filePathForHandle);
            assert.deepStrictEqual(buffer, readFileData);
            _context.next = 11;
            return fileHandle.close();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validateWrite.apply(this, arguments);
}

function validateEmptyWrite() {
  return _validateEmptyWrite.apply(this, arguments);
}

function _validateEmptyWrite() {
  _validateEmptyWrite = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var filePathForHandle, fileHandle, buffer, readFileData;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filePathForHandle = path.resolve(tmpDir, 'tmp-empty-write.txt');
            _context2.next = 3;
            return open(filePathForHandle, 'w+');

          case 3:
            fileHandle = _context2.sent;
            buffer = Buffer.from(''); // empty buffer

            _context2.next = 7;
            return fileHandle.write(buffer, 0, buffer.length);

          case 7:
            readFileData = fs.readFileSync(filePathForHandle);
            assert.deepStrictEqual(buffer, readFileData);
            _context2.next = 11;
            return fileHandle.close();

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _validateEmptyWrite.apply(this, arguments);
}

function validateNonUint8ArrayWrite() {
  return _validateNonUint8ArrayWrite.apply(this, arguments);
}

function _validateNonUint8ArrayWrite() {
  _validateNonUint8ArrayWrite = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var filePathForHandle, fileHandle, buffer, readFileData;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            filePathForHandle = path.resolve(tmpDir, 'tmp-data-write.txt');
            _context3.next = 3;
            return open(filePathForHandle, 'w+');

          case 3:
            fileHandle = _context3.sent;
            buffer = Buffer.from('Hello world', 'utf8').toString('base64');
            _context3.next = 7;
            return fileHandle.write(buffer, 0, buffer.length);

          case 7:
            readFileData = fs.readFileSync(filePathForHandle);
            assert.deepStrictEqual(Buffer.from(buffer, 'utf8'), readFileData);
            _context3.next = 11;
            return fileHandle.close();

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _validateNonUint8ArrayWrite.apply(this, arguments);
}

function validateNonStringValuesWrite() {
  return _validateNonStringValuesWrite.apply(this, arguments);
}

function _validateNonStringValuesWrite() {
  _validateNonStringValuesWrite = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var filePathForHandle, fileHandle, nonStringValues, _i, _nonStringValues, nonStringValue;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            filePathForHandle = path.resolve(tmpDir, 'tmp-non-string-write.txt');
            _context4.next = 3;
            return open(filePathForHandle, 'w+');

          case 3:
            fileHandle = _context4.sent;
            nonStringValues = [123, {}, new Map()];
            _i = 0, _nonStringValues = nonStringValues;

          case 6:
            if (!(_i < _nonStringValues.length)) {
              _context4.next = 13;
              break;
            }

            nonStringValue = _nonStringValues[_i];
            _context4.next = 10;
            return assert.rejects(fileHandle.write(nonStringValue), {
              message: /"buffer"/,
              code: 'ERR_INVALID_ARG_TYPE'
            });

          case 10:
            _i++;
            _context4.next = 6;
            break;

          case 13:
            _context4.next = 15;
            return fileHandle.close();

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _validateNonStringValuesWrite.apply(this, arguments);
}

Promise.all([validateWrite(), validateEmptyWrite(), validateNonUint8ArrayWrite(), validateNonStringValuesWrite()]).then(common.mustCall());