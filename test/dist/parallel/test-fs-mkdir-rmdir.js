'use strict';

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

var d = path.join(tmpdir.path, 'dir');
tmpdir.refresh(); // Make sure the directory does not exist

assert(!fs.existsSync(d)); // Create the directory now

fs.mkdirSync(d); // Make sure the directory exists

assert(fs.existsSync(d)); // Try creating again, it should fail with EEXIST

assert["throws"](function () {
  fs.mkdirSync(d);
}, /EEXIST: file already exists, mkdir/); // Remove the directory now

fs.rmdirSync(d); // Make sure the directory does not exist

assert(!fs.existsSync(d)); // Similarly test the Async version

fs.mkdir(d, 438, common.mustCall(function (err) {
  assert.ifError(err);
  fs.mkdir(d, 438, common.mustCall(function (err) {
    assert.strictEqual(this, undefined);
    assert.ok(err, 'got no error');
    assert.ok(/^EEXIST/.test(err.message), 'got no EEXIST message');
    assert.strictEqual(err.code, 'EEXIST');
    assert.strictEqual(err.path, d);
    fs.rmdir(d, assert.ifError);
  }));
}));