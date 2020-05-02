var compare = require('semver-compare');

if (compare(process.versions.node, '0.6.0') > 0) module.exports = require('fs').readdir;
else {
  var readdirFileTypes = require('../composers/readdirFileTypes');
  var sort = compare(process.versions.node, '0.4.0') > 0;
  module.exports = readdirFileTypes(require('fs').readdir, sort);
}
