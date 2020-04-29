'use strict';

var common = require('../common');

var fixtures = require('../common/fixtures');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var os = require('os');

var URL = require('url').URL;

function pathToFileURL(p) {
  if (!path.isAbsolute(p)) throw new Error('Path must be absolute');
  if (common.isWindows && p.startsWith('\\\\')) p = p.slice(2);
  return new URL("file://".concat(p));
}

var p = path.resolve(fixtures.fixturesDir, 'a.js');
var url = pathToFileURL(p);
assert(url instanceof URL); // Check that we can pass in a URL object successfully

fs.readFile(url, common.mustCall(function (err, data) {
  assert.ifError(err);
  assert(Buffer.isBuffer(data));
})); // Check that using a non file:// URL reports an error

var httpUrl = new URL('http://example.org');
assert["throws"](function () {
  fs.readFile(httpUrl, common.mustNotCall());
}, {
  code: 'ERR_INVALID_URL_SCHEME',
  name: 'TypeError',
  message: 'The URL must be of scheme file'
}); // pct-encoded characters in the path will be decoded and checked

if (common.isWindows) {
  // Encoded back and forward slashes are not permitted on windows
  ['%2f', '%2F', '%5c', '%5C'].forEach(function (i) {
    assert["throws"](function () {
      fs.readFile(new URL("file:///c:/tmp/".concat(i)), common.mustNotCall());
    }, {
      code: 'ERR_INVALID_FILE_URL_PATH',
      name: 'TypeError',
      message: 'File URL path must not include encoded \\ or / characters'
    });
  });
  assert["throws"](function () {
    fs.readFile(new URL('file:///c:/tmp/%00test'), common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_VALUE',
    name: 'TypeError',
    message: 'The argument \'path\' must be a string or Uint8Array without ' + "null bytes. Received 'c:\\\\tmp\\\\\\x00test'"
  });
} else {
  // Encoded forward slashes are not permitted on other platforms
  ['%2f', '%2F'].forEach(function (i) {
    assert["throws"](function () {
      fs.readFile(new URL("file:///c:/tmp/".concat(i)), common.mustNotCall());
    }, {
      code: 'ERR_INVALID_FILE_URL_PATH',
      name: 'TypeError',
      message: 'File URL path must not include encoded / characters'
    });
  });
  assert["throws"](function () {
    fs.readFile(new URL('file://hostname/a/b/c'), common.mustNotCall());
  }, {
    code: 'ERR_INVALID_FILE_URL_HOST',
    name: 'TypeError',
    message: "File URL host must be \"localhost\" or empty on ".concat(os.platform())
  });
  assert["throws"](function () {
    fs.readFile(new URL('file:///tmp/%00test'), common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_VALUE',
    name: 'TypeError',
    message: "The argument 'path' must be a string or Uint8Array without " + "null bytes. Received '/tmp/\\x00test'"
  });
}