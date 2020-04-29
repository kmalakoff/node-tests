'use strict';

var common = require('../common');

var _require = require('worker_threads'),
    Worker = _require.Worker,
    parentPort = _require.parentPort;

var fs = require('fs'); // Checks that terminating Workers does not crash the process if fs.watchFile()
// has active handles.
// Do not use isMainThread so that this test itself can be run inside a Worker.


if (!process.env.HAS_STARTED_WORKER) {
  process.env.HAS_STARTED_WORKER = 1;
  var worker = new Worker(__filename);
  worker.on('message', common.mustCall(function () {
    return worker.terminate();
  }));
} else {
  fs.watchFile(__filename, function () {});
  parentPort.postMessage('running');
}