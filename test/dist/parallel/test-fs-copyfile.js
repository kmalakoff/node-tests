// Flags: --expose-internals
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var common = require('../common');

var fixtures = require('../common/fixtures');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var fs = require('fs');

var _require = require('internal/test/binding'),
    internalBinding = _require.internalBinding;

var _internalBinding = internalBinding('uv'),
    UV_ENOENT = _internalBinding.UV_ENOENT,
    UV_EEXIST = _internalBinding.UV_EEXIST;

var path = require('path');

var src = fixtures.path('a.js');
var dest = path.join(tmpdir.path, 'copyfile.out');
var _fs$constants = fs.constants,
    COPYFILE_EXCL = _fs$constants.COPYFILE_EXCL,
    COPYFILE_FICLONE = _fs$constants.COPYFILE_FICLONE,
    COPYFILE_FICLONE_FORCE = _fs$constants.COPYFILE_FICLONE_FORCE,
    UV_FS_COPYFILE_EXCL = _fs$constants.UV_FS_COPYFILE_EXCL,
    UV_FS_COPYFILE_FICLONE = _fs$constants.UV_FS_COPYFILE_FICLONE,
    UV_FS_COPYFILE_FICLONE_FORCE = _fs$constants.UV_FS_COPYFILE_FICLONE_FORCE;

function verify(src, dest) {
  var srcData = fs.readFileSync(src, 'utf8');
  var srcStat = fs.statSync(src);
  var destData = fs.readFileSync(dest, 'utf8');
  var destStat = fs.statSync(dest);
  assert.strictEqual(srcData, destData);
  assert.strictEqual(srcStat.mode, destStat.mode);
  assert.strictEqual(srcStat.size, destStat.size);
}

tmpdir.refresh(); // Verify that flags are defined.

assert.strictEqual((0, _typeof2["default"])(COPYFILE_EXCL), 'number');
assert.strictEqual((0, _typeof2["default"])(COPYFILE_FICLONE), 'number');
assert.strictEqual((0, _typeof2["default"])(COPYFILE_FICLONE_FORCE), 'number');
assert.strictEqual((0, _typeof2["default"])(UV_FS_COPYFILE_EXCL), 'number');
assert.strictEqual((0, _typeof2["default"])(UV_FS_COPYFILE_FICLONE), 'number');
assert.strictEqual((0, _typeof2["default"])(UV_FS_COPYFILE_FICLONE_FORCE), 'number');
assert.strictEqual(COPYFILE_EXCL, UV_FS_COPYFILE_EXCL);
assert.strictEqual(COPYFILE_FICLONE, UV_FS_COPYFILE_FICLONE);
assert.strictEqual(COPYFILE_FICLONE_FORCE, UV_FS_COPYFILE_FICLONE_FORCE); // Verify that files are overwritten when no flags are provided.

fs.writeFileSync(dest, '', 'utf8');
var result = fs.copyFileSync(src, dest);
assert.strictEqual(result, undefined);
verify(src, dest); // Verify that files are overwritten with default flags.

fs.copyFileSync(src, dest, 0);
verify(src, dest); // Verify that UV_FS_COPYFILE_FICLONE can be used.

fs.unlinkSync(dest);
fs.copyFileSync(src, dest, UV_FS_COPYFILE_FICLONE);
verify(src, dest); // Verify that COPYFILE_FICLONE_FORCE can be used.

try {
  fs.unlinkSync(dest);
  fs.copyFileSync(src, dest, COPYFILE_FICLONE_FORCE);
  verify(src, dest);
} catch (err) {
  assert.strictEqual(err.syscall, 'copyfile');
  assert(err.code === 'ENOTSUP' || err.code === 'ENOTTY' || err.code === 'ENOSYS' || err.code === 'EXDEV');
  assert.strictEqual(err.path, src);
  assert.strictEqual(err.dest, dest);
} // Copies asynchronously.


tmpdir.refresh(); // Don't use unlinkSync() since the last test may fail.

fs.copyFile(src, dest, common.mustCall(function (err) {
  assert.ifError(err);
  verify(src, dest); // Copy asynchronously with flags.

  fs.copyFile(src, dest, COPYFILE_EXCL, common.mustCall(function (err) {
    if (err.code === 'ENOENT') {
      // Could be ENOENT or EEXIST
      assert.strictEqual(err.message, 'ENOENT: no such file or directory, copyfile ' + "'".concat(src, "' -> '").concat(dest, "'"));
      assert.strictEqual(err.errno, UV_ENOENT);
      assert.strictEqual(err.code, 'ENOENT');
      assert.strictEqual(err.syscall, 'copyfile');
    } else {
      assert.strictEqual(err.message, 'EEXIST: file already exists, copyfile ' + "'".concat(src, "' -> '").concat(dest, "'"));
      assert.strictEqual(err.errno, UV_EEXIST);
      assert.strictEqual(err.code, 'EEXIST');
      assert.strictEqual(err.syscall, 'copyfile');
    }
  }));
})); // Throws if callback is not a function.

assert["throws"](function () {
  fs.copyFile(src, dest, 0, 0);
}, {
  code: 'ERR_INVALID_CALLBACK',
  name: 'TypeError'
}); // Throws if the source path is not a string.

[false, 1, {}, [], null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.copyFile(i, dest, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: /src/
  });
  assert["throws"](function () {
    return fs.copyFile(src, i, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: /dest/
  });
  assert["throws"](function () {
    return fs.copyFileSync(i, dest);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: /src/
  });
  assert["throws"](function () {
    return fs.copyFileSync(src, i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: /dest/
  });
});
assert["throws"](function () {
  fs.copyFileSync(src, dest, 'r');
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
  message: /mode/
});
assert["throws"](function () {
  fs.copyFileSync(src, dest, 8);
}, {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError',
  message: 'The value of "mode" is out of range. It must be an integer ' + '>= 0 && <= 7. Received 8'
});
assert["throws"](function () {
  fs.copyFile(src, dest, 'r', common.mustNotCall());
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
  message: /mode/
});