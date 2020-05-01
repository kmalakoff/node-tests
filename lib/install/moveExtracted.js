var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

module.exports = function (tempTarget, cacheTarget, options, callback) {
  fs.readdir(tempTarget, function (err, names) {
    if (err || names.length !== 1) return callback(err || new Error('Expecting 1 file. Received ' + names.join(',')));

    fs.rename(path.join(tempTarget, names[0]), cacheTarget, function (err) {
      if (err) return callback(err);
      rimraf(tempTarget, {}, callback);
    });
  });
};
