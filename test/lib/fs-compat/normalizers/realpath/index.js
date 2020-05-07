var realpathPatch = require('./realpathPatch');

module.exports = function realpath(fn) {
  return realpathPatch(fn);
};
