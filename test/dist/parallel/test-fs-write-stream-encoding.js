'use strict';

require('../common');

var assert = require('assert');

var fixtures = require('../common/fixtures');

var fs = require('fs');

var path = require('path');

var stream = require('stream');

var tmpdir = require('../common/tmpdir');

var firstEncoding = 'base64';
var secondEncoding = 'latin1';
var examplePath = fixtures.path('x.txt');
var dummyPath = path.join(tmpdir.path, 'x.txt');
tmpdir.refresh();
var exampleReadStream = fs.createReadStream(examplePath, {
  encoding: firstEncoding
});
var dummyWriteStream = fs.createWriteStream(dummyPath, {
  encoding: firstEncoding
});
exampleReadStream.pipe(dummyWriteStream).on('finish', function () {
  var assertWriteStream = new stream.Writable({
    write: function write(chunk, enc, next) {
      var expected = Buffer.from('xyz\n');
      assert(chunk.equals(expected));
    }
  });
  assertWriteStream.setDefaultEncoding(secondEncoding);
  fs.createReadStream(dummyPath, {
    encoding: secondEncoding
  }).pipe(assertWriteStream);
});