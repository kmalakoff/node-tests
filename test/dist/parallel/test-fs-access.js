// Flags: --expose-internals
'use strict'; // This tests that fs.access and fs.accessSync works as expected
// and the errors thrown from these APIs include the desired properties

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var common = require('../common');

if (!common.isWindows && process.getuid() === 0) common.skip('as this test should not be run as `root`');
if (common.isIBMi) common.skip('IBMi has a different access permission mechanism');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var _require = require('internal/test/binding'),
    internalBinding = _require.internalBinding;

var _internalBinding = internalBinding('uv'),
    UV_ENOENT = _internalBinding.UV_ENOENT;

var tmpdir = require('../common/tmpdir');

var doesNotExist = path.join(tmpdir.path, '__this_should_not_exist');
var readOnlyFile = path.join(tmpdir.path, 'read_only_file');
var readWriteFile = path.join(tmpdir.path, 'read_write_file');

function createFileWithPerms(file, mode) {
  fs.writeFileSync(file, '');
  fs.chmodSync(file, mode);
}

tmpdir.refresh();
createFileWithPerms(readOnlyFile, 292);
createFileWithPerms(readWriteFile, 438);
/*
 * On non-Windows supported platforms, fs.access(readOnlyFile, W_OK, ...)
 * always succeeds if node runs as the super user, which is sometimes the
 * case for tests running on our continuous testing platform agents.
 *
 * In this case, this test tries to change its process user id to a
 * non-superuser user so that the test that checks for write access to a
 * read-only file can be more meaningful.
 *
 * The change of user id is done after creating the fixtures files for the same
 * reason: the test may be run as the superuser within a directory in which
 * only the superuser can create files, and thus it may need superuser
 * privileges to create them.
 *
 * There's not really any point in resetting the process' user id to 0 after
 * changing it to 'nobody', since in the case that the test runs without
 * superuser privilege, it is not possible to change its process user id to
 * superuser.
 *
 * It can prevent the test from removing files created before the change of user
 * id, but that's fine. In this case, it is the responsibility of the
 * continuous integration platform to take care of that.
 */

var hasWriteAccessForReadonlyFile = false;

if (!common.isWindows && process.getuid() === 0) {
  hasWriteAccessForReadonlyFile = true;

  try {
    process.setuid('nobody');
    hasWriteAccessForReadonlyFile = false;
  } catch (_unused) {}
}

assert.strictEqual((0, _typeof2["default"])(fs.F_OK), 'number');
assert.strictEqual((0, _typeof2["default"])(fs.R_OK), 'number');
assert.strictEqual((0, _typeof2["default"])(fs.W_OK), 'number');
assert.strictEqual((0, _typeof2["default"])(fs.X_OK), 'number');

var throwNextTick = function throwNextTick(e) {
  process.nextTick(function () {
    throw e;
  });
};

fs.access(__filename, common.mustCall(function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  assert.deepStrictEqual(args, [null]);
}));
fs.promises.access(__filename).then(common.mustCall())["catch"](throwNextTick);
fs.access(__filename, fs.R_OK, common.mustCall(function () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  assert.deepStrictEqual(args, [null]);
}));
fs.promises.access(__filename, fs.R_OK).then(common.mustCall())["catch"](throwNextTick);
fs.access(readOnlyFile, fs.F_OK | fs.R_OK, common.mustCall(function () {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  assert.deepStrictEqual(args, [null]);
}));
fs.promises.access(readOnlyFile, fs.F_OK | fs.R_OK).then(common.mustCall())["catch"](throwNextTick);
{
  var expectedError = function expectedError(err) {
    assert.notStrictEqual(err, null);
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.path, doesNotExist);
  };

  fs.access(doesNotExist, common.mustCall(expectedError));
  fs.promises.access(doesNotExist).then(common.mustNotCall(), common.mustCall(expectedError))["catch"](throwNextTick);
}
{
  var _expectedError = function _expectedError(err) {
    assert.strictEqual(this, undefined);

    if (hasWriteAccessForReadonlyFile) {
      assert.ifError(err);
    } else {
      assert.notStrictEqual(err, null);
      assert.strictEqual(err.path, readOnlyFile);
    }
  };

  fs.access(readOnlyFile, fs.W_OK, common.mustCall(_expectedError));
  fs.promises.access(readOnlyFile, fs.W_OK).then(common.mustNotCall(), common.mustCall(_expectedError))["catch"](throwNextTick);
}
{
  var _expectedError2 = function _expectedError2(err) {
    assert.strictEqual(err.code, 'ERR_INVALID_ARG_TYPE');
    assert.ok(err instanceof TypeError);
    return true;
  };

  assert["throws"](function () {
    fs.access(100, fs.F_OK, common.mustNotCall());
  }, _expectedError2);
  fs.promises.access(100, fs.F_OK).then(common.mustNotCall(), common.mustCall(_expectedError2))["catch"](throwNextTick);
}
assert["throws"](function () {
  fs.access(__filename, fs.F_OK);
}, {
  code: 'ERR_INVALID_CALLBACK',
  name: 'TypeError'
});
assert["throws"](function () {
  fs.access(__filename, fs.F_OK, {});
}, {
  code: 'ERR_INVALID_CALLBACK',
  name: 'TypeError'
}); // Regular access should not throw.

fs.accessSync(__filename);
var mode = fs.F_OK | fs.R_OK | fs.W_OK;
fs.accessSync(readWriteFile, mode); // Invalid modes should throw.

[false, 1n, (0, _defineProperty2["default"])({}, Symbol.toPrimitive, function () {
  return fs.R_OK;
}), [1], 'r'].forEach(function (mode, i) {
  console.log(mode, i);
  assert["throws"](function () {
    return fs.access(readWriteFile, mode, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    message: /"mode" argument.+integer/
  });
  assert["throws"](function () {
    return fs.accessSync(readWriteFile, mode);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    message: /"mode" argument.+integer/
  });
}); // Out of range modes should throw

[-1, 8, Infinity, NaN].forEach(function (mode, i) {
  console.log(mode, i);
  assert["throws"](function () {
    return fs.access(readWriteFile, mode, common.mustNotCall());
  }, {
    code: 'ERR_OUT_OF_RANGE',
    message: /"mode".+It must be an integer >= 0 && <= 7/
  });
  assert["throws"](function () {
    return fs.accessSync(readWriteFile, mode);
  }, {
    code: 'ERR_OUT_OF_RANGE',
    message: /"mode".+It must be an integer >= 0 && <= 7/
  });
});
assert["throws"](function () {
  fs.accessSync(doesNotExist);
}, function (err) {
  assert.strictEqual(err.code, 'ENOENT');
  assert.strictEqual(err.path, doesNotExist);
  assert.strictEqual(err.message, "ENOENT: no such file or directory, access '".concat(doesNotExist, "'"));
  assert.strictEqual(err.constructor, Error);
  assert.strictEqual(err.syscall, 'access');
  assert.strictEqual(err.errno, UV_ENOENT);
  return true;
});
assert["throws"](function () {
  fs.accessSync(Buffer.from(doesNotExist));
}, function (err) {
  assert.strictEqual(err.code, 'ENOENT');
  assert.strictEqual(err.path, doesNotExist);
  assert.strictEqual(err.message, "ENOENT: no such file or directory, access '".concat(doesNotExist, "'"));
  assert.strictEqual(err.constructor, Error);
  assert.strictEqual(err.syscall, 'access');
  assert.strictEqual(err.errno, UV_ENOENT);
  return true;
});