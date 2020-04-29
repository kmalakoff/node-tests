'use strict';

require('../common');

var assert = require('assert');

var path = require('path');

var fs = require('fs');

var tmpdir = require('../common/tmpdir');

var tmp = tmpdir.path;
tmpdir.refresh();
var filename = path.resolve(tmp, 'truncate-sync-file.txt');
fs.writeFileSync(filename, 'hello world', 'utf8');
var fd = fs.openSync(filename, 'r+');
fs.truncateSync(fd, 5);
assert(fs.readFileSync(fd).equals(Buffer.from('hello')));
fs.closeSync(fd);
fs.unlinkSync(filename);