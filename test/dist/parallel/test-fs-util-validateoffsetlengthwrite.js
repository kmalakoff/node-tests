// Flags: --expose-internals
'use strict';

require('../common');

var assert = require('assert');

var _require = require('internal/fs/utils'),
    validateOffsetLengthWrite = _require.validateOffsetLengthWrite; // Most platforms don't allow reads or writes >= 2 GB.
// See https://github.com/libuv/libuv/pull/1501.


var kIoMaxLength = Math.pow(2, 31) - 1; // RangeError when offset > byteLength

{
  var offset = 100;
  var length = 100;
  var byteLength = 50;
  assert["throws"](function () {
    return validateOffsetLengthWrite(offset, length, byteLength);
  }, {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "offset" is out of range. ' + "It must be <= ".concat(byteLength, ". Received ").concat(offset)
  });
} // RangeError when byteLength < kIoMaxLength, and length > byteLength - offset.

{
  var _offset = kIoMaxLength - 150;

  var _length = 200;

  var _byteLength = kIoMaxLength - 100;

  assert["throws"](function () {
    return validateOffsetLengthWrite(_offset, _length, _byteLength);
  }, {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "length" is out of range. ' + "It must be <= ".concat(_byteLength - _offset, ". Received ").concat(_length)
  });
}