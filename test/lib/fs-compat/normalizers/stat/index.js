var statOptions = require('./statOptions');
var invalidArgThrowRewrite = require('./invalidArgThrowRewrite');

module.exports = function stat(fn) {
  return invalidArgThrowRewrite(statOptions(fn));
};
