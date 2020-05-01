var compare = require('semver-compare');

if (compare(process.versions.node, '15.0.0') > 0) module.exports = require('fs').readdir;
else {
  var readdirFileTypes = require('../composers/readdirFileTypes');
  if (compare(process.versions.node, '15.0.0') > 0) module.exports = readdirFileTypes(require('fs').readdir);
  else {
    // eslint-disable-next-line no-inner-declarations
    function sortResults(err, results, callback) {
      if (arguments.length === 2) callback = results;
      err ? callback(err) : callback(null, results.sort());
    }
    var wrapCallback = require('../composers/wrapCallback');
    module.exports = readdirFileTypes(wrapCallback(require('fs').readdir, sortResults));
  }
}
