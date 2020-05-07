var readdirFileTypes = require('./readdirFileTypes');
var invalidArgThrowRewrite = require('./invalidArgThrowRewrite');

module.exports = function readdir(fn) {
  return invalidArgThrowRewrite(readdirFileTypes(fn));
};
