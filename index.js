var path = require('path');
var fs = require('fs');
var assign = require('object-assign');
var mock = require('mock-require');
var Queue = require('queue-cb');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp-classic');
var download = require('get-remote');

var buildFolder = require('./lib/buildFolder');
var progress = require('./lib/progress');
var runTestFolder = require('./lib/runTestFolder');
var testSetup = require('./lib/testSetup');
var testTeardown = require('./lib/testTeardown');

var DEFAULT_OPTIONS = {
  cacheDirectory: path.join(__dirname, '.cache'),
  buildDirectory: path.join(__dirname, '.build'),
  downloadURL: function downloadURL(version) {
    return 'https://codeload.github.com/nodejs/node/zip/' + version;
  },
};
var BUILD_FOLDERS = [path.join('lib', 'internal'), 'test'];
var TEST_FOLDERS = ['parallel'];

function NodeTests(options) {
  options = options || {};
  this.options = assign({}, DEFAULT_OPTIONS, options);
}

NodeTests.prototype.clean = function clean(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  var cacheTarget = options.version ? path.join(options.cacheDirectory, options.version) : options.cacheDirectory;
  var buildTarget = options.version ? path.join(options.buildDirectory, options.version) : options.buildDirectory;

  var queue = new Queue(1);
  queue.defer(rimraf.bind(null, cacheTarget, {}));
  queue.defer(rimraf.bind(null, buildTarget, {}));
  queue.await(callback);
};

NodeTests.prototype.install = function install(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  if (!options.version) return callback(new Error('Options are missing version'));
  var cacheTarget = path.join(options.cacheDirectory, options.version);

  fs.readdir(cacheTarget, function (err, names) {
    if (!err && names.length && !options.force) return callback();

    var queue = new Queue(1);
    err || queue.defer(rimraf.bind(null, cacheTarget));
    queue.defer(mkdirp.bind(null, cacheTarget));
    queue.defer(function (callback) {
      download(options.repositoryURL(options.version), cacheTarget, { extract: true, strip: 1, progress: progress, time: 1000 }, function (err) {
        console.log('');
        callback(err);
      });
    });
    queue.await(function (err) {
      err ? rimraf(cacheTarget, {}, callback) : callback();
    });
  });
};

NodeTests.prototype.build = function build(options, callback) {
  var self = this;
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  if (!options.version) return callback(new Error('Options are missing version'));
  var buildTarget = path.join(options.buildDirectory, options.version);

  fs.readdir(buildTarget, function (err, names) {
    if (!err && names.length && !options.force) return callback();

    var queue = new Queue(1);
    err || queue.defer(rimraf.bind(null, buildTarget));
    queue.defer(self.install.bind(this, options));
    for (var index in BUILD_FOLDERS) queue.defer(buildFolder.bind(null, BUILD_FOLDERS[index], options));
    queue.await(callback);
  });
};

NodeTests.prototype.runSuite = function runSuite(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  if (!options.version) return callback(new Error('Options are missing version'));

  var queue = new Queue(1);
  queue.defer(this.build.bind(this, options));
  for (var index in TEST_FOLDERS) queue.defer(runTestFolder.bind(null, TEST_FOLDERS[index], options));
  queue.await(callback);
};

NodeTests.prototype.runTest = function runTest(testPath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  if (!options.version) return callback(new Error('Options are missing version'));

  // replace module under test
  if (options.module) {
    try {
      var parts = options.module.split(',');
      mock(parts[0], require(parts[1]));
    } catch (err) {
      return callback(err);
    }
  }

  var queue = new Queue(1);
  queue.defer(testSetup.bind(null, options));
  queue.defer(function (callback) {
    try {
      require(path.join(options.buildDirectory, options.version, 'test', testPath));
      callback();
    } catch (err) {
      callback(err);
    }
  });
  queue.await(function (err) {
    testTeardown(options);
    callback(err);
  });
};

module.exports = NodeTests;
