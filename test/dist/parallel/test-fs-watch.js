'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var common = require('../common');

if (common.isIBMi) common.skip('IBMi does not support `fs.watch()`'); // Tests if `filename` is provided to watcher on supported platforms

var fs = require('fs');

var assert = require('assert');

var _require = require('path'),
    join = _require.join;

var WatchTestCase = /*#__PURE__*/function () {
  function WatchTestCase(shouldInclude, dirName, fileName, field) {
    (0, _classCallCheck2["default"])(this, WatchTestCase);
    this.dirName = dirName;
    this.fileName = fileName;
    this.field = field;
    this.shouldSkip = !shouldInclude;
  }

  (0, _createClass2["default"])(WatchTestCase, [{
    key: "dirPath",
    get: function get() {
      return join(tmpdir.path, this.dirName);
    }
  }, {
    key: "filePath",
    get: function get() {
      return join(this.dirPath, this.fileName);
    }
  }]);
  return WatchTestCase;
}();

var cases = [// Watch on a directory should callback with a filename on supported systems
new WatchTestCase(common.isLinux || common.isOSX || common.isWindows || common.isAIX, 'watch1', 'foo', 'filePath'), // Watch on a file should callback with a filename on supported systems
new WatchTestCase(common.isLinux || common.isOSX || common.isWindows, 'watch2', 'bar', 'dirPath')];

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();

var _loop = function _loop() {
  var testCase = _cases[_i];
  if (testCase.shouldSkip) return "continue";
  fs.mkdirSync(testCase.dirPath); // Long content so it's actually flushed.

  var content1 = Date.now() + testCase.fileName.toLowerCase().repeat(1e4);
  fs.writeFileSync(testCase.filePath, content1);
  var interval = void 0;
  var pathToWatch = testCase[testCase.field];
  var watcher = fs.watch(pathToWatch);
  watcher.on('error', function (err) {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    assert.fail(err);
  });
  watcher.on('close', common.mustCall(function () {
    watcher.close(); // Closing a closed watcher should be a noop
  }));
  watcher.on('change', common.mustCall(function (eventType, argFilename) {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    if (common.isOSX) assert.strictEqual(['rename', 'change'].includes(eventType), true);else assert.strictEqual(eventType, 'change');
    assert.strictEqual(argFilename, testCase.fileName);
    watcher.close(); // We document that watchers cannot be used anymore when it's closed,
    // here we turn the methods into noops instead of throwing

    watcher.close(); // Closing a closed watcher should be a noop
  })); // Long content so it's actually flushed. toUpperCase so there's real change.

  var content2 = Date.now() + testCase.fileName.toUpperCase().repeat(1e4);
  interval = setInterval(function () {
    fs.writeFileSync(testCase.filePath, '');
    fs.writeFileSync(testCase.filePath, content2);
  }, 100);
};

for (var _i = 0, _cases = cases; _i < _cases.length; _i++) {
  var _ret = _loop();

  if (_ret === "continue") continue;
}

[false, 1, {}, [], null, undefined].forEach(function (input) {
  assert["throws"](function () {
    return fs.watch(input, common.mustNotCall());
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
});