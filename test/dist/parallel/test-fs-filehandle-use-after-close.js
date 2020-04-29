'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs').promises;

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var filehandle, otherFilehandle;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return fs.open(__filename);

        case 2:
          filehandle = _context.sent;
          assert.notStrictEqual(filehandle.fd, -1);
          _context.next = 6;
          return filehandle.close();

        case 6:
          assert.strictEqual(filehandle.fd, -1); // Open another file handle first. This would typically receive the fd
          // that `filehandle` previously used. In earlier versions of Node.js, the
          // .stat() call would then succeed because it still used the original fd;
          // See https://github.com/nodejs/node/issues/31361 for more details.

          _context.next = 9;
          return fs.open(process.execPath);

        case 9:
          otherFilehandle = _context.sent;
          assert.rejects(function () {
            return filehandle.stat();
          }, {
            code: 'EBADF',
            syscall: 'fstat'
          });
          _context.next = 13;
          return otherFilehandle.close();

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))().then(common.mustCall());