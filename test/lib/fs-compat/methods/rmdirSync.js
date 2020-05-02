var compare = require('semver-compare');

if (compare(process.versions.node, '10.0.0') > 0) module.exports = require('fs').rmdirSync;
else {
  var original = require('fs').rmdirSync;
  module.exports = function (dir) {
    try {
      original(dir);
    } catch (err) {
      debugger;
    }
  };
}
