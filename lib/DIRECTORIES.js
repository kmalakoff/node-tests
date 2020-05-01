var path = require('path');

// var homedir = require('homedir-polyfill');

module.exports = {
  CACHE: path.join(__dirname, '..', '.cache'),
  BUILD: path.join(__dirname, '..', '.build'),
};
