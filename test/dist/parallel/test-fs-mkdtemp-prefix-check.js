'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var prefixValues = [undefined, null, 0, true, false, 1, ''];

function fail(value) {
  assert["throws"](function () {
    fs.mkdtempSync(value, {});
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
}

function failAsync(value) {
  assert["throws"](function () {
    fs.mkdtemp(value, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
}

prefixValues.forEach(function (prefixValue) {
  fail(prefixValue);
  failAsync(prefixValue);
});