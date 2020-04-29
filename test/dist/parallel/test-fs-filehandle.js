// Flags: --expose-gc --no-warnings --expose-internals
'use strict';

var common = require('../common');

var assert = require('assert');

var path = require('path');

var _require = require('internal/test/binding'),
    internalBinding = _require.internalBinding;

var fs = internalBinding('fs');

var _require2 = require('internal/fs/utils'),
    stringToFlags = _require2.stringToFlags; // Verifies that the FileHandle object is garbage collected and that a
// warning is emitted if it is not closed.


var fdnum;
{
  var ctx = {};
  fdnum = fs.openFileHandle(path.toNamespacedPath(__filename), stringToFlags('r'), 438, undefined, ctx).fd;
  assert.strictEqual(ctx.errno, undefined);
}
var deprecationWarning = 'Closing a FileHandle object on garbage collection is deprecated. ' + 'Please close FileHandle objects explicitly using ' + 'FileHandle.prototype.close(). In the future, an error will be ' + 'thrown if a file descriptor is closed during garbage collection.';
common.expectWarning({
  'internal/test/binding': ['These APIs are for internal testing only. Do not use them.'],
  'Warning': ["Closing file descriptor ".concat(fdnum, " on garbage collection")],
  'DeprecationWarning': [[deprecationWarning, 'DEP0137']]
});
global.gc();
setTimeout(function () {}, 10);