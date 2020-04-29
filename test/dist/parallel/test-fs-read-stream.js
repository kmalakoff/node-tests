// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var common = require('../common');

var tmpdir = require('../common/tmpdir');

var child_process = require('child_process');

var assert = require('assert');

var fs = require('fs');

var fixtures = require('../common/fixtures');

var fn = fixtures.path('elipses.txt');
var rangeFile = fixtures.path('x.txt');

function test1(options) {
  var paused = false;
  var bytesRead = 0;
  var file = fs.createReadStream(fn, options);
  var fileSize = fs.statSync(fn).size;
  assert.strictEqual(file.bytesRead, 0);
  file.on('open', common.mustCall(function (fd) {
    file.length = 0;
    assert.strictEqual((0, _typeof2["default"])(fd), 'number');
    assert.strictEqual(file.bytesRead, 0);
    assert.ok(file.readable); // GH-535

    file.pause();
    file.resume();
    file.pause();
    file.resume();
  }));
  file.on('data', function (data) {
    assert.ok(data instanceof Buffer);
    assert.ok(data.byteOffset % 8 === 0);
    assert.ok(!paused);
    file.length += data.length;
    bytesRead += data.length;
    assert.strictEqual(file.bytesRead, bytesRead);
    paused = true;
    file.pause();
    setTimeout(function () {
      paused = false;
      file.resume();
    }, 10);
  });
  file.on('end', common.mustCall(function (chunk) {
    assert.strictEqual(bytesRead, fileSize);
    assert.strictEqual(file.bytesRead, fileSize);
  }));
  file.on('close', common.mustCall(function () {
    assert.strictEqual(bytesRead, fileSize);
    assert.strictEqual(file.bytesRead, fileSize);
  }));
  process.on('exit', function () {
    assert.strictEqual(file.length, 30000);
  });
}

test1({});
test1({
  fs: {
    open: common.mustCall(fs.open),
    read: common.mustCallAtLeast(fs.read, 1),
    close: common.mustCall(fs.close)
  }
});
{
  var file = fs.createReadStream(fn, {
    encoding: 'utf8'
  });
  file.length = 0;
  file.on('data', function (data) {
    assert.strictEqual((0, _typeof2["default"])(data), 'string');
    file.length += data.length;

    for (var i = 0; i < data.length; i++) {
      // http://www.fileformat.info/info/unicode/char/2026/index.htm
      assert.strictEqual(data[i], "\u2026");
    }
  });
  file.on('close', common.mustCall());
  process.on('exit', function () {
    assert.strictEqual(file.length, 10000);
  });
}
{
  var _file = fs.createReadStream(rangeFile, {
    bufferSize: 1,
    start: 1,
    end: 2
  });

  var contentRead = '';

  _file.on('data', function (data) {
    contentRead += data.toString('utf-8');
  });

  _file.on('end', common.mustCall(function (data) {
    assert.strictEqual(contentRead, 'yz');
  }));
}
{
  var _file2 = fs.createReadStream(rangeFile, {
    bufferSize: 1,
    start: 1
  });

  _file2.data = '';

  _file2.on('data', function (data) {
    _file2.data += data.toString('utf-8');
  });

  _file2.on('end', common.mustCall(function () {
    assert.strictEqual(_file2.data, 'yz\n');
  }));
}
{
  // Ref: https://github.com/nodejs/node-v0.x-archive/issues/2320
  var _file3 = fs.createReadStream(rangeFile, {
    bufferSize: 1.23,
    start: 1
  });

  _file3.data = '';

  _file3.on('data', function (data) {
    _file3.data += data.toString('utf-8');
  });

  _file3.on('end', common.mustCall(function () {
    assert.strictEqual(_file3.data, 'yz\n');
  }));
}
assert["throws"](function () {
  fs.createReadStream(rangeFile, {
    start: 10,
    end: 2
  });
}, {
  code: 'ERR_OUT_OF_RANGE',
  message: 'The value of "start" is out of range. It must be <= "end"' + ' (here: 2). Received 10',
  name: 'RangeError'
});
{
  var stream = fs.createReadStream(rangeFile, {
    start: 0,
    end: 0
  });
  stream.data = '';
  stream.on('data', function (chunk) {
    stream.data += chunk;
  });
  stream.on('end', common.mustCall(function () {
    assert.strictEqual(stream.data, 'x');
  }));
}
{
  // Verify that end works when start is not specified.
  var _stream = new fs.createReadStream(rangeFile, {
    end: 1
  });

  _stream.data = '';

  _stream.on('data', function (chunk) {
    _stream.data += chunk;
  });

  _stream.on('end', common.mustCall(function () {
    assert.strictEqual(_stream.data, 'xy');
  }));
}

if (!common.isWindows) {
  // Verify that end works when start is not specified, and we do not try to
  // use positioned reads. This makes sure that this keeps working for
  // non-seekable file descriptors.
  tmpdir.refresh();
  var filename = "".concat(tmpdir.path, "/foo.pipe");
  var mkfifoResult = child_process.spawnSync('mkfifo', [filename]);

  if (!mkfifoResult.error) {
    child_process.exec("echo \"xyz foobar\" > '".concat(filename, "'"));

    var _stream2 = new fs.createReadStream(filename, {
      end: 1
    });

    _stream2.data = '';

    _stream2.on('data', function (chunk) {
      _stream2.data += chunk;
    });

    _stream2.on('end', common.mustCall(function () {
      assert.strictEqual(_stream2.data, 'xy');
      fs.unlinkSync(filename);
    }));
  } else {
    common.printSkipMessage('mkfifo not available');
  }
}

{
  // Pause and then resume immediately.
  var pauseRes = fs.createReadStream(rangeFile);
  pauseRes.pause();
  pauseRes.resume();
}
{
  var fileNext = function fileNext() {
    // This will tell us if the fd is usable again or not.
    _file4 = fs.createReadStream(null, {
      fd: _file4.fd,
      start: 0
    });
    _file4.data = '';

    _file4.on('data', function (data) {
      _file4.data += data;
    });

    _file4.on('end', common.mustCall(function (err) {
      assert.strictEqual(_file4.data, 'xyz\n');
    }));

    process.on('exit', function () {
      assert(_file4.closed);
      assert(_file4.destroyed);
    });
  };

  var _file4 = fs.createReadStream(rangeFile, {
    autoClose: false
  });

  var data = '';

  _file4.on('data', function (chunk) {
    data += chunk;
  });

  _file4.on('end', common.mustCall(function () {
    assert.strictEqual(data, 'xyz\n');
    process.nextTick(function () {
      assert(!_file4.closed);
      assert(!_file4.destroyed);
      fileNext();
    });
  }));
}
{
  // Just to make sure autoClose won't close the stream because of error.
  var _file5 = fs.createReadStream(null, {
    fd: 13337,
    autoClose: false
  });

  _file5.on('data', common.mustNotCall());

  _file5.on('error', common.mustCall());

  process.on('exit', function () {
    assert(!_file5.closed);
    assert(!_file5.destroyed);
    assert(_file5.fd);
  });
}
{
  // Make sure stream is destroyed when file does not exist.
  var _file6 = fs.createReadStream('/path/to/file/that/does/not/exist');

  _file6.on('data', common.mustNotCall());

  _file6.on('error', common.mustCall());

  process.on('exit', function () {
    assert(!_file6.closed);
    assert(_file6.destroyed);
  });
}