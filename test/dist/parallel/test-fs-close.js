'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var fd = fs.openSync(__filename, 'r');
fs.close(fd, common.mustCall(function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  assert.deepStrictEqual(args, [null]);
}));