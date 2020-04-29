'use strict';

var common = require('../common');

if (!common.isLinux) common.skip('Test is linux specific.');

var path = require('path');

var fs = require('fs');

var assert = require('assert');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var filename = "\uD83D\uDC04";
var root = Buffer.from("".concat(tmpdir.path).concat(path.sep));
var filebuff = Buffer.from(filename, 'ucs2');
var fullpath = Buffer.concat([root, filebuff]);

try {
  fs.closeSync(fs.openSync(fullpath, 'w+'));
} catch (e) {
  if (e.code === 'EINVAL') common.skip('test requires filesystem that supports UCS2');
  throw e;
}

fs.readdir(tmpdir.path, 'ucs2', common.mustCall(function (err, list) {
  assert.ifError(err);
  assert.strictEqual(list.length, 1);
  var fn = list[0];
  assert.deepStrictEqual(Buffer.from(fn, 'ucs2'), filebuff);
  assert.strictEqual(fn, filename);
}));