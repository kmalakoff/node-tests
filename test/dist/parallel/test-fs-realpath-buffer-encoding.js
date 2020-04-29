'use strict';

var common = require('../common');

var fixtures = require('../common/fixtures');

var assert = require('assert');

var fs = require('fs');

var string_dir = fs.realpathSync(fixtures.fixturesDir);
var buffer_dir = Buffer.from(string_dir);
var encodings = ['ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex'];
var expected = {};
encodings.forEach(function (encoding) {
  expected[encoding] = buffer_dir.toString(encoding);
}); // test sync version

var encoding;

for (encoding in expected) {
  var expected_value = expected[encoding];
  var result = void 0;
  result = fs.realpathSync(string_dir, {
    encoding: encoding
  });
  assert.strictEqual(result, expected_value);
  result = fs.realpathSync(string_dir, encoding);
  assert.strictEqual(result, expected_value);
  result = fs.realpathSync(buffer_dir, {
    encoding: encoding
  });
  assert.strictEqual(result, expected_value);
  result = fs.realpathSync(buffer_dir, encoding);
  assert.strictEqual(result, expected_value);
}

var buffer_result;
buffer_result = fs.realpathSync(string_dir, {
  encoding: 'buffer'
});
assert.deepStrictEqual(buffer_result, buffer_dir);
buffer_result = fs.realpathSync(string_dir, 'buffer');
assert.deepStrictEqual(buffer_result, buffer_dir);
buffer_result = fs.realpathSync(buffer_dir, {
  encoding: 'buffer'
});
assert.deepStrictEqual(buffer_result, buffer_dir);
buffer_result = fs.realpathSync(buffer_dir, 'buffer');
assert.deepStrictEqual(buffer_result, buffer_dir); // test async version

var _loop = function _loop() {
  var expected_value = expected[encoding];
  fs.realpath(string_dir, {
    encoding: encoding
  }, common.mustCall(function (err, res) {
    assert.ifError(err);
    assert.strictEqual(res, expected_value);
  }));
  fs.realpath(string_dir, encoding, common.mustCall(function (err, res) {
    assert.ifError(err);
    assert.strictEqual(res, expected_value);
  }));
  fs.realpath(buffer_dir, {
    encoding: encoding
  }, common.mustCall(function (err, res) {
    assert.ifError(err);
    assert.strictEqual(res, expected_value);
  }));
  fs.realpath(buffer_dir, encoding, common.mustCall(function (err, res) {
    assert.ifError(err);
    assert.strictEqual(res, expected_value);
  }));
};

for (encoding in expected) {
  _loop();
}

fs.realpath(string_dir, {
  encoding: 'buffer'
}, common.mustCall(function (err, res) {
  assert.ifError(err);
  assert.deepStrictEqual(res, buffer_dir);
}));
fs.realpath(string_dir, 'buffer', common.mustCall(function (err, res) {
  assert.ifError(err);
  assert.deepStrictEqual(res, buffer_dir);
}));
fs.realpath(buffer_dir, {
  encoding: 'buffer'
}, common.mustCall(function (err, res) {
  assert.ifError(err);
  assert.deepStrictEqual(res, buffer_dir);
}));
fs.realpath(buffer_dir, 'buffer', common.mustCall(function (err, res) {
  assert.ifError(err);
  assert.deepStrictEqual(res, buffer_dir);
}));