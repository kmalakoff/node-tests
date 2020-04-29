'use strict';

var common = require('../common');

if (!common.isWindows) common.skip('Test for Windows only');

var fixtures = require('../common/fixtures');

var assert = require('assert');

var fs = require('fs');

var spawnSync = require('child_process').spawnSync;

var result; // Create a subst drive

var driveLetters = 'ABCDEFGHIJKLMNOPQRSTUWXYZ';
var drive;
var i;

for (i = 0; i < driveLetters.length; ++i) {
  drive = "".concat(driveLetters[i], ":");
  result = spawnSync('subst', [drive, fixtures.fixturesDir]);
  if (result.status === 0) break;
}

if (i === driveLetters.length) common.skip('Cannot create subst drive'); // Schedule cleanup (and check if all callbacks where called)

process.on('exit', function () {
  spawnSync('subst', ['/d', drive]);
}); // test:

var filename = "".concat(drive, "\\empty.js");
var filenameBuffer = Buffer.from(filename);
result = fs.realpathSync(filename);
assert.strictEqual(result, filename);
result = fs.realpathSync(filename, 'buffer');
assert(Buffer.isBuffer(result));
assert(result.equals(filenameBuffer));
fs.realpath(filename, common.mustCall(function (err, result) {
  assert.ifError(err);
  assert.strictEqual(result, filename);
}));
fs.realpath(filename, 'buffer', common.mustCall(function (err, result) {
  assert.ifError(err);
  assert(Buffer.isBuffer(result));
  assert(result.equals(filenameBuffer));
}));