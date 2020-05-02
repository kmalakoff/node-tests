var fs = require('fs');
var assign = require('object.assign');

var invalidArgThrowRewrite = require('./composers/invalidArgThrowRewrite');
var readdirFileTypes = require('./composers/readdirFileTypes');
var realpathPatch = require('./composers/realpathPatch');
var rmdirSyncRecursive = require('./composers/rmdirSyncRecursive');
var statOptions = require('./composers/statOptions');

var compatMethods = {
  lstat: invalidArgThrowRewrite(statOptions(fs.lstat)),
  readdir: invalidArgThrowRewrite(readdirFileTypes(fs.readdir)),
  readdirSync: invalidArgThrowRewrite(fs.readdirSync),
  realpath: realpathPatch(fs.realpath),
  realpathSync: realpathPatch(fs.realpathSync),
  rmdirSync: rmdirSyncRecursive(fs.rmdirSync),
  stat: invalidArgThrowRewrite(statOptions(fs.stat)),
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
