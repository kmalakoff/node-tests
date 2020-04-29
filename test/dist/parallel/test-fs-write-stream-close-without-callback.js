'use strict';

require('../common');

var fs = require('fs');

var path = require('path');

var tmpdir = require('../common/tmpdir');

tmpdir.refresh();
var s = fs.createWriteStream(path.join(tmpdir.path, 'nocallback'));
s.end('hello world');
s.close();