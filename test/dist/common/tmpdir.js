/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var fs = require('fs');

var path = require('path');

var _require = require('worker_threads'),
    isMainThread = _require.isMainThread;

function rimrafSync(pathname) {
  fs.rmdirSync(pathname, {
    maxRetries: 3,
    recursive: true
  });
}

var testRoot = process.env.NODE_TEST_DIR ? fs.realpathSync(process.env.NODE_TEST_DIR) : path.resolve(__dirname, '..'); // Using a `.` prefixed name, which is the convention for "hidden" on POSIX,
// gets tools to ignore it by default or by simple rules, especially eslint.

var tmpdirName = '.tmp.' + (process.env.TEST_SERIAL_ID || process.env.TEST_THREAD_ID || '0');
var tmpPath = path.join(testRoot, tmpdirName);
var firstRefresh = true;

function refresh() {
  rimrafSync(this.path);
  fs.mkdirSync(this.path);

  if (firstRefresh) {
    firstRefresh = false; // Clean only when a test uses refresh. This allows for child processes to
    // use the tmpdir and only the parent will clean on exit.

    process.on('exit', onexit);
  }
}

function onexit() {
  // Change directory to avoid possible EBUSY
  if (isMainThread) process.chdir(testRoot);

  try {
    rimrafSync(tmpPath);
  } catch (e) {
    console.error('Can\'t clean tmpdir:', tmpPath);
    var files = fs.readdirSync(tmpPath);
    console.error('Files blocking:', files);

    if (files.some(function (f) {
      return f.startsWith('.nfs');
    })) {
      // Warn about NFS "silly rename"
      console.error('Note: ".nfs*" might be files that were open and ' + 'unlinked but not closed.');
      console.error('See http://nfs.sourceforge.net/#faq_d2 for details.');
    }

    console.error();
    throw e;
  }
}

module.exports = {
  path: tmpPath,
  refresh: refresh
};