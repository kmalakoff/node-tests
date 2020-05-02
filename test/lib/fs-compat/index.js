var fs = require('fs');
var assign = require('object.assign');

var invalidArgThrowRewrite = require('./composers/invalidArgThrowRewrite');
var readdirFileTypes = require('./composers/readdirFileTypes');
var realpathPatch = require('./composers/realpathPatch');
var rmdirRecursive = require('./composers/rmdirRecursive');
var statOptions = require('./composers/statOptions');

var compatMethods = {
  fstat: invalidArgThrowRewrite(fs.fstat),
  fstatSync: invalidArgThrowRewrite(fs.fstatSync),
  lstat: invalidArgThrowRewrite(statOptions(fs.lstat)),
  lstatSync: invalidArgThrowRewrite(fs.lstatSync),
  readdir: invalidArgThrowRewrite(readdirFileTypes(fs.readdir)),
  readdirSync: invalidArgThrowRewrite(fs.readdirSync),
  realpath: realpathPatch(fs.realpath),
  realpathSync: realpathPatch(fs.realpathSync),
  rmdir: rmdirRecursive(fs.rmdir),
  rmdirSync: rmdirRecursive(fs.rmdirSync),
  stat: invalidArgThrowRewrite(statOptions(fs.stat)),
  statSync: invalidArgThrowRewrite(statOptions(fs.statSync)),
};

var fsMethods = {};
for (var key in compatMethods) {
  fsMethods[key] = fs[key];
}

// need to mix the methods into fs
module.exports = assign(fs, compatMethods, {
  _compatPatch: function patch() {
    assign(fs, compatMethods);
  },
  _compatRestore: function restore() {
    assign(fs, fsMethods);
  },
});
