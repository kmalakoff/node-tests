var compare = require('semver-compare');

if (compare(process.versions.node, '0.6.0') > 0) module.exports = require('fs').lstat;
else module.exports = require('../composers/statOptions')(require('fs').lstat);
