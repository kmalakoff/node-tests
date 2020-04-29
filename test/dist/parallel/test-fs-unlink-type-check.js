'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

[false, 1, {}, [], null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.unlink(i, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.unlinkSync(i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});