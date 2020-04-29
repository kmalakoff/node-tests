'use strict';

var common = require('../common');

var fixtures = require('../common/fixtures');

var fs = require('fs');

var read = require('util').promisify(fs.read);

var assert = require('assert');

var filepath = fixtures.path('x.txt');
var fd = fs.openSync(filepath, 'r');
var expected = Buffer.from('xyz\n');
var defaultBufferAsync = Buffer.alloc(16384);
read(fd, {}).then(function (_ref) {
  var bytesRead = _ref.bytesRead,
      buffer = _ref.buffer;
  assert.strictEqual(bytesRead, expected.length);
  assert.deepStrictEqual(defaultBufferAsync.length, buffer.length);
}).then(common.mustCall());