'use strict';

var common = require('../common');

var fixtures = require('../common/fixtures');

var assert = require('assert');

var fs = require('fs');

var filepath = fixtures.path('x.txt');
var fd = fs.openSync(filepath, 'r');
var bufferAsync = Buffer.alloc(0);
var bufferSync = Buffer.alloc(0);
fs.read(fd, bufferAsync, 0, 0, 0, common.mustCall(function (err, bytesRead) {
  assert.strictEqual(bytesRead, 0);
  assert.deepStrictEqual(bufferAsync, Buffer.alloc(0));
}));
var r = fs.readSync(fd, bufferSync, 0, 0, 0);
assert.deepStrictEqual(bufferSync, Buffer.alloc(0));
assert.strictEqual(r, 0);