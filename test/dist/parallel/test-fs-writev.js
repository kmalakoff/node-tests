'use strict';

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف';

var getFileName = function getFileName(i) {
  return path.join(tmpdir.path, "writev_".concat(i, ".txt"));
};
/**
 * Testing with a array of buffers input
 */
// fs.writev with array of buffers with all parameters


{
  var filename = getFileName(1);
  var fd = fs.openSync(filename, 'w');
  var buffer = Buffer.from(expected);
  var bufferArr = [buffer, buffer];
  var done = common.mustCall(function (err, written, buffers) {
    assert.ifError(err);
    assert.deepStrictEqual(bufferArr, buffers);
    var expectedLength = bufferArr.length * buffer.byteLength;
    assert.deepStrictEqual(written, expectedLength);
    fs.closeSync(fd);
    assert(Buffer.concat(bufferArr).equals(fs.readFileSync(filename)));
  });
  fs.writev(fd, bufferArr, null, done);
} // fs.writev with array of buffers without position

{
  var _filename = getFileName(2);

  var _fd = fs.openSync(_filename, 'w');

  var _buffer = Buffer.from(expected);

  var _bufferArr = [_buffer, _buffer];

  var _done = common.mustCall(function (err, written, buffers) {
    assert.ifError(err);
    assert.deepStrictEqual(_bufferArr, buffers);
    var expectedLength = _bufferArr.length * _buffer.byteLength;
    assert.deepStrictEqual(written, expectedLength);
    fs.closeSync(_fd);
    assert(Buffer.concat(_bufferArr).equals(fs.readFileSync(_filename)));
  });

  fs.writev(_fd, _bufferArr, _done);
}
/**
 * Testing with wrong input types
 */

{
  var _filename2 = getFileName(3);

  var _fd2 = fs.openSync(_filename2, 'w');

  [false, 'test', {}, [{}], ['sdf'], null, undefined].forEach(function (i) {
    assert["throws"](function () {
      return fs.writev(_fd2, i, null, common.mustNotCall());
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    });
  });
  fs.closeSync(_fd2);
} // fs.writev with wrong fd types

[false, 'test', {}, [{}], null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.writev(i, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});