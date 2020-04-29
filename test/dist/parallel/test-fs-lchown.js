'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var promises = fs.promises; // Validate the path argument.

[false, 1, {}, [], null, undefined].forEach(function (i) {
  var err = {
    name: 'TypeError',
    code: 'ERR_INVALID_ARG_TYPE'
  };
  assert["throws"](function () {
    return fs.lchown(i, 1, 1, common.mustNotCall());
  }, err);
  assert["throws"](function () {
    return fs.lchownSync(i, 1, 1);
  }, err);
  promises.lchown(false, 1, 1).then(common.mustNotCall())["catch"](common.expectsError(err));
}); // Validate the uid and gid arguments.

[false, 'test', {}, [], null, undefined].forEach(function (i) {
  var err = {
    name: 'TypeError',
    code: 'ERR_INVALID_ARG_TYPE'
  };
  assert["throws"](function () {
    return fs.lchown('not_a_file_that_exists', i, 1, common.mustNotCall());
  }, err);
  assert["throws"](function () {
    return fs.lchown('not_a_file_that_exists', 1, i, common.mustNotCall());
  }, err);
  assert["throws"](function () {
    return fs.lchownSync('not_a_file_that_exists', i, 1);
  }, err);
  assert["throws"](function () {
    return fs.lchownSync('not_a_file_that_exists', 1, i);
  }, err);
  promises.lchown('not_a_file_that_exists', i, 1).then(common.mustNotCall())["catch"](common.expectsError(err));
  promises.lchown('not_a_file_that_exists', 1, i).then(common.mustNotCall())["catch"](common.expectsError(err));
}); // Validate the callback argument.

[false, 1, 'test', {}, [], null, undefined].forEach(function (i) {
  assert["throws"](function () {
    return fs.lchown('not_a_file_that_exists', 1, 1, i);
  }, {
    name: 'TypeError',
    code: 'ERR_INVALID_CALLBACK'
  });
});

if (!common.isWindows) {
  var testFile = path.join(tmpdir.path, path.basename(__filename));
  var uid = process.geteuid();
  var gid = process.getegid();
  tmpdir.refresh();
  fs.copyFileSync(__filename, testFile);
  fs.lchownSync(testFile, uid, gid);
  fs.lchown(testFile, uid, gid, common.mustCall( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(err) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.ifError(err);
              _context.next = 3;
              return promises.lchown(testFile, uid, gid);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()));
}