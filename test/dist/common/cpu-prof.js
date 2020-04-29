/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

require('./');

var fs = require('fs');

var path = require('path');

var assert = require('assert');

function getCpuProfiles(dir) {
  var list = fs.readdirSync(dir);
  return list.filter(function (file) {
    return file.endsWith('.cpuprofile');
  }).map(function (file) {
    return path.join(dir, file);
  });
}

function getFrames(file, suffix) {
  var data = fs.readFileSync(file, 'utf8');
  var profile = JSON.parse(data);
  var frames = profile.nodes.filter(function (i) {
    var frame = i.callFrame;
    return frame.url.endsWith(suffix);
  });
  return {
    frames: frames,
    nodes: profile.nodes
  };
}

function verifyFrames(output, file, suffix) {
  var _getFrames = getFrames(file, suffix),
      frames = _getFrames.frames,
      nodes = _getFrames.nodes;

  if (frames.length === 0) {
    // Show native debug output and the profile for debugging.
    console.log(output.stderr.toString());
    console.log(nodes);
  }

  assert.notDeepStrictEqual(frames, []);
} // We need to set --cpu-interval to a smaller value to make sure we can
// find our workload in the samples. 50us should be a small enough sampling
// interval for this.


var kCpuProfInterval = 50;

var env = _objectSpread(_objectSpread({}, process.env), {}, {
  NODE_DEBUG_NATIVE: 'INSPECTOR_PROFILER'
});

module.exports = {
  getCpuProfiles: getCpuProfiles,
  kCpuProfInterval: kCpuProfInterval,
  env: env,
  getFrames: getFrames,
  verifyFrames: verifyFrames
};