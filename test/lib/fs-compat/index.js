var fs = require('fs');
var assign = require('object.assign');
var promisify = require('util.promisify');
var endsWith = require('end-with');

var invalidArgThrowRewrite = require('./composers/invalidArgThrowRewrite');
var readdirFileTypes = require('./composers/readdirFileTypes');
var readdirSyncFileTypes = require('./composers/readdirSyncFileTypes');
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
  readdirSync: invalidArgThrowRewrite(readdirSyncFileTypes(fs.readdirSync)),
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
fsMethods.promises = fs.promises;

if (!fs.promises) {
  var BUILT_INS = 'Stats';

  fs.promises = {};
  for (var name in fs) {
    if (endsWith(name, 'Sync') || ~BUILT_INS.indexOf(name) || typeof fs[name] !== 'function') continue;
    fs.promises[name] = promisify(compatMethods[name] || fs[name]);
  }
} else {
  // eslint-disable-next-line no-redeclare
  for (var name in compatMethods) {
    if (endsWith(name, 'Sync')) continue;
    fs.promises[name] = promisify(compatMethods[name]);
  }
}

if (!fs.Dirent) {
  fs.Dirent = require('dirent-from-stats').DirentBase;
  fs.constants = fs.constants || {};
  for (var cn in fs.Dirent.constants) {
    if (typeof fs.constants[cn] === 'undefined') fs.constants[cn] = fs.Dirent.constants[cn];
  }
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
