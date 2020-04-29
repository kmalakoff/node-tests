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

var fs = require('fs');

var fixtures = require('../common/fixtures');

var emptyFile = fixtures.path('empty.txt');
fs.open(emptyFile, 'r', common.mustCall(function (error, fd) {
  assert.ifError(error);
  var read = fs.createReadStream(emptyFile, {
    fd: fd
  });
  read.once('data', common.mustNotCall('data event should not emit'));
  read.once('end', common.mustCall());
}));
fs.open(emptyFile, 'r', common.mustCall(function (error, fd) {
  assert.ifError(error);
  var read = fs.createReadStream(emptyFile, {
    fd: fd
  });
  read.pause();
  read.once('data', common.mustNotCall('data event should not emit'));
  read.once('end', common.mustNotCall('end event should not emit'));
  setTimeout(common.mustCall(function () {
    assert.strictEqual(read.isPaused(), true);
  }), common.platformTimeout(50));
}));