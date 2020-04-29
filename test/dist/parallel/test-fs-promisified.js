'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var _require = require('util'),
    promisify = _require.promisify;

var read = promisify(fs.read);
var write = promisify(fs.write);
var exists = promisify(fs.exists);
{
  var fd = fs.openSync(__filename, 'r');
  read(fd, Buffer.alloc(1024), 0, 1024, null).then(common.mustCall(function (obj) {
    assert.strictEqual((0, _typeof2["default"])(obj.bytesRead), 'number');
    assert(obj.buffer instanceof Buffer);
    fs.closeSync(fd);
  }));
}

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
{
  var filename = path.join(tmpdir.path, 'write-promise.txt');

  var _fd = fs.openSync(filename, 'w');

  write(_fd, Buffer.from('foobar')).then(common.mustCall(function (obj) {
    assert.strictEqual((0, _typeof2["default"])(obj.bytesWritten), 'number');
    assert.strictEqual(obj.buffer.toString(), 'foobar');
    fs.closeSync(_fd);
  }));
}
{
  exists(__filename).then(common.mustCall(function (x) {
    assert.strictEqual(x, true);
  }));
}