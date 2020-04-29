'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

var readdirDir = tmpdir.path;
var files = ['empty', 'files', 'for', 'just', 'testing']; // Make sure tmp directory is clean

tmpdir.refresh(); // Create the necessary files

files.forEach(function (currentFile) {
  fs.closeSync(fs.openSync("".concat(readdirDir, "/").concat(currentFile), 'w'));
}); // Check the readdir Sync version

assert.deepStrictEqual(files, fs.readdirSync(readdirDir).sort()); // Check the readdir async version

fs.readdir(readdirDir, common.mustCall(function (err, f) {
  assert.ifError(err);
  assert.deepStrictEqual(files, f.sort());
})); // readdir() on file should throw ENOTDIR
// https://github.com/joyent/node/issues/1869

assert["throws"](function () {
  fs.readdirSync(__filename);
}, /Error: ENOTDIR: not a directory/);
fs.readdir(__filename, common.mustCall(function (e) {
  assert.strictEqual(e.code, 'ENOTDIR');
}));
[false, 1, [], {}, null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.readdir(i, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.readdirSync(i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});