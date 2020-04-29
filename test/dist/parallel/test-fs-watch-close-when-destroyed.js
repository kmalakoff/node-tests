'use strict'; // This tests that closing a watcher when the underlying handle is
// already destroyed will result in a noop instead of a crash.

var common = require('../common');

if (common.isIBMi) common.skip('IBMi does not support `fs.watch()`');

var tmpdir = require('../common/tmpdir');

var fs = require('fs');

var path = require('path');

tmpdir.refresh();
var root = path.join(tmpdir.path, 'watched-directory');
fs.mkdirSync(root);
var watcher = fs.watch(root, {
  persistent: false,
  recursive: false
}); // The following listeners may or may not be invoked.

watcher.addListener('error', function () {
  setTimeout(function () {
    watcher.close();
  }, // Should not crash if it's invoked
  common.platformTimeout(10));
});
watcher.addListener('change', function () {
  setTimeout(function () {
    watcher.close();
  }, common.platformTimeout(10));
});
fs.rmdirSync(root); // Wait for the listener to hit

setTimeout(common.mustCall(function () {}), common.platformTimeout(100));