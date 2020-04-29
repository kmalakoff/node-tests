'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

[Infinity, -Infinity, NaN].forEach(function (input) {
  assert["throws"](function () {
    fs._toUnixTimestamp(input);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});
assert["throws"](function () {
  fs._toUnixTimestamp({});
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
});
var okInputs = [1, -1, '1', '-1', Date.now()];
okInputs.forEach(function (input) {
  fs._toUnixTimestamp(input);
});