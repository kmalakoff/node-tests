'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var fs = require('fs');

var fsPromises = fs.promises;

var path = require('path');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var tmpDir = tmpdir.path;
tmpdir.refresh();
var dest = path.resolve(tmpDir, 'tmp.txt');
var buffer = Buffer.from('abc'.repeat(1000));
var buffer2 = Buffer.from('xyz'.repeat(1000));

function doWrite() {
  return _doWrite.apply(this, arguments);
}

function _doWrite() {
  _doWrite = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fsPromises.writeFile(dest, buffer);

          case 2:
            data = fs.readFileSync(dest);
            assert.deepStrictEqual(data, buffer);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _doWrite.apply(this, arguments);
}

function doAppend() {
  return _doAppend.apply(this, arguments);
}

function _doAppend() {
  _doAppend = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var data, buf;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fsPromises.appendFile(dest, buffer2);

          case 2:
            data = fs.readFileSync(dest);
            buf = Buffer.concat([buffer, buffer2]);
            assert.deepStrictEqual(buf, data);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _doAppend.apply(this, arguments);
}

function doRead() {
  return _doRead.apply(this, arguments);
}

function _doRead() {
  _doRead = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var data, buf;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return fsPromises.readFile(dest);

          case 2:
            data = _context3.sent;
            buf = fs.readFileSync(dest);
            assert.deepStrictEqual(buf, data);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _doRead.apply(this, arguments);
}

function doReadWithEncoding() {
  return _doReadWithEncoding.apply(this, arguments);
}

function _doReadWithEncoding() {
  _doReadWithEncoding = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var data, syncData;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return fsPromises.readFile(dest, 'utf-8');

          case 2:
            data = _context4.sent;
            syncData = fs.readFileSync(dest, 'utf-8');
            assert.strictEqual((0, _typeof2["default"])(data), 'string');
            assert.deepStrictEqual(data, syncData);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _doReadWithEncoding.apply(this, arguments);
}

doWrite().then(doAppend).then(doRead).then(doReadWithEncoding).then(common.mustCall());