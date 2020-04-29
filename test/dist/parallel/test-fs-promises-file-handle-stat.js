'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common'); // The following tests validate base functionality for the fs.promises
// FileHandle.stat method.


var open = require('fs').promises.open;

var path = require('path');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

tmpdir.refresh();

function validateStat() {
  return _validateStat.apply(this, arguments);
}

function _validateStat() {
  _validateStat = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var filePath, fileHandle, stats;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filePath = path.resolve(tmpdir.path, 'tmp-read-file.txt');
            _context.next = 3;
            return open(filePath, 'w+');

          case 3:
            fileHandle = _context.sent;
            _context.next = 6;
            return fileHandle.stat();

          case 6:
            stats = _context.sent;
            assert.ok(stats.mtime instanceof Date);
            _context.next = 10;
            return fileHandle.close();

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validateStat.apply(this, arguments);
}

validateStat().then(common.mustCall());