// var compare = require('semver-compare');

module.exports = function invalidArgThrowRewriteComposer(fn) {
  return function invalidArgThrowRewrite() {
    try {
      return fn.apply(null, arguments);
    } catch (err) {
      if (err.name === 'TypeError [ERR_INVALID_ARG_TYPE]') err.name = 'TypeError';
      throw err;
    }
  };
};
