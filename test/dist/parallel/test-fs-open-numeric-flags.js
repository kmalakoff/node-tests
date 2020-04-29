'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh(); // O_WRONLY without O_CREAT shall fail with ENOENT

var pathNE = path.join(tmpdir.path, 'file-should-not-exist');
assert["throws"](function () {
  return fs.openSync(pathNE, fs.constants.O_WRONLY);
}, function (e) {
  return e.code === 'ENOENT';
});