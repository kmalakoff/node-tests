'use strict';

var common = require('../common');

var assert = require('assert');

var gcTrackerMap = new WeakMap();
var gcTrackerTag = 'NODE_TEST_COMMON_GC_TRACKER';

function onGC(obj, gcListener) {
  var async_hooks = require('async_hooks');

  var onGcAsyncHook = async_hooks.createHook({
    init: common.mustCallAtLeast(function (id, type) {
      if (this.trackedId === undefined) {
        assert.strictEqual(type, gcTrackerTag);
        this.trackedId = id;
      }
    }),
    destroy: function destroy(id) {
      assert.notStrictEqual(this.trackedId, -1);

      if (id === this.trackedId) {
        this.gcListener.ongc();
        onGcAsyncHook.disable();
      }
    }
  }).enable();
  onGcAsyncHook.gcListener = gcListener;
  gcTrackerMap.set(obj, new async_hooks.AsyncResource(gcTrackerTag));
  obj = null;
}

module.exports = onGC;