// Flags: --expose-internals
'use strict'; // This verifies the error thrown by fs.watch.

var common = require('../common');

if (common.isIBMi) common.skip('IBMi does not support `fs.watch()`');

var assert = require('assert');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

var path = require('path');

var nonexistentFile = path.join(tmpdir.path, 'non-existent');

var _require = require('internal/test/binding'),
    internalBinding = _require.internalBinding;

var _internalBinding = internalBinding('uv'),
    UV_ENODEV = _internalBinding.UV_ENODEV,
    UV_ENOENT = _internalBinding.UV_ENOENT;

tmpdir.refresh();
{
  var validateError = function validateError(err) {
    assert.strictEqual(err.path, nonexistentFile);
    assert.strictEqual(err.filename, nonexistentFile);
    assert.strictEqual(err.syscall, 'watch');

    if (err.code === 'ENOENT') {
      assert.strictEqual(err.message, "ENOENT: no such file or directory, watch '".concat(nonexistentFile, "'"));
      assert.strictEqual(err.errno, UV_ENOENT);
      assert.strictEqual(err.code, 'ENOENT');
    } else {
      // AIX
      assert.strictEqual(err.message, "ENODEV: no such device, watch '".concat(nonexistentFile, "'"));
      assert.strictEqual(err.errno, UV_ENODEV);
      assert.strictEqual(err.code, 'ENODEV');
    }

    return true;
  };

  assert["throws"](function () {
    return fs.watch(nonexistentFile, common.mustNotCall());
  }, validateError);
}
{
  var file = path.join(tmpdir.path, 'file-to-watch');
  fs.writeFileSync(file, 'test');
  var watcher = fs.watch(file, common.mustNotCall());

  var _validateError = function _validateError(err) {
    assert.strictEqual(err.path, nonexistentFile);
    assert.strictEqual(err.filename, nonexistentFile);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, watch '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'watch');
    fs.unlinkSync(file);
    return true;
  };

  watcher.on('error', common.mustCall(_validateError)); // Simulate the invocation from the binding

  watcher._handle.onchange(UV_ENOENT, 'ENOENT', nonexistentFile);
}