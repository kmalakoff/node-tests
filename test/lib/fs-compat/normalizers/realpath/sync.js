var realpathPatch = require('./realpathPatch');

module.exports = function realpathSync(fn) {
  return realpathPatch(fn);
};
