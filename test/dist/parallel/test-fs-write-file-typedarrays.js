'use strict';

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var join = require('path').join;

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var filename = join(tmpdir.path, 'test.txt');
var s = '南越国是前203年至前111年存在于岭南地区的一个国家，国都位于番禺，疆域包括今天中国的广东、' + '广西两省区的大部份地区，福建省、湖南、贵州、云南的一小部份地区和越南的北部。' + '南越国是秦朝灭亡后，由南海郡尉赵佗于前203年起兵兼并桂林郡和象郡后建立。' + '前196年和前179年，南越国曾先后两次名义上臣属于西汉，成为西汉的“外臣”。前112年，' + '南越国末代君主赵建德与西汉发生战争，被汉武帝于前111年所灭。南越国共存在93年，' + '历经五代君主。南越国是岭南地区的第一个有记载的政权国家，采用封建制和郡县制并存的制度，' + '它的建立保证了秦末乱世岭南地区社会秩序的稳定，有效的改善了岭南地区落后的政治、##济现状。\n'; // The length of the buffer should be a multiple of 8
// as required by common.getArrayBufferViews()

var inputBuffer = Buffer.from(s.repeat(8), 'utf8');

var _iterator = _createForOfIteratorHelper(common.getArrayBufferViews(inputBuffer)),
    _step;

try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var expectView = _step.value;
    console.log('Sync test for ', expectView[Symbol.toStringTag]);
    fs.writeFileSync(filename, expectView);
    assert.strictEqual(fs.readFileSync(filename, 'utf8'), inputBuffer.toString('utf8'));
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}

var _iterator2 = _createForOfIteratorHelper(common.getArrayBufferViews(inputBuffer)),
    _step2;

try {
  var _loop = function _loop() {
    var expectView = _step2.value;
    console.log('Async test for ', expectView[Symbol.toStringTag]);
    var file = "".concat(filename, "-").concat(expectView[Symbol.toStringTag]);
    fs.writeFile(file, expectView, common.mustCall(function (e) {
      assert.ifError(e);
      fs.readFile(file, 'utf8', common.mustCall(function (err, data) {
        assert.ifError(err);
        assert.strictEqual(data, inputBuffer.toString('utf8'));
      }));
    }));
  };

  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
    _loop();
  }
} catch (err) {
  _iterator2.e(err);
} finally {
  _iterator2.f();
}