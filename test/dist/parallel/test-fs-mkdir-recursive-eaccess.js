'use strict'; // Test that mkdir with recursive option returns appropriate error
// when executed on folder it does not have permission to access.
// Ref: https://github.com/nodejs/node/issues/31481

var common = require('../common');

if (!common.isWindows && process.getuid() === 0) common.skip('as this test should not be run as `root`');
if (common.isIBMi) common.skip('IBMi has a different access permission mechanism');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();

var assert = require('assert');

var _require = require('child_process'),
    execSync = _require.execSync;

var fs = require('fs');

var path = require('path');

var n = 0;

function makeDirectoryReadOnly(dir) {
  var accessErrorCode = 'EACCES';

  if (common.isWindows) {
    accessErrorCode = 'EPERM';
    execSync("icacls ".concat(dir, " /inheritance:r"));
    execSync("icacls ".concat(dir, " /deny \"everyone\":W"));
  } else {
    fs.chmodSync(dir, '444');
  }

  return accessErrorCode;
}

function makeDirectoryWritable(dir) {
  if (common.isWindows) {
    execSync("icacls ".concat(dir, " /grant \"everyone\":W"));
  }
} // Synchronous API should return an EACCESS error with path populated.


{
  var dir = path.join(tmpdir.path, "mkdirp_".concat(n++));
  fs.mkdirSync(dir);
  var codeExpected = makeDirectoryReadOnly(dir);
  var err = null;

  try {
    fs.mkdirSync(path.join(dir, '/foo'), {
      recursive: true
    });
  } catch (_err) {
    err = _err;
  }

  makeDirectoryWritable(dir);
  assert(err);
  assert.strictEqual(err.code, codeExpected);
  assert(err.path);
} // Asynchronous API should return an EACCESS error with path populated.

{
  var _dir = path.join(tmpdir.path, "mkdirp_".concat(n++));

  fs.mkdirSync(_dir);

  var _codeExpected = makeDirectoryReadOnly(_dir);

  fs.mkdir(path.join(_dir, '/bar'), {
    recursive: true
  }, function (err) {
    makeDirectoryWritable(_dir);
    assert(err);
    assert.strictEqual(err.code, _codeExpected);
    assert(err.path);
  });
}