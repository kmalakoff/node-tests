'use strict';

var common = require('../common');

var fs = require('fs');

var assert = require('assert');

var fixtures = require('../common/fixtures');

var filepath = fixtures.path('x.txt');
var fd = fs.openSync(filepath, 'r');
var expected = 'xyz\n'; // Error must be thrown with string

assert["throws"](function () {
  return fs.read(fd, expected.length, 0, 'utf-8', common.mustNotCall());
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
  message: 'The "buffer" argument must be an instance of Buffer, ' + 'TypedArray, or DataView. Received type number (4)'
});
[true, null, undefined, function () {}, {}].forEach(function (value) {
  assert["throws"](function () {
    fs.read(value, Buffer.allocUnsafe(expected.length), 0, expected.length, 0, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});
assert["throws"](function () {
  fs.read(fd, Buffer.allocUnsafe(expected.length), -1, expected.length, 0, common.mustNotCall());
}, {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError',
  message: 'The value of "offset" is out of range. It must be >= 0. ' + 'Received -1'
});
assert["throws"](function () {
  fs.read(fd, Buffer.allocUnsafe(expected.length), NaN, expected.length, 0, common.mustNotCall());
}, {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError',
  message: 'The value of "offset" is out of range. It must be an integer. ' + 'Received NaN'
});
assert["throws"](function () {
  fs.read(fd, Buffer.allocUnsafe(expected.length), 0, -1, 0, common.mustNotCall());
}, {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError',
  message: 'The value of "length" is out of range. ' + 'It must be >= 0. Received -1'
});
assert["throws"](function () {
  return fs.readSync(fd, expected.length, 0, 'utf-8');
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
  message: 'The "buffer" argument must be an instance of Buffer, ' + 'TypedArray, or DataView. Received type number (4)'
});
[true, null, undefined, function () {}, {}].forEach(function (value) {
  assert["throws"](function () {
    fs.readSync(value, Buffer.allocUnsafe(expected.length), 0, expected.length, 0);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});
assert["throws"](function () {
  fs.readSync(fd, Buffer.allocUnsafe(expected.length), -1, expected.length, 0);
}, {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError',
  message: 'The value of "offset" is out of range. ' + 'It must be >= 0. Received -1'
});
assert["throws"](function () {
  fs.readSync(fd, Buffer.allocUnsafe(expected.length), NaN, expected.length, 0);
}, {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError',
  message: 'The value of "offset" is out of range. It must be an integer. ' + 'Received NaN'
});
assert["throws"](function () {
  fs.readSync(fd, Buffer.allocUnsafe(expected.length), 0, -1, 0);
}, {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError',
  message: 'The value of "length" is out of range. ' + 'It must be >= 0. Received -1'
});
assert["throws"](function () {
  fs.readSync(fd, Buffer.allocUnsafe(expected.length), 0, expected.length + 1, 0);
}, {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError',
  message: 'The value of "length" is out of range. ' + 'It must be <= 4. Received 5'
});