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

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

var watchSeenOne = 0;
var watchSeenTwo = 0;
var watchSeenThree = 0;
var watchSeenFour = 0;
var testDir = tmpdir.path;
var filenameOne = 'watch.txt';
var filepathOne = path.join(testDir, filenameOne);
var filenameTwo = 'hasOwnProperty';
var filepathTwo = filenameTwo;
var filepathTwoAbs = path.join(testDir, filenameTwo);
var filenameThree = 'charm'; // Because the third time is

var filenameFour = 'get';
process.on('exit', function () {
  assert.strictEqual(watchSeenOne, 1);
  assert.strictEqual(watchSeenTwo, 2);
  assert.strictEqual(watchSeenThree, 1);
  assert.strictEqual(watchSeenFour, 1);
});
tmpdir.refresh();
fs.writeFileSync(filepathOne, 'hello');
assert["throws"](function () {
  fs.watchFile(filepathOne);
}, {
  code: 'ERR_INVALID_ARG_TYPE'
}); // Does not throw.

fs.watchFile(filepathOne, function () {
  fs.unwatchFile(filepathOne);
  ++watchSeenOne;
});
setTimeout(function () {
  fs.writeFileSync(filepathOne, 'world');
}, 1000);
process.chdir(testDir);
fs.writeFileSync(filepathTwoAbs, 'howdy');
assert["throws"](function () {
  fs.watchFile(filepathTwo);
}, {
  code: 'ERR_INVALID_ARG_TYPE'
});
{
  // Does not throw.
  var a = function a() {
    fs.unwatchFile(filepathTwo, a);
    ++watchSeenTwo;
  };

  var b = function b() {
    fs.unwatchFile(filepathTwo, b);
    ++watchSeenTwo;
  };

  fs.watchFile(filepathTwo, a);
  fs.watchFile(filepathTwo, b);
}
setTimeout(function () {
  fs.writeFileSync(filepathTwoAbs, 'pardner');
}, 1000);
{
  // Does not throw.
  var _b = function _b() {
    fs.unwatchFile(filenameThree, _b);
    ++watchSeenThree;
  };

  var uncalledListener = common.mustNotCall();
  fs.watchFile(filenameThree, uncalledListener);
  fs.watchFile(filenameThree, _b);
  fs.unwatchFile(filenameThree, uncalledListener);
}
setTimeout(function () {
  fs.writeFileSync(filenameThree, 'pardner');
}, 1000);
setTimeout(function () {
  fs.writeFileSync(filenameFour, 'hey');
}, 200);
setTimeout(function () {
  fs.writeFileSync(filenameFour, 'hey');
}, 500);
{
  // Does not throw.
  var _a = function _a() {
    ++watchSeenFour;
    assert.strictEqual(watchSeenFour, 1);
    fs.unwatchFile(".".concat(path.sep).concat(filenameFour), _a);
  };

  fs.watchFile(filenameFour, _a);
}