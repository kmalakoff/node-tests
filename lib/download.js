var path = require('path');
var https = require('https');
var url = require('url');
var fs = require('fs');
var log = require('single-line-log').stdout;
var through = require('through');
var humanize = require('pretty-bytes');
var Queue = require('queue-cb');
var rimraf = require('rimraf');
var DecompressZip = require('decompress-zip');
var callOnce = require('call-once-fn');
var uuid = require('uuid');

module.exports = function download(target, options, callback) {
  var tempFile = path.join(path.dirname(target), uuid.v4());

  var queue = new Queue(1);
  queue.defer(function (callback) {
    callback = callOnce(callback);

    // eslint-disable-next-line node/no-deprecated-api
    var parsed = url.parse(options.repositoryURL(options.version));
    var req = https.request({ host: parsed.host, path: parsed.path, port: 443 });

    req.on('response', function (res) {
      var total = 0;
      var progress = through(function write(data) {
        total += data.length;
        log('Downloading ' + options.version + ' ' + humanize(total));
        this.queue(data);
      });

      res
        .pipe(progress)
        .pipe(fs.createWriteStream(tempFile))
        .on('error', callback)
        .on('close', function () {
          callback();
        });
    });
    req.end();
  });
  queue.defer(function (callback) {
    callback = callOnce(callback);

    var unzipper = new DecompressZip(tempFile);
    unzipper.on('error', callback);
    unzipper.on('extract', callback.bind(null, null));
    unzipper.extract({ path: target });
  });
  queue.await(function (err) {
    var q2 = new Queue();
    q2.defer(rimraf.bind(null, tempFile, {}));
    !err || q2.defer(rimraf.bind(null, target, {}));
    q2.await(function (err2) {
      callback(err || err2);
    });
  });
};
