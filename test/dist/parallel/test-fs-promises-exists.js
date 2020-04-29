'use strict';

require('../common');

var assert = require('assert');

assert.strictEqual(require('fs/promises'), require('fs').promises);