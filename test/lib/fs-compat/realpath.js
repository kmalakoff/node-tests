var fs = require('fs');
var realpath = require('fs.realpath');

realpath.native = fs.realpath.native;
module.exports = realpath;
