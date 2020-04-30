var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var Queue = require('queue-cb');
var https = require('https');
var ProgressBar = require('progress');

var CACHE_DIR = require('./DIRECTORIES').CACHE;

module.exports = function install(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  var version = options.version || require('./VERSION');
  var cacheTarget = path.join(CACHE_DIR, version + Date.now());

  fs.access(cacheTarget, function (missing) {
    if (!missing && !options.force) return callback();

    var queue = new Queue(1);
    missing || queue.defer(rimraf.bind(null, cacheTarget));
    queue.defer(function (callback) {
      var req = https.request({
        host: 'github.com',
        port: 443,
        path: '/nodejs/node/archive/' + version + '.zip',
      });

      req.on('response', function (res) {
        // download(', cacheTarget, { extract: true })
        // .on('response', (res) => {
        var bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: +res.headers['content-length'],
        });
        res.on('data', function (chunk) {
          debugger;
          bar.tick(chunk.length);
        });
        res.on('error', function (err) {
          debugger;
          callback(err);
        });
        res.on('end', function () {
          debugger;
          callback();
        });
      });
      // .then(() => callback());
      req.end();
    });
    queue.await(callback);
  });
};
