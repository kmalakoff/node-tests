'use strict';

require('../common');

var assert = require('assert');

var fs = require('fs');

var stream = require('stream');

var fixtures = require('../common/fixtures');

var encoding = 'base64';
var example = fixtures.path('x.txt');
var assertStream = new stream.Writable({
  write: function write(chunk, enc, next) {
    var expected = Buffer.from('xyz');
    assert(chunk.equals(expected));
  }
});
assertStream.setDefaultEncoding(encoding);
fs.createReadStream(example, encoding).pipe(assertStream);