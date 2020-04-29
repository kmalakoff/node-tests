'use strict';

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف';
var cnt = 0;

var getFileName = function getFileName() {
  return path.join(tmpdir.path, "readv_".concat(++cnt, ".txt"));
};

var exptectedBuff = Buffer.from(expected);

var allocateEmptyBuffers = function allocateEmptyBuffers(combinedLength) {
  var bufferArr = []; // Allocate two buffers, each half the size of exptectedBuff

  bufferArr[0] = Buffer.alloc(Math.floor(combinedLength / 2)), bufferArr[1] = Buffer.alloc(combinedLength - bufferArr[0].length);
  return bufferArr;
};

var getCallback = function getCallback(fd, bufferArr) {
  return common.mustCall(function (err, bytesRead, buffers) {
    assert.ifError(err);
    assert.deepStrictEqual(bufferArr, buffers);
    var expectedLength = exptectedBuff.length;
    assert.deepStrictEqual(bytesRead, expectedLength);
    fs.closeSync(fd);
    assert(Buffer.concat(bufferArr).equals(exptectedBuff));
  });
}; // fs.readv with array of buffers with all parameters


{
  var filename = getFileName();
  var fd = fs.openSync(filename, 'w+');
  fs.writeSync(fd, exptectedBuff);
  var bufferArr = allocateEmptyBuffers(exptectedBuff.length);
  var callback = getCallback(fd, bufferArr);
  fs.readv(fd, bufferArr, 0, callback);
} // fs.readv with array of buffers without position

{
  var _filename = getFileName();

  fs.writeFileSync(_filename, exptectedBuff);

  var _fd = fs.openSync(_filename, 'r');

  var _bufferArr = allocateEmptyBuffers(exptectedBuff.length);

  var _callback = getCallback(_fd, _bufferArr);

  fs.readv(_fd, _bufferArr, _callback);
}
/**
 * Testing with incorrect arguments
 */

var wrongInputs = [false, 'test', {}, [{}], ['sdf'], null, undefined];
{
  var _filename2 = getFileName(2);

  fs.writeFileSync(_filename2, exptectedBuff);

  var _fd2 = fs.openSync(_filename2, 'r');

  wrongInputs.forEach(function (wrongInput) {
    assert["throws"](function () {
      return fs.readv(_fd2, wrongInput, null, common.mustNotCall());
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    });
  });
  fs.closeSync(_fd2);
}
{
  // fs.readv with wrong fd argument
  wrongInputs.forEach(function (wrongInput) {
    assert["throws"](function () {
      return fs.readv(wrongInput, common.mustNotCall());
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    });
  });
}