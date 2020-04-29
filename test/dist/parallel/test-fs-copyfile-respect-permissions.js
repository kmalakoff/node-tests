'use strict'; // Test that fs.copyFile() respects file permissions.
// Ref: https://github.com/nodejs/node/issues/26936

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

if (!common.isWindows && process.getuid() === 0) common.skip('as this test should not be run as `root`');
if (common.isIBMi) common.skip('IBMi has a different access permission mechanism');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var n = 0;

function beforeEach() {
  n++;
  var source = path.join(tmpdir.path, "source".concat(n));
  var dest = path.join(tmpdir.path, "dest".concat(n));
  fs.writeFileSync(source, 'source');
  fs.writeFileSync(dest, 'dest');
  fs.chmodSync(dest, '444');

  var check = function check(err) {
    var expected = ['EACCES', 'EPERM'];
    assert(expected.includes(err.code), "".concat(err.code, " not in ").concat(expected));
    assert.strictEqual(fs.readFileSync(dest, 'utf8'), 'dest');
    return true;
  };

  return {
    source: source,
    dest: dest,
    check: check
  };
} // Test synchronous API.


{
  var _beforeEach = beforeEach(),
      source = _beforeEach.source,
      dest = _beforeEach.dest,
      check = _beforeEach.check;

  assert["throws"](function () {
    fs.copyFileSync(source, dest);
  }, check);
} // Test promises API.

{
  var _beforeEach2 = beforeEach(),
      _source = _beforeEach2.source,
      _dest = _beforeEach2.dest,
      _check = _beforeEach2.check;

  (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return assert.rejects(fs.promises.copyFile(_source, _dest), _check);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))();
} // Test callback API.

{
  var _beforeEach3 = beforeEach(),
      _source2 = _beforeEach3.source,
      _dest2 = _beforeEach3.dest,
      _check2 = _beforeEach3.check;

  fs.copyFile(_source2, _dest2, common.mustCall(_check2));
}