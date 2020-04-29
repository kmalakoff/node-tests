'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var promiseFs = require('fs').promises;

var path = require('path');

var tmpdir = require('../common/tmpdir');

var isDate = require('util').types.isDate;

var _require = require('util'),
    inspect = _require.inspect;

tmpdir.refresh();
var testIndex = 0;

function getFilename() {
  var filename = path.join(tmpdir.path, "test-file-".concat(++testIndex));
  fs.writeFileSync(filename, 'test');
  return filename;
}

function verifyStats(bigintStats, numStats, allowableDelta) {
  // allowableDelta: It's possible that the file stats are updated between the
  // two stat() calls so allow for a small difference.
  for (var _i = 0, _Object$keys = Object.keys(numStats); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    var val = numStats[key];

    if (isDate(val)) {
      var time = val.getTime();
      var time2 = bigintStats[key].getTime();
      assert(time - time2 <= allowableDelta, "difference of ".concat(key, ".getTime() should <= ").concat(allowableDelta, ".\n") + "Number version ".concat(time, ", BigInt version ").concat(time2, "n"));
    } else if (key === 'mode') {
      assert.strictEqual(bigintStats[key], BigInt(val));
      assert.strictEqual(bigintStats.isBlockDevice(), numStats.isBlockDevice());
      assert.strictEqual(bigintStats.isCharacterDevice(), numStats.isCharacterDevice());
      assert.strictEqual(bigintStats.isDirectory(), numStats.isDirectory());
      assert.strictEqual(bigintStats.isFIFO(), numStats.isFIFO());
      assert.strictEqual(bigintStats.isFile(), numStats.isFile());
      assert.strictEqual(bigintStats.isSocket(), numStats.isSocket());
      assert.strictEqual(bigintStats.isSymbolicLink(), numStats.isSymbolicLink());
    } else if (key.endsWith('Ms')) {
      var nsKey = key.replace('Ms', 'Ns');
      var msFromBigInt = bigintStats[key];
      var nsFromBigInt = bigintStats[nsKey];
      var msFromBigIntNs = Number(nsFromBigInt / Math.pow(10n, 6n));
      var msFromNum = numStats[key];
      assert(msFromNum - Number(msFromBigInt) <= allowableDelta, "Number version ".concat(key, " = ").concat(msFromNum, ", ") + "BigInt version ".concat(key, " = ").concat(msFromBigInt, "n, ") + "Allowable delta = ".concat(allowableDelta));
      assert(msFromNum - Number(msFromBigIntNs) <= allowableDelta, "Number version ".concat(key, " = ").concat(msFromNum, ", ") + "BigInt version ".concat(nsKey, " = ").concat(nsFromBigInt, "n") + " = ".concat(msFromBigIntNs, "ms, Allowable delta = ").concat(allowableDelta));
    } else if (Number.isSafeInteger(val)) {
      assert.strictEqual(bigintStats[key], BigInt(val), "".concat(inspect(bigintStats[key]), " !== ").concat(inspect(BigInt(val)), "\n") + "key=".concat(key, ", val=").concat(val));
    } else {
      assert(Number(bigintStats[key]) - val < 1, "".concat(key, " is not a safe integer, difference should < 1.\n") + "Number version ".concat(val, ", BigInt version ").concat(bigintStats[key], "n"));
    }
  }
}

var runSyncTest = function runSyncTest(func, arg) {
  var startTime = process.hrtime.bigint();
  var bigintStats = func(arg, {
    bigint: true
  });
  var numStats = func(arg);
  var endTime = process.hrtime.bigint();
  var allowableDelta = Math.ceil(Number(endTime - startTime) / 1e6);
  verifyStats(bigintStats, numStats, allowableDelta);
};

{
  var filename = getFilename();
  runSyncTest(fs.statSync, filename);
}

if (!common.isWindows) {
  var _filename = getFilename();

  var link = "".concat(_filename, "-link");
  fs.symlinkSync(_filename, link);
  runSyncTest(fs.lstatSync, link);
}

{
  var _filename2 = getFilename();

  var fd = fs.openSync(_filename2, 'r');
  runSyncTest(fs.fstatSync, fd);
  fs.closeSync(fd);
}

var runCallbackTest = function runCallbackTest(func, arg, done) {
  var startTime = process.hrtime.bigint();
  func(arg, {
    bigint: true
  }, common.mustCall(function (err, bigintStats) {
    func(arg, common.mustCall(function (err, numStats) {
      var endTime = process.hrtime.bigint();
      var allowableDelta = Math.ceil(Number(endTime - startTime) / 1e6);
      verifyStats(bigintStats, numStats, allowableDelta);

      if (done) {
        done();
      }
    }));
  }));
};

{
  var _filename3 = getFilename();

  runCallbackTest(fs.stat, _filename3);
}

if (!common.isWindows) {
  var _filename4 = getFilename();

  var _link = "".concat(_filename4, "-link");

  fs.symlinkSync(_filename4, _link);
  runCallbackTest(fs.lstat, _link);
}

{
  var _filename5 = getFilename();

  var _fd = fs.openSync(_filename5, 'r');

  runCallbackTest(fs.fstat, _fd, function () {
    fs.closeSync(_fd);
  });
}

var runPromiseTest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(func, arg) {
    var startTime, bigintStats, numStats, endTime, allowableDelta;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            startTime = process.hrtime.bigint();
            _context.next = 3;
            return func(arg, {
              bigint: true
            });

          case 3:
            bigintStats = _context.sent;
            _context.next = 6;
            return func(arg);

          case 6:
            numStats = _context.sent;
            endTime = process.hrtime.bigint();
            allowableDelta = Math.ceil(Number(endTime - startTime) / 1e6);
            verifyStats(bigintStats, numStats, allowableDelta);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function runPromiseTest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

{
  var _filename6 = getFilename();

  runPromiseTest(promiseFs.stat, _filename6);
}

if (!common.isWindows) {
  var _filename7 = getFilename();

  var _link2 = "".concat(_filename7, "-link");

  fs.symlinkSync(_filename7, _link2);
  runPromiseTest(promiseFs.lstat, _link2);
}

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
  var filename, handle, startTime, bigintStats, numStats, endTime, allowableDelta;
  return _regenerator["default"].wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          filename = getFilename();
          _context2.next = 3;
          return promiseFs.open(filename, 'r');

        case 3:
          handle = _context2.sent;
          startTime = process.hrtime.bigint();
          _context2.next = 7;
          return handle.stat({
            bigint: true
          });

        case 7:
          bigintStats = _context2.sent;
          _context2.next = 10;
          return handle.stat();

        case 10:
          numStats = _context2.sent;
          endTime = process.hrtime.bigint();
          allowableDelta = Math.ceil(Number(endTime - startTime) / 1e6);
          verifyStats(bigintStats, numStats, allowableDelta);
          _context2.next = 16;
          return handle.close();

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
}))();