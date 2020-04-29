// Flags: --expose-internals
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var _require = require('internal/fs/utils'),
    validateRmdirOptions = _require.validateRmdirOptions;

tmpdir.refresh();
var count = 0;

var nextDirPath = function nextDirPath() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'rmdir-recursive';
  return path.join(tmpdir.path, "".concat(name, "-").concat(count++));
};

function makeNonEmptyDirectory(depth, files, folders, dirname, createSymLinks) {
  fs.mkdirSync(dirname, {
    recursive: true
  });
  fs.writeFileSync(path.join(dirname, 'text.txt'), 'hello', 'utf8');
  var options = {
    flag: 'wx'
  };

  for (var f = files; f > 0; f--) {
    fs.writeFileSync(path.join(dirname, "f-".concat(depth, "-").concat(f)), '', options);
  }

  if (createSymLinks) {
    // Valid symlink
    fs.symlinkSync("f-".concat(depth, "-1"), path.join(dirname, "link-".concat(depth, "-good")), 'file'); // Invalid symlink

    fs.symlinkSync('does-not-exist', path.join(dirname, "link-".concat(depth, "-bad")), 'file');
  } // File with a name that looks like a glob


  fs.writeFileSync(path.join(dirname, '[a-z0-9].txt'), '', options);
  depth--;

  if (depth <= 0) {
    return;
  }

  for (var _f = folders; _f > 0; _f--) {
    fs.mkdirSync(path.join(dirname, "folder-".concat(depth, "-").concat(_f)), {
      recursive: true
    });
    makeNonEmptyDirectory(depth, files, folders, path.join(dirname, "d-".concat(depth, "-").concat(_f)), createSymLinks);
  }
}

function removeAsync(dir) {
  // Removal should fail without the recursive option.
  fs.rmdir(dir, common.mustCall(function (err) {
    assert.strictEqual(err.syscall, 'rmdir'); // Removal should fail without the recursive option set to true.

    fs.rmdir(dir, {
      recursive: false
    }, common.mustCall(function (err) {
      assert.strictEqual(err.syscall, 'rmdir'); // Recursive removal should succeed.

      fs.rmdir(dir, {
        recursive: true
      }, common.mustCall(function (err) {
        assert.ifError(err); // No error should occur if recursive and the directory does not exist.

        fs.rmdir(dir, {
          recursive: true
        }, common.mustCall(function (err) {
          assert.ifError(err); // Attempted removal should fail now because the directory is gone.

          fs.rmdir(dir, common.mustCall(function (err) {
            assert.strictEqual(err.syscall, 'rmdir');
          }));
        }));
      }));
    }));
  }));
} // Test the asynchronous version


{
  // Create a 4-level folder hierarchy including symlinks
  var dir = nextDirPath();
  makeNonEmptyDirectory(4, 10, 2, dir, true);
  removeAsync(dir); // Create a 2-level folder hierarchy without symlinks

  dir = nextDirPath();
  makeNonEmptyDirectory(2, 10, 2, dir, false);
  removeAsync(dir); // Create a flat folder including symlinks

  dir = nextDirPath();
  makeNonEmptyDirectory(1, 10, 2, dir, true);
  removeAsync(dir);
} // Test the synchronous version.

{
  var _dir = nextDirPath();

  makeNonEmptyDirectory(4, 10, 2, _dir, true); // Removal should fail without the recursive option set to true.

  assert["throws"](function () {
    fs.rmdirSync(_dir);
  }, {
    syscall: 'rmdir'
  });
  assert["throws"](function () {
    fs.rmdirSync(_dir, {
      recursive: false
    });
  }, {
    syscall: 'rmdir'
  }); // Recursive removal should succeed.

  fs.rmdirSync(_dir, {
    recursive: true
  }); // No error should occur if recursive and the directory does not exist.

  fs.rmdirSync(_dir, {
    recursive: true
  }); // Attempted removal should fail now because the directory is gone.

  assert["throws"](function () {
    return fs.rmdirSync(_dir);
  }, {
    syscall: 'rmdir'
  });
} // Test the Promises based version.

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var dir;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dir = nextDirPath();
          makeNonEmptyDirectory(4, 10, 2, dir, true); // Removal should fail without the recursive option set to true.

          assert.rejects(fs.promises.rmdir(dir), {
            syscall: 'rmdir'
          });
          assert.rejects(fs.promises.rmdir(dir, {
            recursive: false
          }), {
            syscall: 'rmdir'
          }); // Recursive removal should succeed.

          _context.next = 6;
          return fs.promises.rmdir(dir, {
            recursive: true
          });

        case 6:
          _context.next = 8;
          return fs.promises.rmdir(dir, {
            recursive: true
          });

        case 8:
          // Attempted removal should fail now because the directory is gone.
          assert.rejects(fs.promises.rmdir(dir), {
            syscall: 'rmdir'
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))(); // Test input validation.

{
  var defaults = {
    retryDelay: 100,
    maxRetries: 0,
    recursive: false
  };
  var modified = {
    retryDelay: 953,
    maxRetries: 5,
    recursive: true
  };
  assert.deepStrictEqual(validateRmdirOptions(), defaults);
  assert.deepStrictEqual(validateRmdirOptions({}), defaults);
  assert.deepStrictEqual(validateRmdirOptions(modified), modified);
  assert.deepStrictEqual(validateRmdirOptions({
    maxRetries: 99
  }), {
    retryDelay: 100,
    maxRetries: 99,
    recursive: false
  });
  [null, 'foo', 5, NaN].forEach(function (bad) {
    assert["throws"](function () {
      validateRmdirOptions(bad);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: /^The "options" argument must be of type object\./
    });
  });
  [undefined, null, 'foo', Infinity, function () {}].forEach(function (bad) {
    assert["throws"](function () {
      validateRmdirOptions({
        recursive: bad
      });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: /^The "recursive" argument must be of type boolean\./
    });
  });
  assert["throws"](function () {
    validateRmdirOptions({
      retryDelay: -1
    });
  }, {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: /^The value of "retryDelay" is out of range\./
  });
  assert["throws"](function () {
    validateRmdirOptions({
      maxRetries: -1
    });
  }, {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: /^The value of "maxRetries" is out of range\./
  });
}