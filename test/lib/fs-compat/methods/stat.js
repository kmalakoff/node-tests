var compare = require('semver-compare');

if (compare(process.versions.node, '15.0.0') > 0) module.exports = require('fs').stat;
else {
  var statOptions = require('../composers/statOptions');
  module.exports = statOptions(require('fs').stat);
}
