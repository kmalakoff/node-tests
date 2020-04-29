'use strict';
/*
 * This test makes sure that `writeFile()` always writes from the current
 * position of the file, instead of truncating the file, when used with file
 * descriptors.
 */

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var join = require('path').join;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
{
  /* writeFileSync() test. */
  var filename = join(tmpdir.path, 'test.txt');
  /* Open the file descriptor. */

  var fd = fs.openSync(filename, 'w');
  /* Write only five characters, so that the position moves to five. */

  assert.deepStrictEqual(fs.writeSync(fd, 'Hello'), 5);
  assert.deepStrictEqual(fs.readFileSync(filename).toString(), 'Hello');
  /* Write some more with writeFileSync(). */

  fs.writeFileSync(fd, 'World');
  /* New content should be written at position five, instead of zero. */

  assert.deepStrictEqual(fs.readFileSync(filename).toString(), 'HelloWorld');
  /* Close the file descriptor. */

  fs.closeSync(fd);
}
{
  /* writeFile() test. */
  var file = join(tmpdir.path, 'test1.txt');
  /* Open the file descriptor. */

  fs.open(file, 'w', common.mustCall(function (err, fd) {
    assert.ifError(err);
    /* Write only five characters, so that the position moves to five. */

    fs.write(fd, 'Hello', common.mustCall(function (err, bytes) {
      assert.ifError(err);
      assert.strictEqual(bytes, 5);
      assert.deepStrictEqual(fs.readFileSync(file).toString(), 'Hello');
      /* Write some more with writeFile(). */

      fs.writeFile(fd, 'World', common.mustCall(function (err) {
        assert.ifError(err);
        /* New content should be written at position five, instead of zero. */

        assert.deepStrictEqual(fs.readFileSync(file).toString(), 'HelloWorld');
        /* Close the file descriptor. */

        fs.closeSync(fd);
      }));
    }));
  }));
}