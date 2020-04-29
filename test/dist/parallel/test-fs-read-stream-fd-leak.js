'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

var fixtures = require('../common/fixtures');

var openCount = 0;
var _fsopen = fs.open;
var _fsclose = fs.close;
var loopCount = 50;
var totalCheck = 50;
var emptyTxt = fixtures.path('empty.txt');

fs.open = function () {
  openCount++;
  return _fsopen.apply(null, arguments);
};

fs.close = function () {
  openCount--;
  return _fsclose.apply(null, arguments);
};

function testLeak(endFn, callback) {
  console.log("testing for leaks from fs.createReadStream().".concat(endFn, "()..."));
  var i = 0;
  var check = 0;

  function checkFunction() {
    if (openCount !== 0 && check < totalCheck) {
      check++;
      setTimeout(checkFunction, 100);
      return;
    }

    assert.strictEqual(openCount, 0, "no leaked file descriptors using ".concat(endFn, "() (got ").concat(openCount, ")"));
    openCount = 0;
    callback && setTimeout(callback, 100);
  }

  setInterval(function () {
    var s = fs.createReadStream(emptyTxt);
    s[endFn]();

    if (++i === loopCount) {
      clearTimeout(this);
      setTimeout(checkFunction, 100);
    }
  }, 2);
}

testLeak('close', function () {
  testLeak('destroy');
});