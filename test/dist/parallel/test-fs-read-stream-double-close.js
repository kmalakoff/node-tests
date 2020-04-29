'use strict';

var common = require('../common');

var fs = require('fs');

{
  var s = fs.createReadStream(__filename);
  s.close(common.mustCall());
  s.close(common.mustCall());
}
{
  var _s = fs.createReadStream(__filename); // This is a private API, but it is worth testing. close calls this


  _s.destroy(null, common.mustCall());

  _s.destroy(null, common.mustCall());
}