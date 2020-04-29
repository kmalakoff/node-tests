'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var watch = fs.watchFile(__filename, common.mustNotCall());
var triggered;
var listener = common.mustCall(function () {
  triggered = true;
});
triggered = false;
watch.once('stop', listener); // Should trigger.

watch.stop();
assert.strictEqual(triggered, false);
setImmediate(function () {
  assert.strictEqual(triggered, true);
  watch.removeListener('stop', listener);
});