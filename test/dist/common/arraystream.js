/* eslint-disable node-core/require-common-first, node-core/required-modules */
'use strict';

var _require = require('stream'),
    Stream = _require.Stream;

function noop() {} // A stream to push an array into a REPL


function ArrayStream() {
  this.run = function (data) {
    var _this = this;

    data.forEach(function (line) {
      _this.emit('data', "".concat(line, "\n"));
    });
  };
}

Object.setPrototypeOf(ArrayStream.prototype, Stream.prototype);
Object.setPrototypeOf(ArrayStream, Stream);
ArrayStream.prototype.readable = true;
ArrayStream.prototype.writable = true;
ArrayStream.prototype.pause = noop;
ArrayStream.prototype.resume = noop;
ArrayStream.prototype.write = noop;
module.exports = ArrayStream;