var compare = require('semver-compare');

if (compare(process.versions.node, '0.6.0') > 0) module.exports = require('fs').realpath;
else module.exports = require('fs.realpath').realpath;
