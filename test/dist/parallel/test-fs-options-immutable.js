'use strict';

var common = require('../common');
/*
 * These tests make sure that the `options` object passed to these functions are
 * never altered.
 *
 * Refer: https://github.com/nodejs/node/issues/7655
 */


var assert = require('assert');

var fs = require('fs');

var path = require('path');

var errHandler = function errHandler(e) {
  return assert.ifError(e);
};

var options = Object.freeze({});

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
fs.readFile(__filename, options, common.mustCall(errHandler));
fs.readFileSync(__filename, options);
fs.readdir(__dirname, options, common.mustCall(errHandler));
fs.readdirSync(__dirname, options);

if (common.canCreateSymLink()) {
  var sourceFile = path.resolve(tmpdir.path, 'test-readlink');
  var linkFile = path.resolve(tmpdir.path, 'test-readlink-link');
  fs.writeFileSync(sourceFile, '');
  fs.symlinkSync(sourceFile, linkFile);
  fs.readlink(linkFile, options, common.mustCall(errHandler));
  fs.readlinkSync(linkFile, options);
}

{
  var fileName = path.resolve(tmpdir.path, 'writeFile');
  fs.writeFileSync(fileName, 'ABCD', options);
  fs.writeFile(fileName, 'ABCD', options, common.mustCall(errHandler));
}
{
  var _fileName = path.resolve(tmpdir.path, 'appendFile');

  fs.appendFileSync(_fileName, 'ABCD', options);
  fs.appendFile(_fileName, 'ABCD', options, common.mustCall(errHandler));
}

if (!common.isIBMi) {
  // IBMi does not suppport fs.watch()
  var watch = fs.watch(__filename, options, common.mustNotCall());
  watch.close();
}

{
  fs.watchFile(__filename, options, common.mustNotCall());
  fs.unwatchFile(__filename);
}
{
  fs.realpathSync(__filename, options);
  fs.realpath(__filename, options, common.mustCall(errHandler));
}
{
  var tempFileName = path.resolve(tmpdir.path, 'mkdtemp-');
  fs.mkdtempSync(tempFileName, options);
  fs.mkdtemp(tempFileName, options, common.mustCall(errHandler));
}
{
  var _fileName2 = path.resolve(tmpdir.path, 'streams');

  fs.WriteStream(_fileName2, options).once('open', common.mustCall(function () {
    fs.ReadStream(_fileName2, options).destroy();
  })).end();
}