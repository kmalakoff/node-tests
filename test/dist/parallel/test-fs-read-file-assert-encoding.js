'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var encoding = 'foo-8';
var filename = 'bar.txt';
assert["throws"](function () {
  return fs.readFile(filename, {
    encoding: encoding
  }, common.mustNotCall());
}, {
  code: 'ERR_INVALID_OPT_VALUE_ENCODING',
  name: 'TypeError'
});