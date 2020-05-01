var original = require('fs').realpath;
var compare = require('semver-compare');

if (compare(process.versions.node, '15.0.0') > 0) module.exports = original;
else {
  module.exports = require('fs.realpath');
  module.exports.native = original.native;
}
