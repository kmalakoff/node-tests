var compare = require('semver-compare');

if (compare(process.versions.node, '15.0.0') > 0) module.exports = require('fs').readdir;
else module.exports = require('../composers/readdirFileTypes')(require('fs').readdir, compare(process.versions.node, '0.9.0') < 0);
