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

/* eslint-disable node-core/require-common-first, node-core/required-modules */

/* eslint-disable node-core/crypto-check */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var process = global.process; // Some tests tamper with the process global.

var assert = require('assert');

var _require = require('child_process'),
    exec = _require.exec,
    execSync = _require.execSync,
    spawnSync = _require.spawnSync;

var fs = require('fs'); // Do not require 'os' until needed so that test-os-checked-fucnction can
// monkey patch it. If 'os' is required here, that test will fail.


var path = require('path');

var util = require('util');

var _require2 = require('worker_threads'),
    isMainThread = _require2.isMainThread;

var tmpdir = require('./tmpdir');

var bits = ['arm64', 'mips', 'mipsel', 'ppc64', 's390x', 'x64'].includes(process.arch) ? 64 : 32;
var hasIntl = !!process.config.variables.v8_enable_i18n_support; // Some tests assume a umask of 0o022 so set that up front. Tests that need a
// different umask will set it themselves.
//
// Workers can read, but not set the umask, so check that this is the main
// thread.

if (isMainThread) process.umask(18);

var noop = function noop() {};

var hasCrypto = Boolean(process.versions.openssl) && !process.env.NODE_SKIP_CRYPTO; // Check for flags. Skip this for workers (both, the `cluster` module and
// `worker_threads`) and child processes.
// If the binary was built without-ssl then the crypto flags are
// invalid (bad option). The test itself should handle this case.

if (process.argv.length === 2 && !process.env.NODE_SKIP_FLAG_CHECK && isMainThread && hasCrypto && module.parent && require('cluster').isMaster) {
  // The copyright notice is relatively big and the flags could come afterwards.
  var bytesToRead = 1500;
  var buffer = Buffer.allocUnsafe(bytesToRead);
  var fd = fs.openSync(module.parent.filename, 'r');
  var bytesRead = fs.readSync(fd, buffer, 0, bytesToRead);
  fs.closeSync(fd);
  var source = buffer.toString('utf8', 0, bytesRead);
  var flagStart = source.indexOf('// Flags: --') + 10;

  if (flagStart !== 9) {
    var flagEnd = source.indexOf('\n', flagStart); // Normalize different EOL.

    if (source[flagEnd - 1] === '\r') {
      flagEnd--;
    }

    var flags = source.substring(flagStart, flagEnd).replace(/_/g, '-').split(' ');
    var args = process.execArgv.map(function (arg) {
      return arg.replace(/_/g, '-');
    });

    var _iterator = _createForOfIteratorHelper(flags),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var flag = _step.value;

        if (!args.includes(flag) && ( // If the binary is build without `intl` the inspect option is
        // invalid. The test itself should handle this case.
        process.features.inspector || !flag.startsWith('--inspect'))) {
          console.log('NOTE: The test started as a child_process using these flags:', util.inspect(flags), 'Use NODE_SKIP_FLAG_CHECK to run the test with the original flags.');

          var _args = [].concat((0, _toConsumableArray2["default"])(flags), (0, _toConsumableArray2["default"])(process.execArgv), (0, _toConsumableArray2["default"])(process.argv.slice(1)));

          var options = {
            encoding: 'utf8',
            stdio: 'inherit'
          };
          var result = spawnSync(process.execPath, _args, options);

          if (result.signal) {
            process.kill(0, result.signal);
          } else {
            process.exit(result.status);
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

var isWindows = process.platform === 'win32';
var isAIX = process.platform === 'aix';
var isSunOS = process.platform === 'sunos';
var isFreeBSD = process.platform === 'freebsd';
var isOpenBSD = process.platform === 'openbsd';
var isLinux = process.platform === 'linux';
var isOSX = process.platform === 'darwin';
var rootDir = isWindows ? 'c:\\' : '/';
var buildType = process.config.target_defaults ? process.config.target_defaults.default_configuration : 'Release'; // If env var is set then enable async_hook hooks for all tests.

if (process.env.NODE_TEST_WITH_ASYNC_HOOKS) {
  var destroydIdsList = {};
  var destroyListList = {};
  var initHandles = {};

  var _require3 = require('internal/test/binding'),
      internalBinding = _require3.internalBinding;

  var async_wrap = internalBinding('async_wrap');
  process.on('exit', function () {
    // Iterate through handles to make sure nothing crashes
    for (var k in initHandles) {
      util.inspect(initHandles[k]);
    }
  });
  var _queueDestroyAsyncId = async_wrap.queueDestroyAsyncId;

  async_wrap.queueDestroyAsyncId = function queueDestroyAsyncId(id) {
    if (destroyListList[id] !== undefined) {
      process._rawDebug(destroyListList[id]);

      process._rawDebug();

      throw new Error("same id added to destroy list twice (".concat(id, ")"));
    }

    destroyListList[id] = util.inspect(new Error());

    _queueDestroyAsyncId(id);
  };

  require('async_hooks').createHook({
    init: function init(id, ty, tr, resource) {
      if (initHandles[id]) {
        process._rawDebug("Is same resource: ".concat(resource === initHandles[id].resource));

        process._rawDebug("Previous stack:\n".concat(initHandles[id].stack, "\n"));

        throw new Error("init called twice for same id (".concat(id, ")"));
      }

      initHandles[id] = {
        resource: resource,
        stack: util.inspect(new Error()).substr(6)
      };
    },
    before: function before() {},
    after: function after() {},
    destroy: function destroy(id) {
      if (destroydIdsList[id] !== undefined) {
        process._rawDebug(destroydIdsList[id]);

        process._rawDebug();

        throw new Error("destroy called for same id (".concat(id, ")"));
      }

      destroydIdsList[id] = util.inspect(new Error());
    }
  }).enable();
}

var opensslCli = null;
var inFreeBSDJail = null;
var localhostIPv4 = null;
var localIPv6Hosts = isLinux ? [// Debian/Ubuntu
'ip6-localhost', 'ip6-loopback', // SUSE
'ipv6-localhost', 'ipv6-loopback', // Typically universal
'localhost'] : ['localhost'];

var PIPE = function () {
  var localRelative = path.relative(process.cwd(), "".concat(tmpdir.path, "/"));
  var pipePrefix = isWindows ? '\\\\.\\pipe\\' : localRelative;
  var pipeName = "node-test.".concat(process.pid, ".sock");
  return path.join(pipePrefix, pipeName);
}();
/*
 * Check that when running a test with
 * `$node --abort-on-uncaught-exception $file child`
 * the process aborts.
 */


function childShouldThrowAndAbort() {
  var testCmd = '';

  if (!isWindows) {
    // Do not create core files, as it can take a lot of disk space on
    // continuous testing and developers' machines
    testCmd += 'ulimit -c 0 && ';
  }

  testCmd += "\"".concat(process.argv[0], "\" --abort-on-uncaught-exception ");
  testCmd += "\"".concat(process.argv[1], "\" child");
  var child = exec(testCmd);
  child.on('exit', function onExit(exitCode, signal) {
    var errMsg = 'Test should have aborted ' + "but instead exited with exit code ".concat(exitCode) + " and signal ".concat(signal);
    assert(nodeProcessAborted(exitCode, signal), errMsg);
  });
}

function createZeroFilledFile(filename) {
  var fd = fs.openSync(filename, 'w');
  fs.ftruncateSync(fd, 10 * 1024 * 1024);
  fs.closeSync(fd);
}

var pwdCommand = isWindows ? ['cmd.exe', ['/d', '/c', 'cd']] : ['pwd', []];

function platformTimeout(ms) {
  var multipliers = typeof ms === 'bigint' ? {
    two: 2n,
    four: 4n,
    seven: 7n
  } : {
    two: 2,
    four: 4,
    seven: 7
  };
  if (process.features.debug) ms = multipliers.two * ms;
  if (isAIX) return multipliers.two * ms; // Default localhost speed is slower on AIX

  if (process.arch !== 'arm') return ms;
  var armv = process.config.variables.arm_version;
  if (armv === '6') return multipliers.seven * ms; // ARMv6

  if (armv === '7') return multipliers.two * ms; // ARMv7

  return ms; // ARMv8+
}

var knownGlobals = [clearImmediate, clearInterval, clearTimeout, global, setImmediate, setInterval, setTimeout, queueMicrotask];

if (global.gc) {
  knownGlobals.push(global.gc);
}

function allowGlobals() {
  for (var _len = arguments.length, whitelist = new Array(_len), _key = 0; _key < _len; _key++) {
    whitelist[_key] = arguments[_key];
  }

  knownGlobals = knownGlobals.concat(whitelist);
}

if (process.env.NODE_TEST_KNOWN_GLOBALS !== '0') {
  var leakedGlobals = function leakedGlobals() {
    var leaked = [];

    for (var val in global) {
      if (!knownGlobals.includes(global[val])) {
        leaked.push(val);
      }
    }

    return leaked;
  };

  if (process.env.NODE_TEST_KNOWN_GLOBALS) {
    var knownFromEnv = process.env.NODE_TEST_KNOWN_GLOBALS.split(',');
    allowGlobals.apply(void 0, (0, _toConsumableArray2["default"])(knownFromEnv));
  }

  process.on('exit', function () {
    var leaked = leakedGlobals();

    if (leaked.length > 0) {
      assert.fail("Unexpected global(s) found: ".concat(leaked.join(', ')));
    }
  });
}

var mustCallChecks = [];

function runCallChecks(exitCode) {
  if (exitCode !== 0) return;
  var failed = mustCallChecks.filter(function (context) {
    if ('minimum' in context) {
      context.messageSegment = "at least ".concat(context.minimum);
      return context.actual < context.minimum;
    } else {
      context.messageSegment = "exactly ".concat(context.exact);
      return context.actual !== context.exact;
    }
  });
  failed.forEach(function (context) {
    console.log('Mismatched %s function calls. Expected %s, actual %d.', context.name, context.messageSegment, context.actual);
    console.log(context.stack.split('\n').slice(2).join('\n'));
  });
  if (failed.length) process.exit(1);
}

function mustCall(fn, exact) {
  return _mustCallInner(fn, exact, 'exact');
}

function mustCallAtLeast(fn, minimum) {
  return _mustCallInner(fn, minimum, 'minimum');
}

function _mustCallInner(fn) {
  var _context;

  var criteria = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var field = arguments.length > 2 ? arguments[2] : undefined;
  if (process._exiting) throw new Error('Cannot use common.mustCall*() in process exit handler');

  if (typeof fn === 'number') {
    criteria = fn;
    fn = noop;
  } else if (fn === undefined) {
    fn = noop;
  }

  if (typeof criteria !== 'number') throw new TypeError("Invalid ".concat(field, " value: ").concat(criteria));
  var context = (_context = {}, (0, _defineProperty2["default"])(_context, field, criteria), (0, _defineProperty2["default"])(_context, "actual", 0), (0, _defineProperty2["default"])(_context, "stack", util.inspect(new Error())), (0, _defineProperty2["default"])(_context, "name", fn.name || '<anonymous>'), _context); // Add the exit listener only once to avoid listener leak warnings

  if (mustCallChecks.length === 0) process.on('exit', runCallChecks);
  mustCallChecks.push(context);
  return function () {
    context.actual++;
    return fn.apply(this, arguments);
  };
}

function hasMultiLocalhost() {
  var _require4 = require('internal/test/binding'),
      internalBinding = _require4.internalBinding;

  var _internalBinding = internalBinding('tcp_wrap'),
      TCP = _internalBinding.TCP,
      TCPConstants = _internalBinding.constants;

  var t = new TCP(TCPConstants.SOCKET);
  var ret = t.bind('127.0.0.2', 0);
  t.close();
  return ret === 0;
}

function skipIfEslintMissing() {
  if (!fs.existsSync(path.join(__dirname, '..', '..', 'tools', 'node_modules', 'eslint'))) {
    skip('missing ESLint');
  }
}

function canCreateSymLink() {
  // On Windows, creating symlinks requires admin privileges.
  // We'll only try to run symlink test if we have enough privileges.
  // On other platforms, creating symlinks shouldn't need admin privileges
  if (isWindows) {
    // whoami.exe needs to be the one from System32
    // If unix tools are in the path, they can shadow the one we want,
    // so use the full path while executing whoami
    var whoamiPath = path.join(process.env.SystemRoot, 'System32', 'whoami.exe');

    try {
      var output = execSync("".concat(whoamiPath, " /priv"), {
        timeout: 1000
      });
      return output.includes('SeCreateSymbolicLinkPrivilege');
    } catch (_unused) {
      return false;
    }
  } // On non-Windows platforms, this always returns `true`


  return true;
}

function getCallSite(top) {
  var originalStackFormatter = Error.prepareStackTrace;

  Error.prepareStackTrace = function (err, stack) {
    return "".concat(stack[0].getFileName(), ":").concat(stack[0].getLineNumber());
  };

  var err = new Error();
  Error.captureStackTrace(err, top); // With the V8 Error API, the stack is not formatted until it is accessed

  err.stack;
  Error.prepareStackTrace = originalStackFormatter;
  return err.stack;
}

function mustNotCall(msg) {
  var callSite = getCallSite(mustNotCall);
  return function mustNotCall() {
    assert.fail("".concat(msg || 'function should not have been called', " at ").concat(callSite));
  };
}

function printSkipMessage(msg) {
  console.log("1..0 # Skipped: ".concat(msg));
}

function skip(msg) {
  printSkipMessage(msg);
  process.exit(0);
} // Returns true if the exit code "exitCode" and/or signal name "signal"
// represent the exit code and/or signal name of a node process that aborted,
// false otherwise.


function nodeProcessAborted(exitCode, signal) {
  // Depending on the compiler used, node will exit with either
  // exit code 132 (SIGILL), 133 (SIGTRAP) or 134 (SIGABRT).
  var expectedExitCodes = [132, 133, 134]; // On platforms using KSH as the default shell (like SmartOS),
  // when a process aborts, KSH exits with an exit code that is
  // greater than 256, and thus the exit code emitted with the 'exit'
  // event is null and the signal is set to either SIGILL, SIGTRAP,
  // or SIGABRT (depending on the compiler).

  var expectedSignals = ['SIGILL', 'SIGTRAP', 'SIGABRT']; // On Windows, 'aborts' are of 2 types, depending on the context:
  // (i) Forced access violation, if --abort-on-uncaught-exception is on
  // which corresponds to exit code 3221225477 (0xC0000005)
  // (ii) Otherwise, _exit(134) which is called in place of abort() due to
  // raising SIGABRT exiting with ambiguous exit code '3' by default

  if (isWindows) expectedExitCodes = [0xC0000005, 134]; // When using --abort-on-uncaught-exception, V8 will use
  // base::OS::Abort to terminate the process.
  // Depending on the compiler used, the shell or other aspects of
  // the platform used to build the node binary, this will actually
  // make V8 exit by aborting or by raising a signal. In any case,
  // one of them (exit code or signal) needs to be set to one of
  // the expected exit codes or signals.

  if (signal !== null) {
    return expectedSignals.includes(signal);
  } else {
    return expectedExitCodes.includes(exitCode);
  }
}

function isAlive(pid) {
  try {
    process.kill(pid, 'SIGCONT');
    return true;
  } catch (_unused2) {
    return false;
  }
}

function _expectWarning(name, expected, code) {
  if (typeof expected === 'string') {
    expected = [[expected, code]];
  } else if (!Array.isArray(expected)) {
    expected = Object.entries(expected).map(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          a = _ref2[0],
          b = _ref2[1];

      return [b, a];
    });
  } else if (!Array.isArray(expected[0])) {
    expected = [[expected[0], expected[1]]];
  } // Deprecation codes are mandatory, everything else is not.


  if (name === 'DeprecationWarning') {
    expected.forEach(function (_ref3) {
      var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
          _ = _ref4[0],
          code = _ref4[1];

      return assert(code, expected);
    });
  }

  return mustCall(function (warning) {
    var _expected$shift = expected.shift(),
        _expected$shift2 = (0, _slicedToArray2["default"])(_expected$shift, 2),
        message = _expected$shift2[0],
        code = _expected$shift2[1];

    assert.strictEqual(warning.name, name);

    if (typeof message === 'string') {
      assert.strictEqual(warning.message, message);
    } else {
      assert(message.test(warning.message));
    }

    assert.strictEqual(warning.code, code);
  }, expected.length);
}

var catchWarning; // Accepts a warning name and description or array of descriptions or a map of
// warning names to description(s) ensures a warning is generated for each
// name/description pair.
// The expected messages have to be unique per `expectWarning()` call.

function expectWarning(nameOrMap, expected, code) {
  if (catchWarning === undefined) {
    catchWarning = {};
    process.on('warning', function (warning) {
      if (!catchWarning[warning.name]) {
        throw new TypeError("\"".concat(warning.name, "\" was triggered without being expected.\n") + util.inspect(warning));
      }

      catchWarning[warning.name](warning);
    });
  }

  if (typeof nameOrMap === 'string') {
    catchWarning[nameOrMap] = _expectWarning(nameOrMap, expected, code);
  } else {
    Object.keys(nameOrMap).forEach(function (name) {
      catchWarning[name] = _expectWarning(name, nameOrMap[name]);
    });
  }
} // Useful for testing expected internal/error objects


function expectsError(validator, exact) {
  return mustCall(function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (args.length !== 1) {
      // Do not use `assert.strictEqual()` to prevent `inspect` from
      // always being called.
      assert.fail("Expected one argument, got ".concat(util.inspect(args)));
    }

    var error = args.pop();
    var descriptor = Object.getOwnPropertyDescriptor(error, 'message'); // The error message should be non-enumerable

    assert.strictEqual(descriptor.enumerable, false);
    assert["throws"](function () {
      throw error;
    }, validator);
    return true;
  }, exact);
}

function skipIfInspectorDisabled() {
  if (!process.features.inspector) {
    skip('V8 inspector is disabled');
  }
}

function skipIf32Bits() {
  if (bits < 64) {
    skip('The tested feature is not available in 32bit builds');
  }
}

function skipIfWorker() {
  if (!isMainThread) {
    skip('This test only works on a main thread');
  }
}

function getArrayBufferViews(buf) {
  var buffer = buf.buffer,
      byteOffset = buf.byteOffset,
      byteLength = buf.byteLength;
  var out = [];
  var arrayBufferViews = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, DataView];

  for (var _i = 0, _arrayBufferViews = arrayBufferViews; _i < _arrayBufferViews.length; _i++) {
    var type = _arrayBufferViews[_i];
    var _type$BYTES_PER_ELEME = type.BYTES_PER_ELEMENT,
        BYTES_PER_ELEMENT = _type$BYTES_PER_ELEME === void 0 ? 1 : _type$BYTES_PER_ELEME;

    if (byteLength % BYTES_PER_ELEMENT === 0) {
      out.push(new type(buffer, byteOffset, byteLength / BYTES_PER_ELEMENT));
    }
  }

  return out;
}

function getBufferSources(buf) {
  return [].concat((0, _toConsumableArray2["default"])(getArrayBufferViews(buf)), [new Uint8Array(buf).buffer]);
} // Crash the process on unhandled rejections.


var crashOnUnhandledRejection = function crashOnUnhandledRejection(err) {
  throw err;
};

process.on('unhandledRejection', crashOnUnhandledRejection);

function disableCrashOnUnhandledRejection() {
  process.removeListener('unhandledRejection', crashOnUnhandledRejection);
}

function getTTYfd() {
  // Do our best to grab a tty fd.
  var tty = require('tty'); // Don't attempt fd 0 as it is not writable on Windows.
  // Ref: ef2861961c3d9e9ed6972e1e84d969683b25cf95


  var ttyFd = [1, 2, 4, 5].find(tty.isatty);

  if (ttyFd === undefined) {
    try {
      return fs.openSync('/dev/tty');
    } catch (_unused3) {
      // There aren't any tty fd's available to use.
      return -1;
    }
  }

  return ttyFd;
}

function runWithInvalidFD(func) {
  var fd = 1 << 30; // Get first known bad file descriptor. 1 << 30 is usually unlikely to
  // be an valid one.

  try {
    while (fs.fstatSync(fd--) && fd > 0) {
      ;
    }
  } catch (_unused4) {
    return func(fd);
  }

  printSkipMessage('Could not generate an invalid fd');
} // A helper function to simplify checking for ERR_INVALID_ARG_TYPE output.


function invalidArgTypeHelper(input) {
  if (input == null) {
    return " Received ".concat(input);
  }

  if (typeof input === 'function' && input.name) {
    return " Received function ".concat(input.name);
  }

  if ((0, _typeof2["default"])(input) === 'object') {
    if (input.constructor && input.constructor.name) {
      return " Received an instance of ".concat(input.constructor.name);
    }

    return " Received ".concat(util.inspect(input, {
      depth: -1
    }));
  }

  var inspected = util.inspect(input, {
    colors: false
  });
  if (inspected.length > 25) inspected = "".concat(inspected.slice(0, 25), "...");
  return " Received type ".concat((0, _typeof2["default"])(input), " (").concat(inspected, ")");
}

var common = {
  allowGlobals: allowGlobals,
  buildType: buildType,
  canCreateSymLink: canCreateSymLink,
  childShouldThrowAndAbort: childShouldThrowAndAbort,
  createZeroFilledFile: createZeroFilledFile,
  disableCrashOnUnhandledRejection: disableCrashOnUnhandledRejection,
  expectsError: expectsError,
  expectWarning: expectWarning,
  getArrayBufferViews: getArrayBufferViews,
  getBufferSources: getBufferSources,
  getCallSite: getCallSite,
  getTTYfd: getTTYfd,
  hasIntl: hasIntl,
  hasCrypto: hasCrypto,
  hasMultiLocalhost: hasMultiLocalhost,
  invalidArgTypeHelper: invalidArgTypeHelper,
  isAIX: isAIX,
  isAlive: isAlive,
  isFreeBSD: isFreeBSD,
  isLinux: isLinux,
  isMainThread: isMainThread,
  isOpenBSD: isOpenBSD,
  isOSX: isOSX,
  isSunOS: isSunOS,
  isWindows: isWindows,
  localIPv6Hosts: localIPv6Hosts,
  mustCall: mustCall,
  mustCallAtLeast: mustCallAtLeast,
  mustNotCall: mustNotCall,
  nodeProcessAborted: nodeProcessAborted,
  PIPE: PIPE,
  platformTimeout: platformTimeout,
  printSkipMessage: printSkipMessage,
  pwdCommand: pwdCommand,
  rootDir: rootDir,
  runWithInvalidFD: runWithInvalidFD,
  skip: skip,
  skipIf32Bits: skipIf32Bits,
  skipIfEslintMissing: skipIfEslintMissing,
  skipIfInspectorDisabled: skipIfInspectorDisabled,
  skipIfWorker: skipIfWorker,

  get enoughTestCpu() {
    var cpus = require('os').cpus();

    return Array.isArray(cpus) && (cpus.length > 1 || cpus[0].speed > 999);
  },

  get enoughTestMem() {
    return require('os').totalmem() > 0x70000000;
    /* 1.75 Gb */
  },

  get hasFipsCrypto() {
    return hasCrypto && require('crypto').getFips();
  },

  get hasIPv6() {
    var iFaces = require('os').networkInterfaces();

    var re = isWindows ? /Loopback Pseudo-Interface/ : /lo/;
    return Object.keys(iFaces).some(function (name) {
      return re.test(name) && iFaces[name].some(function (_ref5) {
        var family = _ref5.family;
        return family === 'IPv6';
      });
    });
  },

  get inFreeBSDJail() {
    if (inFreeBSDJail !== null) return inFreeBSDJail;

    if (exports.isFreeBSD && execSync('sysctl -n security.jail.jailed').toString() === '1\n') {
      inFreeBSDJail = true;
    } else {
      inFreeBSDJail = false;
    }

    return inFreeBSDJail;
  },

  // On IBMi, process.platform and os.platform() both return 'aix',
  // It is not enough to differentiate between IBMi and real AIX system.
  get isIBMi() {
    return require('os').type() === 'OS400';
  },

  get isLinuxPPCBE() {
    return process.platform === 'linux' && process.arch === 'ppc64' && require('os').endianness() === 'BE';
  },

  get localhostIPv4() {
    if (localhostIPv4 !== null) return localhostIPv4;

    if (this.inFreeBSDJail) {
      // Jailed network interfaces are a bit special - since we need to jump
      // through loops, as well as this being an exception case, assume the
      // user will provide this instead.
      if (process.env.LOCALHOST) {
        localhostIPv4 = process.env.LOCALHOST;
      } else {
        console.error('Looks like we\'re in a FreeBSD Jail. ' + 'Please provide your default interface address ' + 'as LOCALHOST or expect some tests to fail.');
      }
    }

    if (localhostIPv4 === null) localhostIPv4 = '127.0.0.1';
    return localhostIPv4;
  },

  get localhostIPv6() {
    return '::1';
  },

  // opensslCli defined lazily to reduce overhead of spawnSync
  get opensslCli() {
    if (opensslCli !== null) return opensslCli;

    if (process.config.variables.node_shared_openssl) {
      // Use external command
      opensslCli = 'openssl';
    } else {
      // Use command built from sources included in Node.js repository
      opensslCli = path.join(path.dirname(process.execPath), 'openssl-cli');
    }

    if (exports.isWindows) opensslCli += '.exe';
    var opensslCmd = spawnSync(opensslCli, ['version']);

    if (opensslCmd.status !== 0 || opensslCmd.error !== undefined) {
      // OpenSSL command cannot be executed
      opensslCli = false;
    }

    return opensslCli;
  },

  get PORT() {
    if (+process.env.TEST_PARALLEL) {
      throw new Error('common.PORT cannot be used in a parallelized test');
    }

    return +process.env.NODE_COMMON_PORT || 12346;
  }

};
var validProperties = new Set(Object.keys(common));
module.exports = new Proxy(common, {
  get: function get(obj, prop) {
    if (!validProperties.has(prop)) throw new Error("Using invalid common property: '".concat(prop, "'"));
    return obj[prop];
  }
});