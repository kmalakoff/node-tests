'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

function testFd(input, errObj) {
  assert["throws"](function () {
    return fs.fchown(input);
  }, errObj);
  assert["throws"](function () {
    return fs.fchownSync(input);
  }, errObj);
}

function testUid(input, errObj) {
  assert["throws"](function () {
    return fs.fchown(1, input);
  }, errObj);
  assert["throws"](function () {
    return fs.fchownSync(1, input);
  }, errObj);
}

function testGid(input, errObj) {
  assert["throws"](function () {
    return fs.fchown(1, 1, input);
  }, errObj);
  assert["throws"](function () {
    return fs.fchownSync(1, 1, input);
  }, errObj);
}

['', false, null, undefined, {}, []].forEach(function (input) {
  var errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: /fd|uid|gid/
  };
  testFd(input, errObj);
  testUid(input, errObj);
  testGid(input, errObj);
});
[Infinity, NaN].forEach(function (input) {
  var errObj = {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "fd" is out of range. It must be an integer. ' + "Received ".concat(input)
  };
  testFd(input, errObj);
  errObj.message = errObj.message.replace('fd', 'uid');
  testUid(input, errObj);
  errObj.message = errObj.message.replace('uid', 'gid');
  testGid(input, errObj);
});
[-2, Math.pow(2, 32)].forEach(function (input) {
  var errObj = {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "fd" is out of range. It must be ' + ">= 0 && <= 2147483647. Received ".concat(input)
  };
  testFd(input, errObj);
  errObj.message = 'The value of "uid" is out of range. It must be >= -1 && ' + "<= 4294967295. Received ".concat(input);
  testUid(input, errObj);
  errObj.message = errObj.message.replace('uid', 'gid');
  testGid(input, errObj);
});