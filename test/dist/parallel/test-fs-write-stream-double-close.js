'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
{
  var s = fs.createWriteStream(path.join(tmpdir.path, 'rw'));
  s.close(common.mustCall());
  s.close(common.mustCall());
}
{
  var _s = fs.createWriteStream(path.join(tmpdir.path, 'rw2'));

  var emits = 0;

  _s.on('close', function () {
    emits++;
  });

  _s.close(common.mustCall(function () {
    assert.strictEqual(emits, 1);

    _s.close(common.mustCall(function () {
      assert.strictEqual(emits, 1);
    }));

    process.nextTick(function () {
      _s.close(common.mustCall(function () {
        assert.strictEqual(emits, 1);
      }));
    });
  }));
}
{
  var _s2 = fs.createWriteStream(path.join(tmpdir.path, 'rw'), {
    autoClose: false
  });

  _s2.close(common.mustCall());

  _s2.close(common.mustCall());
}