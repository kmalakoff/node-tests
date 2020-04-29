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
// Flags: --expose_externalize_string
'use strict';

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var fn = path.join(tmpdir.path, 'write.txt');
var fn2 = path.join(tmpdir.path, 'write2.txt');
var fn3 = path.join(tmpdir.path, 'write3.txt');
var expected = 'ümlaut.';
var constants = fs.constants;
/* eslint-disable no-undef */

common.allowGlobals(externalizeString, isOneByteString, x);
{
  var _expected = 'ümlaut eins'; // Must be a unique string.

  externalizeString(_expected);
  assert.strictEqual(isOneByteString(_expected), true);
  var fd = fs.openSync(fn, 'w');
  fs.writeSync(fd, _expected, 0, 'latin1');
  fs.closeSync(fd);
  assert.strictEqual(fs.readFileSync(fn, 'latin1'), _expected);
}
{
  var _expected2 = 'ümlaut zwei'; // Must be a unique string.

  externalizeString(_expected2);
  assert.strictEqual(isOneByteString(_expected2), true);

  var _fd = fs.openSync(fn, 'w');

  fs.writeSync(_fd, _expected2, 0, 'utf8');
  fs.closeSync(_fd);
  assert.strictEqual(fs.readFileSync(fn, 'utf8'), _expected2);
}
{
  var _expected3 = '中文 1'; // Must be a unique string.

  externalizeString(_expected3);
  assert.strictEqual(isOneByteString(_expected3), false);

  var _fd2 = fs.openSync(fn, 'w');

  fs.writeSync(_fd2, _expected3, 0, 'ucs2');
  fs.closeSync(_fd2);
  assert.strictEqual(fs.readFileSync(fn, 'ucs2'), _expected3);
}
{
  var _expected4 = '中文 2'; // Must be a unique string.

  externalizeString(_expected4);
  assert.strictEqual(isOneByteString(_expected4), false);

  var _fd3 = fs.openSync(fn, 'w');

  fs.writeSync(_fd3, _expected4, 0, 'utf8');
  fs.closeSync(_fd3);
  assert.strictEqual(fs.readFileSync(fn, 'utf8'), _expected4);
}
/* eslint-enable no-undef */

fs.open(fn, 'w', 420, common.mustCall(function (err, fd) {
  assert.ifError(err);
  var done = common.mustCall(function (err, written) {
    assert.ifError(err);
    assert.strictEqual(written, Buffer.byteLength(expected));
    fs.closeSync(fd);
    var found = fs.readFileSync(fn, 'utf8');
    fs.unlinkSync(fn);
    assert.strictEqual(found, expected);
  });
  var written = common.mustCall(function (err, written) {
    assert.ifError(err);
    assert.strictEqual(written, 0);
    fs.write(fd, expected, 0, 'utf8', done);
  });
  fs.write(fd, '', 0, 'utf8', written);
}));
var args = constants.O_CREAT | constants.O_WRONLY | constants.O_TRUNC;
fs.open(fn2, args, 420, common.mustCall(function (err, fd) {
  assert.ifError(err);
  var done = common.mustCall(function (err, written) {
    assert.ifError(err);
    assert.strictEqual(written, Buffer.byteLength(expected));
    fs.closeSync(fd);
    var found = fs.readFileSync(fn2, 'utf8');
    fs.unlinkSync(fn2);
    assert.strictEqual(found, expected);
  });
  var written = common.mustCall(function (err, written) {
    assert.ifError(err);
    assert.strictEqual(written, 0);
    fs.write(fd, expected, 0, 'utf8', done);
  });
  fs.write(fd, '', 0, 'utf8', written);
}));
fs.open(fn3, 'w', 420, common.mustCall(function (err, fd) {
  assert.ifError(err);
  var done = common.mustCall(function (err, written) {
    assert.ifError(err);
    assert.strictEqual(written, Buffer.byteLength(expected));
    fs.closeSync(fd);
  });
  fs.write(fd, expected, done);
}));
[false, 'test', {}, [], null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.write(i, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.writeSync(i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});
[false, 5, {}, [], null, undefined].forEach(function (data) {
  assert["throws"](function () {
    return fs.write(1, data, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    message: /"buffer"/
  });
  assert["throws"](function () {
    return fs.writeSync(1, data);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    message: /"buffer"/
  });
});