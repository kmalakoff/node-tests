'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

var example = path.join(tmpdir.path, 'dummy');
tmpdir.refresh(); // Should not throw.

fs.createWriteStream(example, undefined).end();
fs.createWriteStream(example, null).end();
fs.createWriteStream(example, 'utf8').end();
fs.createWriteStream(example, {
  encoding: 'utf8'
}).end();

var createWriteStreamErr = function createWriteStreamErr(path, opt) {
  assert["throws"](function () {
    fs.createWriteStream(path, opt);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
};

createWriteStreamErr(example, 123);
createWriteStreamErr(example, 0);
createWriteStreamErr(example, true);
createWriteStreamErr(example, false);