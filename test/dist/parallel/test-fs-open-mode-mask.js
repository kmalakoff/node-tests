'use strict'; // This tests that the lower bits of mode > 0o777 still works in fs.open().

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var mode = common.isWindows ? 292 : 420;
var maskToIgnore = 4096;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();

function test(mode, asString) {
  var suffix = asString ? 'str' : 'num';
  var input = asString ? (mode | maskToIgnore).toString(8) : mode | maskToIgnore;
  {
    var file = path.join(tmpdir.path, "openSync-".concat(suffix, ".txt"));
    var fd = fs.openSync(file, 'w+', input);
    assert.strictEqual(fs.fstatSync(fd).mode & 511, mode);
    fs.closeSync(fd);
    assert.strictEqual(fs.statSync(file).mode & 511, mode);
  }
  {
    var _file = path.join(tmpdir.path, "open-".concat(suffix, ".txt"));

    fs.open(_file, 'w+', input, common.mustCall(function (err, fd) {
      assert.ifError(err);
      assert.strictEqual(fs.fstatSync(fd).mode & 511, mode);
      fs.closeSync(fd);
      assert.strictEqual(fs.statSync(_file).mode & 511, mode);
    }));
  }
}

test(mode, true);
test(mode, false);