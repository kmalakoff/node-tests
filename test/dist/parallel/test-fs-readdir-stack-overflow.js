'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

function recurse() {
  fs.readdirSync('.');
  recurse();
}

assert["throws"](function () {
  return recurse();
}, {
  name: 'RangeError',
  message: 'Maximum call stack size exceeded'
});