'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var http = require('http');

var fixtures = require('../common/fixtures');

var _require = require('child_process'),
    spawn = _require.spawn;

var _require2 = require('url'),
    parseURL = _require2.parse;

var _require3 = require('url'),
    pathToFileURL = _require3.pathToFileURL;

var _require4 = require('events'),
    EventEmitter = _require4.EventEmitter;

var _MAINSCRIPT = fixtures.path('loop.js');

var DEBUG = false;
var TIMEOUT = common.platformTimeout(15 * 1000);

function spawnChildProcess(inspectorFlags, scriptContents, scriptFile) {
  var args = [].concat(inspectorFlags);

  if (scriptContents) {
    args.push('-e', scriptContents);
  } else {
    args.push(scriptFile);
  }

  var child = spawn(process.execPath, args);
  var handler = tearDown.bind(null, child);
  process.on('exit', handler);
  process.on('uncaughtException', handler);
  common.disableCrashOnUnhandledRejection();
  process.on('unhandledRejection', handler);
  process.on('SIGINT', handler);
  return child;
}

function makeBufferingDataCallback(dataCallback) {
  var buffer = Buffer.alloc(0);
  return function (data) {
    var newData = Buffer.concat([buffer, data]);
    var str = newData.toString('utf8');
    var lines = str.replace(/\r/g, '').split('\n');
    if (str.endsWith('\n')) buffer = Buffer.alloc(0);else buffer = Buffer.from(lines.pop(), 'utf8');

    var _iterator = _createForOfIteratorHelper(lines),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var line = _step.value;
        dataCallback(line);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
}

function tearDown(child, err) {
  child.kill();

  if (err) {
    console.error(err);
    process.exit(1);
  }
}

function parseWSFrame(buffer) {
  // Protocol described in https://tools.ietf.org/html/rfc6455#section-5
  var message = null;
  if (buffer.length < 2) return {
    length: 0,
    message: message
  };

  if (buffer[0] === 0x88 && buffer[1] === 0x00) {
    return {
      length: 2,
      message: message,
      closed: true
    };
  }

  assert.strictEqual(buffer[0], 0x81);
  var dataLen = 0x7F & buffer[1];
  var bodyOffset = 2;
  if (buffer.length < bodyOffset + dataLen) return 0;

  if (dataLen === 126) {
    dataLen = buffer.readUInt16BE(2);
    bodyOffset = 4;
  } else if (dataLen === 127) {
    assert(buffer[2] === 0 && buffer[3] === 0, 'Inspector message too big');
    dataLen = buffer.readUIntBE(4, 6);
    bodyOffset = 10;
  }

  if (buffer.length < bodyOffset + dataLen) return {
    length: 0,
    message: message
  };
  var jsonPayload = buffer.slice(bodyOffset, bodyOffset + dataLen).toString('utf8');

  try {
    message = JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JSON.parse() failed for: ".concat(jsonPayload));
    throw e;
  }

  if (DEBUG) console.log('[received]', JSON.stringify(message));
  return {
    length: bodyOffset + dataLen,
    message: message
  };
}

function formatWSFrame(message) {
  var messageBuf = Buffer.from(JSON.stringify(message));
  var wsHeaderBuf = Buffer.allocUnsafe(16);
  wsHeaderBuf.writeUInt8(0x81, 0);
  var byte2 = 0x80;
  var bodyLen = messageBuf.length;
  var maskOffset = 2;

  if (bodyLen < 126) {
    byte2 = 0x80 + bodyLen;
  } else if (bodyLen < 65536) {
    byte2 = 0xFE;
    wsHeaderBuf.writeUInt16BE(bodyLen, 2);
    maskOffset = 4;
  } else {
    byte2 = 0xFF;
    wsHeaderBuf.writeUInt32BE(bodyLen, 2);
    wsHeaderBuf.writeUInt32BE(0, 6);
    maskOffset = 10;
  }

  wsHeaderBuf.writeUInt8(byte2, 1);
  wsHeaderBuf.writeUInt32BE(0x01020408, maskOffset);

  for (var i = 0; i < messageBuf.length; i++) {
    messageBuf[i] = messageBuf[i] ^ 1 << i % 4;
  }

  return Buffer.concat([wsHeaderBuf.slice(0, maskOffset + 4), messageBuf]);
}

var InspectorSession = /*#__PURE__*/function () {
  function InspectorSession(socket, instance) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, InspectorSession);
    this._instance = instance;
    this._socket = socket;
    this._nextId = 1;
    this._commandResponsePromises = new Map();
    this._unprocessedNotifications = [];
    this._notificationCallback = null;
    this._scriptsIdsByUrl = new Map();
    var buffer = Buffer.alloc(0);
    socket.on('data', function (data) {
      buffer = Buffer.concat([buffer, data]);

      do {
        var _parseWSFrame = parseWSFrame(buffer),
            length = _parseWSFrame.length,
            message = _parseWSFrame.message,
            closed = _parseWSFrame.closed;

        if (!length) break;

        if (closed) {
          socket.write(Buffer.from([0x88, 0x00])); // WS close frame
        }

        buffer = buffer.slice(length);
        if (message) _this._onMessage(message);
      } while (true);
    });
    this._terminationPromise = new Promise(function (resolve) {
      socket.once('close', resolve);
    });
  }

  (0, _createClass2["default"])(InspectorSession, [{
    key: "waitForServerDisconnect",
    value: function waitForServerDisconnect() {
      return this._terminationPromise;
    }
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._socket.destroy();

                return _context.abrupt("return", this.waitForServerDisconnect());

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "_onMessage",
    value: function _onMessage(message) {
      if (message.id) {
        var _this$_commandRespons = this._commandResponsePromises.get(message.id),
            resolve = _this$_commandRespons.resolve,
            reject = _this$_commandRespons.reject;

        this._commandResponsePromises["delete"](message.id);

        if (message.result) resolve(message.result);else reject(message.error);
      } else {
        if (message.method === 'Debugger.scriptParsed') {
          var _message$params = message.params,
              scriptId = _message$params.scriptId,
              url = _message$params.url;

          this._scriptsIdsByUrl.set(scriptId, url);

          var fileUrl = url.startsWith('file:') ? url : pathToFileURL(url).toString();

          if (fileUrl === this.scriptURL().toString()) {
            this.mainScriptId = scriptId;
          }
        }

        if (this._notificationCallback) {
          // In case callback needs to install another
          var callback = this._notificationCallback;
          this._notificationCallback = null;
          callback(message);
        } else {
          this._unprocessedNotifications.push(message);
        }
      }
    }
  }, {
    key: "unprocessedNotifications",
    value: function unprocessedNotifications() {
      return this._unprocessedNotifications;
    }
  }, {
    key: "_sendMessage",
    value: function _sendMessage(message) {
      var _this2 = this;

      var msg = JSON.parse(JSON.stringify(message)); // Clone!

      msg.id = this._nextId++;
      if (DEBUG) console.log('[sent]', JSON.stringify(msg));
      var responsePromise = new Promise(function (resolve, reject) {
        _this2._commandResponsePromises.set(msg.id, {
          resolve: resolve,
          reject: reject
        });
      });
      return new Promise(function (resolve) {
        return _this2._socket.write(formatWSFrame(msg), resolve);
      }).then(function () {
        return responsePromise;
      });
    }
  }, {
    key: "send",
    value: function send(commands) {
      var _this3 = this;

      if (Array.isArray(commands)) {
        // Multiple commands means the response does not matter. There might even
        // never be a response.
        return Promise.all(commands.map(function (command) {
          return _this3._sendMessage(command);
        })).then(function () {});
      } else {
        return this._sendMessage(commands);
      }
    }
  }, {
    key: "waitForNotification",
    value: function waitForNotification(methodOrPredicate, description) {
      var desc = description || methodOrPredicate;
      var message = "Timed out waiting for matching notification (".concat(desc, "))");
      return fires(this._asyncWaitForNotification(methodOrPredicate), message, TIMEOUT);
    }
  }, {
    key: "_asyncWaitForNotification",
    value: function () {
      var _asyncWaitForNotification2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(methodOrPredicate) {
        var _this4 = this;

        var matchMethod, predicate, notification;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                matchMethod = function _matchMethod(notification) {
                  return notification.method === methodOrPredicate;
                };

                predicate = typeof methodOrPredicate === 'string' ? matchMethod : methodOrPredicate;
                notification = null;

              case 3:
                if (!this._unprocessedNotifications.length) {
                  _context2.next = 7;
                  break;
                }

                notification = this._unprocessedNotifications.shift();
                _context2.next = 10;
                break;

              case 7:
                _context2.next = 9;
                return new Promise(function (resolve) {
                  return _this4._notificationCallback = resolve;
                });

              case 9:
                notification = _context2.sent;

              case 10:
                if (!predicate(notification)) {
                  _context2.next = 3;
                  break;
                }

              case 11:
                return _context2.abrupt("return", notification);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _asyncWaitForNotification(_x) {
        return _asyncWaitForNotification2.apply(this, arguments);
      }

      return _asyncWaitForNotification;
    }()
  }, {
    key: "_isBreakOnLineNotification",
    value: function _isBreakOnLineNotification(message, line, expectedScriptPath) {
      if (message.method === 'Debugger.paused') {
        var callFrame = message.params.callFrames[0];
        var location = callFrame.location;

        var scriptPath = this._scriptsIdsByUrl.get(location.scriptId);

        assert.strictEqual(scriptPath.toString(), expectedScriptPath.toString(), "".concat(scriptPath, " !== ").concat(expectedScriptPath));
        assert.strictEqual(location.lineNumber, line);
        return true;
      }
    }
  }, {
    key: "waitForBreakOnLine",
    value: function waitForBreakOnLine(line, url) {
      var _this5 = this;

      return this.waitForNotification(function (notification) {
        return _this5._isBreakOnLineNotification(notification, line, url);
      }, "break on ".concat(url, ":").concat(line));
    }
  }, {
    key: "_matchesConsoleOutputNotification",
    value: function _matchesConsoleOutputNotification(notification, type, values) {
      if (!Array.isArray(values)) values = [values];

      if (notification.method === 'Runtime.consoleAPICalled') {
        var params = notification.params;

        if (params.type === type) {
          var i = 0;

          var _iterator2 = _createForOfIteratorHelper(params.args),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var value = _step2.value;
              if (value.value !== values[i++]) return false;
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          return i === values.length;
        }
      }
    }
  }, {
    key: "waitForConsoleOutput",
    value: function waitForConsoleOutput(type, values) {
      var _this6 = this;

      var desc = "Console output matching ".concat(JSON.stringify(values));
      return this.waitForNotification(function (notification) {
        return _this6._matchesConsoleOutputNotification(notification, type, values);
      }, desc);
    }
  }, {
    key: "runToCompletion",
    value: function () {
      var _runToCompletion = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.log('[test]', 'Verify node waits for the frontend to disconnect');
                _context3.next = 3;
                return this.send({
                  'method': 'Debugger.resume'
                });

              case 3:
                _context3.next = 5;
                return this.waitForNotification(function (notification) {
                  return notification.method === 'Runtime.executionContextDestroyed' && notification.params.executionContextId === 1;
                });

              case 5:
                _context3.next = 7;
                return this._instance.nextStderrString();

              case 7:
                _context3.t0 = _context3.sent;

                if (!(_context3.t0 !== 'Waiting for the debugger to disconnect...')) {
                  _context3.next = 12;
                  break;
                }

                ;
                _context3.next = 5;
                break;

              case 12:
                _context3.next = 14;
                return this.disconnect();

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function runToCompletion() {
        return _runToCompletion.apply(this, arguments);
      }

      return runToCompletion;
    }()
  }, {
    key: "scriptPath",
    value: function scriptPath() {
      return this._instance.scriptPath();
    }
  }, {
    key: "script",
    value: function script() {
      return this._instance.script();
    }
  }, {
    key: "scriptURL",
    value: function scriptURL() {
      return pathToFileURL(this.scriptPath());
    }
  }]);
  return InspectorSession;
}();

var NodeInstance = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(NodeInstance, _EventEmitter);

  var _super = _createSuper(NodeInstance);

  function NodeInstance() {
    var _this7;

    var inspectorFlags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['--inspect-brk=0', '--expose-internals'];
    var scriptContents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var scriptFile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _MAINSCRIPT;
    (0, _classCallCheck2["default"])(this, NodeInstance);
    _this7 = _super.call(this);
    _this7._scriptPath = scriptFile;
    _this7._script = scriptFile ? null : scriptContents;
    _this7._portCallback = null;
    _this7.portPromise = new Promise(function (resolve) {
      return _this7._portCallback = resolve;
    });
    _this7._process = spawnChildProcess(inspectorFlags, scriptContents, scriptFile);
    _this7._running = true;
    _this7._stderrLineCallback = null;
    _this7._unprocessedStderrLines = [];

    _this7._process.stdout.on('data', makeBufferingDataCallback(function (line) {
      _this7.emit('stdout', line);

      console.log('[out]', line);
    }));

    _this7._process.stderr.on('data', makeBufferingDataCallback(function (message) {
      return _this7.onStderrLine(message);
    }));

    _this7._shutdownPromise = new Promise(function (resolve) {
      _this7._process.once('exit', function (exitCode, signal) {
        if (signal) {
          console.error("[err] child process crashed, signal ".concat(signal));
        }

        resolve({
          exitCode: exitCode,
          signal: signal
        });
        _this7._running = false;
      });
    });
    return _this7;
  }

  (0, _createClass2["default"])(NodeInstance, [{
    key: "onStderrLine",
    value: function onStderrLine(line) {
      console.log('[err]', line);

      if (this._portCallback) {
        var matches = line.match(/Debugger listening on ws:\/\/.+:(\d+)\/.+/);

        if (matches) {
          this._portCallback(matches[1]);

          this._portCallback = null;
        }
      }

      if (this._stderrLineCallback) {
        this._stderrLineCallback(line);

        this._stderrLineCallback = null;
      } else {
        this._unprocessedStderrLines.push(line);
      }
    }
  }, {
    key: "httpGet",
    value: function httpGet(host, path, hostHeaderValue) {
      console.log('[test]', "Testing ".concat(path));
      var headers = hostHeaderValue ? {
        'Host': hostHeaderValue
      } : null;
      return this.portPromise.then(function (port) {
        return new Promise(function (resolve, reject) {
          var req = http.get({
            host: host,
            port: port,
            path: path,
            headers: headers
          }, function (res) {
            var response = '';
            res.setEncoding('utf8');
            res.on('data', function (data) {
              return response += data.toString();
            }).on('end', function () {
              resolve(response);
            });
          });
          req.on('error', reject);
        });
      }).then(function (response) {
        try {
          return JSON.parse(response);
        } catch (e) {
          e.body = response;
          throw e;
        }
      });
    }
  }, {
    key: "sendUpgradeRequest",
    value: function () {
      var _sendUpgradeRequest = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var response, devtoolsUrl, port;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.httpGet(null, '/json/list');

              case 2:
                response = _context4.sent;
                devtoolsUrl = response[0].webSocketDebuggerUrl;
                _context4.next = 6;
                return this.portPromise;

              case 6:
                port = _context4.sent;
                return _context4.abrupt("return", http.get({
                  port: port,
                  path: parseURL(devtoolsUrl).path,
                  headers: {
                    'Connection': 'Upgrade',
                    'Upgrade': 'websocket',
                    'Sec-WebSocket-Version': 13,
                    'Sec-WebSocket-Key': 'key=='
                  }
                }));

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function sendUpgradeRequest() {
        return _sendUpgradeRequest.apply(this, arguments);
      }

      return sendUpgradeRequest;
    }()
  }, {
    key: "connectInspectorSession",
    value: function () {
      var _connectInspectorSession = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        var _this8 = this;

        var upgradeRequest;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                console.log('[test]', 'Connecting to a child Node process');
                _context5.next = 3;
                return this.sendUpgradeRequest();

              case 3:
                upgradeRequest = _context5.sent;
                return _context5.abrupt("return", new Promise(function (resolve) {
                  upgradeRequest.on('upgrade', function (message, socket) {
                    return resolve(new InspectorSession(socket, _this8));
                  }).on('response', common.mustNotCall('Upgrade was not received'));
                }));

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function connectInspectorSession() {
        return _connectInspectorSession.apply(this, arguments);
      }

      return connectInspectorSession;
    }()
  }, {
    key: "expectConnectionDeclined",
    value: function () {
      var _expectConnectionDeclined = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        var upgradeRequest;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                console.log('[test]', 'Checking upgrade is not possible');
                _context6.next = 3;
                return this.sendUpgradeRequest();

              case 3:
                upgradeRequest = _context6.sent;
                return _context6.abrupt("return", new Promise(function (resolve) {
                  upgradeRequest.on('upgrade', common.mustNotCall('Upgrade was received')).on('response', function (response) {
                    return response.on('data', function () {}).on('end', function () {
                      return resolve(response.statusCode);
                    });
                  });
                }));

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function expectConnectionDeclined() {
        return _expectConnectionDeclined.apply(this, arguments);
      }

      return expectConnectionDeclined;
    }()
  }, {
    key: "expectShutdown",
    value: function expectShutdown() {
      return this._shutdownPromise;
    }
  }, {
    key: "nextStderrString",
    value: function nextStderrString() {
      var _this9 = this;

      if (this._unprocessedStderrLines.length) return Promise.resolve(this._unprocessedStderrLines.shift());
      return new Promise(function (resolve) {
        return _this9._stderrLineCallback = resolve;
      });
    }
  }, {
    key: "write",
    value: function write(message) {
      this._process.stdin.write(message);
    }
  }, {
    key: "kill",
    value: function kill() {
      this._process.kill();

      return this.expectShutdown();
    }
  }, {
    key: "scriptPath",
    value: function scriptPath() {
      return this._scriptPath;
    }
  }, {
    key: "script",
    value: function script() {
      if (this._script === null) this._script = fs.readFileSync(this.scriptPath(), 'utf8');
      return this._script;
    }
  }], [{
    key: "startViaSignal",
    value: function () {
      var _startViaSignal = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(scriptContents) {
        var instance, msg;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                instance = new NodeInstance(['--expose-internals'], "".concat(scriptContents, "\nprocess._rawDebug('started');"), undefined);
                msg = 'Timed out waiting for process to start';

              case 2:
                _context7.next = 4;
                return fires(instance.nextStderrString(), msg, TIMEOUT);

              case 4:
                _context7.t0 = _context7.sent;

                if (!(_context7.t0 !== 'started')) {
                  _context7.next = 8;
                  break;
                }

                _context7.next = 2;
                break;

              case 8:
                process._debugProcess(instance._process.pid);

                return _context7.abrupt("return", instance);

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function startViaSignal(_x2) {
        return _startViaSignal.apply(this, arguments);
      }

      return startViaSignal;
    }()
  }]);
  return NodeInstance;
}(EventEmitter);

function onResolvedOrRejected(promise, callback) {
  return promise.then(function (result) {
    callback();
    return result;
  }, function (error) {
    callback();
    throw error;
  });
}

function timeoutPromise(error, timeoutMs) {
  var clearCallback = null;
  var done = false;
  var promise = onResolvedOrRejected(new Promise(function (resolve, reject) {
    var timeout = setTimeout(function () {
      return reject(error);
    }, timeoutMs);

    clearCallback = function clearCallback() {
      if (done) return;
      clearTimeout(timeout);
      resolve();
    };
  }), function () {
    return done = true;
  });
  promise.clear = clearCallback;
  return promise;
} // Returns a new promise that will propagate `promise` resolution or rejection
// if that happens within the `timeoutMs` timespan, or rejects with `error` as
// a reason otherwise.


function fires(promise, error, timeoutMs) {
  var timeout = timeoutPromise(error, timeoutMs);
  return Promise.race([onResolvedOrRejected(promise, function () {
    return timeout.clear();
  }), timeout]);
}

module.exports = {
  NodeInstance: NodeInstance
};