'use strict';

var common = require('../common');

var tmpdir = require('../common/tmpdir'); // This test ensures that fs.existsSync doesn't incorrectly return false.
// (especially on Windows)
// https://github.com/nodejs/node-v0.x-archive/issues/3739


var assert = require('assert');

var fs = require('fs');

var path = require('path');

var dir = path.resolve(tmpdir.path); // Make sure that the tmp directory is clean

tmpdir.refresh(); // Make a long path.

for (var i = 0; i < 50; i++) {
  dir = "".concat(dir, "/1234567890");

  try {
    fs.mkdirSync(dir, '0777');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
} // Test if file exists synchronously


assert(fs.existsSync(dir), 'Directory is not accessible'); // Test if file exists asynchronously

fs.access(dir, common.mustCall(function (err) {
  assert.ifError(err);
}));