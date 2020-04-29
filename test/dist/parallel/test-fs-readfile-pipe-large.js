'use strict';

var common = require('../common'); // Simulate `cat readfile.js | node readfile.js`


if (common.isWindows || common.isAIX) common.skip("No /dev/stdin on ".concat(process.platform, "."));

var assert = require('assert');

var path = require('path');

var fs = require('fs');

if (process.argv[2] === 'child') {
  fs.readFile('/dev/stdin', function (er, data) {
    assert.ifError(er);
    process.stdout.write(data);
  });
  return;
}

var tmpdir = require('../common/tmpdir');

var filename = path.join(tmpdir.path, '/readfile_pipe_large_test.txt');
var dataExpected = 'a'.repeat(999999);
tmpdir.refresh();
fs.writeFileSync(filename, dataExpected);

var exec = require('child_process').exec;

var f = JSON.stringify(__filename);
var node = JSON.stringify(process.execPath);
var cmd = "cat ".concat(filename, " | ").concat(node, " ").concat(f, " child");
exec(cmd, {
  maxBuffer: 1000000
}, common.mustCall(function (err, stdout, stderr) {
  assert.ifError(err);
  assert.strictEqual(stdout, dataExpected, "expect it reads the file and outputs 999999 'a' but got : ".concat(stdout));
  assert.strictEqual(stderr, '', "expect that it does not write to stderr, but got : ".concat(stderr));
  console.log('ok');
}));