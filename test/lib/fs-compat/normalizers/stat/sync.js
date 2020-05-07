var statSyncOptions = require('./statSyncOptions');
var invalidArgThrowRewrite = require('./invalidArgThrowRewrite');

module.exports = function statSync(fn) {
  return invalidArgThrowRewrite(statSyncOptions(fn));
};
