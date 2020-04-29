'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncIterator"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

var testDir = tmpdir.path;
var files = ['empty', 'files', 'for', 'just', 'testing']; // Make sure tmp directory is clean

tmpdir.refresh(); // Create the necessary files

files.forEach(function (filename) {
  fs.closeSync(fs.openSync(path.join(testDir, filename), 'w'));
});

function assertDirent(dirent) {
  assert(dirent instanceof fs.Dirent);
  assert.strictEqual(dirent.isFile(), true);
  assert.strictEqual(dirent.isDirectory(), false);
  assert.strictEqual(dirent.isSocket(), false);
  assert.strictEqual(dirent.isBlockDevice(), false);
  assert.strictEqual(dirent.isCharacterDevice(), false);
  assert.strictEqual(dirent.isFIFO(), false);
  assert.strictEqual(dirent.isSymbolicLink(), false);
}

var dirclosedError = {
  code: 'ERR_DIR_CLOSED'
};
var invalidCallbackObj = {
  code: 'ERR_INVALID_CALLBACK',
  name: 'TypeError'
}; // Check the opendir Sync version

{
  var dir = fs.opendirSync(testDir);
  var entries = files.map(function () {
    var dirent = dir.readSync();
    assertDirent(dirent);
    return dirent.name;
  });
  assert.deepStrictEqual(files, entries.sort()); // dir.read should return null when no more entries exist

  assert.strictEqual(dir.readSync(), null); // check .path

  assert.strictEqual(dir.path, testDir);
  dir.closeSync();
  assert["throws"](function () {
    return dir.readSync();
  }, dirclosedError);
  assert["throws"](function () {
    return dir.closeSync();
  }, dirclosedError);
} // Check the opendir async version

fs.opendir(testDir, common.mustCall(function (err, dir) {
  assert.ifError(err);
  var sync = true;
  dir.read(common.mustCall(function (err, dirent) {
    assert(!sync);
    assert.ifError(err); // Order is operating / file system dependent

    assert(files.includes(dirent.name), "'files' should include ".concat(dirent));
    assertDirent(dirent);
    var syncInner = true;
    dir.read(common.mustCall(function (err, dirent) {
      assert(!syncInner);
      assert.ifError(err);
      dir.close(common.mustCall(function (err) {
        assert.ifError(err);
      }));
    }));
    syncInner = false;
  }));
  sync = false;
})); // opendir() on file should throw ENOTDIR

assert["throws"](function () {
  fs.opendirSync(__filename);
}, /Error: ENOTDIR: not a directory/);
assert["throws"](function () {
  fs.opendir(__filename);
}, /TypeError \[ERR_INVALID_CALLBACK\]: Callback must be a function/);
fs.opendir(__filename, common.mustCall(function (e) {
  assert.strictEqual(e.code, 'ENOTDIR');
}));
[false, 1, [], {}, null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.opendir(i, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.opendirSync(i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
}); // Promise-based tests

function doPromiseTest() {
  return _doPromiseTest.apply(this, arguments);
}

function _doPromiseTest() {
  _doPromiseTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var dir, entries, i, dirent;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fs.promises.opendir(testDir);

          case 2:
            dir = _context.sent;
            entries = [];
            i = files.length;

          case 5:
            if (!i--) {
              _context.next = 13;
              break;
            }

            _context.next = 8;
            return dir.read();

          case 8:
            dirent = _context.sent;
            entries.push(dirent.name);
            assertDirent(dirent);
            _context.next = 5;
            break;

          case 13:
            assert.deepStrictEqual(files, entries.sort()); // dir.read should return null when no more entries exist

            _context.t0 = assert;
            _context.next = 17;
            return dir.read();

          case 17:
            _context.t1 = _context.sent;

            _context.t0.strictEqual.call(_context.t0, _context.t1, null);

            _context.next = 21;
            return dir.close();

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _doPromiseTest.apply(this, arguments);
}

doPromiseTest().then(common.mustCall()); // Async iterator

function doAsyncIterTest() {
  return _doAsyncIterTest.apply(this, arguments);
}

function _doAsyncIterTest() {
  _doAsyncIterTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var entries, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, dirent;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            entries = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _context2.prev = 3;
            _context2.t0 = _asyncIterator2["default"];
            _context2.next = 7;
            return fs.promises.opendir(testDir);

          case 7:
            _context2.t1 = _context2.sent;
            _iterator = (0, _context2.t0)(_context2.t1);

          case 9:
            _context2.next = 11;
            return _iterator.next();

          case 11:
            _step = _context2.sent;
            _iteratorNormalCompletion = _step.done;
            _context2.next = 15;
            return _step.value;

          case 15:
            _value = _context2.sent;

            if (_iteratorNormalCompletion) {
              _context2.next = 23;
              break;
            }

            dirent = _value;
            entries.push(dirent.name);
            assertDirent(dirent);

          case 20:
            _iteratorNormalCompletion = true;
            _context2.next = 9;
            break;

          case 23:
            _context2.next = 29;
            break;

          case 25:
            _context2.prev = 25;
            _context2.t2 = _context2["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context2.t2;

          case 29:
            _context2.prev = 29;
            _context2.prev = 30;

            if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
              _context2.next = 34;
              break;
            }

            _context2.next = 34;
            return _iterator["return"]();

          case 34:
            _context2.prev = 34;

            if (!_didIteratorError) {
              _context2.next = 37;
              break;
            }

            throw _iteratorError;

          case 37:
            return _context2.finish(34);

          case 38:
            return _context2.finish(29);

          case 39:
            assert.deepStrictEqual(files, entries.sort()); // Automatically closed during iterator

          case 40:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 25, 29, 39], [30,, 34, 38]]);
  }));
  return _doAsyncIterTest.apply(this, arguments);
}

doAsyncIterTest().then(common.mustCall()); // Async iterators should do automatic cleanup

function doAsyncIterBreakTest() {
  return _doAsyncIterBreakTest.apply(this, arguments);
}

function _doAsyncIterBreakTest() {
  _doAsyncIterBreakTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var dir, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, dirent;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return fs.promises.opendir(testDir);

          case 2:
            dir = _context4.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _context4.prev = 5;
            _iterator2 = (0, _asyncIterator2["default"])(dir);

          case 7:
            _context4.next = 9;
            return _iterator2.next();

          case 9:
            _step2 = _context4.sent;
            _iteratorNormalCompletion2 = _step2.done;
            _context4.next = 13;
            return _step2.value;

          case 13:
            _value2 = _context4.sent;

            if (_iteratorNormalCompletion2) {
              _context4.next = 20;
              break;
            }

            dirent = _value2;
            return _context4.abrupt("break", 20);

          case 17:
            _iteratorNormalCompletion2 = true;
            _context4.next = 7;
            break;

          case 20:
            _context4.next = 26;
            break;

          case 22:
            _context4.prev = 22;
            _context4.t0 = _context4["catch"](5);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t0;

          case 26:
            _context4.prev = 26;
            _context4.prev = 27;

            if (!(!_iteratorNormalCompletion2 && _iterator2["return"] != null)) {
              _context4.next = 31;
              break;
            }

            _context4.next = 31;
            return _iterator2["return"]();

          case 31:
            _context4.prev = 31;

            if (!_didIteratorError2) {
              _context4.next = 34;
              break;
            }

            throw _iteratorError2;

          case 34:
            return _context4.finish(31);

          case 35:
            return _context4.finish(26);

          case 36:
            _context4.next = 38;
            return assert.rejects( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      return _context3.abrupt("return", dir.read());

                    case 1:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })), dirclosedError);

          case 38:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[5, 22, 26, 36], [27,, 31, 35]]);
  }));
  return _doAsyncIterBreakTest.apply(this, arguments);
}

doAsyncIterBreakTest().then(common.mustCall());

function doAsyncIterReturnTest() {
  return _doAsyncIterReturnTest.apply(this, arguments);
}

function _doAsyncIterReturnTest() {
  _doAsyncIterReturnTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var dir;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return fs.promises.opendir(testDir);

          case 2:
            dir = _context7.sent;
            _context7.next = 5;
            return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
              var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value3, dirent;

              return _regenerator["default"].wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _iteratorNormalCompletion3 = true;
                      _didIteratorError3 = false;
                      _context5.prev = 2;
                      _iterator3 = (0, _asyncIterator2["default"])(dir);

                    case 4:
                      _context5.next = 6;
                      return _iterator3.next();

                    case 6:
                      _step3 = _context5.sent;
                      _iteratorNormalCompletion3 = _step3.done;
                      _context5.next = 10;
                      return _step3.value;

                    case 10:
                      _value3 = _context5.sent;

                      if (_iteratorNormalCompletion3) {
                        _context5.next = 17;
                        break;
                      }

                      dirent = _value3;
                      return _context5.abrupt("return");

                    case 14:
                      _iteratorNormalCompletion3 = true;
                      _context5.next = 4;
                      break;

                    case 17:
                      _context5.next = 23;
                      break;

                    case 19:
                      _context5.prev = 19;
                      _context5.t0 = _context5["catch"](2);
                      _didIteratorError3 = true;
                      _iteratorError3 = _context5.t0;

                    case 23:
                      _context5.prev = 23;
                      _context5.prev = 24;

                      if (!(!_iteratorNormalCompletion3 && _iterator3["return"] != null)) {
                        _context5.next = 28;
                        break;
                      }

                      _context5.next = 28;
                      return _iterator3["return"]();

                    case 28:
                      _context5.prev = 28;

                      if (!_didIteratorError3) {
                        _context5.next = 31;
                        break;
                      }

                      throw _iteratorError3;

                    case 31:
                      return _context5.finish(28);

                    case 32:
                      return _context5.finish(23);

                    case 33:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee5, null, [[2, 19, 23, 33], [24,, 28, 32]]);
            }))();

          case 5:
            _context7.next = 7;
            return assert.rejects( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
              return _regenerator["default"].wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      return _context6.abrupt("return", dir.read());

                    case 1:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, _callee6);
            })), dirclosedError);

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _doAsyncIterReturnTest.apply(this, arguments);
}

doAsyncIterReturnTest().then(common.mustCall());

function doAsyncIterThrowTest() {
  return _doAsyncIterThrowTest.apply(this, arguments);
}

function _doAsyncIterThrowTest() {
  _doAsyncIterThrowTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var dir, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _value4, dirent;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return fs.promises.opendir(testDir);

          case 2:
            dir = _context9.sent;
            _context9.prev = 3;
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _context9.prev = 6;
            _iterator4 = (0, _asyncIterator2["default"])(dir);

          case 8:
            _context9.next = 10;
            return _iterator4.next();

          case 10:
            _step4 = _context9.sent;
            _iteratorNormalCompletion4 = _step4.done;
            _context9.next = 14;
            return _step4.value;

          case 14:
            _value4 = _context9.sent;

            if (_iteratorNormalCompletion4) {
              _context9.next = 21;
              break;
            }

            dirent = _value4;
            throw new Error('oh no');

          case 18:
            _iteratorNormalCompletion4 = true;
            _context9.next = 8;
            break;

          case 21:
            _context9.next = 27;
            break;

          case 23:
            _context9.prev = 23;
            _context9.t0 = _context9["catch"](6);
            _didIteratorError4 = true;
            _iteratorError4 = _context9.t0;

          case 27:
            _context9.prev = 27;
            _context9.prev = 28;

            if (!(!_iteratorNormalCompletion4 && _iterator4["return"] != null)) {
              _context9.next = 32;
              break;
            }

            _context9.next = 32;
            return _iterator4["return"]();

          case 32:
            _context9.prev = 32;

            if (!_didIteratorError4) {
              _context9.next = 35;
              break;
            }

            throw _iteratorError4;

          case 35:
            return _context9.finish(32);

          case 36:
            return _context9.finish(27);

          case 37:
            _context9.next = 43;
            break;

          case 39:
            _context9.prev = 39;
            _context9.t1 = _context9["catch"](3);

            if (!(_context9.t1.message !== 'oh no')) {
              _context9.next = 43;
              break;
            }

            throw _context9.t1;

          case 43:
            _context9.next = 45;
            return assert.rejects( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
              return _regenerator["default"].wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      return _context8.abrupt("return", dir.read());

                    case 1:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _callee8);
            })), dirclosedError);

          case 45:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[3, 39], [6, 23, 27, 37], [28,, 32, 36]]);
  }));
  return _doAsyncIterThrowTest.apply(this, arguments);
}

doAsyncIterThrowTest().then(common.mustCall()); // Check error thrown on invalid values of bufferSize

var _loop = function _loop() {
  var bufferSize = _arr[_i];
  assert["throws"](function () {
    return fs.opendirSync(testDir, {
      bufferSize: bufferSize
    });
  }, {
    code: 'ERR_OUT_OF_RANGE'
  });
};

for (var _i = 0, _arr = [-1, 0, 0.5, 1.5, Infinity, NaN]; _i < _arr.length; _i++) {
  _loop();
}

var _loop2 = function _loop2() {
  var bufferSize = _arr2[_i2];
  assert["throws"](function () {
    return fs.opendirSync(testDir, {
      bufferSize: bufferSize
    });
  }, {
    code: 'ERR_INVALID_ARG_TYPE'
  });
};

for (var _i2 = 0, _arr2 = ['', '1', null]; _i2 < _arr2.length; _i2++) {
  _loop2();
} // Check that passing a positive integer as bufferSize works


{
  var _dir = fs.opendirSync(testDir, {
    bufferSize: 1024
  });

  assertDirent(_dir.readSync());

  _dir.close();
} // Check that when passing a string instead of function - throw an exception

function doAsyncIterInvalidCallbackTest() {
  return _doAsyncIterInvalidCallbackTest.apply(this, arguments);
}

function _doAsyncIterInvalidCallbackTest() {
  _doAsyncIterInvalidCallbackTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var dir;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return fs.promises.opendir(testDir);

          case 2:
            dir = _context10.sent;
            assert["throws"](function () {
              return dir.close('not function');
            }, invalidCallbackObj);

          case 4:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _doAsyncIterInvalidCallbackTest.apply(this, arguments);
}

doAsyncIterInvalidCallbackTest().then(common.mustCall()); // Check if directory already closed - throw an exception

function doAsyncIterDirClosedTest() {
  return _doAsyncIterDirClosedTest.apply(this, arguments);
}

function _doAsyncIterDirClosedTest() {
  _doAsyncIterDirClosedTest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var dir;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return fs.promises.opendir(testDir);

          case 2:
            dir = _context11.sent;
            _context11.next = 5;
            return dir.close();

          case 5:
            assert["throws"](function () {
              return dir.close();
            }, dirclosedError);

          case 6:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _doAsyncIterDirClosedTest.apply(this, arguments);
}

doAsyncIterDirClosedTest().then(common.mustCall());