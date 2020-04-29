/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

if (module.parent) {
  var runModuleAs = function runModuleAs(filename, flags, spawnOptions, role) {
    return spawnSync(process.execPath, [].concat((0, _toConsumableArray2["default"])(flags), [__filename, role, filename]), spawnOptions);
  };

  var _require = require('child_process'),
      spawnSync = _require.spawnSync;

  module.exports = runModuleAs;
  return;
}

var _require2 = require('worker_threads'),
    Worker = _require2.Worker,
    isMainThread = _require2.isMainThread,
    workerData = _require2.workerData;

if (isMainThread) {
  if (process.argv[2] === 'worker') {
    new Worker(__filename, {
      workerData: process.argv[3]
    });
    return;
  }

  require(process.argv[3]);
} else {
  require(workerData);
}