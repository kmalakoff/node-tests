'use strict';

var common = require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh(); // Test creating and reading hard link

var srcPath = path.join(tmpdir.path, 'hardlink-target.txt');
var dstPath = path.join(tmpdir.path, 'link1.js');
fs.writeFileSync(srcPath, 'hello world');

function callback(err) {
  assert.ifError(err);
  var dstContent = fs.readFileSync(dstPath, 'utf8');
  assert.strictEqual(dstContent, 'hello world');
}

fs.link(srcPath, dstPath, common.mustCall(callback)); // test error outputs

[false, 1, [], {}, null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.link(i, '', common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.link('', i, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.linkSync(i, '');
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  assert["throws"](function () {
    return fs.linkSync('', i);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});