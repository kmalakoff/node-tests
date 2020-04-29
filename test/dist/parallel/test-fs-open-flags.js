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
// Flags: --expose-internals
'use strict';

var common = require('../common');

var fixtures = require('../common/fixtures');

var assert = require('assert');

var fs = require('fs');

var path = require('path'); // 0 if not found in fs.constants


var _fs$constants = fs.constants,
    _fs$constants$O_APPEN = _fs$constants.O_APPEND,
    O_APPEND = _fs$constants$O_APPEN === void 0 ? 0 : _fs$constants$O_APPEN,
    _fs$constants$O_CREAT = _fs$constants.O_CREAT,
    O_CREAT = _fs$constants$O_CREAT === void 0 ? 0 : _fs$constants$O_CREAT,
    _fs$constants$O_EXCL = _fs$constants.O_EXCL,
    O_EXCL = _fs$constants$O_EXCL === void 0 ? 0 : _fs$constants$O_EXCL,
    _fs$constants$O_RDONL = _fs$constants.O_RDONLY,
    O_RDONLY = _fs$constants$O_RDONL === void 0 ? 0 : _fs$constants$O_RDONL,
    _fs$constants$O_RDWR = _fs$constants.O_RDWR,
    O_RDWR = _fs$constants$O_RDWR === void 0 ? 0 : _fs$constants$O_RDWR,
    _fs$constants$O_SYNC = _fs$constants.O_SYNC,
    O_SYNC = _fs$constants$O_SYNC === void 0 ? 0 : _fs$constants$O_SYNC,
    _fs$constants$O_DSYNC = _fs$constants.O_DSYNC,
    O_DSYNC = _fs$constants$O_DSYNC === void 0 ? 0 : _fs$constants$O_DSYNC,
    _fs$constants$O_TRUNC = _fs$constants.O_TRUNC,
    O_TRUNC = _fs$constants$O_TRUNC === void 0 ? 0 : _fs$constants$O_TRUNC,
    _fs$constants$O_WRONL = _fs$constants.O_WRONLY,
    O_WRONLY = _fs$constants$O_WRONL === void 0 ? 0 : _fs$constants$O_WRONL;

var _require = require('internal/fs/utils'),
    stringToFlags = _require.stringToFlags;

assert.strictEqual(stringToFlags('r'), O_RDONLY);
assert.strictEqual(stringToFlags('r+'), O_RDWR);
assert.strictEqual(stringToFlags('rs+'), O_RDWR | O_SYNC);
assert.strictEqual(stringToFlags('sr+'), O_RDWR | O_SYNC);
assert.strictEqual(stringToFlags('w'), O_TRUNC | O_CREAT | O_WRONLY);
assert.strictEqual(stringToFlags('w+'), O_TRUNC | O_CREAT | O_RDWR);
assert.strictEqual(stringToFlags('a'), O_APPEND | O_CREAT | O_WRONLY);
assert.strictEqual(stringToFlags('a+'), O_APPEND | O_CREAT | O_RDWR);
assert.strictEqual(stringToFlags('wx'), O_TRUNC | O_CREAT | O_WRONLY | O_EXCL);
assert.strictEqual(stringToFlags('xw'), O_TRUNC | O_CREAT | O_WRONLY | O_EXCL);
assert.strictEqual(stringToFlags('wx+'), O_TRUNC | O_CREAT | O_RDWR | O_EXCL);
assert.strictEqual(stringToFlags('xw+'), O_TRUNC | O_CREAT | O_RDWR | O_EXCL);
assert.strictEqual(stringToFlags('ax'), O_APPEND | O_CREAT | O_WRONLY | O_EXCL);
assert.strictEqual(stringToFlags('xa'), O_APPEND | O_CREAT | O_WRONLY | O_EXCL);
assert.strictEqual(stringToFlags('as'), O_APPEND | O_CREAT | O_WRONLY | O_SYNC);
assert.strictEqual(stringToFlags('sa'), O_APPEND | O_CREAT | O_WRONLY | O_SYNC);
assert.strictEqual(stringToFlags('ax+'), O_APPEND | O_CREAT | O_RDWR | O_EXCL);
assert.strictEqual(stringToFlags('xa+'), O_APPEND | O_CREAT | O_RDWR | O_EXCL);
assert.strictEqual(stringToFlags('as+'), O_APPEND | O_CREAT | O_RDWR | O_SYNC);
assert.strictEqual(stringToFlags('sa+'), O_APPEND | O_CREAT | O_RDWR | O_SYNC);
'+ +a +r +w rw wa war raw r++ a++ w++ x +x x+ rx rx+ wxx wax xwx xxx'.split(' ').forEach(function (flags) {
  assert["throws"](function () {
    return stringToFlags(flags);
  }, {
    code: 'ERR_INVALID_OPT_VALUE',
    name: 'TypeError'
  });
});
assert["throws"](function () {
  return stringToFlags({});
}, {
  code: 'ERR_INVALID_OPT_VALUE',
  name: 'TypeError'
});
assert["throws"](function () {
  return stringToFlags(true);
}, {
  code: 'ERR_INVALID_OPT_VALUE',
  name: 'TypeError'
});

if (common.isLinux || common.isOSX) {
  var tmpdir = require('../common/tmpdir');

  tmpdir.refresh();
  var file = path.join(tmpdir.path, 'a.js');
  fs.copyFileSync(fixtures.path('a.js'), file);
  fs.open(file, O_DSYNC, common.mustCall(function (err, fd) {
    assert.ifError(err);
    fs.closeSync(fd);
  }));
}