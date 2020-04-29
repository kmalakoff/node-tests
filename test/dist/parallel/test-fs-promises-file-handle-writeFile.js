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

function validateWriteFile() {
  return _validateWriteFile.apply(this, arguments);
}

function _validateWriteFile() {
  _validateWriteFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var filePathForHandle, fileHandle, buffer, readFileData;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filePathForHandle = path.resolve(tmpDir, 'tmp-write-file2.txt');
            _context.next = 3;
            return open(filePathForHandle, 'w+');

          case 3:
            fileHandle = _context.sent;
            buffer = Buffer.from('Hello world'.repeat(100), 'utf8');
            _context.next = 7;
            return fileHandle.writeFile(buffer);

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
  return _validateWriteFile.apply(this, arguments);
}

validateWriteFile().then(common.mustCall());