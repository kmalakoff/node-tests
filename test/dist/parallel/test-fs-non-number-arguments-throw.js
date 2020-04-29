'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

var tempFile = path.join(tmpdir.path, 'fs-non-number-arguments-throw');
tmpdir.refresh();
fs.writeFileSync(tempFile, 'abc\ndef'); // A sanity check when using numbers instead of strings

var sanity = 'def';
var saneEmitter = fs.createReadStream(tempFile, {
  start: 4,
  end: 6
});
assert["throws"](function () {
  fs.createReadStream(tempFile, {
    start: '4',
    end: 6
  });
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
});
assert["throws"](function () {
  fs.createReadStream(tempFile, {
    start: 4,
    end: '6'
  });
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
});
assert["throws"](function () {
  fs.createWriteStream(tempFile, {
    start: '4'
  });
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
});
saneEmitter.on('data', common.mustCall(function (data) {
  assert.strictEqual(sanity, data.toString('utf8'), "read ".concat(data.toString('utf8'), " instead of ").concat(sanity));
}));