'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var common = require('../common');

var assert = require('assert');

var tmpdir = require('../common/tmpdir');

var fixtures = require('../common/fixtures');

var path = require('path');

var fs = require('fs');

var fsPromises = fs.promises;
var access = fsPromises.access,
    chmod = fsPromises.chmod,
    chown = fsPromises.chown,
    copyFile = fsPromises.copyFile,
    lchown = fsPromises.lchown,
    link = fsPromises.link,
    lchmod = fsPromises.lchmod,
    lstat = fsPromises.lstat,
    mkdir = fsPromises.mkdir,
    mkdtemp = fsPromises.mkdtemp,
    open = fsPromises.open,
    readFile = fsPromises.readFile,
    readdir = fsPromises.readdir,
    readlink = fsPromises.readlink,
    realpath = fsPromises.realpath,
    rename = fsPromises.rename,
    rmdir = fsPromises.rmdir,
    stat = fsPromises.stat,
    symlink = fsPromises.symlink,
    truncate = fsPromises.truncate,
    unlink = fsPromises.unlink,
    utimes = fsPromises.utimes,
    writeFile = fsPromises.writeFile;
var tmpDir = tmpdir.path;
var dirc = 0;

function nextdir() {
  return "test".concat(++dirc);
} // fs.promises should be enumerable.


assert.strictEqual(Object.prototype.propertyIsEnumerable.call(fs, 'promises'), true);
{
  access(__filename, 0).then(common.mustCall());
  assert.rejects(access('this file does not exist', 0), {
    code: 'ENOENT',
    name: 'Error',
    message: /^ENOENT: no such file or directory, access/
  });
  assert.rejects(access(__filename, 8), {
    code: 'ERR_OUT_OF_RANGE',
    message: /"mode".*must be an integer >= 0 && <= 7\. Received 8$/
  });
  assert.rejects(access(__filename, (0, _defineProperty2["default"])({}, Symbol.toPrimitive, function () {
    return 5;
  })), {
    code: 'ERR_INVALID_ARG_TYPE',
    message: /"mode" argument.+integer\. Received an instance of Object$/
  });
}

function verifyStatObject(stat) {
  assert.strictEqual((0, _typeof2["default"])(stat), 'object');
  assert.strictEqual((0, _typeof2["default"])(stat.dev), 'number');
  assert.strictEqual((0, _typeof2["default"])(stat.mode), 'number');
}

function getHandle(_x) {
  return _getHandle.apply(this, arguments);
}

function _getHandle() {
  _getHandle = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(dest) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return copyFile(fixtures.path('baz.js'), dest);

          case 2:
            _context6.next = 4;
            return access(dest);

          case 4:
            return _context6.abrupt("return", open(dest, 'r+'));

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _getHandle.apply(this, arguments);
}

{
  var doTest = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var dest, handle, _handle, stats, _dest, _handle2, buf, bufLen, ret, _handle3, _buf, _bufLen, _ret, _handle4, _buf2, _bufLen2, _ret2, _handle5, _handle6, newPath, _stats, newLink, newMode, _newPath, _newLink, newDir, newFile, _stats2, list, dir, _stats3, _dir, _stats4, _dir2, _stats5, _dir3, file, _dir4, _dir5, _stats6, _dir6, _stats7, _dir7;

      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              tmpdir.refresh();
              dest = path.resolve(tmpDir, 'baz.js'); // handle is object

              _context5.next = 4;
              return getHandle(dest);

            case 4:
              handle = _context5.sent;
              assert.strictEqual((0, _typeof2["default"])(handle), 'object');
              _context5.next = 8;
              return handle.close();

            case 8:
              _context5.next = 10;
              return getHandle(dest);

            case 10:
              _handle = _context5.sent;
              _context5.next = 13;
              return _handle.stat();

            case 13:
              stats = _context5.sent;
              verifyStatObject(stats);
              assert.strictEqual(stats.size, 35);
              _context5.next = 18;
              return _handle.truncate(1);

            case 18:
              _context5.next = 20;
              return _handle.stat();

            case 20:
              stats = _context5.sent;
              verifyStatObject(stats);
              assert.strictEqual(stats.size, 1);
              _context5.next = 25;
              return stat(dest);

            case 25:
              stats = _context5.sent;
              verifyStatObject(stats);
              _context5.next = 29;
              return _handle.stat();

            case 29:
              stats = _context5.sent;
              verifyStatObject(stats);
              _context5.next = 33;
              return _handle.datasync();

            case 33:
              _context5.next = 35;
              return _handle.sync();

            case 35:
              _context5.next = 37;
              return _handle.close();

            case 37:
              _dest = path.resolve(tmpDir, 'test1.js');
              _context5.next = 40;
              return getHandle(_dest);

            case 40:
              _handle2 = _context5.sent;
              buf = Buffer.from('DAWGS WIN');
              bufLen = buf.length;
              _context5.next = 45;
              return _handle2.write(buf);

            case 45:
              _context5.next = 47;
              return _handle2.read(Buffer.alloc(bufLen), 0, 0, 0);

            case 47:
              ret = _context5.sent;
              assert.strictEqual(ret.bytesRead, 0);
              _context5.next = 51;
              return unlink(_dest);

            case 51:
              _context5.next = 53;
              return _handle2.close();

            case 53:
              _context5.next = 55;
              return getHandle(dest);

            case 55:
              _handle3 = _context5.sent;
              _buf = Buffer.from('hello fsPromises');
              _bufLen = _buf.length;
              _context5.next = 60;
              return _handle3.write(_buf);

            case 60:
              _context5.next = 62;
              return _handle3.read(Buffer.alloc(_bufLen), 0, _bufLen, 0);

            case 62:
              _ret = _context5.sent;
              assert.strictEqual(_ret.bytesRead, _bufLen);
              assert.deepStrictEqual(_ret.buffer, _buf);
              _context5.next = 67;
              return _handle3.close();

            case 67:
              _context5.next = 69;
              return getHandle(dest);

            case 69:
              _handle4 = _context5.sent;
              _buf2 = Buffer.from('hello FileHandle');
              _bufLen2 = _buf2.length;
              _context5.next = 74;
              return _handle4.write(_buf2, 0, _bufLen2, 0);

            case 74:
              _context5.next = 76;
              return _handle4.read(Buffer.alloc(_bufLen2), 0, _bufLen2, 0);

            case 76:
              _ret2 = _context5.sent;
              assert.strictEqual(_ret2.bytesRead, _bufLen2);
              assert.deepStrictEqual(_ret2.buffer, _buf2);
              _context5.next = 81;
              return truncate(dest, 5);

            case 81:
              _context5.t0 = assert;
              _context5.next = 84;
              return readFile(dest);

            case 84:
              _context5.t1 = _context5.sent.toString();

              _context5.t0.deepStrictEqual.call(_context5.t0, _context5.t1, 'hello');

              _context5.next = 88;
              return _handle4.close();

            case 88:
              _context5.next = 90;
              return getHandle(dest);

            case 90:
              _handle5 = _context5.sent;
              _context5.next = 93;
              return chmod(dest, 438);

            case 93:
              _context5.next = 95;
              return _handle5.chmod(438);

            case 95:
              _context5.next = 97;
              return chmod(dest, 4607);

            case 97:
              _context5.next = 99;
              return _handle5.chmod(4607);

            case 99:
              if (common.isWindows) {
                _context5.next = 104;
                break;
              }

              _context5.next = 102;
              return chown(dest, process.getuid(), process.getgid());

            case 102:
              _context5.next = 104;
              return _handle5.chown(process.getuid(), process.getgid());

            case 104:
              assert.rejects( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return chown(dest, 1, -1);

                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })), {
                code: 'ERR_OUT_OF_RANGE',
                name: 'RangeError',
                message: 'The value of "gid" is out of range. ' + 'It must be >= 0 && < 4294967296. Received -1'
              });
              assert.rejects( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _handle5.chown(1, -1);

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })), {
                code: 'ERR_OUT_OF_RANGE',
                name: 'RangeError',
                message: 'The value of "gid" is out of range. ' + 'It must be >= 0 && < 4294967296. Received -1'
              });
              _context5.next = 108;
              return _handle5.close();

            case 108:
              _context5.next = 110;
              return getHandle(dest);

            case 110:
              _handle6 = _context5.sent;
              _context5.next = 113;
              return utimes(dest, new Date(), new Date());

            case 113:
              _context5.prev = 113;
              _context5.next = 116;
              return _handle6.utimes(new Date(), new Date());

            case 116:
              _context5.next = 121;
              break;

            case 118:
              _context5.prev = 118;
              _context5.t2 = _context5["catch"](113);
              // Some systems do not have futimes. If there is an error,
              // expect it to be ENOSYS
              common.expectsError({
                code: 'ENOSYS',
                name: 'Error'
              })(_context5.t2);

            case 121:
              _context5.next = 123;
              return _handle6.close();

            case 123:
              newPath = path.resolve(tmpDir, 'baz2.js');
              _context5.next = 126;
              return rename(dest, newPath);

            case 126:
              _context5.next = 128;
              return stat(newPath);

            case 128:
              _stats = _context5.sent;
              verifyStatObject(_stats);

              if (!common.canCreateSymLink()) {
                _context5.next = 167;
                break;
              }

              newLink = path.resolve(tmpDir, 'baz3.js');
              _context5.next = 134;
              return symlink(newPath, newLink);

            case 134:
              if (common.isWindows) {
                _context5.next = 137;
                break;
              }

              _context5.next = 137;
              return lchown(newLink, process.getuid(), process.getgid());

            case 137:
              _context5.next = 139;
              return lstat(newLink);

            case 139:
              _stats = _context5.sent;
              verifyStatObject(_stats);
              _context5.t3 = assert;
              _context5.t4 = newPath.toLowerCase();
              _context5.next = 145;
              return realpath(newLink);

            case 145:
              _context5.t5 = _context5.sent.toLowerCase();

              _context5.t3.strictEqual.call(_context5.t3, _context5.t4, _context5.t5);

              _context5.t6 = assert;
              _context5.t7 = newPath.toLowerCase();
              _context5.next = 151;
              return readlink(newLink);

            case 151:
              _context5.t8 = _context5.sent.toLowerCase();

              _context5.t6.strictEqual.call(_context5.t6, _context5.t7, _context5.t8);

              newMode = 438;

              if (!common.isOSX) {
                _context5.next = 163;
                break;
              }

              _context5.next = 157;
              return lchmod(newLink, newMode);

            case 157:
              _context5.next = 159;
              return lstat(newLink);

            case 159:
              _stats = _context5.sent;
              assert.strictEqual(_stats.mode & 511, newMode);
              _context5.next = 165;
              break;

            case 163:
              _context5.next = 165;
              return Promise.all([assert.rejects(lchmod(newLink, newMode), common.expectsError({
                code: 'ERR_METHOD_NOT_IMPLEMENTED',
                name: 'Error',
                message: 'The lchmod() method is not implemented'
              }))]);

            case 165:
              _context5.next = 167;
              return unlink(newLink);

            case 167:
              _newPath = path.resolve(tmpDir, 'baz2.js');
              _newLink = path.resolve(tmpDir, 'baz4.js');
              _context5.next = 171;
              return link(_newPath, _newLink);

            case 171:
              _context5.next = 173;
              return unlink(_newLink);

            case 173:
              newDir = path.resolve(tmpDir, 'dir');
              newFile = path.resolve(tmpDir, 'foo.js');
              _context5.next = 177;
              return mkdir(newDir);

            case 177:
              _context5.next = 179;
              return writeFile(newFile, 'DAWGS WIN!', 'utf8');

            case 179:
              _context5.next = 181;
              return stat(newDir);

            case 181:
              _stats2 = _context5.sent;
              assert(_stats2.isDirectory());
              _context5.next = 185;
              return readdir(tmpDir);

            case 185:
              list = _context5.sent;
              assert.notStrictEqual(list.indexOf('dir'), -1);
              assert.notStrictEqual(list.indexOf('foo.js'), -1);
              _context5.next = 190;
              return rmdir(newDir);

            case 190:
              _context5.next = 192;
              return unlink(newFile);

            case 192:
              dir = path.join(tmpDir, nextdir());
              _context5.next = 195;
              return mkdir(dir, 777);

            case 195:
              _context5.next = 197;
              return stat(dir);

            case 197:
              _stats3 = _context5.sent;
              assert(_stats3.isDirectory());
              _dir = path.join(tmpDir, nextdir());
              _context5.next = 202;
              return mkdir(_dir, '777');

            case 202:
              _context5.next = 204;
              return stat(_dir);

            case 204:
              _stats4 = _context5.sent;
              assert(_stats4.isDirectory());
              _dir2 = path.join(tmpDir, nextdir(), nextdir());
              _context5.next = 209;
              return mkdir(_dir2, {
                recursive: true
              });

            case 209:
              _context5.next = 211;
              return stat(_dir2);

            case 211:
              _stats5 = _context5.sent;
              assert(_stats5.isDirectory());
              _dir3 = path.join(tmpDir, nextdir(), nextdir());
              _context5.next = 216;
              return mkdir(path.dirname(_dir3));

            case 216:
              _context5.next = 218;
              return writeFile(_dir3, '');

            case 218:
              assert.rejects(mkdir(_dir3, {
                recursive: true
              }), {
                code: 'EEXIST',
                message: /EEXIST: .*mkdir/,
                name: 'Error',
                syscall: 'mkdir'
              });
              file = path.join(tmpDir, nextdir(), nextdir());
              _dir4 = path.join(file, nextdir(), nextdir());
              _context5.next = 223;
              return mkdir(path.dirname(file));

            case 223:
              _context5.next = 225;
              return writeFile(file, '');

            case 225:
              assert.rejects(mkdir(_dir4, {
                recursive: true
              }), {
                code: 'ENOTDIR',
                message: /ENOTDIR: .*mkdir/,
                name: 'Error',
                syscall: 'mkdir'
              });
              _dir5 = path.resolve(tmpDir, "".concat(nextdir(), "/./").concat(nextdir()));
              _context5.next = 229;
              return mkdir(_dir5, {
                recursive: true
              });

            case 229:
              _context5.next = 231;
              return stat(_dir5);

            case 231:
              _stats6 = _context5.sent;
              assert(_stats6.isDirectory());
              _dir6 = path.resolve(tmpDir, "".concat(nextdir(), "/../").concat(nextdir()));
              _context5.next = 236;
              return mkdir(_dir6, {
                recursive: true
              });

            case 236:
              _context5.next = 238;
              return stat(_dir6);

            case 238:
              _stats7 = _context5.sent;
              assert(_stats7.isDirectory());
              _dir7 = path.join(tmpDir, nextdir(), nextdir());
              ['', 1, {}, [], null, Symbol('test'), function () {}].forEach(function (recursive) {
                assert.rejects(
                /*#__PURE__*/
                // mkdir() expects to get a boolean value for options.recursive.
                (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                  return _regenerator["default"].wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          return _context3.abrupt("return", mkdir(_dir7, {
                            recursive: recursive
                          }));

                        case 1:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                })), {
                  code: 'ERR_INVALID_ARG_TYPE',
                  name: 'TypeError'
                });
              });
              _context5.next = 244;
              return mkdtemp(path.resolve(tmpDir, 'FOO'));

            case 244:
              assert.rejects(
              /*#__PURE__*/
              // mkdtemp() expects to get a string prefix.
              (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        return _context4.abrupt("return", mkdtemp(1));

                      case 1:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })), {
                code: 'ERR_INVALID_ARG_TYPE',
                name: 'TypeError'
              });

            case 245:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[113, 118]]);
    }));

    return function doTest() {
      return _ref.apply(this, arguments);
    };
  }();

  doTest().then(common.mustCall());
}