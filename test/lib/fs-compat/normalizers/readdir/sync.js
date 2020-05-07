var readdirSyncFileTypes = require('./readdirSyncFileTypes');
var invalidArgThrowRewrite = require('./invalidArgThrowRewrite');

module.exports = function readdirSync(fn) {
  return invalidArgThrowRewrite(readdirSyncFileTypes(fn));
};
