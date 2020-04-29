/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var _require = require('stream'),
    Duplex = _require.Duplex;

var assert = require('assert');

var kCallback = Symbol('Callback');
var kOtherSide = Symbol('Other');

var DuplexSocket = /*#__PURE__*/function (_Duplex) {
  (0, _inherits2["default"])(DuplexSocket, _Duplex);

  var _super = _createSuper(DuplexSocket);

  function DuplexSocket() {
    var _this;

    (0, _classCallCheck2["default"])(this, DuplexSocket);
    _this = _super.call(this);
    _this[kCallback] = null;
    _this[kOtherSide] = null;
    return _this;
  }

  (0, _createClass2["default"])(DuplexSocket, [{
    key: "_read",
    value: function _read() {
      var callback = this[kCallback];

      if (callback) {
        this[kCallback] = null;
        callback();
      }
    }
  }, {
    key: "_write",
    value: function _write(chunk, encoding, callback) {
      assert.notStrictEqual(this[kOtherSide], null);
      assert.strictEqual(this[kOtherSide][kCallback], null);

      if (chunk.length === 0) {
        process.nextTick(callback);
      } else {
        this[kOtherSide].push(chunk);
        this[kOtherSide][kCallback] = callback;
      }
    }
  }, {
    key: "_final",
    value: function _final(callback) {
      this[kOtherSide].on('end', callback);
      this[kOtherSide].push(null);
    }
  }]);
  return DuplexSocket;
}(Duplex);

function makeDuplexPair() {
  var clientSide = new DuplexSocket();
  var serverSide = new DuplexSocket();
  clientSide[kOtherSide] = serverSide;
  serverSide[kOtherSide] = clientSide;
  return {
    clientSide: clientSide,
    serverSide: serverSide
  };
}

module.exports = makeDuplexPair;