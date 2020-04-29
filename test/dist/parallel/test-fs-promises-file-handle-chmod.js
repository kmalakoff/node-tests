'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common'); // The following tests validate base functionality for the fs.promises
// FileHandle.chmod method.


var fs = require('fs');

var open = fs.promises.open;

var path = require('path');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var tmpDir = tmpdir.path;
tmpdir.refresh();

function validateFilePermission() {
  return _validateFilePermission.apply(this, arguments);
}

function _validateFilePermission() {
  _validateFilePermission = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var filePath, fileHandle, statsBeforeMod, expectedAccess, newPermissions, statsAfterMod;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            filePath = path.resolve(tmpDir, 'tmp-chmod.txt');
            _context.next = 3;
            return open(filePath, 'w+', 292);

          case 3:
            fileHandle = _context.sent;
            // File created with r--r--r-- 444
            statsBeforeMod = fs.statSync(filePath);
            assert.deepStrictEqual(statsBeforeMod.mode & 292, 292);
            newPermissions = 501;

            if (common.isWindows) {
              // Chmod in Windows will only toggle read only/write access. The
              // fs.Stats.mode in Windows is computed using read/write
              // bits (not exec). Read-only at best returns 444; r/w 666.
              // Refer: /deps/uv/src/win/fs.cfs;
              expectedAccess = 436;
            } else {
              expectedAccess = newPermissions;
            } // Change the permissions to rwxr--r-x


            _context.next = 10;
            return fileHandle.chmod(newPermissions);

          case 10:
            statsAfterMod = fs.statSync(filePath);
            assert.deepStrictEqual(statsAfterMod.mode & expectedAccess, expectedAccess);
            _context.next = 14;
            return fileHandle.close();

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validateFilePermission.apply(this, arguments);
}

validateFilePermission().then(common.mustCall());