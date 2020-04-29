'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var expected = 'ümlaut. Лорем 運務ホソモ指及 आपको करने विकास 紙読決多密所 أضف';
var exptectedBuff = Buffer.from(expected);
var expectedLength = exptectedBuff.length;
var filename = path.join(tmpdir.path, 'readv_sync.txt');
fs.writeFileSync(filename, exptectedBuff);

var allocateEmptyBuffers = function allocateEmptyBuffers(combinedLength) {
  var bufferArr = []; // Allocate two buffers, each half the size of exptectedBuff

  bufferArr[0] = Buffer.alloc(Math.floor(combinedLength / 2)), bufferArr[1] = Buffer.alloc(combinedLength - bufferArr[0].length);
  return bufferArr;
}; // fs.readvSync with array of buffers with all parameters


{
  var fd = fs.openSync(filename, 'r');
  var bufferArr = allocateEmptyBuffers(exptectedBuff.length);
  var read = fs.readvSync(fd, [Buffer.from('')], 0);
  assert.deepStrictEqual(read, 0);
  read = fs.readvSync(fd, bufferArr, 0);
  assert.deepStrictEqual(read, expectedLength);
  fs.closeSync(fd);
  assert(Buffer.concat(bufferArr).equals(fs.readFileSync(filename)));
} // fs.readvSync with array of buffers without position

{
  var _fd = fs.openSync(filename, 'r');

  var _bufferArr = allocateEmptyBuffers(exptectedBuff.length);

  var _read = fs.readvSync(_fd, [Buffer.from('')]);

  assert.deepStrictEqual(_read, 0);
  _read = fs.readvSync(_fd, _bufferArr);
  assert.deepStrictEqual(_read, expectedLength);
  fs.closeSync(_fd);
  assert(Buffer.concat(_bufferArr).equals(fs.readFileSync(filename)));
}
/**
 * Testing with incorrect arguments
 */

var wrongInputs = [false, 'test', {}, [{}], ['sdf'], null, undefined];
{
  var _fd2 = fs.openSync(filename, 'r');

  wrongInputs.forEach(function (wrongInput) {
    assert["throws"](function () {
      return fs.readvSync(_fd2, wrongInput, null);
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
      return fs.readvSync(wrongInput);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError'
    });
  });
}