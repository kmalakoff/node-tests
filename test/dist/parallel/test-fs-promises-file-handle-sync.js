'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require('../common');

var assert = require('assert');

var fixtures = require('../common/fixtures');

var tmpdir = require('../common/tmpdir');

var _require$promises = require('fs').promises,
    access = _require$promises.access,
    copyFile = _require$promises.copyFile,
    open = _require$promises.open;

var path = require('path');

function validate() {
  return _validate.apply(this, arguments);
}

function _validate() {
  _validate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var dest, handle, buf, ret;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tmpdir.refresh();
            dest = path.resolve(tmpdir.path, 'baz.js');
            _context.next = 4;
            return assert.rejects(copyFile(fixtures.path('baz.js'), dest, 'r'), {
              code: 'ERR_INVALID_ARG_TYPE',
              message: /mode.*integer.*string/
            });

          case 4:
            _context.next = 6;
            return copyFile(fixtures.path('baz.js'), dest);

          case 6:
            _context.next = 8;
            return assert.rejects(access(dest, 'r'), {
              code: 'ERR_INVALID_ARG_TYPE',
              message: /mode/
            });

          case 8:
            _context.next = 10;
            return access(dest);

          case 10:
            _context.next = 12;
            return open(dest, 'r+');

          case 12:
            handle = _context.sent;
            _context.next = 15;
            return handle.datasync();

          case 15:
            _context.next = 17;
            return handle.sync();

          case 17:
            buf = Buffer.from('hello world');
            _context.next = 20;
            return handle.write(buf);

          case 20:
            _context.next = 22;
            return handle.read(Buffer.alloc(11), 0, 11, 0);

          case 22:
            ret = _context.sent;
            assert.strictEqual(ret.bytesRead, 11);
            assert.deepStrictEqual(ret.buffer, buf);
            _context.next = 27;
            return handle.close();

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validate.apply(this, arguments);
}

validate();