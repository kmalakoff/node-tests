var fs = require('fs');
var assign = require('object.assign');

module.exports = assign(
  {
    lstat: require('./lstat'),
    readdir: require('./readdir'),
    realpath: require('fs.realpath'),
    stat: require('./stat'),
  },
  fs
);
