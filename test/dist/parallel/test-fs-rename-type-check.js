'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

[false, 1, [], {}, null, undefined].forEach(function (input) {
  var type = 'of type string or an instance of Buffer or URL.' + common.invalidArgTypeHelper(input);
  assert["throws"](function () {
    return fs.rename(input, 'does-not-exist', common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: "The \"oldPath\" argument must be ".concat(type)
  });
  assert["throws"](function () {
    return fs.rename('does-not-exist', input, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: "The \"newPath\" argument must be ".concat(type)
  });
  assert["throws"](function () {
    return fs.renameSync(input, 'does-not-exist');
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: "The \"oldPath\" argument must be ".concat(type)
  });
  assert["throws"](function () {
    return fs.renameSync('does-not-exist', input);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: "The \"newPath\" argument must be ".concat(type)
  });
});