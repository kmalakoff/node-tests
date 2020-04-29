'use strict'; // This tests that the lower bits of mode > 0o777 still works in fs APIs.

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var mode; // On Windows chmod is only able to manipulate write permission

if (common.isWindows) {
  mode = 292; // read-only
} else {
  mode = 511;
}

var maskToIgnore = 4096;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();

function test(mode, asString) {
  var suffix = asString ? 'str' : 'num';
  var input = asString ? (mode | maskToIgnore).toString(8) : mode | maskToIgnore;
  {
    var file = path.join(tmpdir.path, "chmod-async-".concat(suffix, ".txt"));
    fs.writeFileSync(file, 'test', 'utf-8');
    fs.chmod(file, input, common.mustCall(function (err) {
      assert.ifError(err);
      assert.strictEqual(fs.statSync(file).mode & 511, mode);
    }));
  }
  {
    var _file = path.join(tmpdir.path, "chmodSync-".concat(suffix, ".txt"));

    fs.writeFileSync(_file, 'test', 'utf-8');
    fs.chmodSync(_file, input);
    assert.strictEqual(fs.statSync(_file).mode & 511, mode);
  }
  {
    var _file2 = path.join(tmpdir.path, "fchmod-async-".concat(suffix, ".txt"));

    fs.writeFileSync(_file2, 'test', 'utf-8');
    fs.open(_file2, 'w', common.mustCall(function (err, fd) {
      assert.ifError(err);
      fs.fchmod(fd, input, common.mustCall(function (err) {
        assert.ifError(err);
        assert.strictEqual(fs.fstatSync(fd).mode & 511, mode);
        fs.close(fd, assert.ifError);
      }));
    }));
  }
  {
    var _file3 = path.join(tmpdir.path, "fchmodSync-".concat(suffix, ".txt"));

    fs.writeFileSync(_file3, 'test', 'utf-8');
    var fd = fs.openSync(_file3, 'w');
    fs.fchmodSync(fd, input);
    assert.strictEqual(fs.fstatSync(fd).mode & 511, mode);
    fs.close(fd, assert.ifError);
  }

  if (fs.lchmod) {
    var link = path.join(tmpdir.path, "lchmod-src-".concat(suffix));

    var _file4 = path.join(tmpdir.path, "lchmod-dest-".concat(suffix));

    fs.writeFileSync(_file4, 'test', 'utf-8');
    fs.symlinkSync(_file4, link);
    fs.lchmod(link, input, common.mustCall(function (err) {
      assert.ifError(err);
      assert.strictEqual(fs.lstatSync(link).mode & 511, mode);
    }));
  }

  if (fs.lchmodSync) {
    var _link = path.join(tmpdir.path, "lchmodSync-src-".concat(suffix));

    var _file5 = path.join(tmpdir.path, "lchmodSync-dest-".concat(suffix));

    fs.writeFileSync(_file5, 'test', 'utf-8');
    fs.symlinkSync(_file5, _link);
    fs.lchmodSync(_link, input);
    assert.strictEqual(fs.lstatSync(_link).mode & 511, mode);
  }
}

test(mode, true);
test(mode, false);