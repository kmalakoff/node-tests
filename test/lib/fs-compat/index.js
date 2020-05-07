var fs = require('fs');

require('./patches/methods');
require('./patches/promises');
require('./patches/dirent');

module.exports = fs;
