'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require('../common');

var common = require('../common');

var fixtures = require('../common/fixtures');

var assert = require('assert');

var fs = require('fs');

var filepath = fixtures.path('x.txt');
var fd = fs.openSync(filepath, 'r');
var fsPromises = fs.promises;
var buffer = new Uint8Array();
assert["throws"](function () {
  return fs.readSync(fd, buffer, 0, 10, 0);
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  message: 'The argument \'buffer\' is empty and cannot be written. ' + 'Received Uint8Array(0) []'
});
assert["throws"](function () {
  return fs.read(fd, buffer, 0, 1, 0, common.mustNotCall());
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  message: 'The argument \'buffer\' is empty and cannot be written. ' + 'Received Uint8Array(0) []'
});
(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var filehandle;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return fsPromises.open(filepath, 'r');

        case 2:
          filehandle = _context.sent;
          assert.rejects(function () {
            return filehandle.read(buffer, 0, 1, 0);
          }, {
            code: 'ERR_INVALID_ARG_VALUE',
            message: 'The argument \'buffer\' is empty and cannot be written. ' + 'Received Uint8Array(0) []'
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();