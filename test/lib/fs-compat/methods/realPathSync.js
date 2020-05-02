var compare = require('semver-compare');

if (compare(process.versions.node, '0.6.0') > 0) module.exports = require('fs').realpathSync;
else module.exports = require('fs.realpath').realpathSync;
