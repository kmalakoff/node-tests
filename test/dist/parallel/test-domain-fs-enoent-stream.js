'use strict';

var common = require('../common');

var assert = require('assert');

var domain = require('domain');

var fs = require('fs');

var d = new domain.Domain();
var fst = fs.createReadStream('stream for nonexistent file');
d.on('error', common.mustCall(function (err) {
  assert.ok(err.message.match(/^ENOENT: no such file or directory, open '/));
  assert.strictEqual(err.domain, d);
  assert.strictEqual(err.domainEmitter, fst);
  assert.strictEqual(err.domainBound, undefined);
  assert.strictEqual(err.domainThrown, false);
}));
d.add(fst);