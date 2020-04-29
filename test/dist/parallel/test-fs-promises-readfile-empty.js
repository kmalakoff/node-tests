'use strict';

require('../common');

var assert = require('assert');

var _require = require('fs'),
    fs = _require.promises;

var fixtures = require('../common/fixtures');

var fn = fixtures.path('empty.txt');
fs.readFile(fn).then(assert.ok);
fs.readFile(fn, 'utf8').then(assert.strictEqual.bind(void 0, ''));
fs.readFile(fn, {
  encoding: 'utf8'
}).then(assert.strictEqual.bind(void 0, ''));