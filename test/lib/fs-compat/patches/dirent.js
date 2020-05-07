var fs = require('fs');

if (!fs.Dirent) {
  fs.Dirent = require('dirent-from-stats').DirentBase;
  fs.constants = fs.constants || {};
  for (var cn in fs.Dirent.constants) {
    if (typeof fs.constants[cn] === 'undefined') fs.constants[cn] = fs.Dirent.constants[cn];
  }
}
