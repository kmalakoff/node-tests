'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

var readStream = fs.createReadStream(__filename);
assert.strictEqual(readStream.pending, true);
readStream.on('ready', common.mustCall(function () {
  assert.strictEqual(readStream.pending, false);
}));
var writeFile = path.join(tmpdir.path, 'write-fsreadyevent.txt');
tmpdir.refresh();
var writeStream = fs.createWriteStream(writeFile, {
  autoClose: true
});
assert.strictEqual(writeStream.pending, true);
writeStream.on('ready', common.mustCall(function () {
  assert.strictEqual(writeStream.pending, false);
  writeStream.end();
}));