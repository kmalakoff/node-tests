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

var join = require('path').join;

var tmpdir = require('../common/tmpdir');

var currentFileData = 'ABCD';
var s = '南越国是前203年至前111年存在于岭南地区的一个国家，国都位于番禺，疆域包括今天中国的广东、' + '广西两省区的大部份地区，福建省、湖南、贵州、云南的一小部份地区和越南的北部。' + '南越国是秦朝灭亡后，由南海郡尉赵佗于前203年起兵兼并桂林郡和象郡后建立。' + '前196年和前179年，南越国曾先后两次名义上臣属于西汉，成为西汉的“外臣”。前112年，' + '南越国末代君主赵建德与西汉发生战争，被汉武帝于前111年所灭。南越国共存在93年，' + '历经五代君主。南越国是岭南地区的第一个有记载的政权国家，采用封建制和郡县制并存的制度，' + '它的建立保证了秦末乱世岭南地区社会秩序的稳定，有效的改善了岭南地区落后的政治、##济现状。\n';
tmpdir.refresh();

var throwNextTick = function throwNextTick(e) {
  process.nextTick(function () {
    throw e;
  });
}; // Test that empty file will be created and have content added (callback API).


{
  var filename = join(tmpdir.path, 'append.txt');
  fs.appendFile(filename, s, common.mustCall(function (e) {
    assert.ifError(e);
    fs.readFile(filename, common.mustCall(function (e, buffer) {
      assert.ifError(e);
      assert.strictEqual(Buffer.byteLength(s), buffer.length);
    }));
  }));
} // Test that empty file will be created and have content added (promise API).

{
  var _filename = join(tmpdir.path, 'append-promise.txt');

  fs.promises.appendFile(_filename, s).then(common.mustCall(function () {
    return fs.promises.readFile(_filename);
  })).then(function (buffer) {
    assert.strictEqual(Buffer.byteLength(s), buffer.length);
  })["catch"](throwNextTick);
} // Test that appends data to a non-empty file (callback API).

{
  var _filename2 = join(tmpdir.path, 'append-non-empty.txt');

  fs.writeFileSync(_filename2, currentFileData);
  fs.appendFile(_filename2, s, common.mustCall(function (e) {
    assert.ifError(e);
    fs.readFile(_filename2, common.mustCall(function (e, buffer) {
      assert.ifError(e);
      assert.strictEqual(Buffer.byteLength(s) + currentFileData.length, buffer.length);
    }));
  }));
} // Test that appends data to a non-empty file (promise API).

{
  var _filename3 = join(tmpdir.path, 'append-non-empty-promise.txt');

  fs.writeFileSync(_filename3, currentFileData);
  fs.promises.appendFile(_filename3, s).then(common.mustCall(function () {
    return fs.promises.readFile(_filename3);
  })).then(function (buffer) {
    assert.strictEqual(Buffer.byteLength(s) + currentFileData.length, buffer.length);
  })["catch"](throwNextTick);
} // Test that appendFile accepts buffers (callback API).

{
  var _filename4 = join(tmpdir.path, 'append-buffer.txt');

  fs.writeFileSync(_filename4, currentFileData);
  var buf = Buffer.from(s, 'utf8');
  fs.appendFile(_filename4, buf, common.mustCall(function (e) {
    assert.ifError(e);
    fs.readFile(_filename4, common.mustCall(function (e, buffer) {
      assert.ifError(e);
      assert.strictEqual(buf.length + currentFileData.length, buffer.length);
    }));
  }));
} // Test that appendFile accepts buffers (promises API).

{
  var _filename5 = join(tmpdir.path, 'append-buffer-promises.txt');

  fs.writeFileSync(_filename5, currentFileData);

  var _buf = Buffer.from(s, 'utf8');

  fs.promises.appendFile(_filename5, _buf).then(common.mustCall(function () {
    return fs.promises.readFile(_filename5);
  })).then(function (buffer) {
    assert.strictEqual(_buf.length + currentFileData.length, buffer.length);
  })["catch"](throwNextTick);
} // Test that appendFile does not accept invalid data type (callback API).

[false, 5, {}, [], null, undefined].forEach( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
    var errObj, filename;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            errObj = {
              code: 'ERR_INVALID_ARG_TYPE',
              message: /"data"|"buffer"/
            };
            filename = join(tmpdir.path, 'append-invalid-data.txt');
            assert["throws"](function () {
              return fs.appendFile(filename, data, common.mustNotCall());
            }, errObj);
            assert["throws"](function () {
              return fs.appendFileSync(filename, data);
            }, errObj);
            _context.next = 6;
            return assert.rejects(fs.promises.appendFile(filename, data), errObj);

          case 6:
            // The filename shouldn't exist if throwing error.
            assert["throws"](function () {
              return fs.statSync(filename);
            }, {
              code: 'ENOENT',
              message: /no such file or directory/
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()); // Test that appendFile accepts file descriptors (callback API).

{
  var _filename6 = join(tmpdir.path, 'append-descriptors.txt');

  fs.writeFileSync(_filename6, currentFileData);
  fs.open(_filename6, 'a+', common.mustCall(function (e, fd) {
    assert.ifError(e);
    fs.appendFile(fd, s, common.mustCall(function (e) {
      assert.ifError(e);
      fs.close(fd, common.mustCall(function (e) {
        assert.ifError(e);
        fs.readFile(_filename6, common.mustCall(function (e, buffer) {
          assert.ifError(e);
          assert.strictEqual(Buffer.byteLength(s) + currentFileData.length, buffer.length);
        }));
      }));
    }));
  }));
} // Test that appendFile accepts file descriptors (promises API).

{
  var _filename7 = join(tmpdir.path, 'append-descriptors-promises.txt');

  fs.writeFileSync(_filename7, currentFileData);
  var fd;
  fs.promises.open(_filename7, 'a+').then(common.mustCall(function (fileDescriptor) {
    fd = fileDescriptor;
    return fs.promises.appendFile(fd, s);
  })).then(common.mustCall(function () {
    return fd.close();
  })).then(common.mustCall(function () {
    return fs.promises.readFile(_filename7);
  })).then(common.mustCall(function (buffer) {
    assert.strictEqual(Buffer.byteLength(s) + currentFileData.length, buffer.length);
  }))["catch"](throwNextTick);
}
assert["throws"](function () {
  return fs.appendFile(join(tmpdir.path, 'append6.txt'), console.log);
}, {
  code: 'ERR_INVALID_CALLBACK'
});