// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var caughtException = false;

try {
  // Should throw ENOENT, not EBADF
  // see https://github.com/joyent/node/pull/1228
  fs.openSync('/8hvftyuncxrt/path/to/file/that/does/not/exist', 'r');
} catch (e) {
  assert.strictEqual(e.code, 'ENOENT');
  caughtException = true;
}

assert.strictEqual(caughtException, true);
fs.openSync(__filename);
fs.open(__filename, common.mustCall(function (err) {
  assert.ifError(err);
}));
fs.open(__filename, 'r', common.mustCall(function (err) {
  assert.ifError(err);
}));
fs.open(__filename, 'rs', common.mustCall(function (err) {
  assert.ifError(err);
}));
fs.open(__filename, 'r', 0, common.mustCall(function (err) {
  assert.ifError(err);
}));
fs.open(__filename, 'r', null, common.mustCall(function (err) {
  assert.ifError(err);
}));

function promise() {
  return _promise.apply(this, arguments);
}

function _promise() {
  _promise = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fs.promises.open(__filename);

          case 2:
            _context.next = 4;
            return fs.promises.open(__filename, 'r');

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _promise.apply(this, arguments);
}

promise().then(common.mustCall())["catch"](common.mustNotCall());
assert["throws"](function () {
  return fs.open(__filename, 'r', 'boom', common.mustNotCall());
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  name: 'TypeError'
});

var _loop = function _loop() {
  var extra = _arr[_i];
  assert["throws"](function () {
    return fs.open.apply(fs, [__filename].concat((0, _toConsumableArray2["default"])(extra)));
  }, {
    code: 'ERR_INVALID_CALLBACK',
    name: 'TypeError'
  });
};

for (var _i = 0, _arr = [[], ['r'], ['r', 0], ['r', 0, 'bad callback']]; _i < _arr.length; _i++) {
  _loop();
}

[false, 1, [], {}, null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.open(i, 'r', common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.openSync(i, 'r', common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert.rejects(fs.promises.open(i, 'r'), {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
}); // Check invalid modes.

[false, [], {}].forEach(function (mode) {
  assert["throws"](function () {
    return fs.open(__filename, 'r', mode, common.mustNotCall());
  }, {
    message: /'mode' must be a 32-bit/,
    code: 'ERR_INVALID_ARG_VALUE'
  });
  assert["throws"](function () {
    return fs.openSync(__filename, 'r', mode, common.mustNotCall());
  }, {
    message: /'mode' must be a 32-bit/,
    code: 'ERR_INVALID_ARG_VALUE'
  });
  assert.rejects(fs.promises.open(__filename, 'r', mode), {
    message: /'mode' must be a 32-bit/,
    code: 'ERR_INVALID_ARG_VALUE'
  });
});