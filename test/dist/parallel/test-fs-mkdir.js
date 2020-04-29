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

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var dirc = 0;

function nextdir() {
  return "test".concat(++dirc);
} // fs.mkdir creates directory using assigned path


{
  var pathname = path.join(tmpdir.path, nextdir());
  fs.mkdir(pathname, common.mustCall(function (err) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(pathname), true);
  }));
} // fs.mkdir creates directory with assigned mode value

{
  var _pathname = path.join(tmpdir.path, nextdir());

  fs.mkdir(_pathname, 511, common.mustCall(function (err) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(_pathname), true);
  }));
} // mkdirSync successfully creates directory from given path

{
  var _pathname2 = path.join(tmpdir.path, nextdir());

  fs.mkdirSync(_pathname2);
  var exists = fs.existsSync(_pathname2);
  assert.strictEqual(exists, true);
} // mkdirSync and mkdir require path to be a string, buffer or url.
// Anything else generates an error.

[false, 1, {}, [], null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.mkdir(i, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.mkdirSync(i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
}); // mkdirpSync when both top-level, and sub-folders do not exist.

{
  var _pathname3 = path.join(tmpdir.path, nextdir(), nextdir());

  fs.mkdirSync(_pathname3, {
    recursive: true
  });

  var _exists = fs.existsSync(_pathname3);

  assert.strictEqual(_exists, true);
  assert.strictEqual(fs.statSync(_pathname3).isDirectory(), true);
} // mkdirpSync when folder already exists.

{
  var _pathname4 = path.join(tmpdir.path, nextdir(), nextdir());

  fs.mkdirSync(_pathname4, {
    recursive: true
  }); // Should not cause an error.

  fs.mkdirSync(_pathname4, {
    recursive: true
  });

  var _exists2 = fs.existsSync(_pathname4);

  assert.strictEqual(_exists2, true);
  assert.strictEqual(fs.statSync(_pathname4).isDirectory(), true);
} // mkdirpSync ../

{
  var _pathname5 = "".concat(tmpdir.path, "/").concat(nextdir(), "/../").concat(nextdir(), "/").concat(nextdir());

  fs.mkdirSync(_pathname5, {
    recursive: true
  });

  var _exists3 = fs.existsSync(_pathname5);

  assert.strictEqual(_exists3, true);
  assert.strictEqual(fs.statSync(_pathname5).isDirectory(), true);
} // mkdirpSync when path is a file.

{
  var _pathname6 = path.join(tmpdir.path, nextdir(), nextdir());

  fs.mkdirSync(path.dirname(_pathname6));
  fs.writeFileSync(_pathname6, '', 'utf8');
  assert["throws"](function () {
    fs.mkdirSync(_pathname6, {
      recursive: true
    });
  }, {
    code: 'EEXIST',
    message: /EEXIST: .*mkdir/,
    name: 'Error',
    syscall: 'mkdir'
  });
} // mkdirpSync when part of the path is a file.

{
  var filename = path.join(tmpdir.path, nextdir(), nextdir());

  var _pathname7 = path.join(filename, nextdir(), nextdir());

  fs.mkdirSync(path.dirname(filename));
  fs.writeFileSync(filename, '', 'utf8');
  assert["throws"](function () {
    fs.mkdirSync(_pathname7, {
      recursive: true
    });
  }, {
    code: 'ENOTDIR',
    message: /ENOTDIR: .*mkdir/,
    name: 'Error',
    syscall: 'mkdir',
    path: _pathname7 // See: https://github.com/nodejs/node/issues/28015

  });
} // `mkdirp` when folder does not yet exist.

{
  var _pathname8 = path.join(tmpdir.path, nextdir(), nextdir());

  fs.mkdir(_pathname8, {
    recursive: true
  }, common.mustCall(function (err) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(_pathname8), true);
    assert.strictEqual(fs.statSync(_pathname8).isDirectory(), true);
  }));
} // `mkdirp` when path is a file.

{
  var _pathname9 = path.join(tmpdir.path, nextdir(), nextdir());

  fs.mkdirSync(path.dirname(_pathname9));
  fs.writeFileSync(_pathname9, '', 'utf8');
  fs.mkdir(_pathname9, {
    recursive: true
  }, common.mustCall(function (err) {
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.syscall, 'mkdir');
    assert.strictEqual(fs.statSync(_pathname9).isDirectory(), false);
  }));
} // `mkdirp` when part of the path is a file.

{
  var _filename = path.join(tmpdir.path, nextdir(), nextdir());

  var _pathname10 = path.join(_filename, nextdir(), nextdir());

  fs.mkdirSync(path.dirname(_filename));
  fs.writeFileSync(_filename, '', 'utf8');
  fs.mkdir(_pathname10, {
    recursive: true
  }, common.mustCall(function (err) {
    assert.strictEqual(err.code, 'ENOTDIR');
    assert.strictEqual(err.syscall, 'mkdir');
    assert.strictEqual(fs.existsSync(_pathname10), false); // See: https://github.com/nodejs/node/issues/28015
    // The path field varies slightly in Windows errors, vs., other platforms
    // see: https://github.com/libuv/libuv/issues/2661, for this reason we
    // use startsWith() rather than comparing to the full "pathname".

    assert(err.path.startsWith(_filename));
  }));
} // mkdirpSync dirname loop
// XXX: windows and smartos have issues removing a directory that you're in.

if (common.isMainThread && (common.isLinux || common.isOSX)) {
  var _pathname11 = path.join(tmpdir.path, nextdir());

  fs.mkdirSync(_pathname11);
  process.chdir(_pathname11);
  fs.rmdirSync(_pathname11);
  assert["throws"](function () {
    fs.mkdirSync('X', {
      recursive: true
    });
  }, {
    code: 'ENOENT',
    message: /ENOENT: .*mkdir/,
    name: 'Error',
    syscall: 'mkdir'
  });
  fs.mkdir('X', {
    recursive: true
  }, function (err) {
    assert.strictEqual(err.code, 'ENOENT');
    assert.strictEqual(err.syscall, 'mkdir');
  });
} // mkdirSync and mkdir require options.recursive to be a boolean.
// Anything else generates an error.


{
  var _pathname12 = path.join(tmpdir.path, nextdir());

  ['', 1, {}, [], null, Symbol('test'), function () {}].forEach(function (recursive) {
    var received = common.invalidArgTypeHelper(recursive);
    assert["throws"](function () {
      return fs.mkdir(_pathname12, {
        recursive: recursive
      }, common.mustNotCall());
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "options.recursive" property must be of type boolean.' + received
    });
    assert["throws"](function () {
      return fs.mkdirSync(_pathname12, {
        recursive: recursive
      });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "options.recursive" property must be of type boolean.' + received
    });
  });
} // `mkdirp` returns first folder created, when all folders are new.

{
  var dir1 = nextdir();
  var dir2 = nextdir();
  var firstPathCreated = path.join(tmpdir.path, dir1);

  var _pathname13 = path.join(tmpdir.path, dir1, dir2);

  fs.mkdir(_pathname13, {
    recursive: true
  }, common.mustCall(function (err, path) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(_pathname13), true);
    assert.strictEqual(fs.statSync(_pathname13).isDirectory(), true);
    assert.strictEqual(path, firstPathCreated);
  }));
} // `mkdirp` returns first folder created, when last folder is new.

{
  var _dir = nextdir();

  var _dir2 = nextdir();

  var _pathname14 = path.join(tmpdir.path, _dir, _dir2);

  fs.mkdirSync(path.join(tmpdir.path, _dir));
  fs.mkdir(_pathname14, {
    recursive: true
  }, common.mustCall(function (err, path) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(_pathname14), true);
    assert.strictEqual(fs.statSync(_pathname14).isDirectory(), true);
    assert.strictEqual(path, _pathname14);
  }));
} // `mkdirp` returns undefined, when no new folders are created.

{
  var _dir3 = nextdir();

  var _dir4 = nextdir();

  var _pathname15 = path.join(tmpdir.path, _dir3, _dir4);

  fs.mkdirSync(path.join(tmpdir.path, _dir3, _dir4), {
    recursive: true
  });
  fs.mkdir(_pathname15, {
    recursive: true
  }, common.mustCall(function (err, path) {
    assert.strictEqual(err, null);
    assert.strictEqual(fs.existsSync(_pathname15), true);
    assert.strictEqual(fs.statSync(_pathname15).isDirectory(), true);
    assert.strictEqual(path, undefined);
  }));
} // `mkdirp.sync` returns first folder created, when all folders are new.

{
  var _dir5 = nextdir();

  var _dir6 = nextdir();

  var _firstPathCreated = path.join(tmpdir.path, _dir5);

  var _pathname16 = path.join(tmpdir.path, _dir5, _dir6);

  var p = fs.mkdirSync(_pathname16, {
    recursive: true
  });
  assert.strictEqual(fs.existsSync(_pathname16), true);
  assert.strictEqual(fs.statSync(_pathname16).isDirectory(), true);
  assert.strictEqual(p, _firstPathCreated);
} // `mkdirp.sync` returns first folder created, when last folder is new.

{
  var _dir7 = nextdir();

  var _dir8 = nextdir();

  var _pathname17 = path.join(tmpdir.path, _dir7, _dir8);

  fs.mkdirSync(path.join(tmpdir.path, _dir7), {
    recursive: true
  });

  var _p = fs.mkdirSync(_pathname17, {
    recursive: true
  });

  assert.strictEqual(fs.existsSync(_pathname17), true);
  assert.strictEqual(fs.statSync(_pathname17).isDirectory(), true);
  assert.strictEqual(_p, _pathname17);
} // `mkdirp.sync` returns undefined, when no new folders are created.

{
  var _dir9 = nextdir();

  var _dir10 = nextdir();

  var _pathname18 = path.join(tmpdir.path, _dir9, _dir10);

  fs.mkdirSync(path.join(tmpdir.path, _dir9, _dir10), {
    recursive: true
  });

  var _p2 = fs.mkdirSync(_pathname18, {
    recursive: true
  });

  assert.strictEqual(fs.existsSync(_pathname18), true);
  assert.strictEqual(fs.statSync(_pathname18).isDirectory(), true);
  assert.strictEqual(_p2, undefined);
} // `mkdirp.promises` returns first folder created, when all folders are new.

{
  var testCase = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var p;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fs.promises.mkdir(_pathname19, {
                recursive: true
              });

            case 2:
              p = _context.sent;
              assert.strictEqual(fs.existsSync(_pathname19), true);
              assert.strictEqual(fs.statSync(_pathname19).isDirectory(), true);
              assert.strictEqual(p, _firstPathCreated2);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function testCase() {
      return _ref.apply(this, arguments);
    };
  }();

  var _dir11 = nextdir();

  var _dir12 = nextdir();

  var _firstPathCreated2 = path.join(tmpdir.path, _dir11);

  var _pathname19 = path.join(tmpdir.path, _dir11, _dir12);

  testCase();
} // Keep the event loop alive so the async mkdir() requests
// have a chance to run (since they don't ref the event loop).

process.nextTick(function () {});