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

if (!common.isWindows) common.skip('this test is Windows-specific.');

var fs = require('fs');

var path = require('path');

var assert = require('assert');

var tmpdir = require('../common/tmpdir'); // Make a path that will be at least 260 chars long.


var fileNameLen = Math.max(260 - tmpdir.path.length - 1, 1);
var fileName = path.join(tmpdir.path, 'x'.repeat(fileNameLen));
var fullPath = path.resolve(fileName);
tmpdir.refresh();
console.log({
  filenameLength: fileName.length,
  fullPathLength: fullPath.length
});
fs.writeFile(fullPath, 'ok', common.mustCall(function (err) {
  assert.ifError(err);
  fs.stat(fullPath, common.mustCall(function (err, stats) {
    assert.ifError(err);
  }));
}));