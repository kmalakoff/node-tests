var fs = require('fs');

var compat = {
  lstat: require('./lstat'),
  readdir: require('./readdir'),
  realpath: require('fs.realpath'),
  stat: require('./stat'),
};
for (var key in fs) compat[key] = compat[key] || fs[key];

module.exports = compat;
