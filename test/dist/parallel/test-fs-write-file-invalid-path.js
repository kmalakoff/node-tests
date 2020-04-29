'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

if (!common.isWindows) common.skip('This test is for Windows only.');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var DATA_VALUE = 'hello'; // Refs: https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx
// Ignore '/', '\\' and ':'

var RESERVED_CHARACTERS = '<>"|?*';
(0, _toConsumableArray2["default"])(RESERVED_CHARACTERS).forEach(function (ch) {
  var pathname = path.join(tmpdir.path, "somefile_".concat(ch));
  assert["throws"](function () {
    fs.writeFileSync(pathname, DATA_VALUE);
  }, /^Error: ENOENT: no such file or directory, open '.*'$/, "failed with '".concat(ch, "'"));
}); // Test for ':' (NTFS data streams).
// Refs: https://msdn.microsoft.com/en-us/library/windows/desktop/bb540537.aspx

var pathname = path.join(tmpdir.path, 'foo:bar');
fs.writeFileSync(pathname, DATA_VALUE);
var content = '';
var fileDataStream = fs.createReadStream(pathname, {
  encoding: 'utf8'
});
fileDataStream.on('data', function (data) {
  content += data;
});
fileDataStream.on('end', common.mustCall(function () {
  assert.strictEqual(content, DATA_VALUE);
}));