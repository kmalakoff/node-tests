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

if (common.isIBMi) common.skip('IBMi does not support fs.watch()');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

if (!common.isMainThread) common.skip('process.chdir is not available in Workers');
var expectFilePath = common.isWindows || common.isLinux || common.isOSX || common.isAIX;
var testDir = tmpdir.path;
tmpdir.refresh();
{
  var filepath = path.join(testDir, 'watch.txt');
  fs.writeFileSync(filepath, 'hello');
  var watcher = fs.watch(filepath);
  watcher.on('change', common.mustCall(function (event, filename) {
    assert.strictEqual(event, 'change');

    if (expectFilePath) {
      assert.strictEqual(filename, 'watch.txt');
    }

    watcher.close();
  }));
  setImmediate(function () {
    fs.writeFileSync(filepath, 'world');
  });
}
{
  var filepathAbs = path.join(testDir, 'hasOwnProperty');
  process.chdir(testDir);
  fs.writeFileSync(filepathAbs, 'howdy');

  var _watcher = fs.watch('hasOwnProperty', common.mustCall(function (event, filename) {
    assert.strictEqual(event, 'change');

    if (expectFilePath) {
      assert.strictEqual(filename, 'hasOwnProperty');
    }

    _watcher.close();
  }));

  setImmediate(function () {
    fs.writeFileSync(filepathAbs, 'pardner');
  });
}
{
  var testsubdir = fs.mkdtempSync(testDir + path.sep);

  var _filepath = path.join(testsubdir, 'newfile.txt');

  var _watcher2 = fs.watch(testsubdir, common.mustCall(function (event, filename) {
    var renameEv = common.isSunOS || common.isAIX ? 'change' : 'rename';
    assert.strictEqual(event, renameEv);

    if (expectFilePath) {
      assert.strictEqual(filename, 'newfile.txt');
    } else {
      assert.strictEqual(filename, null);
    }

    _watcher2.close();
  }));

  setImmediate(function () {
    var fd = fs.openSync(_filepath, 'w');
    fs.closeSync(fd);
  });
} // https://github.com/joyent/node/issues/2293 - non-persistent watcher should
// not block the event loop

{
  fs.watch(__filename, {
    persistent: false
  }, common.mustNotCall());
} // Whitebox test to ensure that wrapped FSEvent is safe
// https://github.com/joyent/node/issues/6690

{
  var oldhandle;
  assert["throws"](function () {
    var w = fs.watch(__filename, common.mustNotCall());
    oldhandle = w._handle;
    w._handle = {
      close: w._handle.close
    };
    w.close();
  }, {
    name: 'Error',
    code: 'ERR_INTERNAL_ASSERTION',
    message: /^handle must be a FSEvent/
  });
  oldhandle.close(); // clean up
}
{
  var _oldhandle;

  assert["throws"](function () {
    var w = fs.watch(__filename, common.mustNotCall());
    _oldhandle = w._handle;
    var protoSymbols = Object.getOwnPropertySymbols(Object.getPrototypeOf(w));
    var kFSWatchStart = protoSymbols.find(function (val) {
      return val.toString() === 'Symbol(kFSWatchStart)';
    });
    w._handle = {};
    w[kFSWatchStart]();
  }, {
    name: 'Error',
    code: 'ERR_INTERNAL_ASSERTION',
    message: /^handle must be a FSEvent/
  });

  _oldhandle.close(); // clean up

}