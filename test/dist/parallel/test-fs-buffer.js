'use strict';

var common = require('../common');

var fixtures = require('../common/fixtures');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
fs.access(Buffer.from(tmpdir.path), common.mustCall(assert.ifError));
var buf = Buffer.from(path.join(tmpdir.path, 'a.txt'));
fs.open(buf, 'w+', common.mustCall(function (err, fd) {
  assert.ifError(err);
  assert(fd);
  fs.close(fd, common.mustCall(assert.ifError));
}));
assert["throws"](function () {
  fs.accessSync(true);
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
  message: 'The "path" argument must be of type string or an instance of ' + 'Buffer or URL. Received type boolean (true)'
});
var dir = Buffer.from(fixtures.fixturesDir);
fs.readdir(dir, 'hex', common.mustCall(function (err, hexList) {
  assert.ifError(err);
  fs.readdir(dir, common.mustCall(function (err, stringList) {
    assert.ifError(err);
    stringList.forEach(function (val, idx) {
      var fromHexList = Buffer.from(hexList[idx], 'hex').toString();
      assert.strictEqual(fromHexList, val, "expected ".concat(val, ", got ").concat(fromHexList, " by hex decoding ").concat(hexList[idx]));
    });
  }));
}));