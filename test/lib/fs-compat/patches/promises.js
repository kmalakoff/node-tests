var fs = require('fs');
var promisify = require('util.promisify');
var endsWith = require('end-with');

var compatMethods = require('./compat-methods');

if (!fs.promises) {
  var BUILT_INS = 'Stats';

  fs.promises = {};
  for (var name in fs) {
    if (endsWith(name, 'Sync') || ~BUILT_INS.indexOf(name) || typeof fs[name] !== 'function') continue;
    fs.promises[name] = promisify(compatMethods[name] || fs[name]);
  }
} else {
  // eslint-disable-next-line no-redeclare
  for (var name in compatMethods) {
    if (endsWith(name, 'Sync')) continue;
    fs.promises[name] = promisify(compatMethods[name]);
  }
}
