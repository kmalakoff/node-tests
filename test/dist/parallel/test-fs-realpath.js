// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var common = require('../common');

var fixtures = require('../common/fixtures');

var tmpdir = require('../common/tmpdir');

if (!common.isMainThread) common.skip('process.chdir is not available in Workers');

var assert = require('assert');

var fs = require('fs');

var path = require('path');

var async_completed = 0;
var async_expected = 0;
var unlink = [];
var skipSymlinks = !common.canCreateSymLink();
var tmpDir = tmpdir.path;
tmpdir.refresh();
var root = '/';
var assertEqualPath = assert.strictEqual;

if (common.isWindows) {
  // Something like "C:\\"
  root = process.cwd().substr(0, 3);

  assertEqualPath = function assertEqualPath(path_left, path_right, message) {
    assert.strictEqual(path_left.toLowerCase(), path_right.toLowerCase(), message);
  };
}

process.nextTick(runTest);

function tmp(p) {
  return path.join(tmpDir, p);
}

var targetsAbsDir = path.join(tmpDir, 'targets');
var tmpAbsDir = tmpDir; // Set up targetsAbsDir and expected subdirectories

fs.mkdirSync(targetsAbsDir);
fs.mkdirSync(path.join(targetsAbsDir, 'nested-index'));
fs.mkdirSync(path.join(targetsAbsDir, 'nested-index', 'one'));
fs.mkdirSync(path.join(targetsAbsDir, 'nested-index', 'two'));

function asynctest(testBlock, args, callback, assertBlock) {
  async_expected++;
  testBlock.apply(testBlock, args.concat(function (err) {
    var ignoreError = false;

    if (assertBlock) {
      try {
        ignoreError = assertBlock.apply(assertBlock, arguments);
      } catch (e) {
        err = e;
      }
    }

    async_completed++;
    callback(ignoreError ? null : err);
  }));
} // sub-tests:


function test_simple_error_callback(realpath, realpathSync, cb) {
  realpath('/this/path/does/not/exist', common.mustCall(function (err, s) {
    assert(err);
    assert(!s);
    cb();
  }));
}

function test_simple_error_cb_with_null_options(realpath, realpathSync, cb) {
  realpath('/this/path/does/not/exist', null, common.mustCall(function (err, s) {
    assert(err);
    assert(!s);
    cb();
  }));
}

function test_simple_relative_symlink(realpath, realpathSync, callback) {
  console.log('test_simple_relative_symlink');

  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }

  var entry = "".concat(tmpDir, "/symlink");
  var expected = "".concat(tmpDir, "/cycles/root.js");
  [[entry, "../".concat(path.basename(tmpDir), "/cycles/root.js")]].forEach(function (t) {
    try {
      fs.unlinkSync(t[0]);
    } catch (_unused) {}

    console.log('fs.symlinkSync(%j, %j, %j)', t[1], t[0], 'file');
    fs.symlinkSync(t[1], t[0], 'file');
    unlink.push(t[0]);
  });
  var result = realpathSync(entry);
  assertEqualPath(result, path.resolve(expected));
  asynctest(realpath, [entry], callback, function (err, result) {
    assertEqualPath(result, path.resolve(expected));
  });
}

function test_simple_absolute_symlink(realpath, realpathSync, callback) {
  console.log('test_simple_absolute_symlink'); // This one should still run, even if skipSymlinks is set,
  // because it uses a junction.

  var type = skipSymlinks ? 'junction' : 'dir';
  console.log('using type=%s', type);
  var entry = "".concat(tmpAbsDir, "/symlink");
  var expected = fixtures.path('nested-index', 'one');
  [[entry, expected]].forEach(function (t) {
    try {
      fs.unlinkSync(t[0]);
    } catch (_unused2) {}

    console.error('fs.symlinkSync(%j, %j, %j)', t[1], t[0], type);
    fs.symlinkSync(t[1], t[0], type);
    unlink.push(t[0]);
  });
  var result = realpathSync(entry);
  assertEqualPath(result, path.resolve(expected));
  asynctest(realpath, [entry], callback, function (err, result) {
    assertEqualPath(result, path.resolve(expected));
  });
}

function test_deep_relative_file_symlink(realpath, realpathSync, callback) {
  console.log('test_deep_relative_file_symlink');

  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }

  var expected = fixtures.path('cycles', 'root.js');
  var linkData1 = path.relative(path.join(targetsAbsDir, 'nested-index', 'one'), expected);
  var linkPath1 = path.join(targetsAbsDir, 'nested-index', 'one', 'symlink1.js');

  try {
    fs.unlinkSync(linkPath1);
  } catch (_unused3) {}

  fs.symlinkSync(linkData1, linkPath1, 'file');
  var linkData2 = '../one/symlink1.js';
  var entry = path.join(targetsAbsDir, 'nested-index', 'two', 'symlink1-b.js');

  try {
    fs.unlinkSync(entry);
  } catch (_unused4) {}

  fs.symlinkSync(linkData2, entry, 'file');
  unlink.push(linkPath1);
  unlink.push(entry);
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function (err, result) {
    assertEqualPath(result, path.resolve(expected));
  });
}

function test_deep_relative_dir_symlink(realpath, realpathSync, callback) {
  console.log('test_deep_relative_dir_symlink');

  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }

  var expected = fixtures.path('cycles', 'folder');
  var path1b = path.join(targetsAbsDir, 'nested-index', 'one');
  var linkPath1b = path.join(path1b, 'symlink1-dir');
  var linkData1b = path.relative(path1b, expected);

  try {
    fs.unlinkSync(linkPath1b);
  } catch (_unused5) {}

  fs.symlinkSync(linkData1b, linkPath1b, 'dir');
  var linkData2b = '../one/symlink1-dir';
  var entry = path.join(targetsAbsDir, 'nested-index', 'two', 'symlink12-dir');

  try {
    fs.unlinkSync(entry);
  } catch (_unused6) {}

  fs.symlinkSync(linkData2b, entry, 'dir');
  unlink.push(linkPath1b);
  unlink.push(entry);
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function (err, result) {
    assertEqualPath(result, path.resolve(expected));
  });
}

function test_cyclic_link_protection(realpath, realpathSync, callback) {
  console.log('test_cyclic_link_protection');

  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }

  var entry = path.join(tmpDir, '/cycles/realpath-3a');
  [[entry, '../cycles/realpath-3b'], [path.join(tmpDir, '/cycles/realpath-3b'), '../cycles/realpath-3c'], [path.join(tmpDir, '/cycles/realpath-3c'), '../cycles/realpath-3a']].forEach(function (t) {
    try {
      fs.unlinkSync(t[0]);
    } catch (_unused7) {}

    fs.symlinkSync(t[1], t[0], 'dir');
    unlink.push(t[0]);
  });
  assert["throws"](function () {
    realpathSync(entry);
  }, {
    code: 'ELOOP',
    name: 'Error'
  });
  asynctest(realpath, [entry], callback, common.mustCall(function (err, result) {
    assert.strictEqual(err.path, entry);
    assert.strictEqual(result, undefined);
    return true;
  }));
}

function test_cyclic_link_overprotection(realpath, realpathSync, callback) {
  console.log('test_cyclic_link_overprotection');

  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }

  var cycles = "".concat(tmpDir, "/cycles");
  var expected = realpathSync(cycles);
  var folder = "".concat(cycles, "/folder");
  var link = "".concat(folder, "/cycles");
  var testPath = cycles;
  testPath += '/folder/cycles'.repeat(10);

  try {
    fs.unlinkSync(link);
  } catch (_unused8) {}

  fs.symlinkSync(cycles, link, 'dir');
  unlink.push(link);
  assertEqualPath(realpathSync(testPath), path.resolve(expected));
  asynctest(realpath, [testPath], callback, function (er, res) {
    assertEqualPath(res, path.resolve(expected));
  });
}

function test_relative_input_cwd(realpath, realpathSync, callback) {
  console.log('test_relative_input_cwd');

  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  } // We need to calculate the relative path to the tmp dir from cwd


  var entrydir = process.cwd();
  var entry = path.relative(entrydir, path.join("".concat(tmpDir, "/cycles/realpath-3a")));
  var expected = "".concat(tmpDir, "/cycles/root.js");
  [[entry, '../cycles/realpath-3b'], ["".concat(tmpDir, "/cycles/realpath-3b"), '../cycles/realpath-3c'], ["".concat(tmpDir, "/cycles/realpath-3c"), 'root.js']].forEach(function (t) {
    var fn = t[0];
    console.error('fn=%j', fn);

    try {
      fs.unlinkSync(fn);
    } catch (_unused9) {}

    var b = path.basename(t[1]);
    var type = b === 'root.js' ? 'file' : 'dir';
    console.log('fs.symlinkSync(%j, %j, %j)', t[1], fn, type);
    fs.symlinkSync(t[1], fn, 'file');
    unlink.push(fn);
  });
  var origcwd = process.cwd();
  process.chdir(entrydir);
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function (err, result) {
    process.chdir(origcwd);
    assertEqualPath(result, path.resolve(expected));
    return true;
  });
}

function test_deep_symlink_mix(realpath, realpathSync, callback) {
  console.log('test_deep_symlink_mix');

  if (common.isWindows) {
    // This one is a mix of files and directories, and it's quite tricky
    // to get the file/dir links sorted out correctly.
    common.printSkipMessage('symlink test (no privs)');
    return callback();
  }
  /*
  /tmp/node-test-realpath-f1 -> $tmpDir/node-test-realpath-d1/foo
  /tmp/node-test-realpath-d1 -> $tmpDir/node-test-realpath-d2
  /tmp/node-test-realpath-d2/foo -> $tmpDir/node-test-realpath-f2
  /tmp/node-test-realpath-f2
    -> $tmpDir/targets/nested-index/one/realpath-c
  $tmpDir/targets/nested-index/one/realpath-c
    -> $tmpDir/targets/nested-index/two/realpath-c
  $tmpDir/targets/nested-index/two/realpath-c -> $tmpDir/cycles/root.js
  $tmpDir/targets/cycles/root.js (hard)
  */


  var entry = tmp('node-test-realpath-f1');

  try {
    fs.unlinkSync(tmp('node-test-realpath-d2/foo'));
  } catch (_unused10) {}

  try {
    fs.rmdirSync(tmp('node-test-realpath-d2'));
  } catch (_unused11) {}

  fs.mkdirSync(tmp('node-test-realpath-d2'), 448);

  try {
    [[entry, "".concat(tmpDir, "/node-test-realpath-d1/foo")], [tmp('node-test-realpath-d1'), "".concat(tmpDir, "/node-test-realpath-d2")], [tmp('node-test-realpath-d2/foo'), '../node-test-realpath-f2'], [tmp('node-test-realpath-f2'), "".concat(targetsAbsDir, "/nested-index/one/realpath-c")], ["".concat(targetsAbsDir, "/nested-index/one/realpath-c"), "".concat(targetsAbsDir, "/nested-index/two/realpath-c")], ["".concat(targetsAbsDir, "/nested-index/two/realpath-c"), "".concat(tmpDir, "/cycles/root.js")]].forEach(function (t) {
      try {
        fs.unlinkSync(t[0]);
      } catch (_unused12) {}

      fs.symlinkSync(t[1], t[0]);
      unlink.push(t[0]);
    });
  } finally {
    unlink.push(tmp('node-test-realpath-d2'));
  }

  var expected = "".concat(tmpAbsDir, "/cycles/root.js");
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function (err, result) {
    assertEqualPath(result, path.resolve(expected));
    return true;
  });
}

function test_non_symlinks(realpath, realpathSync, callback) {
  console.log('test_non_symlinks');
  var entrydir = path.dirname(tmpAbsDir);
  var entry = "".concat(tmpAbsDir.substr(entrydir.length + 1), "/cycles/root.js");
  var expected = "".concat(tmpAbsDir, "/cycles/root.js");
  var origcwd = process.cwd();
  process.chdir(entrydir);
  assertEqualPath(realpathSync(entry), path.resolve(expected));
  asynctest(realpath, [entry], callback, function (err, result) {
    process.chdir(origcwd);
    assertEqualPath(result, path.resolve(expected));
    return true;
  });
}

var upone = path.join(process.cwd(), '..');

function test_escape_cwd(realpath, realpathSync, cb) {
  console.log('test_escape_cwd');
  asynctest(realpath, ['..'], cb, function (er, uponeActual) {
    assertEqualPath(upone, uponeActual, "realpath(\"..\") expected: ".concat(path.resolve(upone), " actual:").concat(uponeActual));
  });
}

function test_upone_actual(realpath, realpathSync, cb) {
  console.log('test_upone_actual');
  var uponeActual = realpathSync('..');
  assertEqualPath(upone, uponeActual);
  cb();
} // Going up with .. multiple times
// .
// `-- a/
//     |-- b/
//     |   `-- e -> ..
//     `-- d -> ..
// realpath(a/b/e/d/a/b/e/d/a) ==> a


function test_up_multiple(realpath, realpathSync, cb) {
  console.error('test_up_multiple');

  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return cb();
  }

  var tmpdir = require('../common/tmpdir');

  tmpdir.refresh();
  fs.mkdirSync(tmp('a'), 493);
  fs.mkdirSync(tmp('a/b'), 493);
  fs.symlinkSync('..', tmp('a/d'), 'dir');
  unlink.push(tmp('a/d'));
  fs.symlinkSync('..', tmp('a/b/e'), 'dir');
  unlink.push(tmp('a/b/e'));
  var abedabed = tmp('abedabed'.split('').join('/'));
  var abedabed_real = tmp('');
  var abedabeda = tmp('abedabeda'.split('').join('/'));
  var abedabeda_real = tmp('a');
  assertEqualPath(realpathSync(abedabeda), abedabeda_real);
  assertEqualPath(realpathSync(abedabed), abedabed_real);
  realpath(abedabeda, function (er, real) {
    assert.ifError(er);
    assertEqualPath(abedabeda_real, real);
    realpath(abedabed, function (er, real) {
      assert.ifError(er);
      assertEqualPath(abedabed_real, real);
      cb();
    });
  });
} // Going up with .. multiple times with options = null
// .
// `-- a/
//     |-- b/
//     |   `-- e -> ..
//     `-- d -> ..
// realpath(a/b/e/d/a/b/e/d/a) ==> a


function test_up_multiple_with_null_options(realpath, realpathSync, cb) {
  console.error('test_up_multiple');

  if (skipSymlinks) {
    common.printSkipMessage('symlink test (no privs)');
    return cb();
  }

  var tmpdir = require('../common/tmpdir');

  tmpdir.refresh();
  fs.mkdirSync(tmp('a'), 493);
  fs.mkdirSync(tmp('a/b'), 493);
  fs.symlinkSync('..', tmp('a/d'), 'dir');
  unlink.push(tmp('a/d'));
  fs.symlinkSync('..', tmp('a/b/e'), 'dir');
  unlink.push(tmp('a/b/e'));
  var abedabed = tmp('abedabed'.split('').join('/'));
  var abedabed_real = tmp('');
  var abedabeda = tmp('abedabeda'.split('').join('/'));
  var abedabeda_real = tmp('a');
  assertEqualPath(realpathSync(abedabeda), abedabeda_real);
  assertEqualPath(realpathSync(abedabed), abedabed_real);
  realpath(abedabeda, null, function (er, real) {
    assert.ifError(er);
    assertEqualPath(abedabeda_real, real);
    realpath(abedabed, null, function (er, real) {
      assert.ifError(er);
      assertEqualPath(abedabed_real, real);
      cb();
    });
  });
} // Absolute symlinks with children.
// .
// `-- a/
//     |-- b/
//     |   `-- c/
//     |       `-- x.txt
//     `-- link -> /tmp/node-test-realpath-abs-kids/a/b/
// realpath(root+'/a/link/c/x.txt') ==> root+'/a/b/c/x.txt'


function test_abs_with_kids(realpath, realpathSync, cb) {
  console.log('test_abs_with_kids'); // This one should still run, even if skipSymlinks is set,
  // because it uses a junction.

  var type = skipSymlinks ? 'junction' : 'dir';
  console.log('using type=%s', type);
  var root = "".concat(tmpAbsDir, "/node-test-realpath-abs-kids");

  function cleanup() {
    ['/a/b/c/x.txt', '/a/link'].forEach(function (file) {
      try {
        fs.unlinkSync(root + file);
      } catch (_unused13) {}
    });
    ['/a/b/c', '/a/b', '/a', ''].forEach(function (folder) {
      try {
        fs.rmdirSync(root + folder);
      } catch (_unused14) {}
    });
  }

  function setup() {
    cleanup();
    ['', '/a', '/a/b', '/a/b/c'].forEach(function (folder) {
      console.log("mkdir ".concat(root).concat(folder));
      fs.mkdirSync(root + folder, 448);
    });
    fs.writeFileSync("".concat(root, "/a/b/c/x.txt"), 'foo');
    fs.symlinkSync("".concat(root, "/a/b"), "".concat(root, "/a/link"), type);
  }

  setup();
  var linkPath = "".concat(root, "/a/link/c/x.txt");
  var expectPath = "".concat(root, "/a/b/c/x.txt");
  var actual = realpathSync(linkPath); // console.log({link:linkPath,expect:expectPath,actual:actual},'sync');

  assertEqualPath(actual, path.resolve(expectPath));
  asynctest(realpath, [linkPath], cb, function (er, actual) {
    // console.log({link:linkPath,expect:expectPath,actual:actual},'async');
    assertEqualPath(actual, path.resolve(expectPath));
    cleanup();
  });
}

function test_root(realpath, realpathSync, cb) {
  assertEqualPath(root, realpathSync('/'));
  realpath('/', function (err, result) {
    assert.ifError(err);
    assertEqualPath(root, result);
    cb();
  });
}

function test_root_with_null_options(realpath, realpathSync, cb) {
  realpath('/', null, function (err, result) {
    assert.ifError(err);
    assertEqualPath(root, result);
    cb();
  });
} // ----------------------------------------------------------------------------


var tests = [test_simple_error_callback, test_simple_error_cb_with_null_options, test_simple_relative_symlink, test_simple_absolute_symlink, test_deep_relative_file_symlink, test_deep_relative_dir_symlink, test_cyclic_link_protection, test_cyclic_link_overprotection, test_relative_input_cwd, test_deep_symlink_mix, test_non_symlinks, test_escape_cwd, test_upone_actual, test_abs_with_kids, test_up_multiple, test_up_multiple_with_null_options, test_root, test_root_with_null_options];
var numtests = tests.length;
var testsRun = 0;

function runNextTest(err) {
  assert.ifError(err);
  var test = tests.shift();

  if (!test) {
    return console.log("".concat(numtests, " subtests completed OK for fs.realpath"));
  }

  testsRun++;
  test(fs.realpath, fs.realpathSync, common.mustCall(function (err) {
    assert.ifError(err);
    testsRun++;
    test(fs.realpath["native"], fs.realpathSync["native"], common.mustCall(runNextTest));
  }));
}

function runTest() {
  var tmpDirs = ['cycles', 'cycles/folder'];
  tmpDirs.forEach(function (t) {
    t = tmp(t);
    fs.mkdirSync(t, 448);
  });
  fs.writeFileSync(tmp('cycles/root.js'), "console.error('roooot!');");
  console.error('start tests');
  runNextTest();
}

process.on('exit', function () {
  assert.strictEqual(2 * numtests, testsRun);
  assert.strictEqual(async_completed, async_expected);
});