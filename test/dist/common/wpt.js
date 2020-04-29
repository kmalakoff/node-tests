/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var assert = require('assert');

var fixtures = require('../common/fixtures');

var fs = require('fs');

var fsPromises = fs.promises;

var path = require('path');

var vm = require('vm');

var _require = require('util'),
    inspect = _require.inspect; // https://github.com/w3c/testharness.js/blob/master/testharness.js
// TODO: get rid of this half-baked harness in favor of the one
// pulled from WPT


var harnessMock = {
  test: function test(fn, desc) {
    try {
      fn();
    } catch (err) {
      console.error("In ".concat(desc, ":"));
      throw err;
    }
  },
  assert_equals: assert.strictEqual,
  assert_true: function assert_true(value, message) {
    return assert.strictEqual(value, true, message);
  },
  assert_false: function assert_false(value, message) {
    return assert.strictEqual(value, false, message);
  },
  assert_throws: function assert_throws(code, func, desc) {
    assert["throws"](func, function (err) {
      return (0, _typeof2["default"])(err) === 'object' && 'name' in err && err.name.startsWith(code.name);
    }, desc);
  },
  assert_array_equals: assert.deepStrictEqual,
  assert_unreached: function assert_unreached(desc) {
    assert.fail("Reached unreachable code: ".concat(desc));
  }
};

var ResourceLoader = /*#__PURE__*/function () {
  function ResourceLoader(path) {
    (0, _classCallCheck2["default"])(this, ResourceLoader);
    this.path = path;
  }
  /**
   * Load a resource in test/fixtures/wpt specified with a URL
   * @param {string} from the path of the file loading this resource,
   *                      relative to thw WPT folder.
   * @param {string} url the url of the resource being loaded.
   * @param {boolean} asPromise if true, return the resource in a
   *                            pseudo-Response object.
   */


  (0, _createClass2["default"])(ResourceLoader, [{
    key: "read",
    value: function read(from, url) {
      var asFetch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      // We need to patch this to load the WebIDL parser
      url = url.replace('/resources/WebIDLParser.js', '/resources/webidl2/lib/webidl2.js');
      var base = path.dirname(from);
      var file = url.startsWith('/') ? fixtures.path('wpt', url) : fixtures.path('wpt', base, url);

      if (asFetch) {
        return fsPromises.readFile(file).then(function (data) {
          return {
            ok: true,
            json: function json() {
              return JSON.parse(data.toString());
            },
            text: function text() {
              return data.toString();
            }
          };
        });
      } else {
        return fs.readFileSync(file, 'utf8');
      }
    }
  }]);
  return ResourceLoader;
}();

var StatusRule = /*#__PURE__*/function () {
  function StatusRule(key, value) {
    var pattern = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    (0, _classCallCheck2["default"])(this, StatusRule);
    this.key = key;
    this.requires = value.requires || [];
    this.fail = value.fail;
    this.skip = value.skip;

    if (pattern) {
      this.pattern = this.transformPattern(pattern);
    } // TODO(joyeecheung): implement this


    this.scope = value.scope;
    this.comment = value.comment;
  }
  /**
   * Transform a filename pattern into a RegExp
   * @param {string} pattern
   * @returns {RegExp}
   */


  (0, _createClass2["default"])(StatusRule, [{
    key: "transformPattern",
    value: function transformPattern(pattern) {
      var result = path.normalize(pattern).replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&');
      return new RegExp(result.replace('*', '.*'));
    }
  }]);
  return StatusRule;
}();

var StatusRuleSet = /*#__PURE__*/function () {
  function StatusRuleSet() {
    (0, _classCallCheck2["default"])(this, StatusRuleSet);
    // We use two sets of rules to speed up matching
    this.exactMatch = {};
    this.patternMatch = [];
  }
  /**
   * @param {object} rules
   */


  (0, _createClass2["default"])(StatusRuleSet, [{
    key: "addRules",
    value: function addRules(rules) {
      for (var _i = 0, _Object$keys = Object.keys(rules); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];

        if (key.includes('*')) {
          this.patternMatch.push(new StatusRule(key, rules[key], key));
        } else {
          this.exactMatch[key] = new StatusRule(key, rules[key]);
        }
      }
    }
  }, {
    key: "match",
    value: function match(file) {
      var result = [];
      var exact = this.exactMatch[file];

      if (exact) {
        result.push(exact);
      }

      var _iterator = _createForOfIteratorHelper(this.patternMatch),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;

          if (item.pattern.test(file)) {
            result.push(item);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return result;
    }
  }]);
  return StatusRuleSet;
}();

var WPTTest = /*#__PURE__*/function () {
  /**
   * @param {string} mod name of the WPT module, e.g.
   *                     'html/webappapis/microtask-queuing'
   * @param {string} filename path of the test, relative to mod, e.g.
   *                          'test.any.js'
   * @param {StatusRule[]} rules
   */
  function WPTTest(mod, filename, rules) {
    (0, _classCallCheck2["default"])(this, WPTTest);
    this.module = mod;
    this.filename = filename;
    this.requires = new Set();
    this.failReasons = [];
    this.skipReasons = [];

    var _iterator2 = _createForOfIteratorHelper(rules),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;

        if (item.requires.length) {
          var _iterator3 = _createForOfIteratorHelper(item.requires),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var req = _step3.value;
              this.requires.add(req);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }

        if (item.fail) {
          this.failReasons.push(item.fail);
        }

        if (item.skip) {
          this.skipReasons.push(item.skip);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  (0, _createClass2["default"])(WPTTest, [{
    key: "getRelativePath",
    value: function getRelativePath() {
      return path.join(this.module, this.filename);
    }
  }, {
    key: "getAbsolutePath",
    value: function getAbsolutePath() {
      return fixtures.path('wpt', this.getRelativePath());
    }
  }, {
    key: "getContent",
    value: function getContent() {
      return fs.readFileSync(this.getAbsolutePath(), 'utf8');
    }
  }]);
  return WPTTest;
}();

var kIntlRequirement = {
  none: 0,
  small: 1,
  full: 2 // TODO(joyeecheung): we may need to deal with --with-intl=system-icu

};

var IntlRequirement = /*#__PURE__*/function () {
  function IntlRequirement() {
    (0, _classCallCheck2["default"])(this, IntlRequirement);
    this.currentIntl = kIntlRequirement.none;

    if (process.config.variables.v8_enable_i18n_support === 0) {
      this.currentIntl = kIntlRequirement.none;
      return;
    } // i18n enabled


    if (process.config.variables.icu_small) {
      this.currentIntl = kIntlRequirement.small;
    } else {
      this.currentIntl = kIntlRequirement.full;
    }
  }
  /**
   * @param {Set} requires
   * @returns {string|false} The config that the build is lacking, or false
   */


  (0, _createClass2["default"])(IntlRequirement, [{
    key: "isLacking",
    value: function isLacking(requires) {
      var current = this.currentIntl;

      if (requires.has('full-icu') && current !== kIntlRequirement.full) {
        return 'full-icu';
      }

      if (requires.has('small-icu') && current < kIntlRequirement.small) {
        return 'small-icu';
      }

      return false;
    }
  }]);
  return IntlRequirement;
}();

var intlRequirements = new IntlRequirement();

var StatusLoader = /*#__PURE__*/function () {
  /**
   * @param {string} path relative path of the WPT subset
   */
  function StatusLoader(path) {
    (0, _classCallCheck2["default"])(this, StatusLoader);
    this.path = path;
    this.loaded = false;
    this.rules = new StatusRuleSet();
    /** @type {WPTTest[]} */

    this.tests = [];
  }
  /**
   * Grep for all .*.js file recursively in a directory.
   * @param {string} dir
   */


  (0, _createClass2["default"])(StatusLoader, [{
    key: "grep",
    value: function grep(dir) {
      var result = [];
      var list = fs.readdirSync(dir);

      var _iterator4 = _createForOfIteratorHelper(list),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var file = _step4.value;
          var filepath = path.join(dir, file);
          var stat = fs.statSync(filepath);

          if (stat.isDirectory()) {
            var _list = this.grep(filepath);

            result = result.concat(_list);
          } else {
            if (!/\.\w+\.js$/.test(filepath)) {
              continue;
            }

            result.push(filepath);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return result;
    }
  }, {
    key: "load",
    value: function load() {
      var dir = path.join(__dirname, '..', 'wpt');
      var statusFile = path.join(dir, 'status', "".concat(this.path, ".json"));
      var result = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
      this.rules.addRules(result);
      var subDir = fixtures.path('wpt', this.path);
      var list = this.grep(subDir);

      var _iterator5 = _createForOfIteratorHelper(list),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var file = _step5.value;
          var relativePath = path.relative(subDir, file);
          var match = this.rules.match(relativePath);
          this.tests.push(new WPTTest(this.path, relativePath, match));
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      this.loaded = true;
    }
  }]);
  return StatusLoader;
}();

var PASSED = 1;
var FAILED = 2;
var SKIPPED = 3;

var WPTRunner = /*#__PURE__*/function () {
  function WPTRunner(path) {
    (0, _classCallCheck2["default"])(this, WPTRunner);
    this.path = path;
    this.resource = new ResourceLoader(path);
    this.sandbox = null;
    this.context = null;
    this.globals = new Map();
    this.status = new StatusLoader(path);
    this.status.load();
    this.tests = new Map(this.status.tests.map(function (item) {
      return [item.filename, item];
    }));
    this.results = new Map();
    this.inProgress = new Set();
  }
  /**
   * Specify that certain global descriptors from the object
   * should be defined in the vm
   * @param {object} obj
   * @param {string[]} names
   */


  (0, _createClass2["default"])(WPTRunner, [{
    key: "copyGlobalsFromObject",
    value: function copyGlobalsFromObject(obj, names) {
      var _iterator6 = _createForOfIteratorHelper(names),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var name = _step6.value;
          var desc = Object.getOwnPropertyDescriptor(obj, name);

          if (!desc) {
            assert.fail("".concat(name, " does not exist on the object"));
          }

          this.globals.set(name, desc);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
    /**
     * Specify that certain global descriptors should be defined in the vm
     * @param {string} name
     * @param {object} descriptor
     */

  }, {
    key: "defineGlobal",
    value: function defineGlobal(name, descriptor) {
      this.globals.set(name, descriptor);
    } // TODO(joyeecheung): work with the upstream to port more tests in .html
    // to .js.

  }, {
    key: "runJsTests",
    value: function runJsTests() {
      var queue = []; // If the tests are run as `node test/wpt/test-something.js subset.any.js`,
      // only `subset.any.js` will be run by the runner.

      if (process.argv[2]) {
        var filename = process.argv[2];

        if (!this.tests.has(filename)) {
          throw new Error("".concat(filename, " not found!"));
        }

        queue.push(this.tests.get(filename));
      } else {
        queue = this.buildQueue();
      }

      this.inProgress = new Set(queue.map(function (item) {
        return item.filename;
      }));

      var _iterator7 = _createForOfIteratorHelper(queue),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var test = _step7.value;
          var _filename = test.filename;
          var content = test.getContent();
          var meta = test.title = this.getMeta(content);
          var absolutePath = test.getAbsolutePath();
          var context = this.generateContext(test);
          var relativePath = test.getRelativePath();
          var code = this.mergeScripts(relativePath, meta, content);

          try {
            vm.runInContext(code, context, {
              filename: absolutePath
            });
          } catch (err) {
            this.fail(_filename, {
              name: '',
              message: err.message,
              stack: inspect(err)
            }, 'UNCAUGHT');
            this.inProgress["delete"](_filename);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      this.tryFinish();
    }
  }, {
    key: "mock",
    value: function mock(testfile) {
      var resource = this.resource;
      var result = {
        // This is a mock, because at the moment fetch is not implemented
        // in Node.js, but some tests and harness depend on this to pull
        // resources.
        fetch: function fetch(file) {
          return resource.read(testfile, file, true);
        },
        GLOBAL: {
          isWindow: function isWindow() {
            return false;
          }
        },
        Object: Object
      };
      return result;
    } // Note: this is how our global space for the WPT test should look like

  }, {
    key: "getSandbox",
    value: function getSandbox(filename) {
      var result = this.mock(filename);

      var _iterator8 = _createForOfIteratorHelper(this.globals),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var _step8$value = (0, _slicedToArray2["default"])(_step8.value, 2),
              name = _step8$value[0],
              desc = _step8$value[1];

          Object.defineProperty(result, name, desc);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      return result;
    }
  }, {
    key: "generateContext",
    value: function generateContext(test) {
      var filename = test.filename;
      var sandbox = this.sandbox = this.getSandbox(test.getRelativePath());
      var context = this.context = vm.createContext(sandbox);
      var harnessPath = fixtures.path('wpt', 'resources', 'testharness.js');
      var harness = fs.readFileSync(harnessPath, 'utf8');
      vm.runInContext(harness, context, {
        filename: harnessPath
      });
      sandbox.add_result_callback(this.resultCallback.bind(this, filename));
      sandbox.add_completion_callback(this.completionCallback.bind(this, filename));
      sandbox.self = sandbox; // TODO(joyeecheung): we are not a window - work with the upstream to
      // add a new scope for us.

      return context;
    }
  }, {
    key: "resultCallback",
    value: function resultCallback(filename, test) {
      switch (test.status) {
        case 1:
          this.fail(filename, test, 'FAILURE');
          break;

        case 2:
          this.fail(filename, test, 'TIMEOUT');
          break;

        case 3:
          this.fail(filename, test, 'INCOMPLETE');
          break;

        default:
          this.succeed(filename, test);
      }
    }
  }, {
    key: "completionCallback",
    value: function completionCallback(filename, tests, harnessStatus) {
      if (harnessStatus.status === 2) {
        assert.fail("test harness timed out in ".concat(filename));
      }

      this.inProgress["delete"](filename);
      this.tryFinish();
    }
  }, {
    key: "tryFinish",
    value: function tryFinish() {
      if (this.inProgress.size > 0) {
        return;
      }

      this.reportResults();
    }
  }, {
    key: "reportResults",
    value: function reportResults() {
      var unexpectedFailures = [];

      var _iterator9 = _createForOfIteratorHelper(this.results),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var _step9$value = (0, _slicedToArray2["default"])(_step9.value, 2),
              _filename2 = _step9$value[0],
              items = _step9$value[1];

          var test = this.tests.get(_filename2);

          var _title = test.meta && test.meta.title;

          _title = _title ? "".concat(_filename2, " : ").concat(_title) : _filename2;
          console.log("---- ".concat(_title, " ----"));

          var _iterator11 = _createForOfIteratorHelper(items),
              _step11;

          try {
            for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
              var _item = _step11.value;

              switch (_item.type) {
                case FAILED:
                  {
                    if (test.failReasons.length) {
                      console.log("[EXPECTED_FAILURE] ".concat(_item.test.name));
                      console.log(test.failReasons.join('; '));
                    } else {
                      console.log("[UNEXPECTED_FAILURE] ".concat(_item.test.name));
                      unexpectedFailures.push([_title, _filename2, _item]);
                    }

                    break;
                  }

                case PASSED:
                  {
                    console.log("[PASSED] ".concat(_item.test.name));
                    break;
                  }

                case SKIPPED:
                  {
                    console.log("[SKIPPED] ".concat(_item.reason));
                    break;
                  }
              }
            }
          } catch (err) {
            _iterator11.e(err);
          } finally {
            _iterator11.f();
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      if (unexpectedFailures.length > 0) {
        var _iterator10 = _createForOfIteratorHelper(unexpectedFailures),
            _step10;

        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var _step10$value = (0, _slicedToArray2["default"])(_step10.value, 3),
                title = _step10$value[0],
                filename = _step10$value[1],
                item = _step10$value[2];

            console.log("---- ".concat(title, " ----"));
            console.log("[".concat(item.reason, "] ").concat(item.test.name));
            console.log(item.test.message);
            console.log(item.test.stack);
            var command = "".concat(process.execPath, " ").concat(process.execArgv) + " ".concat(require.main.filename, " ").concat(filename);
            console.log("Command: ".concat(command, "\n"));
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }

        assert.fail("".concat(unexpectedFailures.length, " unexpected failures found"));
      }
    }
  }, {
    key: "addResult",
    value: function addResult(filename, item) {
      var result = this.results.get(filename);

      if (result) {
        result.push(item);
      } else {
        this.results.set(filename, [item]);
      }
    }
  }, {
    key: "succeed",
    value: function succeed(filename, test) {
      this.addResult(filename, {
        type: PASSED,
        test: test
      });
    }
  }, {
    key: "fail",
    value: function fail(filename, test, reason) {
      this.addResult(filename, {
        type: FAILED,
        test: test,
        reason: reason
      });
    }
  }, {
    key: "skip",
    value: function skip(filename, reasons) {
      this.addResult(filename, {
        type: SKIPPED,
        reason: reasons.join('; ')
      });
    }
  }, {
    key: "getMeta",
    value: function getMeta(code) {
      var matches = code.match(/\/\/ META: .+/g);

      if (!matches) {
        return {};
      } else {
        var result = {};

        var _iterator12 = _createForOfIteratorHelper(matches),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var match = _step12.value;
            var parts = match.match(/\/\/ META: ([^=]+?)=(.+)/);
            var key = parts[1];
            var value = parts[2];

            if (key === 'script') {
              if (result[key]) {
                result[key].push(value);
              } else {
                result[key] = [value];
              }
            } else {
              result[key] = value;
            }
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }

        return result;
      }
    }
  }, {
    key: "mergeScripts",
    value: function mergeScripts(base, meta, content) {
      if (!meta.script) {
        return content;
      } // only one script


      var result = '';

      var _iterator13 = _createForOfIteratorHelper(meta.script),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var script = _step13.value;
          result += this.resource.read(base, script, false);
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      return result + content;
    }
  }, {
    key: "buildQueue",
    value: function buildQueue() {
      var queue = [];

      var _iterator14 = _createForOfIteratorHelper(this.tests.values()),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var test = _step14.value;
          var filename = test.filename;

          if (test.skipReasons.length > 0) {
            this.skip(filename, test.skipReasons);
            continue;
          }

          var lackingIntl = intlRequirements.isLacking(test.requires);

          if (lackingIntl) {
            this.skip(filename, ["requires ".concat(lackingIntl)]);
            continue;
          }

          queue.push(test);
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      return queue;
    }
  }]);
  return WPTRunner;
}();

module.exports = {
  harness: harnessMock,
  WPTRunner: WPTRunner
};