var path = require('path');
var progressStream = require('progress-stream');
var log = require('single-line-log').stdout;

module.exports = function progress(res, fullPath) {
  var filename = path.basename(fullPath);
  var progress = progressStream({
    length: res.headers['content-length'] || 0,
    drain: true,
    speed: 20,
  });
  progress.on('progress', function (update) {
    log('Downloading ' + filename + ' - ' + update.percentage.toFixed(0) + '%');
  });
  return progress;
};
