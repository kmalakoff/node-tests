var fs = require('fs');
var assign = require('object.assign');

var compatMethods = {
  lstat: require('./composers/invalidArgThrowRewrite')(require('./composers/statOptions')(fs.lstat)),
  readdir: require('./composers/invalidArgThrowRewrite')(require('./composers/readdirFileTypes')(fs.readdir)),
  readdirSync: require('./composers/invalidArgThrowRewrite')(fs.readdirSync),
  realpath: assign(require('fs.realpath').realpath, { native: fs.realpath.native }),
  realpathSync: assign(require('fs.realpath').realpathSync, { native: fs.realpathSync.native }),
  rmdirSync: require('./composers/rmdirSyncRecursive')(fs.rmdirSync),
  stat: require('./composers/invalidArgThrowRewrite')(require('./composers/statOptions')(fs.stat)),
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
