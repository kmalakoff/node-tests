// Check that exceeding RLIMIT_FSIZE fails with EFBIG
// rather than terminating the process with SIGXFSZ.
'use strict';

var common = require('../common');

var tmpdir = require('../common/tmpdir');

var assert = require('assert');

var child_process = require('child_process');

var fs = require('fs');

var path = require('path');

if (common.isWindows) common.skip('no RLIMIT_FSIZE on Windows');
if (process.config.variables.node_shared) common.skip('SIGXFSZ signal handler not installed in shared library mode');

if (process.argv[2] === 'child') {
  var filename = path.join(tmpdir.path, 'efbig.txt');
  tmpdir.refresh();
  fs.writeFileSync(filename, '.'.repeat(1 << 16)); // Exceeds RLIMIT_FSIZE.
} else {
  var cmd = "ulimit -f 1 && '".concat(process.execPath, "' '").concat(__filename, "' child");
  var result = child_process.spawnSync('/bin/sh', ['-c', cmd]);
  var haystack = result.stderr.toString();
  var needle = 'Error: EFBIG: file too large, write';
  var ok = haystack.includes(needle);
  if (!ok) console.error(haystack);
  assert(ok);
  assert.strictEqual(result.status, 1);
  assert.strictEqual(result.stdout.toString(), '');
}