'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var fixtures = require('../common/fixtures');

var fn = fixtures.path('elipses.txt');
var rangeFile = fixtures.path('x.txt');
{
  var paused = false;
  var file = fs.ReadStream(fn);
  file.on('open', common.mustCall(function (fd) {
    file.length = 0;
    assert.strictEqual((0, _typeof2["default"])(fd), 'number');
    assert.ok(file.readable); // GH-535

    file.pause();
    file.resume();
    file.pause();
    file.resume();
  }));
  file.on('data', common.mustCallAtLeast(function (data) {
    assert.ok(data instanceof Buffer);
    assert.ok(!paused);
    file.length += data.length;
    paused = true;
    file.pause();
    setTimeout(function () {
      paused = false;
      file.resume();
    }, 10);
  }));
  file.on('end', common.mustCall());
  file.on('close', common.mustCall(function () {
    assert.strictEqual(file.length, 30000);
  }));
}
{
  var _file = fs.createReadStream(fn, Object.create({
    encoding: 'utf8'
  }));

  _file.length = 0;

  _file.on('data', function (data) {
    assert.strictEqual((0, _typeof2["default"])(data), 'string');
    _file.length += data.length;

    for (var i = 0; i < data.length; i++) {
      // http://www.fileformat.info/info/unicode/char/2026/index.htm
      assert.strictEqual(data[i], "\u2026");
    }
  });

  _file.on('close', common.mustCall(function () {
    assert.strictEqual(_file.length, 10000);
  }));
}
{
  var options = Object.create({
    bufferSize: 1,
    start: 1,
    end: 2
  });

  var _file2 = fs.createReadStream(rangeFile, options);

  assert.strictEqual(_file2.start, 1);
  assert.strictEqual(_file2.end, 2);
  var contentRead = '';

  _file2.on('data', function (data) {
    contentRead += data.toString('utf-8');
  });

  _file2.on('end', common.mustCall(function () {
    assert.strictEqual(contentRead, 'yz');
  }));
}
{
  var _options = Object.create({
    bufferSize: 1,
    start: 1
  });

  var _file3 = fs.createReadStream(rangeFile, _options);

  assert.strictEqual(_file3.start, 1);
  _file3.data = '';

  _file3.on('data', function (data) {
    _file3.data += data.toString('utf-8');
  });

  _file3.on('end', common.mustCall(function () {
    assert.strictEqual(_file3.data, 'yz\n');
  }));
} // https://github.com/joyent/node/issues/2320

{
  var _options2 = Object.create({
    bufferSize: 1.23,
    start: 1
  });

  var _file4 = fs.createReadStream(rangeFile, _options2);

  assert.strictEqual(_file4.start, 1);
  _file4.data = '';

  _file4.on('data', function (data) {
    _file4.data += data.toString('utf-8');
  });

  _file4.on('end', common.mustCall(function () {
    assert.strictEqual(_file4.data, 'yz\n');
  }));
}
{
  var message = 'The value of "start" is out of range. It must be <= "end" (here: 2).' + ' Received 10';
  assert["throws"](function () {
    fs.createReadStream(rangeFile, Object.create({
      start: 10,
      end: 2
    }));
  }, {
    code: 'ERR_OUT_OF_RANGE',
    message: message,
    name: 'RangeError'
  });
}
{
  var _options3 = Object.create({
    start: 0,
    end: 0
  });

  var stream = fs.createReadStream(rangeFile, _options3);
  assert.strictEqual(stream.start, 0);
  assert.strictEqual(stream.end, 0);
  stream.data = '';
  stream.on('data', function (chunk) {
    stream.data += chunk;
  });
  stream.on('end', common.mustCall(function () {
    assert.strictEqual(stream.data, 'x');
  }));
} // Pause and then resume immediately.

{
  var pauseRes = fs.createReadStream(rangeFile);
  pauseRes.pause();
  pauseRes.resume();
}
{
  var fileNext = function fileNext() {
    // This will tell us if the fd is usable again or not.
    _file5 = fs.createReadStream(null, Object.create({
      fd: _file5.fd,
      start: 0
    }));
    _file5.data = '';

    _file5.on('data', function (data) {
      _file5.data += data;
    });

    _file5.on('end', common.mustCall(function () {
      assert.strictEqual(_file5.data, 'xyz\n');
    }));
  };

  var data = '';

  var _file5 = fs.createReadStream(rangeFile, Object.create({
    autoClose: false
  }));

  assert.strictEqual(_file5.autoClose, false);

  _file5.on('data', function (chunk) {
    data += chunk;
  });

  _file5.on('end', common.mustCall(function () {
    process.nextTick(common.mustCall(function () {
      assert(!_file5.closed);
      assert(!_file5.destroyed);
      assert.strictEqual(data, 'xyz\n');
      fileNext();
    }));
  }));

  process.on('exit', function () {
    assert(_file5.closed);
    assert(_file5.destroyed);
  });
} // Just to make sure autoClose won't close the stream because of error.

{
  var _options4 = Object.create({
    fd: 13337,
    autoClose: false
  });

  var _file6 = fs.createReadStream(null, _options4);

  _file6.on('data', common.mustNotCall());

  _file6.on('error', common.mustCall());

  process.on('exit', function () {
    assert(!_file6.closed);
    assert(!_file6.destroyed);
    assert(_file6.fd);
  });
} // Make sure stream is destroyed when file does not exist.

{
  var _file7 = fs.createReadStream('/path/to/file/that/does/not/exist');

  _file7.on('data', common.mustNotCall());

  _file7.on('error', common.mustCall());

  process.on('exit', function () {
    assert(!_file7.closed);
    assert(_file7.destroyed);
  });
}