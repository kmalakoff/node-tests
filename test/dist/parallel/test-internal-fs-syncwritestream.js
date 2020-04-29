// Flags: --expose-internals
'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var SyncWriteStream = require('internal/fs/sync_write_stream');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var filename = path.join(tmpdir.path, 'sync-write-stream.txt'); // Verify constructing the instance with default options.

{
  var stream = new SyncWriteStream(1);
  assert.strictEqual(stream.fd, 1);
  assert.strictEqual(stream.readable, false);
  assert.strictEqual(stream.autoClose, true);
} // Verify constructing the instance with specified options.

{
  var _stream = new SyncWriteStream(1, {
    autoClose: false
  });

  assert.strictEqual(_stream.fd, 1);
  assert.strictEqual(_stream.readable, false);
  assert.strictEqual(_stream.autoClose, false);
} // Verify that the file will be written synchronously.

{
  var fd = fs.openSync(filename, 'w');

  var _stream2 = new SyncWriteStream(fd);

  var chunk = Buffer.from('foo');
  assert.strictEqual(_stream2._write(chunk, null, common.mustCall(1)), true);
  assert.strictEqual(fs.readFileSync(filename).equals(chunk), true);
  fs.closeSync(fd);
} // Verify that the stream will unset the fd after destroy().

{
  var _fd = fs.openSync(filename, 'w');

  var _stream3 = new SyncWriteStream(_fd);

  _stream3.on('close', common.mustCall());

  assert.strictEqual(_stream3.destroy(), _stream3);
  assert.strictEqual(_stream3.fd, null);
} // Verify that the stream will unset the fd after destroySoon().

{
  var _fd2 = fs.openSync(filename, 'w');

  var _stream4 = new SyncWriteStream(_fd2);

  _stream4.on('close', common.mustCall());

  assert.strictEqual(_stream4.destroySoon(), _stream4);
  assert.strictEqual(_stream4.fd, null);
} // Verify that calling end() will also destroy the stream.

{
  var _fd3 = fs.openSync(filename, 'w');

  var _stream5 = new SyncWriteStream(_fd3);

  assert.strictEqual(_stream5.fd, _fd3);

  _stream5.end();

  _stream5.on('close', common.mustCall(function () {
    assert.strictEqual(_stream5.fd, null);
  }));
}