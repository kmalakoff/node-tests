'use strict';

var common = require('../common');

var fixtures = require('../common/fixtures');

var fs = require('fs');

var assert = require('assert');

var filepath = fixtures.path('x.txt');
var fd = fs.openSync(filepath, 'r');
var expected = Buffer.from('xyz\n');
var defaultBufferAsync = Buffer.alloc(16384);
var bufferAsOption = Buffer.allocUnsafe(expected.length); // Test passing in an empty options object

fs.read(fd, {
  position: 0
}, common.mustCall(function (err, bytesRead, buffer) {
  assert.strictEqual(bytesRead, expected.length);
  assert.deepStrictEqual(defaultBufferAsync.length, buffer.length);
})); // Test not passing in any options object

fs.read(fd, common.mustCall(function (err, bytesRead, buffer) {
  assert.strictEqual(bytesRead, expected.length);
  assert.deepStrictEqual(defaultBufferAsync.length, buffer.length);
})); // Test passing in options

fs.read(fd, {
  buffer: bufferAsOption,
  offset: 0,
  length: bufferAsOption.length,
  position: 0
}, common.mustCall(function (err, bytesRead, buffer) {
  assert.strictEqual(bytesRead, expected.length);
  assert.deepStrictEqual(bufferAsOption.length, buffer.length);
}));