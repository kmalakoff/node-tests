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

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

fs.stat('.', common.mustCall(function (err, stats) {
  assert.ifError(err);
  assert.ok(stats.mtime instanceof Date);
  assert.ok(stats.hasOwnProperty('blksize'));
  assert.ok(stats.hasOwnProperty('blocks')); // Confirm that we are not running in the context of the internal binding
  // layer.
  // Ref: https://github.com/nodejs/node/commit/463d6bac8b349acc462d345a6e298a76f7d06fb1

  assert.strictEqual(this, undefined);
}));
fs.lstat('.', common.mustCall(function (err, stats) {
  assert.ifError(err);
  assert.ok(stats.mtime instanceof Date); // Confirm that we are not running in the context of the internal binding
  // layer.
  // Ref: https://github.com/nodejs/node/commit/463d6bac8b349acc462d345a6e298a76f7d06fb1

  assert.strictEqual(this, undefined);
})); // fstat

fs.open('.', 'r', undefined, common.mustCall(function (err, fd) {
  assert.ifError(err);
  assert.ok(fd);
  fs.fstat(fd, common.mustCall(function (err, stats) {
    assert.ifError(err);
    assert.ok(stats.mtime instanceof Date);
    fs.close(fd, assert.ifError); // Confirm that we are not running in the context of the internal binding
    // layer.
    // Ref: https://github.com/nodejs/node/commit/463d6bac8b349acc462d345a6e298a76f7d06fb1

    assert.strictEqual(this, undefined);
  })); // Confirm that we are not running in the context of the internal binding
  // layer.
  // Ref: https://github.com/nodejs/node/commit/463d6bac8b349acc462d345a6e298a76f7d06fb1

  assert.strictEqual(this, undefined);
})); // fstatSync

fs.open('.', 'r', undefined, common.mustCall(function (err, fd) {
  var stats = fs.fstatSync(fd);
  assert.ok(stats.mtime instanceof Date);
  fs.close(fd, common.mustCall(assert.ifError));
}));
fs.stat(__filename, common.mustCall(function (err, s) {
  assert.ifError(err);
  assert.strictEqual(s.isDirectory(), false);
  assert.strictEqual(s.isFile(), true);
  assert.strictEqual(s.isSocket(), false);
  assert.strictEqual(s.isBlockDevice(), false);
  assert.strictEqual(s.isCharacterDevice(), false);
  assert.strictEqual(s.isFIFO(), false);
  assert.strictEqual(s.isSymbolicLink(), false);
  var jsonString = JSON.stringify(s);
  var parsed = JSON.parse(jsonString);
  ['dev', 'mode', 'nlink', 'uid', 'gid', 'rdev', 'blksize', 'ino', 'size', 'blocks', 'atime', 'mtime', 'ctime', 'birthtime', 'atimeMs', 'mtimeMs', 'ctimeMs', 'birthtimeMs'].forEach(function (k) {
    assert.ok(k in s, "".concat(k, " should be in Stats"));
    assert.notStrictEqual(s[k], undefined, "".concat(k, " should not be undefined"));
    assert.notStrictEqual(s[k], null, "".concat(k, " should not be null"));
    assert.notStrictEqual(parsed[k], undefined, "".concat(k, " should not be undefined"));
    assert.notStrictEqual(parsed[k], null, "".concat(k, " should not be null"));
  });
  ['dev', 'mode', 'nlink', 'uid', 'gid', 'rdev', 'blksize', 'ino', 'size', 'blocks', 'atimeMs', 'mtimeMs', 'ctimeMs', 'birthtimeMs'].forEach(function (k) {
    assert.strictEqual((0, _typeof2["default"])(s[k]), 'number', "".concat(k, " should be a number"));
    assert.strictEqual((0, _typeof2["default"])(parsed[k]), 'number', "".concat(k, " should be a number"));
  });
  ['atime', 'mtime', 'ctime', 'birthtime'].forEach(function (k) {
    assert.ok(s[k] instanceof Date, "".concat(k, " should be a Date"));
    assert.strictEqual((0, _typeof2["default"])(parsed[k]), 'string', "".concat(k, " should be a string"));
  });
}));
['', false, null, undefined, {}, []].forEach(function (input) {
  ['fstat', 'fstatSync'].forEach(function (fnName) {
    assert["throws"](function () {
      return fs[fnName](input);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    });
  });
});
[false, 1, {}, [], null, undefined].forEach(function (input) {
  assert["throws"](function () {
    return fs.lstat(input, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.lstatSync(input);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.stat(input, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.statSync(input);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
}); // Should not throw an error

fs.stat(__filename, undefined, common.mustCall(function () {}));
fs.open(__filename, 'r', undefined, common.mustCall(function (err, fd) {
  // Should not throw an error
  fs.fstat(fd, undefined, common.mustCall(function () {}));
})); // Should not throw an error

fs.lstat(__filename, undefined, common.mustCall(function () {}));