var compare = require('semver-compare');

if (compare(process.versions.node, '0.6.0') > 0) module.exports = require('fs').lstat;
else {
  var statOptions = require('../composers/statOptions');
  module.exports = statOptions(require('fs').lstat);
}
