var fs = require('fs');

module.exports = {
  fstat: require('../normalizers/stat')(fs.fstat),
  fstatSync: require('../normalizers/stat/sync')(fs.fstatSync),
  lstat: require('../normalizers/stat')(fs.lstat),
  lstatSync: require('../normalizers/stat/sync')(fs.lstatSync),
  readdir: require('../normalizers/readdir')(fs.readdir),
  readdirSync: require('../normalizers/readdir/sync')(fs.readdirSync),
  realpath: require('../normalizers/realpath')(fs.realpath),
  realpathSync: require('../normalizers/realpath/sync')(fs.realpathSync),
  rmdir: require('../normalizers/rmdir')(fs.rmdir),
  rmdirSync: require('../normalizers/rmdir/sync')(fs.rmdirSync),
  stat: require('../normalizers/stat')(fs.stat),
  statSync: require('../normalizers/stat/sync')(fs.statSync),
};
