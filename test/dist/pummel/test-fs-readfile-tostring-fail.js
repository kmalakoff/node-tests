'use strict';

var common = require('../common');

if (!common.enoughTestMem) common.skip('intensive toString tests due to memory confinements');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var cp = require('child_process');

var kStringMaxLength = require('buffer').constants.MAX_STRING_LENGTH;

if (common.isAIX && Number(cp.execSync('ulimit -f')) * 512 < kStringMaxLength) common.skip('intensive toString tests due to file size confinements');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var file = path.join(tmpdir.path, 'toobig.txt');
var stream = fs.createWriteStream(file, {
  flags: 'a'
});
stream.on('error', function (err) {
  throw err;
});
var size = kStringMaxLength / 200;
var a = Buffer.alloc(size, 'a');

for (var i = 0; i < 201; i++) {
  stream.write(a);
}

stream.end();
stream.on('finish', common.mustCall(function () {
  fs.readFile(file, 'utf8', common.mustCall(function (err, buf) {
    assert.ok(err instanceof Error);

    if (err.message !== 'Array buffer allocation failed') {
      var stringLengthHex = kStringMaxLength.toString(16);
      common.expectsError({
        message: 'Cannot create a string longer than ' + "0x".concat(stringLengthHex, " characters"),
        code: 'ERR_STRING_TOO_LONG',
        name: 'Error'
      })(err);
    }

    assert.strictEqual(buf, undefined);
  }));
}));

function destroy() {
  try {
    fs.unlinkSync(file);
  } catch (_unused) {// it may not exist
  }
}

process.on('exit', destroy);
process.on('SIGINT', function () {
  destroy();
  process.exit();
}); // To make sure we don't leave a very large file
// on test machines in the event this test fails.

process.on('uncaughtException', function (err) {
  destroy();
  throw err;
});