'use strict';

require('../common');

var fixtures = require('../common/fixtures');

var assert = require('assert');

var fs = require('fs'); // This test ensures that appropriate TypeError is thrown by createReadStream
// when an argument with invalid type is passed


var example = fixtures.path('x.txt'); // Should not throw.

fs.createReadStream(example, undefined);
fs.createReadStream(example, null);
fs.createReadStream(example, 'utf8');
fs.createReadStream(example, {
  encoding: 'utf8'
});

var createReadStreamErr = function createReadStreamErr(path, opt, error) {
  assert["throws"](function () {
    fs.createReadStream(path, opt);
  }, error);
};

var typeError = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
};
var rangeError = {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError'
};
[123, 0, true, false].forEach(function (opts) {
  return createReadStreamErr(example, opts, typeError);
}); // Case 0: Should not throw if either start or end is undefined

[{}, {
  start: 0
}, {
  end: Infinity
}].forEach(function (opts) {
  return fs.createReadStream(example, opts);
}); // Case 1: Should throw TypeError if either start or end is not of type 'number'

[{
  start: 'invalid'
}, {
  end: 'invalid'
}, {
  start: 'invalid',
  end: 'invalid'
}].forEach(function (opts) {
  return createReadStreamErr(example, opts, typeError);
}); // Case 2: Should throw RangeError if either start or end is NaN

[{
  start: NaN
}, {
  end: NaN
}, {
  start: NaN,
  end: NaN
}].forEach(function (opts) {
  return createReadStreamErr(example, opts, rangeError);
}); // Case 3: Should throw RangeError if either start or end is negative

[{
  start: -1
}, {
  end: -1
}, {
  start: -1,
  end: -1
}].forEach(function (opts) {
  return createReadStreamErr(example, opts, rangeError);
}); // Case 4: Should throw RangeError if either start or end is fractional

[{
  start: 0.1
}, {
  end: 0.1
}, {
  start: 0.1,
  end: 0.1
}].forEach(function (opts) {
  return createReadStreamErr(example, opts, rangeError);
}); // Case 5: Should not throw if both start and end are whole numbers

fs.createReadStream(example, {
  start: 1,
  end: 5
}); // Case 6: Should throw RangeError if start is greater than end

createReadStreamErr(example, {
  start: 5,
  end: 1
}, rangeError); // Case 7: Should throw RangeError if start or end is not safe integer

var NOT_SAFE_INTEGER = Math.pow(2, 53);
[{
  start: NOT_SAFE_INTEGER,
  end: Infinity
}, {
  start: 0,
  end: NOT_SAFE_INTEGER
}].forEach(function (opts) {
  return createReadStreamErr(example, opts, rangeError);
});