var rmdirSyncRecursive = require('./rmdirSyncRecursive');

module.exports = function rmdirSync(fn) {
  return rmdirSyncRecursive(fn);
};
