var fs = require('fs');
var assign = require('object.assign');

module.exports = assign({}, fs, {
  lstat: require('./lstat'),
  readdir: require('./readdir'),
  realpath: require('./realpath'),
  stat: require('./stat'),
});
