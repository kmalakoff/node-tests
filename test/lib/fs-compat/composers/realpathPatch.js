var compare = require('semver-compare');

module.exports = function realpathPatchComposer(fn) {
  var name = fn === require('fs').realpath ? 'realpath' : 'realpathSync';
  var patch = require('fs.realpath');
  var patched = patch[name];
  if (!patched.native) patched.native = fn.native;
  return patched;
};
