/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var assert = require('assert');

var fs = require('fs');

var net = require('net');

var os = require('os');

var path = require('path');

var util = require('util');

var cpus = os.cpus();

function findReports(pid, dir) {
  // Default filenames are of the form
  // report.<date>.<time>.<pid>.<tid>.<seq>.json
  var format = '^report\\.\\d+\\.\\d+\\.' + pid + '\\.\\d+\\.\\d+\\.json$';
  var filePattern = new RegExp(format);
  var files = fs.readdirSync(dir);
  var results = [];
  files.forEach(function (file) {
    if (filePattern.test(file)) results.push(path.join(dir, file));
  });
  return results;
}

function validate(filepath) {
  var report = fs.readFileSync(filepath, 'utf8');

  if (process.report.compact) {
    var end = report.indexOf('\n');
    assert.strictEqual(end, report.length - 1);
  }

  validateContent(JSON.parse(report));
}

function validateContent(report) {
  if (typeof report === 'string') {
    try {
      report = JSON.parse(report);
    } catch (_unused) {
      throw new TypeError('validateContent() expects a JSON string or JavaScript Object');
    }
  }

  try {
    _validateContent(report);
  } catch (err) {
    try {
      err.stack += util.format('\n------\nFailing Report:\n%O', report);
    } catch (_unused2) {}

    throw err;
  }
}

function _validateContent(report) {
  var isWindows = process.platform === 'win32'; // Verify that all sections are present as own properties of the report.

  var sections = ['header', 'javascriptStack', 'nativeStack', 'javascriptHeap', 'libuv', 'environmentVariables', 'sharedObjects', 'resourceUsage', 'workers'];
  if (!isWindows) sections.push('userLimits');
  if (report.uvthreadResourceUsage) sections.push('uvthreadResourceUsage');
  checkForUnknownFields(report, sections);
  sections.forEach(function (section) {
    assert(report.hasOwnProperty(section));
    assert((0, _typeof2["default"])(report[section]) === 'object' && report[section] !== null);
  }); // Verify the format of the header section.

  var header = report.header;
  var headerFields = ['event', 'trigger', 'filename', 'dumpEventTime', 'dumpEventTimeStamp', 'processId', 'commandLine', 'nodejsVersion', 'wordSize', 'arch', 'platform', 'componentVersions', 'release', 'osName', 'osRelease', 'osVersion', 'osMachine', 'cpus', 'host', 'glibcVersionRuntime', 'glibcVersionCompiler', 'cwd', 'reportVersion', 'networkInterfaces', 'threadId'];
  checkForUnknownFields(header, headerFields);
  assert.strictEqual(header.reportVersion, 2); // Increment as needed.

  assert.strictEqual((0, _typeof2["default"])(header.event), 'string');
  assert.strictEqual((0, _typeof2["default"])(header.trigger), 'string');
  assert(typeof header.filename === 'string' || header.filename === null);
  assert.notStrictEqual(new Date(header.dumpEventTime).toString(), 'Invalid Date');
  assert(String(+header.dumpEventTimeStamp), header.dumpEventTimeStamp);
  assert(Number.isSafeInteger(header.processId));
  assert(Number.isSafeInteger(header.threadId) || header.threadId === null);
  assert.strictEqual((0, _typeof2["default"])(header.cwd), 'string');
  assert(Array.isArray(header.commandLine));
  header.commandLine.forEach(function (arg) {
    assert.strictEqual((0, _typeof2["default"])(arg), 'string');
  });
  assert.strictEqual(header.nodejsVersion, process.version);
  assert(Number.isSafeInteger(header.wordSize));
  assert.strictEqual(header.arch, os.arch());
  assert.strictEqual(header.platform, os.platform());
  assert.deepStrictEqual(header.componentVersions, process.versions);
  assert.deepStrictEqual(header.release, process.release);
  assert.strictEqual(header.osName, os.type());
  assert.strictEqual(header.osRelease, os.release());
  assert.strictEqual((0, _typeof2["default"])(header.osVersion), 'string');
  assert.strictEqual((0, _typeof2["default"])(header.osMachine), 'string');
  assert(Array.isArray(header.cpus));
  assert.strictEqual(header.cpus.length, cpus.length);
  header.cpus.forEach(function (cpu) {
    assert.strictEqual((0, _typeof2["default"])(cpu.model), 'string');
    assert.strictEqual((0, _typeof2["default"])(cpu.speed), 'number');
    assert.strictEqual((0, _typeof2["default"])(cpu.user), 'number');
    assert.strictEqual((0, _typeof2["default"])(cpu.nice), 'number');
    assert.strictEqual((0, _typeof2["default"])(cpu.sys), 'number');
    assert.strictEqual((0, _typeof2["default"])(cpu.idle), 'number');
    assert.strictEqual((0, _typeof2["default"])(cpu.irq), 'number');
    assert(cpus.some(function (c) {
      return c.model === cpu.model;
    }));
  });
  assert(Array.isArray(header.networkInterfaces));
  header.networkInterfaces.forEach(function (iface) {
    assert.strictEqual((0, _typeof2["default"])(iface.name), 'string');
    assert.strictEqual((0, _typeof2["default"])(iface.internal), 'boolean');
    assert(/^([0-9A-F][0-9A-F]:){5}[0-9A-F]{2}$/i.test(iface.mac));

    if (iface.family === 'IPv4') {
      assert.strictEqual(net.isIPv4(iface.address), true);
      assert.strictEqual(net.isIPv4(iface.netmask), true);
      assert.strictEqual(iface.scopeid, undefined);
    } else if (iface.family === 'IPv6') {
      assert.strictEqual(net.isIPv6(iface.address), true);
      assert.strictEqual(net.isIPv6(iface.netmask), true);
      assert(Number.isInteger(iface.scopeid));
    } else {
      assert.strictEqual(iface.family, 'unknown');
      assert.strictEqual(iface.address, undefined);
      assert.strictEqual(iface.netmask, undefined);
      assert.strictEqual(iface.scopeid, undefined);
    }
  });
  assert.strictEqual(header.host, os.hostname()); // Verify the format of the javascriptStack section.

  checkForUnknownFields(report.javascriptStack, ['message', 'stack']);
  assert.strictEqual((0, _typeof2["default"])(report.javascriptStack.message), 'string');

  if (report.javascriptStack.stack !== undefined) {
    assert(Array.isArray(report.javascriptStack.stack));
    report.javascriptStack.stack.forEach(function (frame) {
      assert.strictEqual((0, _typeof2["default"])(frame), 'string');
    });
  } // Verify the format of the nativeStack section.


  assert(Array.isArray(report.nativeStack));
  report.nativeStack.forEach(function (frame) {
    assert((0, _typeof2["default"])(frame) === 'object' && frame !== null);
    checkForUnknownFields(frame, ['pc', 'symbol']);
    assert.strictEqual((0, _typeof2["default"])(frame.pc), 'string');
    assert(/^0x[0-9a-f]+$/.test(frame.pc));
    assert.strictEqual((0, _typeof2["default"])(frame.symbol), 'string');
  }); // Verify the format of the javascriptHeap section.

  var heap = report.javascriptHeap;
  var jsHeapFields = ['totalMemory', 'totalCommittedMemory', 'usedMemory', 'availableMemory', 'memoryLimit', 'heapSpaces'];
  checkForUnknownFields(heap, jsHeapFields);
  assert(Number.isSafeInteger(heap.totalMemory));
  assert(Number.isSafeInteger(heap.totalCommittedMemory));
  assert(Number.isSafeInteger(heap.usedMemory));
  assert(Number.isSafeInteger(heap.availableMemory));
  assert(Number.isSafeInteger(heap.memoryLimit));
  assert((0, _typeof2["default"])(heap.heapSpaces) === 'object' && heap.heapSpaces !== null);
  var heapSpaceFields = ['memorySize', 'committedMemory', 'capacity', 'used', 'available'];
  Object.keys(heap.heapSpaces).forEach(function (spaceName) {
    var space = heap.heapSpaces[spaceName];
    checkForUnknownFields(space, heapSpaceFields);
    heapSpaceFields.forEach(function (field) {
      assert(Number.isSafeInteger(space[field]));
    });
  }); // Verify the format of the resourceUsage section.

  var usage = report.resourceUsage;
  var resourceUsageFields = ['userCpuSeconds', 'kernelCpuSeconds', 'cpuConsumptionPercent', 'maxRss', 'pageFaults', 'fsActivity'];
  checkForUnknownFields(usage, resourceUsageFields);
  assert.strictEqual((0, _typeof2["default"])(usage.userCpuSeconds), 'number');
  assert.strictEqual((0, _typeof2["default"])(usage.kernelCpuSeconds), 'number');
  assert.strictEqual((0, _typeof2["default"])(usage.cpuConsumptionPercent), 'number');
  assert(Number.isSafeInteger(usage.maxRss));
  assert((0, _typeof2["default"])(usage.pageFaults) === 'object' && usage.pageFaults !== null);
  checkForUnknownFields(usage.pageFaults, ['IORequired', 'IONotRequired']);
  assert(Number.isSafeInteger(usage.pageFaults.IORequired));
  assert(Number.isSafeInteger(usage.pageFaults.IONotRequired));
  assert((0, _typeof2["default"])(usage.fsActivity) === 'object' && usage.fsActivity !== null);
  checkForUnknownFields(usage.fsActivity, ['reads', 'writes']);
  assert(Number.isSafeInteger(usage.fsActivity.reads));
  assert(Number.isSafeInteger(usage.fsActivity.writes)); // Verify the format of the uvthreadResourceUsage section, if present.

  if (report.uvthreadResourceUsage) {
    var _usage = report.uvthreadResourceUsage;
    var threadUsageFields = ['userCpuSeconds', 'kernelCpuSeconds', 'cpuConsumptionPercent', 'fsActivity'];
    checkForUnknownFields(_usage, threadUsageFields);
    assert.strictEqual((0, _typeof2["default"])(_usage.userCpuSeconds), 'number');
    assert.strictEqual((0, _typeof2["default"])(_usage.kernelCpuSeconds), 'number');
    assert.strictEqual((0, _typeof2["default"])(_usage.cpuConsumptionPercent), 'number');
    assert((0, _typeof2["default"])(_usage.fsActivity) === 'object' && _usage.fsActivity !== null);
    checkForUnknownFields(_usage.fsActivity, ['reads', 'writes']);
    assert(Number.isSafeInteger(_usage.fsActivity.reads));
    assert(Number.isSafeInteger(_usage.fsActivity.writes));
  } // Verify the format of the libuv section.


  assert(Array.isArray(report.libuv));
  report.libuv.forEach(function (resource) {
    assert.strictEqual((0, _typeof2["default"])(resource.type), 'string');
    assert.strictEqual((0, _typeof2["default"])(resource.address), 'string');
    assert(/^0x[0-9a-f]+$/.test(resource.address));
    assert.strictEqual((0, _typeof2["default"])(resource.is_active), 'boolean');
    assert.strictEqual((0, _typeof2["default"])(resource.is_referenced), resource.type === 'loop' ? 'undefined' : 'boolean');
  }); // Verify the format of the environmentVariables section.

  for (var _i = 0, _Object$entries = Object.entries(report.environmentVariables); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    assert.strictEqual((0, _typeof2["default"])(key), 'string');
    assert.strictEqual((0, _typeof2["default"])(value), 'string');
  } // Verify the format of the userLimits section on non-Windows platforms.


  if (!isWindows) {
    var userLimitsFields = ['core_file_size_blocks', 'data_seg_size_kbytes', 'file_size_blocks', 'max_locked_memory_bytes', 'max_memory_size_kbytes', 'open_files', 'stack_size_bytes', 'cpu_time_seconds', 'max_user_processes', 'virtual_memory_kbytes'];
    checkForUnknownFields(report.userLimits, userLimitsFields);

    for (var _i2 = 0, _Object$entries2 = Object.entries(report.userLimits); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = (0, _slicedToArray2["default"])(_Object$entries2[_i2], 2),
          type = _Object$entries2$_i[0],
          limits = _Object$entries2$_i[1];

      assert.strictEqual((0, _typeof2["default"])(type), 'string');
      assert((0, _typeof2["default"])(limits) === 'object' && limits !== null);
      checkForUnknownFields(limits, ['soft', 'hard']);
      assert(typeof limits.soft === 'number' || limits.soft === 'unlimited', "Invalid ".concat(type, " soft limit of ").concat(limits.soft));
      assert(typeof limits.hard === 'number' || limits.hard === 'unlimited', "Invalid ".concat(type, " hard limit of ").concat(limits.hard));
    }
  } // Verify the format of the sharedObjects section.


  assert(Array.isArray(report.sharedObjects));
  report.sharedObjects.forEach(function (sharedObject) {
    assert.strictEqual((0, _typeof2["default"])(sharedObject), 'string');
  }); // Verify the format of the workers section.

  assert(Array.isArray(report.workers));
  report.workers.forEach(_validateContent);
}

function checkForUnknownFields(actual, expected) {
  Object.keys(actual).forEach(function (field) {
    assert(expected.includes(field), "'".concat(field, "' not expected in ").concat(expected));
  });
}

module.exports = {
  findReports: findReports,
  validate: validate,
  validateContent: validateContent
};