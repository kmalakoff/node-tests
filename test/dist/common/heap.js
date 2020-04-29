/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var assert = require('assert');

var util = require('util');

var internalBinding;

try {
  internalBinding = require('internal/test/binding').internalBinding;
} catch (e) {
  console.log('using `test/common/heap.js` requires `--expose-internals`');
  throw e;
}

var _internalBinding = internalBinding('heap_utils'),
    buildEmbedderGraph = _internalBinding.buildEmbedderGraph;

var _require = require('v8'),
    getHeapSnapshot = _require.getHeapSnapshot;

function createJSHeapSnapshot() {
  var stream = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getHeapSnapshot();
  stream.pause();
  var dump = JSON.parse(stream.read());
  var meta = dump.snapshot.meta;
  var nodes = readHeapInfo(dump.nodes, meta.node_fields, meta.node_types, dump.strings);
  var edges = readHeapInfo(dump.edges, meta.edge_fields, meta.edge_types, dump.strings);

  var _iterator = _createForOfIteratorHelper(nodes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var node = _step.value;
      node.incomingEdges = [];
      node.outgoingEdges = [];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var fromNodeIndex = 0;
  var edgeIndex = 0;

  var _iterator2 = _createForOfIteratorHelper(edges),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = _step2.value,
          type = _step2$value.type,
          name_or_index = _step2$value.name_or_index,
          to_node = _step2$value.to_node;

      while (edgeIndex === nodes[fromNodeIndex].edge_count) {
        edgeIndex = 0;
        fromNodeIndex++;
      }

      var toNode = nodes[to_node / meta.node_fields.length];
      var fromNode = nodes[fromNodeIndex];
      var edge = {
        type: type,
        to: toNode,
        from: fromNode,
        name: typeof name_or_index === 'string' ? name_or_index : null
      };
      toNode.incomingEdges.push(edge);
      fromNode.outgoingEdges.push(edge);
      edgeIndex++;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var _iterator3 = _createForOfIteratorHelper(nodes),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _node = _step3.value;
      assert.strictEqual(_node.edge_count, _node.outgoingEdges.length, "".concat(_node.edge_count, " !== ").concat(_node.outgoingEdges.length));
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return nodes;
}

function readHeapInfo(raw, fields, types, strings) {
  var items = [];

  for (var i = 0; i < raw.length; i += fields.length) {
    var item = {};

    for (var j = 0; j < fields.length; j++) {
      var name = fields[j];
      var type = types[j];

      if (Array.isArray(type)) {
        item[name] = type[raw[i + j]];
      } else if (name === 'name_or_index') {
        // type === 'string_or_number'
        if (item.type === 'element' || item.type === 'hidden') type = 'number';else type = 'string';
      }

      if (type === 'string') {
        item[name] = strings[raw[i + j]];
      } else if (type === 'number' || type === 'node') {
        item[name] = raw[i + j];
      }
    }

    items.push(item);
  }

  return items;
}

function inspectNode(snapshot) {
  return util.inspect(snapshot, {
    depth: 4
  });
}

function isEdge(edge, _ref) {
  var node_name = _ref.node_name,
      edge_name = _ref.edge_name;

  if (edge.name !== edge_name) {
    return false;
  } // From our internal embedded graph


  if (edge.to.value) {
    if (edge.to.value.constructor.name !== node_name) {
      return false;
    }
  } else if (edge.to.name !== node_name) {
    return false;
  }

  return true;
}

var State = /*#__PURE__*/function () {
  function State(stream) {
    (0, _classCallCheck2["default"])(this, State);
    this.snapshot = createJSHeapSnapshot(stream);
    this.embedderGraph = buildEmbedderGraph();
  } // Validate the v8 heap snapshot


  (0, _createClass2["default"])(State, [{
    key: "validateSnapshot",
    value: function validateSnapshot(rootName, expected) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref2$loose = _ref2.loose,
          loose = _ref2$loose === void 0 ? false : _ref2$loose;

      var rootNodes = this.snapshot.filter(function (node) {
        return node.name === rootName && node.type !== 'string';
      });

      if (loose) {
        assert(rootNodes.length >= expected.length, "Expect to find at least ".concat(expected.length, " '").concat(rootName, "', ") + "found ".concat(rootNodes.length));
      } else {
        assert.strictEqual(rootNodes.length, expected.length, "Expect to find ".concat(expected.length, " '").concat(rootName, "', ") + "found ".concat(rootNodes.length));
      }

      var _iterator4 = _createForOfIteratorHelper(expected),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var expectation = _step4.value;

          if (expectation.children) {
            var _iterator5 = _createForOfIteratorHelper(expectation.children),
                _step5;

            try {
              var _loop = function _loop() {
                var expectedEdge = _step5.value;
                var check = typeof expectedEdge === 'function' ? expectedEdge : function (edge) {
                  return isEdge(edge, expectedEdge);
                };
                var hasChild = rootNodes.some(function (node) {
                  return node.outgoingEdges.some(check);
                }); // Don't use assert with a custom message here. Otherwise the
                // inspection in the message is done eagerly and wastes a lot of CPU
                // time.

                if (!hasChild) {
                  throw new Error('expected to find child ' + "".concat(util.inspect(expectedEdge), " in ").concat(inspectNode(rootNodes)));
                }
              };

              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                _loop();
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    } // Validate our internal embedded graph representation

  }, {
    key: "validateGraph",
    value: function validateGraph(rootName, expected) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref3$loose = _ref3.loose,
          loose = _ref3$loose === void 0 ? false : _ref3$loose;

      var rootNodes = this.embedderGraph.filter(function (node) {
        return node.name === rootName;
      });

      if (loose) {
        assert(rootNodes.length >= expected.length, "Expect to find at least ".concat(expected.length, " '").concat(rootName, "', ") + "found ".concat(rootNodes.length));
      } else {
        assert.strictEqual(rootNodes.length, expected.length, "Expect to find ".concat(expected.length, " '").concat(rootName, "', ") + "found ".concat(rootNodes.length));
      }

      var _iterator6 = _createForOfIteratorHelper(expected),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var expectation = _step6.value;

          if (expectation.children) {
            var _iterator7 = _createForOfIteratorHelper(expectation.children),
                _step7;

            try {
              var _loop2 = function _loop2() {
                var expectedEdge = _step7.value;
                var check = typeof expectedEdge === 'function' ? expectedEdge : function (edge) {
                  return isEdge(edge, expectedEdge);
                }; // Don't use assert with a custom message here. Otherwise the
                // inspection in the message is done eagerly and wastes a lot of CPU
                // time.

                var hasChild = rootNodes.some(function (node) {
                  return node.edges.some(check);
                });

                if (!hasChild) {
                  throw new Error('expected to find child ' + "".concat(util.inspect(expectedEdge), " in ").concat(inspectNode(rootNodes)));
                }
              };

              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                _loop2();
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "validateSnapshotNodes",
    value: function validateSnapshotNodes(rootName, expected) {
      var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref4$loose = _ref4.loose,
          loose = _ref4$loose === void 0 ? false : _ref4$loose;

      this.validateSnapshot(rootName, expected, {
        loose: loose
      });
      this.validateGraph(rootName, expected, {
        loose: loose
      });
    }
  }]);
  return State;
}();

function recordState() {
  var stream = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  return new State(stream);
}

function validateSnapshotNodes() {
  var _recordState;

  return (_recordState = recordState()).validateSnapshotNodes.apply(_recordState, arguments);
}

module.exports = {
  recordState: recordState,
  validateSnapshotNodes: validateSnapshotNodes
};