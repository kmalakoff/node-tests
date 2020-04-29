'use strict';

var common = require('../common');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
{
  var file = path.join(tmpdir.path, 'write-end-test0.txt');
  var stream = fs.createWriteStream(file, {
    fs: {
      open: common.mustCall(fs.open),
      write: common.mustCallAtLeast(fs.write, 1),
      close: common.mustCall(fs.close)
    }
  });
  stream.end('asd');
  stream.on('close', common.mustCall());
}
{
  var _file = path.join(tmpdir.path, 'write-end-test1.txt');

  var _stream = fs.createWriteStream(_file, {
    fs: {
      open: common.mustCall(fs.open),
      write: fs.write,
      writev: common.mustCallAtLeast(fs.writev, 1),
      close: common.mustCall(fs.close)
    }
  });

  _stream.write('asd');

  _stream.write('asd');

  _stream.write('asd');

  _stream.end();

  _stream.on('close', common.mustCall());
}