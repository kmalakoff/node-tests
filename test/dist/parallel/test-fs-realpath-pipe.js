'use strict';

var common = require('../common');

if (common.isWindows || common.isAIX) common.skip("No /dev/stdin on ".concat(process.platform, "."));

var assert = require('assert');

var _require = require('child_process'),
    spawnSync = _require.spawnSync;

for (var _i = 0, _arr = ["require('fs').realpath('/dev/stdin', (err, resolvedPath) => {\n    if (err) {\n      process.exit(1);\n    }\n    if (resolvedPath) {\n      process.exit(2);\n    }\n  });", "try {\n    if (require('fs').realpathSync('/dev/stdin')) {\n      process.exit(2);\n    }\n  } catch {\n    process.exit(1);\n  }"]; _i < _arr.length; _i++) {
  var code = _arr[_i];
  assert.strictEqual(spawnSync(process.execPath, ['-e', code], {
    stdio: 'pipe'
  }).status, 2);
}