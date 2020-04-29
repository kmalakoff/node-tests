/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var assert = require('assert');

var fork = require('child_process').fork;

var path = require('path');

var runjs = path.join(__dirname, '..', '..', 'benchmark', 'run.js');

function runBenchmark(name, env) {
  var argv = ['test'];
  argv.push(name);

  var mergedEnv = _objectSpread(_objectSpread({}, process.env), env);

  var child = fork(runjs, argv, {
    env: mergedEnv,
    stdio: ['inherit', 'pipe', 'inherit', 'ipc']
  });
  child.stdout.setEncoding('utf8');
  var stdout = '';
  child.stdout.on('data', function (line) {
    stdout += line;
  });
  child.on('exit', function (code, signal) {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null); // This bit makes sure that each benchmark file is being sent settings such
    // that the benchmark file runs just one set of options. This helps keep the
    // benchmark tests from taking a long time to run. Therefore, each benchmark
    // file should result in three lines of output: a blank line, a line with
    // the name of the benchmark file, and a line with the only results that we
    // get from testing the benchmark file.

    assert.ok(/^(?:\n.+?\n.+?\n)+$/.test(stdout), "benchmark file not running exactly one configuration in test: ".concat(stdout));
  });
}

module.exports = runBenchmark;