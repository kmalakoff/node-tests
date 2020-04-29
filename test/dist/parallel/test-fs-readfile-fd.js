'use strict';

var common = require('../common'); // Test fs.readFile using a file descriptor.


var fixtures = require('../common/fixtures');

var assert = require('assert');

var fs = require('fs');

var fn = fixtures.path('empty.txt');

var join = require('path').join;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
tempFd(function (fd, close) {
  fs.readFile(fd, function (err, data) {
    assert.ok(data);
    close();
  });
});
tempFd(function (fd, close) {
  fs.readFile(fd, 'utf8', function (err, data) {
    assert.strictEqual(data, '');
    close();
  });
});
tempFdSync(function (fd) {
  assert.ok(fs.readFileSync(fd));
});
tempFdSync(function (fd) {
  assert.strictEqual(fs.readFileSync(fd, 'utf8'), '');
});

function tempFd(callback) {
  fs.open(fn, 'r', function (err, fd) {
    assert.ifError(err);
    callback(fd, function () {
      fs.close(fd, function (err) {
        assert.ifError(err);
      });
    });
  });
}

function tempFdSync(callback) {
  var fd = fs.openSync(fn, 'r');
  callback(fd);
  fs.closeSync(fd);
}

{
  /*
   * This test makes sure that `readFile()` always reads from the current
   * position of the file, instead of reading from the beginning of the file,
   * when used with file descriptors.
   */
  var filename = join(tmpdir.path, 'test.txt');
  fs.writeFileSync(filename, 'Hello World');
  {
    /* Tests the fs.readFileSync(). */
    var fd = fs.openSync(filename, 'r');
    /* Read only five bytes, so that the position moves to five. */

    var buf = Buffer.alloc(5);
    assert.deepStrictEqual(fs.readSync(fd, buf, 0, 5), 5);
    assert.deepStrictEqual(buf.toString(), 'Hello');
    /* readFileSync() should read from position five, instead of zero. */

    assert.deepStrictEqual(fs.readFileSync(fd).toString(), ' World');
    fs.closeSync(fd);
  }
  {
    /* Tests the fs.readFile(). */
    fs.open(filename, 'r', common.mustCall(function (err, fd) {
      assert.ifError(err);
      var buf = Buffer.alloc(5);
      /* Read only five bytes, so that the position moves to five. */

      fs.read(fd, buf, 0, 5, null, common.mustCall(function (err, bytes) {
        assert.ifError(err);
        assert.strictEqual(bytes, 5);
        assert.deepStrictEqual(buf.toString(), 'Hello');
        fs.readFile(fd, common.mustCall(function (err, data) {
          assert.ifError(err);
          /* readFile() should read from position five, instead of zero. */

          assert.deepStrictEqual(data.toString(), ' World');
          fs.closeSync(fd);
        }));
      }));
    }));
  }
}