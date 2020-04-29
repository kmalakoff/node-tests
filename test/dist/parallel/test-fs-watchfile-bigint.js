'use strict'; // Flags: --expose-internals

var common = require('../common');

var assert = require('assert');

var _require = require('internal/fs/utils'),
    BigIntStats = _require.BigIntStats;

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

var enoentFile = path.join(tmpdir.path, 'non-existent-file');
var expectedStatObject = new BigIntStats(0n, // dev
0n, // mode
0n, // nlink
0n, // uid
0n, // gid
0n, // rdev
0n, // blksize
0n, // ino
0n, // size
0n, // blocks
0n, // atimeMs
0n, // mtimeMs
0n, // ctimeMs
0n, // birthtimeMs
0n, // atimeNs
0n, // mtimeNs
0n, // ctimeNs
0n // birthtimeNs
);
tmpdir.refresh(); // If the file initially didn't exist, and gets created at a later point of
// time, the callback should be invoked again with proper values in stat object

var fileExists = false;
var options = {
  interval: 0,
  bigint: true
};
var watcher = fs.watchFile(enoentFile, options, common.mustCall(function (curr, prev) {
  if (!fileExists) {
    // If the file does not exist, all the fields should be zero and the date
    // fields should be UNIX EPOCH time
    assert.deepStrictEqual(curr, expectedStatObject);
    assert.deepStrictEqual(prev, expectedStatObject); // Create the file now, so that the callback will be called back once the
    // event loop notices it.

    fs.closeSync(fs.openSync(enoentFile, 'w'));
    fileExists = true;
  } else {
    // If the ino (inode) value is greater than zero, it means that the file
    // is present in the filesystem and it has a valid inode number.
    assert(curr.ino > 0n); // As the file just got created, previous ino value should be lesser than
    // or equal to zero (non-existent file).

    assert(prev.ino <= 0n); // Stop watching the file

    fs.unwatchFile(enoentFile);
    watcher.stop(); // Stopping a stopped watcher should be a noop
  }
}, 2)); // 'stop' should only be emitted once - stopping a stopped watcher should
// not trigger a 'stop' event.

watcher.on('stop', common.mustCall(function onStop() {}));