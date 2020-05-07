var rmdirRecursive = require('./rmdirRecursive');

module.exports = function rmdir(fn) {
  return rmdirRecursive(fn);
};
