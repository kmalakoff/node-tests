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

var stream = fs.createReadStream(__filename, {
  bufferSize: 64
});
var err = new Error('BAM');
stream.on('error', common.mustCall(function (err_) {
  process.nextTick(common.mustCall(function () {
    assert.strictEqual(stream.fd, null);
    assert.strictEqual(err_, err);
  }));
}));
fs.close = common.mustCall(function (fd_, cb) {
  assert.strictEqual(fd_, stream.fd);
  process.nextTick(cb);
});
var read = fs.read;

fs.read = function () {
  // First time is ok.
  read.apply(fs, arguments); // Then it breaks.

  fs.read = common.mustCall(function () {
    var cb = arguments[arguments.length - 1];
    process.nextTick(function () {
      cb(err);
    }); // It should not be called again!

    fs.read = function () {
      throw new Error('BOOM!');
    };
  });
};

stream.on('data', function (buf) {
  stream.on('data', common.mustNotCall("no more 'data' events should follow"));
});