'use strict'; // This tests that the lower bits of mode > 0o777 still works in fs.mkdir().

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var mode;

if (common.isWindows) {
  common.skip('mode is not supported in mkdir on Windows');
  return;
} else {
  mode = 420;
}

var maskToIgnore = 4096;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();

function test(mode, asString) {
  var suffix = asString ? 'str' : 'num';
  var input = asString ? (mode | maskToIgnore).toString(8) : mode | maskToIgnore;
  {
    var dir = path.join(tmpdir.path, "mkdirSync-".concat(suffix));
    fs.mkdirSync(dir, input);
    assert.strictEqual(fs.statSync(dir).mode & 511, mode);
  }
  {
    var _dir = path.join(tmpdir.path, "mkdir-".concat(suffix));

    fs.mkdir(_dir, input, common.mustCall(function (err) {
      assert.ifError(err);
      assert.strictEqual(fs.statSync(_dir).mode & 511, mode);
    }));
  }
}

test(mode, true);
test(mode, false);