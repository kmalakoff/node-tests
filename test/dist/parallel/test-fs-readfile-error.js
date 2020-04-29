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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var common = require('../common');

var fs = require('fs'); // Test that fs.readFile fails correctly on a non-existent file.
// `fs.readFile('/')` does not fail on AIX and FreeBSD because you can open
// and read the directory there.


if (common.isAIX || common.isFreeBSD) common.skip('platform not supported.');

var assert = require('assert');

var exec = require('child_process').exec;

var fixtures = require('../common/fixtures');

function test(env, cb) {
  var filename = fixtures.path('test-fs-readfile-error.js');
  var execPath = "\"".concat(process.execPath, "\" \"").concat(filename, "\"");
  var options = {
    env: _objectSpread(_objectSpread({}, process.env), env)
  };
  exec(execPath, options, function (err, stdout, stderr) {
    assert(err);
    assert.strictEqual(stdout, '');
    assert.notStrictEqual(stderr, '');
    cb(String(stderr));
  });
}

test({
  NODE_DEBUG: ''
}, common.mustCall(function (data) {
  assert(/EISDIR/.test(data));
  assert(/test-fs-readfile-error/.test(data));
}));
test({
  NODE_DEBUG: 'fs'
}, common.mustCall(function (data) {
  assert(/EISDIR/.test(data));
  assert(/test-fs-readfile-error/.test(data));
}));
assert["throws"](function () {
  fs.readFile(function () {}, common.mustNotCall());
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  message: 'The "path" argument must be of type string or an instance of ' + 'Buffer or URL. Received type function ([Function (anonymous)])',
  name: 'TypeError'
});