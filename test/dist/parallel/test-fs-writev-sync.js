'use strict';

require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف';

var getFileName = function getFileName(i) {
  return path.join(tmpdir.path, "writev_sync_".concat(i, ".txt"));
};
/**
 * Testing with a array of buffers input
 */
// fs.writevSync with array of buffers with all parameters


{
  var filename = getFileName(1);
  var fd = fs.openSync(filename, 'w');
  var buffer = Buffer.from(expected);
  var bufferArr = [buffer, buffer];
  var expectedLength = bufferArr.length * buffer.byteLength;
  var written = fs.writevSync(fd, [Buffer.from('')], null);
  assert.deepStrictEqual(written, 0);
  written = fs.writevSync(fd, bufferArr, null);
  assert.deepStrictEqual(written, expectedLength);
  fs.closeSync(fd);
  assert(Buffer.concat(bufferArr).equals(fs.readFileSync(filename)));
} // fs.writevSync with array of buffers without position

{
  var _filename = getFileName(2);

  var _fd = fs.openSync(_filename, 'w');

  var _buffer = Buffer.from(expected);

  var _bufferArr = [_buffer, _buffer, _buffer];

  var _expectedLength = _bufferArr.length * _buffer.byteLength;

  var _written = fs.writevSync(_fd, [Buffer.from('')]);

  assert.deepStrictEqual(_written, 0);
  _written = fs.writevSync(_fd, _bufferArr);
  assert.deepStrictEqual(_written, _expectedLength);
  fs.closeSync(_fd);
  assert(Buffer.concat(_bufferArr).equals(fs.readFileSync(_filename)));
}
/**
 * Testing with wrong input types
 */

{
  var _filename2 = getFileName(3);

  var _fd2 = fs.openSync(_filename2, 'w');

  [false, 'test', {}, [{}], ['sdf'], null, undefined].forEach(function (i) {
    assert["throws"](function () {
      return fs.writevSync(_fd2, i, null);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    });
  });
  fs.closeSync(_fd2);
} // fs.writevSync with wrong fd types

[false, 'test', {}, [{}], null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.writevSync(i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});