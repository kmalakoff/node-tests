'use strict';

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var common = require('../common'); // Test creating a symbolic link pointing to a directory.
// Ref: https://github.com/nodejs/node/pull/23724
// Ref: https://github.com/nodejs/node/issues/23596


if (!common.canCreateSymLink()) common.skip('insufficient privileges');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var linkTargets = ['relative-target', path.join(tmpdir.path, 'absolute-target')];
var linkPaths = [path.relative(process.cwd(), path.join(tmpdir.path, 'relative-path')), path.join(tmpdir.path, 'absolute-path')];

function testSync(target, path) {
  fs.symlinkSync(target, path);
  fs.readdirSync(path);
}

function testAsync(target, path) {
  fs.symlink(target, path, common.mustCall(function (err) {
    assert.ifError(err);
    fs.readdirSync(path);
  }));
}

for (var _i = 0, _linkTargets = linkTargets; _i < _linkTargets.length; _i++) {
  var linkTarget = _linkTargets[_i];
  fs.mkdirSync(path.resolve(tmpdir.path, linkTarget));

  var _iterator = _createForOfIteratorHelper(linkPaths),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var linkPath = _step.value;
      testSync(linkTarget, "".concat(linkPath, "-").concat(path.basename(linkTarget), "-sync"));
      testAsync(linkTarget, "".concat(linkPath, "-").concat(path.basename(linkTarget), "-async"));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
} // Test invalid symlink


{
  var _testSync = function _testSync(target, path) {
    fs.symlinkSync(target, path);
    assert(!fs.existsSync(path));
  };

  var _testAsync = function _testAsync(target, path) {
    fs.symlink(target, path, common.mustCall(function (err) {
      assert.ifError(err);
      assert(!fs.existsSync(path));
    }));
  };

  var _iterator2 = _createForOfIteratorHelper(linkTargets.map(function (p) {
    return p + '-broken';
  })),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _linkTarget = _step2.value;

      var _iterator3 = _createForOfIteratorHelper(linkPaths),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _linkPath = _step3.value;

          _testSync(_linkTarget, "".concat(_linkPath, "-").concat(path.basename(_linkTarget), "-sync"));

          _testAsync(_linkTarget, "".concat(_linkPath, "-").concat(path.basename(_linkTarget), "-async"));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}