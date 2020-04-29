'use strict';

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

var tmp = tmpdir.path;
tmpdir.refresh();
var filename = path.resolve(tmp, 'truncate-file.txt');
fs.writeFileSync(filename, 'hello world', 'utf8');
var fd = fs.openSync(filename, 'r+');
var msg = 'Using fs.truncate with a file descriptor is deprecated.' + ' Please use fs.ftruncate with a file descriptor instead.';
common.expectWarning('DeprecationWarning', msg, 'DEP0081');
fs.truncate(fd, 5, common.mustCall(function (err) {
  assert.ok(!err);
  assert.strictEqual(fs.readFileSync(filename, 'utf8'), 'hello');
}));
process.once('beforeExit', function () {
  fs.closeSync(fd);
  fs.unlinkSync(filename);
  console.log('ok');
});