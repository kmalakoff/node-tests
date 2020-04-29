'use strict';

var common = require('../common');

var assert = require('assert');

var util = require('util');

var fs = require('fs');

var promises = fs.promises;
var f = __filename; // This test ensures that input for lchmod is valid, testing for valid
// inputs for path, mode and callback

if (!common.isOSX) {
  common.skip('lchmod is only available on macOS');
} // Check callback


assert["throws"](function () {
  return fs.lchmod(f);
}, {
  code: 'ERR_INVALID_CALLBACK'
});
assert["throws"](function () {
  return fs.lchmod();
}, {
  code: 'ERR_INVALID_CALLBACK'
});
assert["throws"](function () {
  return fs.lchmod(f, {});
}, {
  code: 'ERR_INVALID_CALLBACK'
}); // Check path

[false, 1, {}, [], null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.lchmod(i, 511, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.lchmodSync(i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
}); // Check mode

[false, null, undefined, {}, [], '', '123x'].forEach(function (input) {
  var errObj = {
    code: 'ERR_INVALID_ARG_VALUE',
    name: 'TypeError',
    message: 'The argument \'mode\' must be a 32-bit unsigned integer or an ' + "octal string. Received ".concat(util.inspect(input))
  };
  assert.rejects(promises.lchmod(f, input, function () {}), errObj);
  assert["throws"](function () {
    return fs.lchmodSync(f, input);
  }, errObj);
});
[-1, Math.pow(2, 32)].forEach(function (input) {
  var errObj = {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "mode" is out of range. It must be >= 0 && <= ' + "4294967295. Received ".concat(input)
  };
  assert.rejects(promises.lchmod(f, input, function () {}), errObj);
  assert["throws"](function () {
    return fs.lchmodSync(f, input);
  }, errObj);
});