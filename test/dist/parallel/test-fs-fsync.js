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

var common = require('../common');

var assert = require('assert');

var fixtures = require('../common/fixtures');

var tmpdir = require('../common/tmpdir');

var fs = require('fs');

var path = require('path');

var fileFixture = fixtures.path('a.js');
var fileTemp = path.join(tmpdir.path, 'a.js'); // Copy fixtures to temp.

tmpdir.refresh();
fs.copyFileSync(fileFixture, fileTemp);
fs.open(fileTemp, 'a', 511, common.mustCall(function (err, fd) {
  assert.ifError(err);
  fs.fdatasyncSync(fd);
  fs.fsyncSync(fd);
  fs.fdatasync(fd, common.mustCall(function (err) {
    assert.ifError(err);
    fs.fsync(fd, common.mustCall(function (err) {
      assert.ifError(err);
      fs.closeSync(fd);
    }));
  }));
}));
['', false, null, undefined, {}, []].forEach(function (input) {
  var errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  };
  assert["throws"](function () {
    return fs.fdatasync(input);
  }, errObj);
  assert["throws"](function () {
    return fs.fdatasyncSync(input);
  }, errObj);
  assert["throws"](function () {
    return fs.fsync(input);
  }, errObj);
  assert["throws"](function () {
    return fs.fsyncSync(input);
  }, errObj);
});