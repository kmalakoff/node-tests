'use strict';

var common = require('../common');

var fs = require('fs');

var path = require('path');

var assert = require('assert');

var tmpdir = require('../common/tmpdir');

var writeFile = path.join(tmpdir.path, 'write-autoClose.txt');
tmpdir.refresh();
var file = fs.createWriteStream(writeFile, {
  autoClose: true
});
file.on('finish', common.mustCall(function () {
  assert.strictEqual(file.destroyed, false);
}));
file.end('asd');