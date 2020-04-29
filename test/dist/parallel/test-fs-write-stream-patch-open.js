'use strict';

var common = require('../common');

var fs = require('fs');

var tmpdir = require('../common/tmpdir'); // Run in a child process because 'out' is opened twice, blocking the tmpdir
// and preventing cleanup.


if (process.argv[2] !== 'child') {
  // Parent
  var assert = require('assert');

  var _require = require('child_process'),
      fork = _require.fork;

  tmpdir.refresh(); // Run test

  var child = fork(__filename, ['child'], {
    stdio: 'inherit'
  });
  child.on('exit', common.mustCall(function (code) {
    assert.strictEqual(code, 0);
  }));
  return;
} // Child


common.expectWarning('DeprecationWarning', 'WriteStream.prototype.open() is deprecated', 'DEP0135');
var s = fs.createWriteStream("".concat(tmpdir.path, "/out"));
s.open(); // Allow overriding open().

fs.WriteStream.prototype.open = common.mustCall();
fs.createWriteStream('asd');