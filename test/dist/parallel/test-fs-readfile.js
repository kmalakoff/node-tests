'use strict';

var common = require('../common'); // This test ensures that fs.readFile correctly returns the
// contents of varying-sized files.


var tmpdir = require('../../test/common/tmpdir');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var prefix = ".removeme-fs-readfile-".concat(process.pid);
tmpdir.refresh();
var fileInfo = [{
  name: path.join(tmpdir.path, "".concat(prefix, "-1K.txt")),
  len: 1024
}, {
  name: path.join(tmpdir.path, "".concat(prefix, "-64K.txt")),
  len: 64 * 1024
}, {
  name: path.join(tmpdir.path, "".concat(prefix, "-64KLessOne.txt")),
  len: 64 * 1024 - 1
}, {
  name: path.join(tmpdir.path, "".concat(prefix, "-1M.txt")),
  len: 1 * 1024 * 1024
}, {
  name: path.join(tmpdir.path, "".concat(prefix, "-1MPlusOne.txt")),
  len: 1 * 1024 * 1024 + 1
}]; // Populate each fileInfo (and file) with unique fill.

var sectorSize = 512;

for (var _i = 0, _fileInfo = fileInfo; _i < _fileInfo.length; _i++) {
  var e = _fileInfo[_i];
  e.contents = Buffer.allocUnsafe(e.len); // This accounts for anything unusual in Node's implementation of readFile.
  // Using e.g. 'aa...aa' would miss bugs like Node re-reading
  // the same section twice instead of two separate sections.

  for (var offset = 0; offset < e.len; offset += sectorSize) {
    var fillByte = 256 * Math.random();
    var nBytesToFill = Math.min(sectorSize, e.len - offset);
    e.contents.fill(fillByte, offset, offset + nBytesToFill);
  }

  fs.writeFileSync(e.name, e.contents);
} // All files are now populated.
// Test readFile on each size.


var _loop = function _loop() {
  var e = _fileInfo2[_i2];
  fs.readFile(e.name, common.mustCall(function (err, buf) {
    console.log("Validating readFile on file ".concat(e.name, " of length ").concat(e.len));
    assert.ifError(err);
    assert.deepStrictEqual(buf, e.contents);
  }));
};

for (var _i2 = 0, _fileInfo2 = fileInfo; _i2 < _fileInfo2.length; _i2++) {
  _loop();
}