#!/usr/bin/env node

var getopts = require('getopts-compat');
var exit = require('exit');
var NodeTests = require('..');

(function () {
  var options = getopts(process.argv.slice(2), {
    alias: { version: 'v', module: 'm' },
  });

  // define.option('-v, --version [version]', 'node version to test against');
  // define.option('-m, --module [module]', 'module to test');

  var args = options._;
  if (args.length < 1) {
    console.log('Missing command. Example usage: run-test [test]');
    return exit(-1);
  }

  var tests = new NodeTests(options);
  tests.runTest(args[0], function (err) {
    if (err) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    exit(0);
  });
})();
