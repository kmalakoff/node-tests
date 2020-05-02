var compare = require('semver-compare');

if (compare(process.versions.node, '15.0.0') > 0) module.exports = require('fs').rmdirSync;
else module.exports = require('../composers/rmdirSyncRecursive')(require('fs').rmdirSync);
