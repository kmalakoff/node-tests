'use strict'; // This tests that the errors thrown from fs.close and fs.closeSync
// include the desired properties

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

['', false, null, undefined, {}, []].forEach(function (input) {
  var errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "fd" argument must be of type number.' + common.invalidArgTypeHelper(input)
  };
  assert["throws"](function () {
    return fs.close(input);
  }, errObj);
  assert["throws"](function () {
    return fs.closeSync(input);
  }, errObj);
});
{
  // Test error when cb is not a function
  var fd = fs.openSync(__filename, 'r');
  var errObj = {
    code: 'ERR_INVALID_CALLBACK',
    name: 'TypeError'
  };
  ['', false, null, {}, []].forEach(function (input) {
    assert["throws"](function () {
      return fs.close(fd, input);
    }, errObj);
  });
  fs.closeSync(fd);
}