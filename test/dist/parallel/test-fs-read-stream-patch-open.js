'use strict';

var common = require('../common');

var fs = require('fs');

common.expectWarning('DeprecationWarning', 'ReadStream.prototype.open() is deprecated', 'DEP0135');
var s = fs.createReadStream('asd') // We don't care about errors in this test.
.on('error', function () {});
s.open(); // Allow overriding open().

fs.ReadStream.prototype.open = common.mustCall();
fs.createReadStream('asd');