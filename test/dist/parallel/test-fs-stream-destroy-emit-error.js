'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
{
  var stream = fs.createReadStream(__filename);
  stream.on('close', common.mustCall());
  test(stream);
}
{
  var _stream = fs.createWriteStream("".concat(tmpdir.path, "/dummy"));

  _stream.on('close', common.mustCall());

  test(_stream);
}
{
  var _stream2 = fs.createReadStream(__filename, {
    emitClose: true
  });

  _stream2.on('close', common.mustCall());

  test(_stream2);
}
{
  var _stream3 = fs.createWriteStream("".concat(tmpdir.path, "/dummy2"), {
    emitClose: true
  });

  _stream3.on('close', common.mustCall());

  test(_stream3);
}

function test(stream) {
  var err = new Error('DESTROYED');
  stream.on('open', function () {
    stream.destroy(err);
  });
  stream.on('error', common.mustCall(function (err_) {
    assert.strictEqual(err_, err);
  }));
}