'use strict';

var common = require('../common');

var fs = require('fs');

var assert = require('assert');

assert["throws"](function () {
  fs.write(null, Buffer.allocUnsafe(1), 0, 1, common.mustNotCall());
}, /TypeError/);
assert["throws"](function () {
  fs.write(null, '1', 0, 1, common.mustNotCall());
}, /TypeError/);