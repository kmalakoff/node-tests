/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var path = require('path');

var fs = require('fs');

var fixturesDir = path.join(__dirname, '..', 'fixtures');

function fixturesPath() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return path.join.apply(path, [fixturesDir].concat(args));
}

function readFixtureSync(args, enc) {
  if (Array.isArray(args)) return fs.readFileSync(fixturesPath.apply(void 0, (0, _toConsumableArray2["default"])(args)), enc);
  return fs.readFileSync(fixturesPath(args), enc);
}

function readFixtureKey(name, enc) {
  return fs.readFileSync(fixturesPath('keys', name), enc);
}

module.exports = {
  fixturesDir: fixturesDir,
  path: fixturesPath,
  readSync: readFixtureSync,
  readKey: readFixtureKey
};