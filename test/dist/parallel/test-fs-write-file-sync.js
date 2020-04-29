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

if (!common.isMainThread) common.skip('Setting process.umask is not supported in Workers');

var assert = require('assert');

var path = require('path');

var fs = require('fs'); // On Windows chmod is only able to manipulate read-only bit. Test if creating
// the file in read-only mode works.


var mode = common.isWindows ? 292 : 493; // Reset the umask for testing

process.umask(0);

var tmpdir = require('../common/tmpdir');

tmpdir.refresh(); // Test writeFileSync

{
  var file = path.join(tmpdir.path, 'testWriteFileSync.txt');
  fs.writeFileSync(file, '123', {
    mode: mode
  });
  var content = fs.readFileSync(file, {
    encoding: 'utf8'
  });
  assert.strictEqual(content, '123');
  assert.strictEqual(fs.statSync(file).mode & 511, mode);
} // Test appendFileSync

{
  var _file = path.join(tmpdir.path, 'testAppendFileSync.txt');

  fs.appendFileSync(_file, 'abc', {
    mode: mode
  });

  var _content = fs.readFileSync(_file, {
    encoding: 'utf8'
  });

  assert.strictEqual(_content, 'abc');
  assert.strictEqual(fs.statSync(_file).mode & mode, mode);
} // Test writeFileSync with file descriptor

{
  // Need to hijack fs.open/close to make sure that things
  // get closed once they're opened.
  var _openSync = fs.openSync;
  var _closeSync = fs.closeSync;
  var openCount = 0;

  fs.openSync = function () {
    openCount++;
    return _openSync.apply(void 0, arguments);
  };

  fs.closeSync = function () {
    openCount--;
    return _closeSync.apply(void 0, arguments);
  };

  var _file2 = path.join(tmpdir.path, 'testWriteFileSyncFd.txt');

  var fd = fs.openSync(_file2, 'w+', mode);
  fs.writeFileSync(fd, '123');
  fs.closeSync(fd);

  var _content2 = fs.readFileSync(_file2, {
    encoding: 'utf8'
  });

  assert.strictEqual(_content2, '123');
  assert.strictEqual(fs.statSync(_file2).mode & 511, mode); // Verify that all opened files were closed.

  assert.strictEqual(openCount, 0);
  fs.openSync = _openSync;
  fs.closeSync = _closeSync;
} // Test writeFileSync with flags

{
  var _file3 = path.join(tmpdir.path, 'testWriteFileSyncFlags.txt');

  fs.writeFileSync(_file3, 'hello ', {
    encoding: 'utf8',
    flag: 'a'
  });
  fs.writeFileSync(_file3, 'world!', {
    encoding: 'utf8',
    flag: 'a'
  });

  var _content3 = fs.readFileSync(_file3, {
    encoding: 'utf8'
  });

  assert.strictEqual(_content3, 'hello world!');
}