var fs = require('fs');
var assign = require('object.assign');

var compatMethods = {
  lstat: require('./methods/lstat'),
  readdir: require('./methods/readdir'),
  realpath: require('./methods/realpath'),
  realpathSync: require('./methods/realpathSync'),
  rmdirSync: require('./methods/rmdirSync'),
  stat: require('./methods/stat'),
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
