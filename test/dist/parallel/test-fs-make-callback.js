'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

var callbackThrowValues = [null, true, false, 0, 1, 'foo', /foo/, [], {}];

var _require = require('path'),
    sep = _require.sep;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();

function testMakeCallback(cb) {
  return function () {
    // fs.mkdtemp() calls makeCallback() on its third argument
    fs.mkdtemp("".concat(tmpdir.path).concat(sep), {}, cb);
  };
}

function invalidCallbackThrowsTests() {
  callbackThrowValues.forEach(function (value) {
    assert["throws"](testMakeCallback(value), {
      code: 'ERR_INVALID_CALLBACK',
      name: 'TypeError'
    });
  });
}

invalidCallbackThrowsTests();