var fs = require('fs');
var assign = require('object.assign');

var invalidArgThrowRewrite = require('./composers/invalidArgThrowRewrite');
var readdirFileTypes = require('./composers/readdirFileTypes');
var realpathPatch = require('./composers/realpathPatch');
var rmdirRecursive = require('./composers/rmdirRecursive');
var rmdirSyncRecursive = require('./composers/rmdirSyncRecursive');
var statOptions = require('./composers/statOptions');
var statSyncOptions = require('./composers/statSyncOptions');

var compatMethods = {
  fstat: invalidArgThrowRewrite(statOptions(fs.fstat)),
  fstatSync: invalidArgThrowRewrite(statSyncOptions(fs.fstatSync)),
  lstat: invalidArgThrowRewrite(statOptions(fs.lstat)),
  lstatSync: invalidArgThrowRewrite(statSyncOptions(fs.lstatSync)),
  readdir: invalidArgThrowRewrite(readdirFileTypes(fs.readdir)),
  readdirSync: invalidArgThrowRewrite(fs.readdirSync),
  realpath: realpathPatch(fs.realpath),
  realpathSync: realpathPatch(fs.realpathSync),
  rmdir: rmdirRecursive(fs.rmdir),
  rmdirSync: rmdirSyncRecursive(fs.rmdirSync),
  stat: invalidArgThrowRewrite(statOptions(fs.stat)),
  statSync: invalidArgThrowRewrite(statSyncOptions(fs.statSync)),
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
