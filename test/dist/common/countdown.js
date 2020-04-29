/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var assert = require('assert');

var kLimit = Symbol('limit');
var kCallback = Symbol('callback');

var common = require('./');

var Countdown = /*#__PURE__*/function () {
  function Countdown(limit, cb) {
    (0, _classCallCheck2["default"])(this, Countdown);
    assert.strictEqual((0, _typeof2["default"])(limit), 'number');
    assert.strictEqual((0, _typeof2["default"])(cb), 'function');
    this[kLimit] = limit;
    this[kCallback] = common.mustCall(cb);
  }

  (0, _createClass2["default"])(Countdown, [{
    key: "dec",
    value: function dec() {
      assert(this[kLimit] > 0, 'Countdown expired');
      if (--this[kLimit] === 0) this[kCallback]();
      return this[kLimit];
    }
  }, {
    key: "remaining",
    get: function get() {
      return this[kLimit];
    }
  }]);
  return Countdown;
}();

module.exports = Countdown;