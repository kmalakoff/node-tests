'use strict';

require('../common'); // This test ensures that writeSync throws for invalid data input.


var assert = require('assert');

var fs = require('fs');

[true, false, 0, 1, Infinity, function () {}, {}, [], undefined, null].forEach(function (value) {
  assert["throws"](function () {
    return fs.writeSync(1, value);
  }, {
    message: /"buffer"/,
    code: 'ERR_INVALID_ARG_TYPE'
  });
});