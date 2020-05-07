var fs = require('fs');

var compatMethods = require('./compat-methods');

for (var key in compatMethods) {
  fs[key] = compatMethods[key];
}
