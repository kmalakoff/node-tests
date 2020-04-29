'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

var join = require('path').join;

var _fs$constants = fs.constants,
    _fs$constants$O_CREAT = _fs$constants.O_CREAT,
    O_CREAT = _fs$constants$O_CREAT === void 0 ? 0 : _fs$constants$O_CREAT,
    _fs$constants$O_RDONL = _fs$constants.O_RDONLY,
    O_RDONLY = _fs$constants$O_RDONL === void 0 ? 0 : _fs$constants$O_RDONL,
    _fs$constants$O_TRUNC = _fs$constants.O_TRUNC,
    O_TRUNC = _fs$constants$O_TRUNC === void 0 ? 0 : _fs$constants$O_TRUNC,
    _fs$constants$O_WRONL = _fs$constants.O_WRONLY,
    O_WRONLY = _fs$constants$O_WRONL === void 0 ? 0 : _fs$constants$O_WRONL,
    _fs$constants$UV_FS_O = _fs$constants.UV_FS_O_FILEMAP,
    UV_FS_O_FILEMAP = _fs$constants$UV_FS_O === void 0 ? 0 : _fs$constants$UV_FS_O;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh(); // Run this test on all platforms. While UV_FS_O_FILEMAP is only available on
// Windows, it should be silently ignored on other platforms.

var filename = join(tmpdir.path, 'fmap.txt');
var text = 'Memory File Mapping Test';
var mw = UV_FS_O_FILEMAP | O_TRUNC | O_CREAT | O_WRONLY;
var mr = UV_FS_O_FILEMAP | O_RDONLY;
fs.writeFileSync(filename, text, {
  flag: mw
});
var r1 = fs.readFileSync(filename, {
  encoding: 'utf8',
  flag: mr
});
assert.strictEqual(r1, text);