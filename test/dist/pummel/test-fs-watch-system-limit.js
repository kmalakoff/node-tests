'use strict';

var common = require('../common');

var assert = require('assert');

var child_process = require('child_process');

var fs = require('fs');

var stream = require('stream');

if (!common.isLinux) common.skip('The fs watch limit is OS-dependent');
if (!common.enoughTestCpu) common.skip('This test is resource-intensive');

try {
  // Ensure inotify limit is low enough for the test to actually exercise the
  // limit with small enough resources.
  var limit = Number(fs.readFileSync('/proc/sys/fs/inotify/max_user_watches', 'utf8'));
  if (limit > 16384) common.skip('inotify limit is quite large');
} catch (e) {
  if (e.code === 'ENOENT') common.skip('the inotify /proc subsystem does not exist'); // Fail on other errors.

  throw e;
}

var processes = [];
var gatherStderr = new stream.PassThrough();
gatherStderr.setEncoding('utf8');
gatherStderr.setMaxListeners(Infinity);
var finished = false;

function spawnProcesses() {
  for (var i = 0; i < 10; ++i) {
    var proc = child_process.spawn(process.execPath, ['-e', "process.chdir(".concat(JSON.stringify(__dirname), ");\n        for (const file of fs.readdirSync('.'))\n          fs.watch(file, () => {});")], {
      stdio: ['inherit', 'inherit', 'pipe']
    });
    proc.stderr.pipe(gatherStderr);
    processes.push(proc);
  }

  setTimeout(function () {
    if (!finished && processes.length < 200) spawnProcesses();
  }, 100);
}

spawnProcesses();
var accumulated = '';
gatherStderr.on('data', common.mustCallAtLeast(function (chunk) {
  accumulated += chunk;

  if (accumulated.includes('Error:') && !finished) {
    assert(accumulated.includes('ENOSPC: System limit for number ' + 'of file watchers reached') || accumulated.includes('EMFILE: '), accumulated);
    console.log("done after ".concat(processes.length, " processes, cleaning up"));
    finished = true;
    processes.forEach(function (proc) {
      return proc.kill();
    });
  }
}, 1));