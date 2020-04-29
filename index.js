var fs = require('fs');
// var compat = {
//   lstat: require('./lib/lstat'),
//   readdir: require('./lib/readdir'),
//   realpath: require('fs.realpath'),
//   stat: require('./lib/stat'),
// };

// for (var key in fs) {
//   if (!compat[key]) compat[key] = fs[key];
// }

// module.exports = compat;
module.exports = fs;
