// Flags: --expose-internals
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

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["'", ""]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["", ""]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["'", "' -> "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["'", "' -> "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var common = require('../common');

var fixtures = require('../common/fixtures');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

tmpdir.refresh();
var nonexistentFile = path.join(tmpdir.path, 'non-existent');
var nonexistentDir = path.join(tmpdir.path, 'non-existent', 'foo', 'bar');
var existingFile = path.join(tmpdir.path, 'existingFile.js');
var existingFile2 = path.join(tmpdir.path, 'existingFile2.js');
var existingDir = path.join(tmpdir.path, 'dir');
var existingDir2 = fixtures.path('keys');
fs.mkdirSync(existingDir);
fs.writeFileSync(existingFile, 'test', 'utf-8');
fs.writeFileSync(existingFile2, 'test', 'utf-8');
var COPYFILE_EXCL = fs.constants.COPYFILE_EXCL;

var _require = require('internal/test/binding'),
    internalBinding = _require.internalBinding;

var _internalBinding = internalBinding('uv'),
    UV_EBADF = _internalBinding.UV_EBADF,
    UV_EEXIST = _internalBinding.UV_EEXIST,
    UV_EINVAL = _internalBinding.UV_EINVAL,
    UV_ENOENT = _internalBinding.UV_ENOENT,
    UV_ENOTDIR = _internalBinding.UV_ENOTDIR,
    UV_ENOTEMPTY = _internalBinding.UV_ENOTEMPTY,
    UV_EPERM = _internalBinding.UV_EPERM; // Template tag function for escaping special characters in strings so that:
// new RegExp(re`${str}`).test(str) === true


function re(literals) {
  var escapeRE = /[\\^$.*+?()[\]{}|=!<>:-]/g;
  var result = literals[0].replace(escapeRE, '\\$&');

  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  var _iterator = _createForOfIteratorHelper(values.entries()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = (0, _slicedToArray2["default"])(_step.value, 2),
          i = _step$value[0],
          value = _step$value[1];

      result += value.replace(escapeRE, '\\$&');
      result += literals[i + 1].replace(escapeRE, '\\$&');
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return result;
} // stat


{
  var validateError = function validateError(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, stat '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'stat');
    return true;
  };

  fs.stat(nonexistentFile, common.mustCall(validateError));
  assert["throws"](function () {
    return fs.statSync(nonexistentFile);
  }, validateError);
} // lstat

{
  var _validateError = function _validateError(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, lstat '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'lstat');
    return true;
  };

  fs.lstat(nonexistentFile, common.mustCall(_validateError));
  assert["throws"](function () {
    return fs.lstatSync(nonexistentFile);
  }, _validateError);
} // fstat

{
  var _validateError2 = function _validateError2(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fstat');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fstat');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.fstat(fd, common.mustCall(_validateError2));
    assert["throws"](function () {
      return fs.fstatSync(fd);
    }, _validateError2);
  });
} // realpath

{
  var _validateError3 = function _validateError3(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, lstat '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'lstat');
    return true;
  };

  fs.realpath(nonexistentFile, common.mustCall(_validateError3));
  assert["throws"](function () {
    return fs.realpathSync(nonexistentFile);
  }, _validateError3);
} // native realpath

{
  var _validateError4 = function _validateError4(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, realpath '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'realpath');
    return true;
  };

  fs.realpath["native"](nonexistentFile, common.mustCall(_validateError4));
  assert["throws"](function () {
    return fs.realpathSync["native"](nonexistentFile);
  }, _validateError4);
} // readlink

{
  var _validateError5 = function _validateError5(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, readlink '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'readlink');
    return true;
  };

  fs.readlink(nonexistentFile, common.mustCall(_validateError5));
  assert["throws"](function () {
    return fs.readlinkSync(nonexistentFile);
  }, _validateError5);
} // Link nonexistent file

{
  var _validateError6 = function _validateError6(err) {
    assert.strictEqual(nonexistentFile, err.path); // Could be resolved to an absolute path

    assert.ok(err.dest.endsWith('foo'), "expect ".concat(err.dest, " to end with 'foo'"));
    var regexp = new RegExp('^ENOENT: no such file or directory, link ' + re(_templateObject(), nonexistentFile) + '\'.*foo\'');
    assert.ok(regexp.test(err.message), "Expect ".concat(err.message, " to match ").concat(regexp));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'link');
    return true;
  };

  fs.link(nonexistentFile, 'foo', common.mustCall(_validateError6));
  assert["throws"](function () {
    return fs.linkSync(nonexistentFile, 'foo');
  }, _validateError6);
} // link existing file

{
  var _validateError7 = function _validateError7(err) {
    assert.strictEqual(existingFile, err.path);
    assert.strictEqual(existingFile2, err.dest);
    assert.strictEqual(err.message, "EEXIST: file already exists, link '".concat(existingFile, "' -> ") + "'".concat(existingFile2, "'"));
    assert.strictEqual(err.errno, UV_EEXIST);
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.syscall, 'link');
    return true;
  };

  fs.link(existingFile, existingFile2, common.mustCall(_validateError7));
  assert["throws"](function () {
    return fs.linkSync(existingFile, existingFile2);
  }, _validateError7);
} // symlink

{
  var _validateError8 = function _validateError8(err) {
    assert.strictEqual(existingFile, err.path);
    assert.strictEqual(existingFile2, err.dest);
    assert.strictEqual(err.message, "EEXIST: file already exists, symlink '".concat(existingFile, "' -> ") + "'".concat(existingFile2, "'"));
    assert.strictEqual(err.errno, UV_EEXIST);
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.syscall, 'symlink');
    return true;
  };

  fs.symlink(existingFile, existingFile2, common.mustCall(_validateError8));
  assert["throws"](function () {
    return fs.symlinkSync(existingFile, existingFile2);
  }, _validateError8);
} // unlink

{
  var _validateError9 = function _validateError9(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, unlink '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'unlink');
    return true;
  };

  fs.unlink(nonexistentFile, common.mustCall(_validateError9));
  assert["throws"](function () {
    return fs.unlinkSync(nonexistentFile);
  }, _validateError9);
} // rename

{
  var _validateError10 = function _validateError10(err) {
    assert.strictEqual(nonexistentFile, err.path); // Could be resolved to an absolute path

    assert.ok(err.dest.endsWith('foo'), "expect ".concat(err.dest, " to end with 'foo'"));
    var regexp = new RegExp('ENOENT: no such file or directory, rename ' + re(_templateObject2(), nonexistentFile) + '\'.*foo\'');
    assert.ok(regexp.test(err.message), "Expect ".concat(err.message, " to match ").concat(regexp));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'rename');
    return true;
  };

  var destFile = path.join(tmpdir.path, 'foo');
  fs.rename(nonexistentFile, destFile, common.mustCall(_validateError10));
  assert["throws"](function () {
    return fs.renameSync(nonexistentFile, destFile);
  }, _validateError10);
} // Rename non-empty directory

{
  var _validateError11 = function _validateError11(err) {
    assert.strictEqual(existingDir, err.path);
    assert.strictEqual(existingDir2, err.dest);
    assert.strictEqual(err.syscall, 'rename'); // Could be ENOTEMPTY, EEXIST, or EPERM, depending on the platform

    if (err.code === 'ENOTEMPTY') {
      assert.strictEqual(err.message, "ENOTEMPTY: directory not empty, rename '".concat(existingDir, "' -> ") + "'".concat(existingDir2, "'"));
      assert.strictEqual(err.errno, UV_ENOTEMPTY);
    } else if (err.code === 'EXDEV') {
      // Not on the same mounted filesystem
      assert.strictEqual(err.message, "EXDEV: cross-device link not permitted, rename '".concat(existingDir, "' -> ") + "'".concat(existingDir2, "'"));
    } else if (err.code === 'EEXIST') {
      // smartos and aix
      assert.strictEqual(err.message, "EEXIST: file already exists, rename '".concat(existingDir, "' -> ") + "'".concat(existingDir2, "'"));
      assert.strictEqual(err.errno, UV_EEXIST);
    } else {
      // windows
      assert.strictEqual(err.message, "EPERM: operation not permitted, rename '".concat(existingDir, "' -> ") + "'".concat(existingDir2, "'"));
      assert.strictEqual(err.errno, UV_EPERM);
      assert.strictEqual(err.code, 'EPERM');
    }

    return true;
  };

  fs.rename(existingDir, existingDir2, common.mustCall(_validateError11));
  assert["throws"](function () {
    return fs.renameSync(existingDir, existingDir2);
  }, _validateError11);
} // rmdir

{
  var _validateError12 = function _validateError12(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, rmdir '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'rmdir');
    return true;
  };

  fs.rmdir(nonexistentFile, common.mustCall(_validateError12));
  assert["throws"](function () {
    return fs.rmdirSync(nonexistentFile);
  }, _validateError12);
} // rmdir a file

{
  var _validateError13 = function _validateError13(err) {
    assert.strictEqual(existingFile, err.path);
    assert.strictEqual(err.syscall, 'rmdir');

    if (err.code === 'ENOTDIR') {
      assert.strictEqual(err.message, "ENOTDIR: not a directory, rmdir '".concat(existingFile, "'"));
      assert.strictEqual(err.errno, UV_ENOTDIR);
    } else {
      // windows
      assert.strictEqual(err.message, "ENOENT: no such file or directory, rmdir '".concat(existingFile, "'"));
      assert.strictEqual(err.errno, UV_ENOENT);
      assert.strictEqual(err.code, 'ENOENT');
    }

    return true;
  };

  fs.rmdir(existingFile, common.mustCall(_validateError13));
  assert["throws"](function () {
    return fs.rmdirSync(existingFile);
  }, _validateError13);
} // mkdir

{
  var _validateError14 = function _validateError14(err) {
    assert.strictEqual(existingFile, err.path);
    assert.strictEqual(err.message, "EEXIST: file already exists, mkdir '".concat(existingFile, "'"));
    assert.strictEqual(err.errno, UV_EEXIST);
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.syscall, 'mkdir');
    return true;
  };

  fs.mkdir(existingFile, 438, common.mustCall(_validateError14));
  assert["throws"](function () {
    return fs.mkdirSync(existingFile, 438);
  }, _validateError14);
} // chmod

{
  var _validateError15 = function _validateError15(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, chmod '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'chmod');
    return true;
  };

  fs.chmod(nonexistentFile, 438, common.mustCall(_validateError15));
  assert["throws"](function () {
    return fs.chmodSync(nonexistentFile, 438);
  }, _validateError15);
} // open

{
  var _validateError16 = function _validateError16(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, open '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'open');
    return true;
  };

  fs.open(nonexistentFile, 'r', 438, common.mustCall(_validateError16));
  assert["throws"](function () {
    return fs.openSync(nonexistentFile, 'r', 438);
  }, _validateError16);
} // close

{
  var _validateError17 = function _validateError17(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, close');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'close');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.close(fd, common.mustCall(_validateError17));
    assert["throws"](function () {
      return fs.closeSync(fd);
    }, _validateError17);
  });
} // readFile

{
  var _validateError18 = function _validateError18(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, open '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'open');
    return true;
  };

  fs.readFile(nonexistentFile, common.mustCall(_validateError18));
  assert["throws"](function () {
    return fs.readFileSync(nonexistentFile);
  }, _validateError18);
} // readdir

{
  var _validateError19 = function _validateError19(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, scandir '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'scandir');
    return true;
  };

  fs.readdir(nonexistentFile, common.mustCall(_validateError19));
  assert["throws"](function () {
    return fs.readdirSync(nonexistentFile);
  }, _validateError19);
} // ftruncate

{
  var _validateError20 = function _validateError20(err) {
    assert.strictEqual(err.syscall, 'ftruncate'); // Could be EBADF or EINVAL, depending on the platform

    if (err.code === 'EBADF') {
      assert.strictEqual(err.message, 'EBADF: bad file descriptor, ftruncate');
      assert.strictEqual(err.errno, UV_EBADF);
    } else {
      assert.strictEqual(err.message, 'EINVAL: invalid argument, ftruncate');
      assert.strictEqual(err.errno, UV_EINVAL);
      assert.strictEqual(err.code, 'EINVAL');
    }

    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.ftruncate(fd, 4, common.mustCall(_validateError20));
    assert["throws"](function () {
      return fs.ftruncateSync(fd, 4);
    }, _validateError20);
  });
} // fdatasync

{
  var _validateError21 = function _validateError21(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fdatasync');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fdatasync');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.fdatasync(fd, common.mustCall(_validateError21));
    assert["throws"](function () {
      return fs.fdatasyncSync(fd);
    }, _validateError21);
  });
} // fsync

{
  var _validateError22 = function _validateError22(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fsync');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fsync');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.fsync(fd, common.mustCall(_validateError22));
    assert["throws"](function () {
      return fs.fsyncSync(fd);
    }, _validateError22);
  });
} // chown

if (!common.isWindows) {
  var _validateError23 = function _validateError23(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, chown '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'chown');
    return true;
  };

  fs.chown(nonexistentFile, process.getuid(), process.getgid(), common.mustCall(_validateError23));
  assert["throws"](function () {
    return fs.chownSync(nonexistentFile, process.getuid(), process.getgid());
  }, _validateError23);
} // utimes


if (!common.isAIX) {
  var _validateError24 = function _validateError24(err) {
    assert.strictEqual(nonexistentFile, err.path);
    assert.strictEqual(err.message, "ENOENT: no such file or directory, utime '".concat(nonexistentFile, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'utime');
    return true;
  };

  fs.utimes(nonexistentFile, new Date(), new Date(), common.mustCall(_validateError24));
  assert["throws"](function () {
    return fs.utimesSync(nonexistentFile, new Date(), new Date());
  }, _validateError24);
} // mkdtemp


{
  var _validateError25 = function _validateError25(err) {
    var pathPrefix = new RegExp('^' + re(_templateObject3(), nonexistentDir));
    assert(pathPrefix.test(err.path), "Expect ".concat(err.path, " to match ").concat(pathPrefix));
    var prefix = new RegExp('^ENOENT: no such file or directory, mkdtemp ' + re(_templateObject4(), nonexistentDir));
    assert(prefix.test(err.message), "Expect ".concat(err.message, " to match ").concat(prefix));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'mkdtemp');
    return true;
  };

  fs.mkdtemp(nonexistentDir, common.mustCall(_validateError25));
  assert["throws"](function () {
    return fs.mkdtempSync(nonexistentDir);
  }, _validateError25);
} // Check copyFile with invalid modes.

{
  var _validateError26 = {
    message: /"mode".+must be an integer >= 0 && <= 7\. Received -1/,
    code: 'ERR_OUT_OF_RANGE'
  };
  assert["throws"](function () {
    return fs.copyFile(existingFile, nonexistentFile, -1, function () {});
  }, _validateError26);
  assert["throws"](function () {
    return fs.copyFileSync(existingFile, nonexistentFile, -1);
  }, _validateError26);
} // copyFile: destination exists but the COPYFILE_EXCL flag is provided.

{
  var _validateError27 = function _validateError27(err) {
    if (err.code === 'ENOENT') {
      // Could be ENOENT or EEXIST
      assert.strictEqual(err.message, 'ENOENT: no such file or directory, copyfile ' + "'".concat(existingFile, "' -> '").concat(existingFile2, "'"));
      assert.strictEqual(err.errno, UV_ENOENT);
      assert.strictEqual(err.code, 'ENOENT');
      assert.strictEqual(err.syscall, 'copyfile');
    } else {
      assert.strictEqual(err.message, 'EEXIST: file already exists, copyfile ' + "'".concat(existingFile, "' -> '").concat(existingFile2, "'"));
      assert.strictEqual(err.errno, UV_EEXIST);
      assert.strictEqual(err.code, 'EEXIST');
      assert.strictEqual(err.syscall, 'copyfile');
    }

    return true;
  };

  fs.copyFile(existingFile, existingFile2, COPYFILE_EXCL, common.mustCall(_validateError27));
  assert["throws"](function () {
    return fs.copyFileSync(existingFile, existingFile2, COPYFILE_EXCL);
  }, _validateError27);
} // copyFile: the source does not exist.

{
  var _validateError28 = function _validateError28(err) {
    assert.strictEqual(err.message, 'ENOENT: no such file or directory, copyfile ' + "'".concat(nonexistentFile, "' -> '").concat(existingFile2, "'"));
    assert.strictEqual(err.errno, UV_ENOENT);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'copyfile');
    return true;
  };

  fs.copyFile(nonexistentFile, existingFile2, COPYFILE_EXCL, common.mustCall(_validateError28));
  assert["throws"](function () {
    return fs.copyFileSync(nonexistentFile, existingFile2, COPYFILE_EXCL);
  }, _validateError28);
} // read

{
  var _validateError29 = function _validateError29(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, read');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'read');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    var buf = Buffer.alloc(5);
    fs.read(fd, buf, 0, 1, 1, common.mustCall(_validateError29));
    assert["throws"](function () {
      return fs.readSync(fd, buf, 0, 1, 1);
    }, _validateError29);
  });
} // fchmod

{
  var _validateError30 = function _validateError30(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fchmod');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fchmod');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.fchmod(fd, 438, common.mustCall(_validateError30));
    assert["throws"](function () {
      return fs.fchmodSync(fd, 438);
    }, _validateError30);
  });
} // fchown

if (!common.isWindows) {
  var _validateError31 = function _validateError31(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, fchown');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'fchown');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.fchown(fd, process.getuid(), process.getgid(), common.mustCall(_validateError31));
    assert["throws"](function () {
      return fs.fchownSync(fd, process.getuid(), process.getgid());
    }, _validateError31);
  });
} // write buffer


{
  var _validateError32 = function _validateError32(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, write');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'write');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    var buf = Buffer.alloc(5);
    fs.write(fd, buf, 0, 1, 1, common.mustCall(_validateError32));
    assert["throws"](function () {
      return fs.writeSync(fd, buf, 0, 1, 1);
    }, _validateError32);
  });
} // write string

{
  var _validateError33 = function _validateError33(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, write');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'write');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.write(fd, 'test', 1, common.mustCall(_validateError33));
    assert["throws"](function () {
      return fs.writeSync(fd, 'test', 1);
    }, _validateError33);
  });
} // futimes

if (!common.isAIX) {
  var _validateError34 = function _validateError34(err) {
    assert.strictEqual(err.message, 'EBADF: bad file descriptor, futime');
    assert.strictEqual(err.errno, UV_EBADF);
    assert.strictEqual(err.code, 'EBADF');
    assert.strictEqual(err.syscall, 'futime');
    return true;
  };

  common.runWithInvalidFD(function (fd) {
    fs.futimes(fd, new Date(), new Date(), common.mustCall(_validateError34));
    assert["throws"](function () {
      return fs.futimesSync(fd, new Date(), new Date());
    }, _validateError34);
  });
}