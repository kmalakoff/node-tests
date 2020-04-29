'use strict';

require('../common');

var fixtures = require('../common/fixtures');

var fs = require('fs');

var assert = require('assert');

var filepath = fixtures.path('x.txt');
var fd = fs.openSync(filepath, 'r');
var expected = Buffer.from('xyz\n');

function runTest(defaultBuffer, options) {
  var result = fs.readSync(fd, defaultBuffer, options);
  assert.strictEqual(result, expected.length);
  assert.deepStrictEqual(defaultBuffer, expected);
} // Test passing in an empty options object


runTest(Buffer.allocUnsafe(expected.length), {
  position: 0
}); // Test not passing in any options object

runTest(Buffer.allocUnsafe(expected.length)); // Test passing in options

runTest(Buffer.allocUnsafe(expected.length), {
  offset: 0,
  length: expected.length,
  position: 0
});